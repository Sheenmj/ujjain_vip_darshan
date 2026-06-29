import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, aadhaarLast4, otp } = body;

    if (!name || !aadhaarLast4) {
      return NextResponse.json({ error: "Name and Aadhaar Last 4 digits are required" }, { status: 400 });
    }

    if (aadhaarLast4.length !== 4 || isNaN(Number(aadhaarLast4))) {
      return NextResponse.json({ error: "Invalid Aadhaar details format" }, { status: 400 });
    }

    // Simulate network latency of the UIDAI server (1000ms)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple mock logic: If OTP is provided, verify it. By default, check if OTP is 123456 or empty (for easy demo)
    if (otp && otp !== "123456") {
      return NextResponse.json({
        success: false,
        error: "Incorrect UIDAI OTP. Please try again."
      }, { status: 400 });
    }

    const verificationId = `UIDAI-EKYC-${Math.floor(10000000 + Math.random() * 90000000)}`;

    return NextResponse.json({
      success: true,
      verificationId,
      aadhaarReference: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      verifiedAt: new Date().toISOString(),
      matchScore: 99.4,
      demographics: {
        name,
        gender: "M/F",
        yob: "1980-2005",
        state: "Madhya Pradesh"
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
