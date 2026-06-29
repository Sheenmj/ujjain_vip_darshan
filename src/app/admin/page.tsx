'use client';

import React, { useEffect, useState } from 'react';
import { useBookingStore, BookingDetails } from '@/store/bookingStore';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Users, Activity, ShieldAlert, CheckCircle, XCircle, 
  Search, Lock, Unlock, RefreshCw, Landmark, CreditCard, ClipboardList 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const { t } = useTranslation();
  const { userRole, bookings, auditLogs, approveVipRequest, rejectVipRequest, addAuditLog } = useBookingStore();
  const [dbBookings, setDbBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'live' | 'vip' | 'slots' | 'audit'>('live');
  const [globalFreeze, setGlobalFreeze] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [bookings]); // Refetch if store changes

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.bookings) {
        setDbBookings(data.bookings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFreeze = () => {
    const nextState = !globalFreeze;
    setGlobalFreeze(nextState);
    addAuditLog(
      nextState ? "EMERGENCY_FREEZE_ENABLE" : "EMERGENCY_FREEZE_DISABLE",
      userRole,
      nextState ? "Global slot bookings frozen for all temples" : "Global slot bookings resumed"
    );
  };

  const handleApproveVIP = (id: string) => {
    approveVipRequest(id);
    addAuditLog("VIP_APPROVAL_GRANT", userRole, `Approved VIP protocol request for ticket: ${id}`);
    fetchBookings();
  };

  const handleRejectVIP = async (id: string) => {
    rejectVipRequest(id);
    addAuditLog("VIP_APPROVAL_REJECT", userRole, `Rejected VIP protocol request for ticket: ${id}`);
    
    // Call cancel API to release slots and trigger cancel refund
    try {
      await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id })
      });
      fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  // Filter lists based on search
  const filteredBookings = dbBookings.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.templeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.phone.includes(searchTerm)
  );

  const vipQueue = dbBookings.filter(b => 
    b.vipRequestNote && b.vipApproved === false && b.status === 'CONFIRMED'
  );

  // Statistics calculation
  const totalRevenue = dbBookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalDevoteesCount = dbBookings
    .filter(b => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.devotees.length, 0);

  // Check Auth Role
  const isAuthorized = userRole === 'Super Admin' || userRole === 'Temple Administrator' || userRole === 'VIP Officer';

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 flex-1 flex flex-col justify-center">
        <div className="bg-card border border-red-900/40 p-8 shadow-xl flex flex-col items-center">
          <div className="h-12 w-12 bg-red-950/40 border border-red-900/60 flex items-center justify-center text-red-400 mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-100 text-center">Unauthorized Access</h2>
          <p className="text-xs text-slate-400 mt-2 text-center leading-relaxed">
            Your current simulated role is <strong>{userRole}</strong>. This dashboard is accessible only to **Temple Administrators, VIP Officers, and Super Admins**.
          </p>
          <div className="text-xs text-slate-500 mt-4 text-center">
            Use the role switcher in the top navigation bar to change your role to &quot;Temple Admin&quot; or &quot;Super Admin&quot; to preview this workspace.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-mono">Government Operations Console</span>
          <h2 className="text-3xl font-black text-slate-100 mt-1">Temple Management System</h2>
        </div>

        {/* Emergency Freeze Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-400 hover:text-white text-xs"
            title="Refresh database records"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={handleToggleFreeze}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              globalFreeze 
                ? 'bg-emerald-950 border border-emerald-900/60 text-emerald-400' 
                : 'bg-red-955 border border-red-900/60 text-red-400 glow-saffron'
            }`}
          >
            {globalFreeze ? (
              <>
                <Unlock className="h-4 w-4" /> RESUME ALL BOOKINGS
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> EMERGENCY FREEZE SLOTS
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-white/5 p-4">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Active bookings</div>
          <div className="text-2xl font-black text-slate-100 mt-1">{dbBookings.filter(b => b.status === 'CONFIRMED').length} Tickets</div>
        </div>
        <div className="bg-card border border-white/5 p-4">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Pilgrims Count</div>
          <div className="text-2xl font-black text-slate-100 mt-1">{totalDevoteesCount} Devotees</div>
        </div>
        <div className="bg-card border border-white/5 p-4">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Daily Collections</div>
          <div className="text-2xl font-black text-accent mt-1">₹{totalRevenue}</div>
        </div>
        <div className="bg-card border border-white/5 p-4">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">VIP Requests Pending</div>
          <div className="text-2xl font-black text-primary mt-1">{vipQueue.length} Pending</div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex border-b border-white/5 mb-6">
        <button
          onClick={() => setActiveAdminTab('live')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeAdminTab === 'live' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Live Bookings Stream
        </button>
        <button
          onClick={() => setActiveAdminTab('vip')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer relative ${
            activeAdminTab === 'vip' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          VIP Verification Queue
          {vipQueue.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center bg-primary text-[8px] font-bold text-white">
              {vipQueue.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveAdminTab('slots')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeAdminTab === 'slots' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Slot Quota Manager
        </button>
        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeAdminTab === 'audit' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          System Audit Logs (DPDP)
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-grow flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
        {/* TAB 1: Live Bookings */}
        {activeAdminTab === 'live' && (
          <motion.div 
            key="live"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 border border-white/5">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ticket ID, temple, or phone number..."
                className="bg-transparent text-xs text-slate-200 w-full outline-hidden border-none"
              />
            </div>

            <div className="border border-white/5 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-white/5">
                    <th className="p-3">Ticket ID</th>
                    <th className="p-3">Temple</th>
                    <th className="p-3">Slot Schedule</th>
                    <th className="p-3">Devotees</th>
                    <th className="p-3">Transaction</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        No bookings found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/20 text-slate-300">
                        <td className="p-3 font-mono font-bold">{b.id}</td>
                        <td className="p-3 font-bold text-slate-200">{b.templeName}</td>
                        <td className="p-3">
                          <div>{b.date}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{b.slot}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold">{b.devotees.length} Pilgrims</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">
                            {b.devotees.map(d => d.name).join(', ')}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-accent">₹{b.amount}</div>
                          <div className="text-[9px] text-slate-500 font-mono mt-0.5 truncate max-w-[120px]">{b.paymentId}</div>
                        </td>
                        <td className="p-3">
                          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 ${
                            b.status === 'CONFIRMED' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-red-955/80 text-red-400'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 2: VIP Approvals Queue */}
        {activeAdminTab === 'vip' && (
          <motion.div 
            key="vip"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col gap-4"
          >
            {vipQueue.length === 0 ? (
              <div className="p-8 border border-dashed border-white/5 text-center text-xs text-slate-500">
                No pending VIP approval requests in queue.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vipQueue.map((b) => (
                  <div key={b.id} className="bg-slate-900/30 border border-white/5 p-5 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                        <span className="font-mono font-bold text-slate-400">{b.id}</span>
                        <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-900/60 px-2 py-0.5">
                          Pending Approval
                        </span>
                      </div>
                      
                      <div className="text-xs">
                        <h4 className="font-bold text-slate-200">{b.templeName}</h4>
                        <div className="text-slate-400 mt-1">{b.date} | {b.slot}</div>
                      </div>

                      <div className="bg-slate-950 p-3 border border-white/5">
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-1">VIP Protocol Justification</span>
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          &quot;{b.vipRequestNote}&quot;
                        </p>
                      </div>

                      <div className="text-xs">
                        <span className="text-slate-500 font-semibold uppercase text-[9px] tracking-wider">Pilgrims:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-400 mt-1 text-[11px]">
                          {b.devotees.map((d, idx) => (
                            <li key={idx}>{d.name} (Age {d.age}, Aadhaar Last 4: {d.aadhaarLast4})</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-white/5 pt-3">
                      <button
                        onClick={() => handleRejectVIP(b.id)}
                        className="w-1/2 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 text-xs font-bold border border-red-900/50 cursor-pointer"
                      >
                        Reject & Refund
                      </button>
                      <button
                        onClick={() => handleApproveVIP(b.id)}
                        className="w-1/2 py-2 bg-emerald-950 text-emerald-400 border border-emerald-900/50 hover:bg-emerald-900 hover:text-white text-xs font-bold cursor-pointer"
                      >
                        Approve Protocol
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: Slot Quota Manager */}
        {activeAdminTab === 'slots' && (
          <motion.div 
            key="slots"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900/20 border border-white/5 p-6"
          >
            <h3 className="text-sm font-bold text-slate-100 border-b border-white/5 pb-3">Slot Configurations</h3>
            
            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-3 font-semibold text-slate-400">
                <div>Temple Name</div>
                <div>Default VIP Quota / Slot</div>
                <div>Operational Status</div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-2 border-b border-white/5 items-center">
                <div className="font-bold text-slate-200">Mahakaleshwar Jyotirlinga</div>
                <div className="font-mono">150 passes</div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 bg-emerald-400" /> Active
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-2 border-b border-white/5 items-center">
                <div className="font-bold text-slate-200">Harsiddhi Mata Temple</div>
                <div className="font-mono">150 passes</div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 bg-emerald-400" /> Active
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-2 border-b border-white/5 items-center">
                <div className="font-bold text-slate-200">Kaal Bhairav Temple</div>
                <div className="font-mono">150 passes</div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 bg-emerald-400" /> Active
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 border border-white/5 mt-6 text-slate-500 text-xs leading-relaxed">
              <strong>Admin Note:</strong> Changing default slot allocations will automatically apply to any dates created for slots after {new Date(Date.now() + 86400000).toDateString()}. Current active dates must have allocations modified via specific holiday overrides.
            </div>
          </motion.div>
        )}

        {/* TAB 4: Immutable System Audit Logs */}
        {activeAdminTab === 'audit' && (
          <motion.div 
            key="audit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="p-4 bg-slate-950 border border-white/10 flex items-start gap-2.5">
              <ClipboardList className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase">DPDP Compliant Immutable Log Ledger</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Under the Section 8 parameters of India&apos;s Digital Personal Data Protection Act 2023, every administrative access, login session, file processing event, and slot state change must register to a non-volatile, encrypted append-only log ledger.
                </p>
              </div>
            </div>

            <div className="border border-white/5 overflow-hidden text-xs font-mono">
              <div className="bg-slate-900/80 text-slate-400 p-3 border-b border-white/5 grid grid-cols-4 font-semibold">
                <div>Timestamp</div>
                <div>Action Protocol</div>
                <div>Actor Role/Identifier</div>
                <div>Details Trace</div>
              </div>

              <div className="divide-y divide-white/5 divide-dashed max-h-[350px] overflow-y-auto">
                {auditLogs.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 bg-slate-900/10">
                    No system log trails recorded in this session.
                  </div>
                ) : (
                  auditLogs.map((log, idx) => (
                    <div key={idx} className="p-3 grid grid-cols-4 hover:bg-slate-900/20 text-slate-400 items-start">
                      <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                      <div>
                        <span className={`text-[9px] px-1.5 py-0.5 font-bold ${
                          log.action.includes('FREEZE') || log.action.includes('REJECT') ? 'bg-red-950 text-red-400' :
                          log.action.includes('SUCCESS') || log.action.includes('CONFIRMED') ? 'bg-emerald-950 text-emerald-400' :
                          'bg-slate-900 text-slate-300'
                        }`}>
                          {log.action}
                        </span>
                      </div>
                      <div className="text-slate-300 font-bold">{log.user}</div>
                      <div className="text-slate-500 text-[11px] truncate" title={log.details}>{log.details}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
