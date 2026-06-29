import { NextResponse } from 'next/server';
import { temples } from '@/data/temples';

export async function GET() {
  return NextResponse.json({ temples });
}
