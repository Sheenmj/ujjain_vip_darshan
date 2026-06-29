import { NextResponse } from 'next/server';

// Server-side in-memory cache for available slots (simulating Redis counters)
// Key format: `${templeId}:${date}:${slotIndex}`
const slotCounterCache: Record<string, number> = {};

const SLOTS = [
  "06:00 AM - 08:00 AM",
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
  "08:00 PM - 10:00 PM"
];

function getInitialCapacity(templeId: string, slotIndex: number): number {
  // Let's seed it deterministically based on temple and slot, so it feels "real"
  const hash = (templeId.charCodeAt(0) + slotIndex) % 7;
  if (hash === 0) return 4;   // Red zone (<10%)
  if (hash === 1) return 8;   // Amber zone (10-50%)
  if (hash === 2) return 12;  // Amber zone (10-50%)
  return 85;                  // Green zone (>50%)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const templeId = searchParams.get('templeId') || 'mahakaleshwar';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const slotData = SLOTS.map((slot, index) => {
    const key = `${templeId}:${date}:${index}`;
    if (slotCounterCache[key] === undefined) {
      slotCounterCache[key] = getInitialCapacity(templeId, index);
    }
    const available = slotCounterCache[key];
    const total = 150; // Total capacity is 150
    const percent = (available / total) * 100;
    
    let status: 'green' | 'amber' | 'red' = 'green';
    if (percent < 10) status = 'red';
    else if (percent <= 50) status = 'amber';

    return {
      id: index.toString(),
      time: slot,
      available,
      total,
      status
    };
  });

  return NextResponse.json({
    templeId,
    date,
    slots: slotData
  });
}

// Support atomic DECR via POST to simulate Redis slot lock
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templeId, date, slotIndex, count = 1 } = body;

    if (!templeId || !date || slotIndex === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const key = `${templeId}:${date}:${slotIndex}`;
    
    // Seed if not exists
    if (slotCounterCache[key] === undefined) {
      slotCounterCache[key] = getInitialCapacity(templeId, Number(slotIndex));
    }

    if (slotCounterCache[key] < count) {
      return NextResponse.json({ success: false, error: "Slot sold out or insufficient seats" }, { status: 409 });
    }

    // Atomic decrement
    slotCounterCache[key] -= count;

    return NextResponse.json({
      success: true,
      key,
      remaining: slotCounterCache[key]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
