import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(req: NextRequest) {
  try {
    // Initialize Gemini and Pinecone clients locally to avoid build errors
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key' });
    
    let pc: Pinecone | null = null;
    if (process.env.PINECONE_API_KEY) {
      pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });
    }
    const { messages, language } = await req.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const latestMessage = messages[messages.length - 1].content;

    // 1. Create embedding for the user's query
    let context = '';
    try {
      if (pc && process.env.PINECONE_INDEX_NAME) {
        // We use gemini's embedding model
        const embeddingResponse = await ai.models.embedContent({
          model: 'text-embedding-004',
          contents: latestMessage,
        });

        const embedding = embeddingResponse.embeddings?.[0]?.values;

        if (embedding) {
          // 2. Query Pinecone vector database
          const index = pc.Index(process.env.PINECONE_INDEX_NAME);
          const queryResponse = await index.query({
            vector: embedding,
            topK: 3,
            includeMetadata: true,
          });

          // 3. Construct context from retrieved documents
          context = queryResponse.matches
            .map((match: any) => match.metadata?.text)
            .filter(Boolean)
            .join('\n\n');
        }
      }
    } catch (vectorError) {
      console.warn('Vector DB search failed or not configured. Proceeding without RAG context.', vectorError);
    }

    // 4. Construct the prompt with RAG context
    const languageInstruction = language === 'hi' 
      ? 'CRITICAL: You MUST answer strictly in Hindi language.' 
      : language === 'ta' 
      ? 'CRITICAL: You MUST answer strictly in Tamil language.'
      : language === 'te'
      ? 'CRITICAL: You MUST answer strictly in Telugu language.'
      : language === 'gu'
      ? 'CRITICAL: You MUST answer strictly in Gujarati language.'
      : 'You must answer in English.';

    const systemPrompt = `You are the official AI Assistant for the Ujjain Darshan Portal. 
Your goal is to help users book temple visits, understand services, answer FAQs, and guide them through the platform.
Be polite, highly professional, and concise.
${languageInstruction}

Website Context (Use this to answer queries accurately):
${context ? context : 'No specific context retrieved. Rely on general knowledge about Ujjain and the portal.'}`;

    // Format history for Gemini
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Inject system prompt into the first message or use system instruction if supported
    // Since GoogleGenAI supports system instructions:
    
    // 5. Generate stream
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    // 6. Return standard readable stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            controller.enqueue(new TextEncoder().encode(chunk.text));
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
