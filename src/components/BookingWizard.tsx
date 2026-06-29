'use client';

import React, { useState, useEffect } from 'react';
import { useBookingStore, Devotee, Temple } from '@/store/bookingStore';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  X, Calendar, Clock, User, Phone, CheckCircle, 
  CreditCard, QrCode, AlertTriangle, ArrowLeft, 
  ArrowRight, ShieldCheck, Fingerprint, RefreshCw, Plus, Trash2 
} from 'lucide-react';
import { useTemples } from '@/hooks/useTemples';
import { useRouter } from 'next/navigation';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingWizard({ isOpen, onClose }: BookingWizardProps) {
  const { t } = useTranslation();
  const store = useBookingStore();
  const temples = useTemples();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [kycFiles, setKycFiles] = useState<Record<number, string>>({}); // base64 or dummy string
  const [submittingKyc, setSubmittingKyc] = useState(false);
  const [kycDone, setKycDone] = useState(false);
  const [selectedSlotObj, setSelectedSlotObj] = useState<any>(null);

  // New Devotee temp inputs
  const [tempName, setTempName] = useState('');
  const [tempAge, setTempAge] = useState('');
  const [tempGender, setTempGender] = useState('Male');
  const [tempAadhaar, setTempAadhaar] = useState('');

  // Fetch slots from API when temple and date are selected
  const [liveSlots, setLiveSlots] = useState<any[]>([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  useEffect(() => {
    if (store.selectedTemple && store.selectedDate) {
      fetchSlots();
    }
  }, [store.selectedTemple, store.selectedDate]);

  const fetchSlots = async () => {
    if (!store.selectedTemple || !store.selectedDate) return;
    setFetchingSlots(true);
    try {
      const res = await fetch(`/api/slots?templeId=${store.selectedTemple.id}&date=${store.selectedDate}`);
      const data = await res.json();
      if (data.slots) {
        setLiveSlots(data.slots);
      }
    } catch (e) {
      console.error("Error fetching slots:", e);
    } finally {
      setFetchingSlots(false);
    }
  };

  if (!isOpen) return null;

  // Step 1: Select Temple
  const handleSelectTemple = (temple: Temple) => {
    store.setSelectedTemple(temple);
    store.setSelectedDate('');
    store.setSelectedSlot('');
    setSelectedSlotObj(null);
    store.setStep(2);
  };

  // Step 2: Date + Slot selection
  const handleSelectSlot = (slot: any) => {
    if (slot.available <= 0) return;
    store.setSelectedSlot(slot.time);
    setSelectedSlotObj(slot);
  };

  const handleDateAndSlotNext = () => {
    if (!store.selectedDate || !store.selectedSlot) {
      setError("Please select both date and time slot.");
      return;
    }
    setError(null);
    store.setStep(3);
  };

  // Step 3: Add Devotees
  const handleAddDevotee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName || !tempAge || !tempAadhaar) {
      setError("Please fill all devotee details.");
      return;
    }
    if (tempAadhaar.length !== 4 || isNaN(Number(tempAadhaar))) {
      setError("Aadhaar must be exactly the last 4 digits.");
      return;
    }
    const ageNum = Number(tempAge);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError("Please enter a valid age.");
      return;
    }

    // Add to list
    store.addDevotee({
      name: tempName,
      age: ageNum,
      gender: tempGender,
      aadhaarLast4: tempAadhaar,
      kycVerified: false
    });

    // Reset inputs
    setTempName('');
    setTempAge('');
    setTempAadhaar('');
    setError(null);
  };

  const handleDevoteesNext = () => {
    if (store.devotees.length === 0) {
      setError("Please add at least one devotee.");
      return;
    }
    setError(null);
    store.setStep(4);
  };

  // Step 4: OTP Verification
  const handleSendOtp = () => {
    if (mobileNumber.length !== 10 || isNaN(Number(mobileNumber))) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setError(null);
      store.addAuditLog("OTP_DISPATCH", "Devotee", `Sent mock OTP to ${mobileNumber}`);
    }, 600);
  };

  const handleVerifyOtp = () => {
    if (otpCode !== '123456') {
      setError("Invalid OTP. For demo purposes, use '123456'.");
      return;
    }
    setOtpVerified(true);
    store.setOtpStatus(true, true);
    store.setUserSession(mobileNumber, 'Devotee');
    setError(null);
    store.addAuditLog("OTP_VERIFICATION", mobileNumber, "OTP verified successfully");
    store.setStep(5);
  };

  // Step 5: e-KYC Identity Upload
  const handleFileChange = (index: number) => {
    setKycFiles(prev => ({
      ...prev,
      [index]: `uploaded-identity-file-devotee-${index}.png`
    }));
  };

  const handleRunKyc = async () => {
    // Make sure files are uploaded for all devotees
    if (Object.keys(kycFiles).length !== store.devotees.length) {
      setError("Please upload identification documents for all devotees.");
      return;
    }

    setSubmittingKyc(true);
    setError(null);
    
    try {
      // Run mock e-KYC verification sequential requests to `/api/kyc`
      const verifiedDevotees = [...store.devotees];
      
      for (let i = 0; i < verifiedDevotees.length; i++) {
        const d = verifiedDevotees[i];
        const res = await fetch('/api/kyc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: d.name,
            aadhaarLast4: d.aadhaarLast4,
            otp: "123456" // mock OTP bypass
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `KYC failed for ${d.name}`);
        }

        const data = await res.json();
        verifiedDevotees[i] = {
          ...d,
          kycVerified: true,
          idFile: kycFiles[i]
        };

        store.addAuditLog("KYC_SUCCESS", mobileNumber, `Aadhaar verification success for ${d.name} (${data.verificationId})`);
      }

      store.setDevotees(verifiedDevotees);
      setKycDone(true);
      store.setKycStatus(false, true);
      store.setStep(6);
    } catch (e: any) {
      setError(e.message || "e-KYC connection timed out. Please retry.");
    } finally {
      setSubmittingKyc(false);
    }
  };

  // Step 6: Payment Process
  const handleInitiatePayment = async () => {
    setLoading(true);
    setError(null);

    const pricePerTicket = store.selectedTemple?.vipDarshanInfo.price || 0;
    const totalAmount = pricePerTicket * store.devotees.length;

    try {
      // 1. Decrement capacity on backend atomically
      const SLOTS = ["06:00 AM - 08:00 AM", "08:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 02:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM", "08:00 PM - 10:00 PM"];
      const slotIndexFallback = liveSlots.find(s => s.time === store.selectedSlot)?.id || SLOTS.indexOf(store.selectedSlot).toString();
      
      const decrRes = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templeId: store.selectedTemple?.id,
          date: store.selectedDate,
          slotIndex: selectedSlotObj?.id || slotIndexFallback,
          count: store.devotees.length
        })
      });

      if (!decrRes.ok) {
        const decrErr = await decrRes.json();
        throw new Error(decrErr.error || "Failed to secure slot seats. Slot might be full.");
      }

      // Simulate Razorpay Gateway checkout latency
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockPaymentId = `pay_${crypto.randomUUID().replace(/-/g, '').substring(0, 14)}`;

      // 2. Submit booking transaction
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templeId: store.selectedTemple?.id,
          templeName: store.selectedTemple?.name,
          date: store.selectedDate,
          slot: store.selectedSlot,
          devotees: store.devotees,
          phone: mobileNumber,
          paymentId: mockPaymentId,
          amount: totalAmount,
          vipRequestNote: store.vipNote || undefined
        })
      });

      if (!bookingRes.ok) {
        const bookingErr = await bookingRes.json();
        throw new Error(bookingErr.error || "Booking transaction failed.");
      }

      const bookingData = await bookingRes.json();
      store.addBooking(bookingData.booking);
      
      store.addAuditLog("PAYMENT_SUCCESS", mobileNumber, `Razorpay payment ${mockPaymentId} captured for Rs. ${totalAmount}`);
      store.addAuditLog("BOOKING_CONFIRMED", mobileNumber, `Confirmed VIP Ticket: ${bookingData.booking.id} for ${store.devotees.length} devotees`);

      // Celebrate & Move to Step 7
      store.setStep(7);
    } catch (e: any) {
      setError(e.message || "Payment gateway connection error.");
    } finally {
      setLoading(false);
    }
  };

  const getPricePerTicket = () => store.selectedTemple?.vipDarshanInfo.price || 0;
  const getTotalPrice = () => getPricePerTicket() * store.devotees.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-3xl bg-card border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/50">
          <div>
            <span className="text-[10px] tracking-widest text-accent uppercase font-bold">{t('step')} {store.currentStep} of 7</span>
            <h2 className="text-lg font-bold text-slate-100">
              {store.currentStep === 1 && t('selectTemple')}
              {store.currentStep === 2 && t('selectDateTime')}
              {store.currentStep === 3 && t('devoteeDetails')}
              {store.currentStep === 4 && t('verifyOtp')}
              {store.currentStep === 5 && t('identityKyc')}
              {store.currentStep === 6 && t('payment')}
              {store.currentStep === 7 && t('confirmed')}
            </h2>
          </div>
          {store.currentStep !== 7 && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            className="bg-primary h-1 transition-all duration-300"
            style={{ width: `${(store.currentStep / 7) * 100}%` }}
          />
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-950/40 border border-red-900/60 flex items-center gap-2.5 text-xs text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* STEP 1: Select Temple */}
          {store.currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {temples.map((temple) => (
                <div 
                  key={temple.id}
                  onClick={() => handleSelectTemple(temple as any)}
                  className="bg-slate-900/50 border border-white/5 hover:border-primary/50 hover:bg-slate-900 p-5 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-slate-200 group-hover:text-primary transition-colors">{temple.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{temple.deity.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
                    <span className="text-slate-400">Price: <span className="text-accent font-bold">₹{temple.vipDarshanInfo.price}</span></span>
                    <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Select <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: Choose Date & Slot */}
          {store.currentStep === 2 && store.selectedTemple && (
            <div className="flex flex-col gap-6">
              <div className="p-4 bg-slate-900/40 border border-white/5 flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Selected Temple</div>
                  <div className="text-sm font-bold text-slate-200">{store.selectedTemple.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Select Darshan Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={store.selectedDate}
                    onChange={(e) => store.setSelectedDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 px-4 py-3 text-sm text-slate-200 focus:outline-hidden focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Select Time Slot</label>
                  {!store.selectedDate ? (
                    <div className="h-[200px] border border-dashed border-white/10 flex items-center justify-center text-xs text-slate-500">
                      Please select a date to load slots
                    </div>
                  ) : fetchingSlots ? (
                    <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                      <span>Fetching slot availability...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-2">
                      {liveSlots.map((slot) => {
                        const isSelected = store.selectedSlot === slot.time;
                        const isSoldOut = slot.available <= 0;

                        return (
                          <div
                            key={slot.id}
                            onClick={() => handleSelectSlot(slot)}
                            className={`p-3 border text-left cursor-pointer transition-all duration-150 flex items-center justify-between ${
                              isSelected 
                                ? 'bg-primary/20 border-primary text-primary' 
                                : isSoldOut 
                                  ? 'bg-slate-900/20 border-white/5 opacity-50 cursor-not-allowed'
                                  : 'bg-slate-900/50 border-white/5 hover:border-white/20 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="text-xs font-medium">{slot.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${
                                slot.status === 'green' ? 'bg-emerald-950 text-emerald-400' :
                                slot.status === 'amber' ? 'bg-amber-950 text-amber-400' :
                                'bg-red-950 text-red-400'
                              }`}>
                                {isSoldOut ? t('soldOut') : `${slot.available} / ${slot.total}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* VIP Note Option */}
              <div className="mt-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Special VIP Privilege Request (Optional)
                </label>
                <textarea
                  value={store.vipNote}
                  onChange={(e) => store.setVipNote(e.target.value)}
                  placeholder="Explain eligibility (e.g. Government official, protocol tier, physical disability require escort). Subject to verification by VIP approval cell."
                  className="w-full bg-slate-900 border border-white/10 px-4 py-3 text-xs text-slate-200 focus:outline-hidden focus:border-primary transition-colors h-16 resize-none"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                <button 
                  onClick={() => store.setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <button
                  onClick={handleDateAndSlotNext}
                  disabled={!store.selectedDate || !store.selectedSlot}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Add Devotee details */}
          {store.currentStep === 3 && (
            <div className="flex flex-col gap-6">
              {/* Devotees List */}
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Devotees Added ({store.devotees.length})</h3>
                {store.devotees.length === 0 ? (
                  <div className="p-6 border border-dashed border-white/10 text-center text-xs text-slate-500">
                    No devotees added yet. Fill the details below to add.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {store.devotees.map((d, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-900/60 border border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{d.name} ({d.age}, {d.gender})</div>
                            <div className="text-[10px] text-slate-500">Aadhaar: **** **** {d.aadhaarLast4}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => store.removeDevotee(index)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Devotee Form */}
              <form onSubmit={handleAddDevotee} className="bg-slate-900/30 p-4 border border-white/5">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Add Devotee Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Full Name (As in Aadhaar)</label>
                    <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full bg-slate-900 border border-white/10 px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Age</label>
                      <input 
                        type="number" 
                        value={tempAge}
                        onChange={(e) => setTempAge(e.target.value)}
                        placeholder="Age"
                        className="w-full bg-slate-900 border border-white/10 px-3 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Gender</label>
                      <select 
                        value={tempGender}
                        onChange={(e) => setTempGender(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 px-2 py-2 text-xs text-slate-200 focus:outline-hidden focus:border-primary"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Aadhaar Number (Last 4 Digits only)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      maxLength={4}
                      value={tempAadhaar}
                      onChange={(e) => setTempAadhaar(e.target.value)}
                      placeholder="1234"
                      className="w-32 bg-slate-900 border border-white/10 px-3 py-2 text-xs text-center tracking-widest text-slate-200 focus:outline-hidden focus:border-primary font-mono"
                    />
                    <button 
                      type="submit"
                      className="flex items-center gap-1.5 px-4 bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </div>
                </div>
              </form>

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <button 
                  type="button"
                  onClick={() => store.setStep(2)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleDevoteesNext}
                  disabled={store.devotees.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: OTP Verification */}
          {store.currentStep === 4 && (
            <div className="flex flex-col items-center justify-center py-6 gap-6 max-w-sm mx-auto">
              <div className="h-14 w-14 bg-primary/15 flex items-center justify-center text-primary">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-200 text-sm">Mobile Verification</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Enter your mobile number to receive a secure login OTP for booking verification.
                </p>
              </div>

              {!otpSent ? (
                <div className="w-full flex flex-col gap-3">
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold text-xs">+91</span>
                    <input
                      type="text"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full bg-slate-900 border border-white/10 pl-12 pr-4 py-2.5 text-xs tracking-wider font-mono text-slate-200 focus:outline-hidden focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Send Verification OTP"}
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
                  <div className="text-xs text-center text-slate-500">
                    OTP sent to +91 {mobileNumber}
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 6-digit OTP (Demo: 123456)"
                    className="w-full bg-slate-900 border border-white/10 px-4 py-2.5 text-xs text-center tracking-widest font-mono text-slate-200 focus:outline-hidden focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOtpSent(false)}
                      className="w-1/3 py-2 bg-slate-900 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      Resend
                    </button>
                    <button
                      onClick={handleVerifyOtp}
                      className="w-2/3 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                    >
                      Verify & Access
                    </button>
                  </div>
                </div>
              )}

              <button 
                onClick={() => store.setStep(3)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors mt-2 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Devotees
              </button>
            </div>
          )}

          {/* STEP 5: e-KYC Verification */}
          {store.currentStep === 5 && (
            <div className="flex flex-col gap-5">
              <div className="p-4 bg-slate-900/40 border border-white/5 flex items-start gap-3">
                <Fingerprint className="h-8 w-8 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase">UIDAI Aadhaar e-KYC Sandbox</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    To comply with security and prevent booking duplicates under the DPDP Act 2023 guidelines, you must upload a copy of Aadhaar or Government ID for verification. Files are processed via secure cryptographic hashes and not persisted at rest.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {store.devotees.map((d, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900/60 border border-white/5 gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{d.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Aadhaar: **** **** {d.aadhaarLast4}</div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                      {kycFiles[index] ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> ID Linked
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-500">ID Required</span>
                      )}
                      
                      <label className="px-3.5 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors">
                        Upload ID
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={() => handleFileChange(index)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <button 
                  onClick={() => store.setStep(4)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <button
                  onClick={handleRunKyc}
                  disabled={submittingKyc || Object.keys(kycFiles).length !== store.devotees.length}
                  className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submittingKyc ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Verifying UIDAI e-KYC...
                    </>
                  ) : (
                    <>
                      Verify e-KYC & Continue <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Payment */}
          {store.currentStep === 6 && store.selectedTemple && (
            <div className="flex flex-col gap-6">
              <div className="bg-slate-900/40 p-4 border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Temple</div>
                  <div className="font-bold text-slate-200 mt-0.5">{store.selectedTemple.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Date</div>
                  <div className="font-bold text-slate-200 mt-0.5">{store.selectedDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Time Slot</div>
                  <div className="font-bold text-slate-200 mt-0.5">{store.selectedSlot}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Devotees</div>
                  <div className="font-bold text-slate-200 mt-0.5">{store.devotees.length} Pilgrims</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Devotee Summary</h3>
                <div className="border border-white/5 overflow-hidden text-xs">
                  {store.devotees.map((d, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border-b border-white/5 last:border-b-0 bg-slate-900/20">
                      <div>
                        <span className="font-bold text-slate-200">{d.name}</span> ({d.gender}, Age {d.age})
                      </div>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" /> e-KYC Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation */}
              <div className="p-4 bg-slate-900/70 border border-white/5 flex flex-col gap-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>VIP Darshan Fee (₹{getPricePerTicket()} × {store.devotees.length})</span>
                  <span className="font-bold text-slate-200">₹{getTotalPrice()}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST @ 0% (Devasthanam Exemption)</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST @ 0%</span>
                  <span>₹0</span>
                </div>
                <hr className="border-white/5" />
                <div className="flex justify-between text-sm font-bold text-slate-100">
                  <span>Total Amount Payable</span>
                  <span className="text-accent text-base">₹{getTotalPrice()}</span>
                </div>
              </div>

              {/* Secure Payment details */}
              <div className="bg-slate-950 p-4 border border-white/10 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-accent shrink-0" />
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Payments are processed through <strong>Razorpay Secured Gateway</strong>. PCI-DSS compliance is maintained. No financial credentials or card details are recorded on our servers.
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <button 
                  onClick={() => store.setStep(5)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
                <button
                  onClick={handleInitiatePayment}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Securing Transaction...
                    </>
                  ) : (
                    <>
                      Pay & Secure Ticket (₹{getTotalPrice()})
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Booking Confirmed */}
          {store.currentStep === 7 && store.bookings[0] && (
            <div className="flex flex-col items-center text-center gap-6 py-4">
              <div className="h-14 w-14 bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">VIP Darshan Reserved Successfully!</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Ticket has been issued. An SMS containing the cryptographic QR check-in token has been dispatched to +91 {mobileNumber}.
                </p>
              </div>

              {/* QR Display */}
              <div className="p-4 bg-white shadow-xl border border-slate-200 flex flex-col items-center">
                {/* Simplified Mock QR box using canvas/SVG */}
                <div className="h-44 w-44 bg-slate-100 flex items-center justify-center p-2 relative">
                  <QrCode className="h-40 w-40 text-slate-900" />
                  {/* Digital Signature Emblem in center */}
                  <div className="absolute h-10 w-10 bg-slate-900 border-2 border-white flex items-center justify-center text-accent">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-bold font-mono text-slate-800 uppercase tracking-wider">
                  Ticket ID: {store.bookings[0].id}
                </div>
              </div>

              {/* Booking Stats Summary */}
              <div className="w-full bg-slate-900/60 p-4 border border-white/5 grid grid-cols-2 gap-4 text-xs text-left max-w-md">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Temple</div>
                  <div className="font-bold text-slate-300 mt-0.5">{store.bookings[0].templeName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Slot Date & Time</div>
                  <div className="font-bold text-slate-300 mt-0.5">{store.bookings[0].date} at {store.bookings[0].slot.split(' - ')[0]}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Verification Code</div>
                  <div className="font-bold text-accent font-mono mt-0.5">{store.bookings[0].paymentId?.replace('pay_', 'TX-')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Entry Gate</div>
                  <div className="font-bold text-slate-300 mt-0.5">VIP Gate (Gate No. 1)</div>
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-3 w-full justify-center mt-2">
                <button
                  onClick={() => {
                    onClose();
                    router.push('/bookings');
                  }}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => {
                    store.resetBookingFlow();
                    onClose();
                  }}
                  className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Done & Exit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
