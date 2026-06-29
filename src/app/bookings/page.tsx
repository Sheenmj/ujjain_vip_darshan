'use client';

import React, { useEffect, useState } from 'react';
import { useBookingStore, BookingDetails } from '@/store/bookingStore';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Calendar, Clock, ShieldCheck, RefreshCw, XCircle, 
  Download, QrCode, AlertCircle, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const { t } = useTranslation();
  const { userPhone, setUserSession } = useBookingStore();
  const [phoneInput, setPhoneInput] = useState('');
  const [localBookings, setLocalBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userPhone) {
      fetchBookings();
    }
  }, [userPhone]);

  const fetchBookings = async () => {
    if (!userPhone) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?phone=${userPhone}`);
      const data = await res.json();
      if (data.bookings) {
        setLocalBookings(data.bookings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.length === 10 && !isNaN(Number(phoneInput))) {
      setUserSession(phoneInput, 'Devotee');
      useBookingStore.getState().addAuditLog(
        "DEVOTEE_LOGIN",
        phoneInput,
        "Devotee signed in via bookings interface"
      );
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking? A refund will be initiated to your source account within 3-5 business days.")) {
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });

      if (res.ok) {
        setMessage("Booking successfully cancelled. Refund of Rs. has been initiated.");
        useBookingStore.getState().addAuditLog(
          "BOOKING_CANCELLATION",
          userPhone || "System",
          `Devotee cancelled VIP ticket booking: ${bookingId}`
        );
        fetchBookings();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to cancel booking.");
      }
    } catch (e) {
      alert("Error processing cancellation request.");
    } finally {
      setLoading(false);
    }
  };

  const triggerPdfDownload = (booking: BookingDetails) => {
    // Generate a simple print layout simulation or file download
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Ujjain Devasthan Pass - ${booking.id}</title>
            <style>
              body { font-family: monospace; padding: 40px; background: #fff; color: #000; text-align: center; }
              .pass-box { border: 4px double #000; padding: 20px; max-width: 400px; margin: 0 auto; }
              .header { font-size: 16px; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
              .qr-box { font-size: 100px; padding: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; font-size: 12px; margin: 8px 0; border-bottom: 1px dashed #ccc; }
              .devotees { text-align: left; font-size: 11px; margin-top: 15px; }
              .footer { margin-top: 25px; font-size: 10px; color: #555; }
            </style>
          </head>
          <body>
            <div class="pass-box">
              <div class="header">
                GOVT OF MADHYA PRADESH<br/>
                VIP DARSHAN PASS
              </div>
              <div class="detail-row"><strong>Pass ID:</strong> <span>${booking.id}</span></div>
              <div class="detail-row"><strong>Temple:</strong> <span>${booking.templeName}</span></div>
              <div class="detail-row"><strong>Date:</strong> <span>${booking.date}</span></div>
              <div class="detail-row"><strong>Time Slot:</strong> <span>${booking.slot}</span></div>
              <div class="detail-row"><strong>Gate:</strong> <span>VIP Gate No.1</span></div>
              <div class="detail-row"><strong>Amount Paid:</strong> <span>₹${booking.amount}</span></div>
              
              <div class="devotees">
                <strong>Devotees (${booking.devotees.length}):</strong>
                ${booking.devotees.map((d, i) => `<div style="margin-top:4px;">${i+1}. ${d.name} (Age: ${d.age}, Aadhaar: ****${d.aadhaarLast4})</div>`).join('')}
              </div>
              
              <div class="qr-box">🛡️</div>
              <div style="font-size:8px; word-break: break-all; margin-top:10px;">SIGNATURE: ${booking.qrCode?.substring(0, 48)}...</div>
              
              <div class="footer">
                Verify this encrypted pass at Gate 1 via the official Temple Staff QR app. Exits allowed within ±30 min slots.
              </div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  if (!userPhone) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex-1 flex flex-col justify-center">
        <div className="bg-card border border-white/10 p-8 shadow-xl flex flex-col items-center">
          <div className="h-12 w-12 bg-primary/10 flex items-center justify-center text-primary mb-4">
            <QrCode className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 text-center">Access Devotee Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1.5 text-center leading-relaxed">
            Enter the mobile number used during ticket booking to view, download, or cancel your VIP Darshan Passes.
          </p>

          <form onSubmit={handleSignIn} className="w-full mt-6 flex flex-col gap-3.5">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-xs">+91</span>
              <input
                type="text"
                maxLength={10}
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full bg-slate-900 border border-white/10 pl-12 pr-4 py-2.5 text-xs tracking-wider font-mono text-slate-200 focus:outline-hidden focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              Sign In Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] text-accent font-bold uppercase tracking-wider font-mono">Devotee Console</span>
          <h2 className="text-2xl font-black text-slate-100 mt-1">My VIP Darshan Bookings</h2>
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Bookings
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 text-xs flex items-center gap-2 mb-6">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Bookings Lists */}
      {localBookings.length === 0 ? (
        <div className="bg-card border border-white/5 p-12 shadow-md text-center flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-slate-800 flex items-center justify-center text-slate-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-300 text-sm">No Bookings Found</h3>
            <p className="text-xs text-slate-500 mt-1">We couldn&apos;t find any VIP booking linked to mobile +91 {userPhone}.</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
          >
            Go Book a Darshan <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {localBookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED';
            return (
              <div 
                key={booking.id}
                className="bg-card border border-white/5 p-6 shadow-md flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:border-white/10 transition-colors"
              >
                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-1 border border-white/5">
                      {booking.id}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 ${
                      isConfirmed ? 'bg-emerald-950 border border-emerald-900/50 text-emerald-400' : 'bg-red-955 border border-red-900/50 text-red-400'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-200 text-base">{booking.templeName}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-primary" /> {booking.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {booking.slot}</span>
                      <span className="text-accent font-bold">₹{booking.amount} Paid</span>
                    </div>
                  </div>

                  {/* Devotees */}
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Devotees ({booking.devotees.length})</div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {booking.devotees.map((d, idx) => (
                        <span key={idx} className="bg-slate-900 px-2 py-1 text-slate-300 text-[10px] border border-white/5">
                          {d.name} ({d.gender}, Age: {d.age})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions (Download pass / QR scan helper) */}
                {isConfirmed && (
                  <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <button
                      onClick={() => triggerPdfDownload(booking)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/5 hover:border-white/10 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-950/40 hover:bg-red-900/40 text-red-400 hover:text-red-200 border border-red-900/60 text-xs font-bold transition-all cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" /> Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
