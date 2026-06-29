import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory bookings DB (simulating PostgreSQL database)
const bookingsDb: any[] = [];

// Seed database with a few mock bookings to show on initial load
const MOCK_DATE = new Date().toISOString().split('T')[0];
bookingsDb.push(
  {
    id: "BKG-52891047",
    templeId: "mahakaleshwar",
    templeName: "Mahakaleshwar Jyotirlinga",
    date: MOCK_DATE,
    slot: "08:00 AM - 10:00 AM",
    phone: "9876543210",
    devotees: [
      { name: "Rajesh Kumar", age: 42, gender: "Male", aadhaarLast4: "5432", kycVerified: true }
    ],
    status: "CONFIRMED",
    amount: 250,
    paymentId: "pay_Nz82h1Js92aKs8",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    qrCode: "MOCK_QR_PAYLOAD_HMAC_SIGNATURE_AES_ENCRYPTED_DATA_1"
  },
  {
    id: "BKG-18274092",
    templeId: "harsiddhi",
    templeName: "Harsiddhi Mata Temple",
    date: MOCK_DATE,
    slot: "06:00 PM - 08:00 PM",
    phone: "9876543210",
    devotees: [
      { name: "Anita Sharma", age: 38, gender: "Female", aadhaarLast4: "9876", kycVerified: true }
    ],
    status: "CONFIRMED",
    amount: 150,
    paymentId: "pay_Ka91p0Qx72nLw9",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    qrCode: "MOCK_QR_PAYLOAD_HMAC_SIGNATURE_AES_ENCRYPTED_DATA_2"
  }
);

// Encryption Key and Secret for QR security
const ENCRYPTION_KEY = crypto.scryptSync('ujjayin-secret-password-128', 'salt', 32);
const HMAC_SECRET = 'mahakal-portal-cryptographic-hmac-secret-key-2026';

function encryptPayload(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  
  if (phone) {
    // Return bookings for a specific devotee phone number
    const userBookings = bookingsDb.filter(b => b.phone === phone);
    return NextResponse.json({ bookings: userBookings });
  }

  // Otherwise, return all bookings (for Admin Dashboard)
  return NextResponse.json({ bookings: bookingsDb });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      templeId, 
      templeName, 
      date, 
      slot, 
      devotees, 
      phone, 
      paymentId, 
      amount,
      vipRequestNote 
    } = body;

    // Basic Validation
    if (!templeId || !date || !slot || !devotees || !phone || !paymentId) {
      return NextResponse.json({ error: "Missing required booking details or payment verification" }, { status: 400 });
    }

    if (devotees.length === 0) {
      return NextResponse.json({ error: "Please add at least one devotee" }, { status: 400 });
    }

    // 1. Enforce DB Unique Constraint: One Aadhaar per temple per date
    for (const devotee of devotees) {
      const isDuplicate = bookingsDb.some(b => 
        b.templeId === templeId && 
        b.date === date && 
        b.status === 'CONFIRMED' &&
        b.devotees.some((d: any) => d.aadhaarLast4 === devotee.aadhaarLast4)
      );

      if (isDuplicate) {
        return NextResponse.json({ 
          error: `Devotee ${devotee.name} already has a confirmed booking at this temple on ${date}. (Duplicate Aadhaar check failed)` 
        }, { status: 409 });
      }
    }

    // 2. Generate Booking ID
    const bookingId = `BKG-${Math.floor(10000000 + Math.random() * 90000000)}`;

    // 3. Cryptographic QR generation (HMAC + AES-256)
    // QR Payload contains: BookingID, TempleID, Date, Slot, number of devotees
    const qrRawPayload = JSON.stringify({
      id: bookingId,
      templeId,
      date,
      slot,
      devoteeCount: devotees.length,
      expiresAt: new Date(new Date(`${date} ${slot.split(' - ')[1] || '23:59 PM'}`).getTime() + 30 * 60000).toISOString() // +30 mins buffer
    });

    // Generate HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', HMAC_SECRET);
    hmac.update(qrRawPayload);
    const signature = hmac.digest('hex');

    // Encrypt both payload and signature with AES-256-CBC
    const finalQrString = encryptPayload(JSON.stringify({
      payload: qrRawPayload,
      sig: signature
    }));

    // 4. Create database record
    const newBooking = {
      id: bookingId,
      templeId,
      templeName,
      date,
      slot,
      phone,
      devotees,
      status: "CONFIRMED",
      amount,
      paymentId,
      vipRequestNote,
      vipApproved: vipRequestNote ? false : undefined, // requires approval if note exists
      timestamp: new Date().toISOString(),
      qrCode: finalQrString
    };

    bookingsDb.push(newBooking);

    return NextResponse.json({
      success: true,
      booking: newBooking
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Support cancellations / refunds
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
    }

    const bookingIndex = bookingsDb.findIndex(b => b.id === bookingId);
    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    bookingsDb[bookingIndex].status = "CANCELLED";

    return NextResponse.json({
      success: true,
      booking: bookingsDb[bookingIndex]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
