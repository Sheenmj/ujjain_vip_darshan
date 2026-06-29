'use client';

import React, { useState, useEffect } from 'react';
import { useBookingStore, BookingDetails } from '@/store/bookingStore';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  QrCode, ShieldAlert, CheckCircle, ShieldCheck, 
  Camera, RefreshCw, Search, Users, Sparkles, Flame 
} from 'lucide-react';

export default function StaffPage() {
  const { t } = useTranslation();
  const { userRole, bookings, addAuditLog } = useBookingStore();
  
  // UI and Verification States
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorResult, setErrorResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualQuery, setManualQuery] = useState('');
  const [localBookings, setLocalBookings] = useState<BookingDetails[]>([]);
  const [crowdCount, setCrowdCount] = useState(14); // Mock initial crowd count

  useEffect(() => {
    fetchBookings();
  }, [bookings]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setLocalBookings(data.bookings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const verifyQrPayload = async (qrString: string) => {
    setLoading(true);
    setScanResult(null);
    setErrorResult(null);

    try {
      const res = await fetch('/api/staff/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: qrString })
      });

      const data = await res.json();
      
      if (res.ok && data.verified) {
        setScanResult(data);
        setCrowdCount(prev => prev + data.devoteeCount);
        addAuditLog(
          "QR_SCAN_SUCCESS",
          userRole,
          `Verified entrance for Ticket: ${data.bookingId} (${data.devoteeCount} pilgrims)`
        );
      } else {
        setErrorResult(data.error || "Verification rejected.");
        addAuditLog(
          "QR_SCAN_SECURITY_DENIED",
          userRole,
          `Security block: QR scan denied. Reason: ${data.error || 'Unknown validation fail'}`
        );
      }
    } catch (e) {
      setErrorResult("Network or connection error contacting authentication gateway.");
    } finally {
      setLoading(false);
    }
  };

  // Mock Simulations for QR Scan
  const handleSimulateValidScan = () => {
    // Pick the latest confirmed booking from the list
    const validBooking = localBookings.find(b => b.status === 'CONFIRMED');
    if (!validBooking) {
      alert("No active bookings found in database. Please book a VIP Darshan first!");
      return;
    }
    verifyQrPayload(validBooking.qrCode || '');
  };

  const handleSimulateTamperedScan = () => {
    // Generate a garbage QR string representing a signature modification
    verifyQrPayload("IV_HEX_GARBAGE_TICKET_TAMPERED:CIPHER_HEX_GARBAGE");
  };

  const handleSimulateReplayScan = () => {
    // Double scan the same valid ticket
    const validBooking = localBookings.find(b => b.status === 'CONFIRMED');
    if (!validBooking) {
      alert("No active bookings found. Book a VIP ticket first!");
      return;
    }
    // Scan it once, wait 500ms and scan again to trigger replay attack block
    verifyQrPayload(validBooking.qrCode || '');
    setTimeout(() => {
      verifyQrPayload(validBooking.qrCode || '');
    }, 800);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery) return;
    
    // Search local database
    const matched = localBookings.find(b => 
      b.id.toLowerCase() === manualQuery.toLowerCase() || 
      b.phone === manualQuery
    );

    if (matched) {
      setScanResult({
        verified: true,
        bookingId: matched.id,
        templeId: matched.templeId,
        date: matched.date,
        slot: matched.slot,
        devoteeCount: matched.devotees.length,
        scanTime: new Date().toISOString(),
        message: `Manual lookup success. Devotee matching phone +91 ${matched.phone}`
      });
      setErrorResult(null);
      setCrowdCount(prev => prev + matched.devotees.length);
      addAuditLog(
        "MANUAL_LOOKUP_SUCCESS",
        userRole,
        `Verified manual lookup entry for Ticket: ${matched.id}`
      );
    } else {
      setErrorResult("Ticket ID or Mobile number not found in active database registries.");
      setScanResult(null);
    }
  };

  // Check Auth Role
  const isAuthorized = userRole === 'Temple Staff' || userRole === 'Super Admin';

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex-1 flex flex-col justify-center">
        <div className="bg-card border border-red-900/40 p-8 shadow-xl flex flex-col items-center">
          <div className="h-12 w-12 bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-400 mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-100 text-center">Unauthorized Access</h2>
          <p className="text-xs text-slate-400 mt-2 text-center leading-relaxed">
            Your current simulated role is <strong>{userRole}</strong>. This scanner utility app is designed for **Temple Gate Staff & Security Officers** only.
          </p>
          <div className="text-xs text-slate-500 mt-4 text-center">
            Use the role switcher in the top navigation bar to change your role to &quot;Temple Staff&quot; or &quot;Super Admin&quot; to inspect this workspace.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-mono">Gate Entry Protocol</span>
          <h2 className="text-2xl font-black text-slate-100 mt-1">Temple Staff Check-in Console</h2>
        </div>
        
        {/* Real-time occupancy */}
        <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 border border-white/5 text-xs">
          <Users className="h-4 w-4 text-accent" />
          <span className="text-slate-400">Current Slot Count: <span className="font-bold text-slate-200">{crowdCount} verified entries</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Camera Simulator */}
        <div className="bg-card border border-white/5 overflow-hidden shadow-lg flex flex-col">
          <div className="bg-slate-900 px-4 py-3 border-b border-white/5 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-primary" /> Camera Viewfinder
            </span>
            <span className="h-2 w-2 bg-red-500 animate-ping" />
          </div>

          <div className="bg-slate-950 aspect-video flex flex-col items-center justify-center p-6 relative border-b border-white/5">
            {/* Viewfinder borders */}
            <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-primary" />

            <div className="flex flex-col items-center text-center gap-3">
              <QrCode className="h-16 w-16 text-slate-700 animate-pulse" />
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Align ticket QR inside frame
              </div>
            </div>
          </div>

          {/* Simulation Buttons */}
          <div className="p-4 bg-slate-900/40 flex flex-col gap-2">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Simulate Gate Scans</span>
            
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <button
                onClick={handleSimulateValidScan}
                className="py-2 px-1 bg-emerald-950 border border-emerald-900/60 hover:bg-emerald-900 text-emerald-400 hover:text-white font-bold transition-all cursor-pointer text-center"
              >
                Scan Valid Ticket
              </button>
              <button
                onClick={handleSimulateTamperedScan}
                className="py-2 px-1 bg-red-955 border border-red-900/60 hover:bg-red-900 text-red-400 hover:text-white font-bold transition-all cursor-pointer text-center"
              >
                Scan Tampered QR
              </button>
              <button
                onClick={handleSimulateReplayScan}
                className="py-2 px-1 bg-amber-950/40 border border-amber-900/60 hover:bg-amber-900 text-amber-400 hover:text-white font-bold transition-all cursor-pointer text-center"
              >
                Scan Replay Attack
              </button>
            </div>

            <div className="border-t border-white/5 my-2 pt-2">
              <form onSubmit={handleManualSearch} className="flex gap-2">
                <input
                  type="text"
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  placeholder="Manual backup ID or Mobile number..."
                  className="bg-slate-950 border border-white/10 px-3 py-1.5 text-xs text-slate-200 flex-1 focus:outline-hidden focus:border-primary"
                />
                <button 
                  type="submit"
                  className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs cursor-pointer flex items-center justify-center"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Verification Result Display */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-white/5 p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                Scan Verification Log
              </h3>

              {loading ? (
                <div className="h-48 flex flex-col items-center justify-center gap-2.5 text-xs text-slate-500">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  <span>Checking cryptographic signature authenticity...</span>
                </div>
              ) : scanResult ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Success Result */}
                  <div className="p-4 bg-emerald-950/30 border border-emerald-900/60 text-emerald-400 flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">Pass Verified: Access Granted</h4>
                      <p className="text-xs mt-1 leading-relaxed">
                        {scanResult.message}
                      </p>
                    </div>
                  </div>

                  {/* Devotee Info */}
                  <div className="p-4 bg-slate-950 border border-white/5 space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 gap-2 border-b border-white/5 pb-2 text-slate-400">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">Ticket ID</div>
                        <div className="font-mono font-bold text-slate-300 mt-0.5">{scanResult.bookingId}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">Devotees Count</div>
                        <div className="font-bold text-slate-300 mt-0.5">{scanResult.devoteeCount} Pilgrims</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-slate-400">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">Temple Name</div>
                        <div className="font-bold text-slate-300 mt-0.5 uppercase">{scanResult.templeId}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500">Slot Timings</div>
                        <div className="font-bold text-slate-300 mt-0.5">{scanResult.slot}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : errorResult ? (
                <div className="space-y-4 animate-fadeIn">
                  {/* Security Error Result */}
                  <div className="p-4 bg-red-955 border border-red-900/60 text-red-400 flex items-start gap-3">
                    <ShieldAlert className="h-6 w-6 shrink-0 mt-0.5 text-red-400" />
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">Access Denied: Validation Failed</h4>
                      <p className="text-xs mt-1 leading-relaxed text-red-300">
                        {errorResult}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-48 border border-dashed border-white/10 flex flex-col items-center justify-center p-6 text-center text-slate-500 text-xs">
                  <Flame className="h-8 w-8 text-slate-700 mb-2" />
                  <span>Awaiting QR ticket scan simulation from Gate 1 scanner...</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-slate-500 leading-relaxed font-mono">
              GATE KEY CACHE: Active (Valid for next 4 hours) | LOCAL_OFFLINE_VERIFICATION: Enabled
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
