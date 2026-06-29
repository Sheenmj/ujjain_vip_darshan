import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory set for scanned QR codes to prevent replay attacks (simulating Redis SET NX)
const scannedQrCodesSet = new Set<string>();

const ENCRYPTION_KEY = crypto.scryptSync('ujjayin-secret-password-128', 'salt', 32);
const HMAC_SECRET = 'mahakal-portal-cryptographic-hmac-secret-key-2026';

function decryptPayload(encryptedText: string): string {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  if (!ivHex || !encryptedHex) {
    throw new Error('Invalid encrypted data format');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrData } = body;

    if (!qrData) {
      return NextResponse.json({ error: "QR payload is empty" }, { status: 400 });
    }

    let decryptedObj;
    try {
      // 1. Decrypt QR code using AES-256
      const decryptedText = decryptPayload(qrData);
      decryptedObj = JSON.parse(decryptedText);
    } catch (e) {
      return NextResponse.json({ 
        verified: false, 
        error: "QR Decryption Failed! Invalid or corrupted ticket." 
      }, { status: 400 });
    }

    const { payload, sig } = decryptedObj;
    
    // 2. Validate HMAC Signature
    const expectedHmac = crypto.createHmac('sha256', HMAC_SECRET);
    expectedHmac.update(payload);
    const calculatedSig = expectedHmac.digest('hex');

    if (calculatedSig !== sig) {
      return NextResponse.json({ 
        verified: false, 
        error: "Cryptographic Signature Mismatch! Tampered ticket detected." 
      }, { status: 401 });
    }

    // Parse the actual ticket payload
    const ticketData = JSON.parse(payload);
    const { id, templeId, date, slot, devoteeCount, expiresAt } = ticketData;

    // 3. Prevent Replay Attack: Enforce single-use via Redis-like Set
    if (scannedQrCodesSet.has(id)) {
      return NextResponse.json({ 
        verified: false, 
        error: `Replay Attack Alert! This ticket (ID: ${id}) was already scanned and marked as entered.` 
      }, { status: 409 });
    }

    // 4. Validate time window (+- 30 mins)
    const now = new Date();
    const expiryDate = new Date(expiresAt);
    
    if (now > expiryDate) {
      return NextResponse.json({
        verified: false,
        error: `Darshan window expired. Expired at: ${expiryDate.toLocaleTimeString()}`
      }, { status: 403 });
    }

    // Mark as scanned
    scannedQrCodesSet.add(id);

    return NextResponse.json({
      verified: true,
      bookingId: id,
      templeId,
      date,
      slot,
      devoteeCount,
      scanTime: now.toISOString(),
      message: "Access Granted. Welcome to the temple corridor."
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
