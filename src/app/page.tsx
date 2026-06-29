'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useBookingStore } from '@/store/bookingStore';
import BookingWizard from '@/components/BookingWizard';
import { 
  Calendar, Flame, Sparkles, Clock, AlertTriangle, 
  MapPin, BookOpen, Shield, ShieldAlert, CheckCircle2, ArrowRight 
} from 'lucide-react';
import Image from 'next/image';
import { useTemples } from '@/hooks/useTemples';

export default function Home() {
  const { t } = useTranslation();
  const store = useBookingStore();
  const temples = useTemples();
  
  // UI Control states
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeTabTemple, setActiveTabTemple] = useState('mahakaleshwar');
  const [liveSlots, setLiveSlots] = useState<any[]>([]);
  const [pollingTime, setPollingTime] = useState<string>('');
  const [dpdpAccepted, setDpdpAccepted] = useState<boolean>(true); // default to show modal if not checked in localStorage

  // Fetch slots list periodically (simulating WebSocket/long polling)
  useEffect(() => {
    fetchLiveSlots();
    const interval = setInterval(fetchLiveSlots, 15000); // 15 seconds poll
    return () => clearInterval(interval);
  }, [activeTabTemple]);

  // Check DPDP Consent status on load
  useEffect(() => {
    const consent = localStorage.getItem('ujjain_dpdp_consent');
    if (!consent) {
      setDpdpAccepted(false);
    }
  }, []);

  const fetchLiveSlots = async () => {
    try {
      const res = await fetch(`/api/slots?templeId=${activeTabTemple}`);
      const data = await res.json();
      if (data.slots) {
        setLiveSlots(data.slots);
        setPollingTime(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error("Error fetching live slots:", e);
    }
  };

  const handleAcceptDpdp = () => {
    localStorage.setItem('ujjain_dpdp_consent', 'true');
    setDpdpAccepted(true);
    store.addAuditLog("DPDP_CONSENT_GRANTED", "Anonymous Pilgrim", "Explicit consent granted for Aadhaar e-KYC processing");
  };

  const handleBookSlotShortcut = (slotTime: string) => {
    const matchedTemple = temples.find(t => t.id === activeTabTemple);
    if (matchedTemple) {
      store.setSelectedTemple(matchedTemple as any);
      store.setSelectedDate(new Date().toISOString().split('T')[0]);
      store.setSelectedSlot(slotTime);
      store.setStep(3); // skip directly to devotee input step!
      setIsWizardOpen(true);
    }
  };

  const selectedTempleDetails = temples.find(t => t.id === activeTabTemple);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col relative">
      
      {/* 1. Hero Section using User's Uploaded Shiva Image */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Video with absolute positioning */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 filter brightness-[0.75] contrast-[1.05]"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Gradient Overlays for premium look */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-12">
          {/* Saffron Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 border border-primary/40 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 animate-pulse glow-saffron">
            <Flame className="h-4.5 w-4.5" />
            <span>{t('title')}</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
            {t('heroTitlePrefix')} <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-accent">{t('heroTitleHighlight')}</span> {t('heroTitleSuffix')}
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-200 mt-6 leading-relaxed drop-shadow-md">
            {t('heroDesc')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
            <button 
              onClick={() => {
                store.resetBookingFlow();
                setIsWizardOpen(true);
              }}
              className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold shadow-lg hover:shadow-primary/30 transition-all cursor-pointer transform hover:-translate-y-0.5 text-sm uppercase tracking-wider w-full sm:w-auto"
            >
              {t('bookNow')}
            </button>
            <a 
              href="#live-counters"
              className="px-8 py-3.5 bg-slate-900/80 border border-white/10 hover:border-white/20 text-white font-bold text-sm transition-all w-full sm:w-auto text-center"
            >
              {t('checkAvailability')}
            </a>
          </div>
        </div>
      </section>

      {/* 2. Live Slot Counters (Polling/WebSockets) */}
      <section id="live-counters" className="w-full px-0 py-0 -mt-24 relative z-20">
        <div className="glass-premium p-6 sm:p-8 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 border-b border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>{t('realTimeBooking')}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-100 mt-1">{t('liveCounter')}</h2>
            </div>

            {/* Temple Toggles */}
            <div className="flex flex-wrap gap-2">
              {temples.map((temple) => (
                <button
                  key={temple.id}
                  onClick={() => setActiveTabTemple(temple.id)}
                  className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTabTemple === temple.id 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-slate-900/80 border border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {temple.name}
                </button>
              ))}
            </div>
          </div>

          {/* Polling Timer and Slot Cards */}
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[10px] text-slate-500 mb-3 font-mono">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-500 animate-ping" />
              {t('livePollingActive')}
            </span>
            <span>{t('lastUpdated')}: {pollingTime || t('loading')}</span>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
            {liveSlots.map((slot) => {
              const isSoldOut = slot.available <= 0;
              return (
                <div
                  key={slot.id}
                  onClick={() => !isSoldOut && handleBookSlotShortcut(slot.time)}
                  className={`p-4 border flex flex-col justify-between h-28 cursor-pointer transition-all duration-200 group relative ${
                    isSoldOut 
                      ? 'bg-slate-950/40 border-white/5 opacity-50 cursor-not-allowed'
                      : slot.status === 'red'
                        ? 'bg-red-950/15 border-red-900/40 hover:border-red-500'
                        : slot.status === 'amber'
                          ? 'bg-amber-950/15 border-amber-900/40 hover:border-amber-500'
                          : 'bg-slate-900/50 border-white/5 hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <Clock className="h-4.5 w-4.5 text-slate-400 group-hover:text-primary transition-colors" />
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase ${
                      slot.status === 'green' ? 'bg-emerald-950 text-emerald-400' :
                      slot.status === 'amber' ? 'bg-amber-950 text-amber-400' :
                      'bg-red-950 text-red-400'
                    }`}>
                      {slot.status === 'green' ? t('highAvailability') : slot.status === 'amber' ? t('limited') : t('fillingFast')}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 mt-2 truncate">{slot.time}</div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-baseline gap-1">
                      <span className={`font-bold text-sm ${
                        slot.status === 'green' ? 'text-emerald-400' :
                        slot.status === 'amber' ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {slot.available}
                      </span>
                      <span>/ {slot.total} {t('slotsRemaining')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Temple Showcase Section with Images */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-1">
              <Flame className="h-4 w-4" />
              <span>{t('sacredDestinations')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">{t('sacredTemples')}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {temples.map((temple) => (
            <div
              key={temple.id}
              className="group relative overflow-hidden border border-border cursor-pointer"
              onClick={() => {
                setActiveTabTemple(temple.id);
                store.setSelectedTemple(temple as any);
                store.resetBookingFlow();
                setIsWizardOpen(true);
              }}
            >
              {/* Temple Image */}
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={temple.templeImage}
                  alt={temple.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Deity Image Badge */}
                <div className="absolute top-4 right-4 h-20 w-20 border-2 border-primary/60 shadow-xl overflow-hidden bg-black/40 backdrop-blur-sm">
                  <Image
                    src={temple.deityImage}
                    alt={temple.deity.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* VIP Price Tag */}
                <div className="absolute top-4 left-4 bg-primary px-3 py-1 text-white text-xs font-bold shadow-lg">
                  VIP ₹{temple.vipDarshanInfo.price}
                </div>

                {/* Temple Name Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-black text-white drop-shadow-lg">{temple.name}</h3>
                  <p className="text-sm text-white/80 font-medium mt-0.5">{temple.deity.name}</p>
                </div>
              </div>

              {/* Temple Details Card */}
              <div className="bg-card p-5 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {temple.deity.description.slice(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {temple.deity.primaryFestivals.slice(0, 2).map((fest: string, i: number) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-bold border border-primary/20">
                        {fest}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
                    <span>{t('bookVipDarshan')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Bottom Info Row */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{temple.visitingInfo.hours}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t('ujjainMP')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Temple Lore & Historical Content (Sanity schema preview) */}
      {selectedTempleDetails && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Historical Details */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-card border border-white/5 p-6 shadow-lg">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-white/5 pb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                {t('templeLore')}
              </h3>
              <div className="mt-4 space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <div>
                  <h4 className="font-bold text-accent">{t('deityIconography')}</h4>
                  <p className="mt-1">{selectedTempleDetails.deity.description}</p>
                  <p className="mt-2 text-slate-400 italic">{selectedTempleDetails.deity.iconography}</p>
                </div>
                <hr className="border-white/5" />
                <div>
                  <h4 className="font-bold text-accent">{t('architecturalHeritage')}</h4>
                  <p className="mt-1">
                    <strong>{t('period')}:</strong> {selectedTempleDetails.history.foundingPeriod} | <strong>{t('style')}:</strong> {selectedTempleDetails.history.architecturalStyle}
                  </p>
                  <p className="mt-1">{selectedTempleDetails.history.heritageListing}</p>
                </div>
              </div>
            </div>

            {/* Advisory Notice to fill empty space */}
            <div className="bg-red-950/20 border border-red-500/20 p-6 shadow-lg relative overflow-hidden group hover:border-red-500/30 transition-all flex-grow">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-24 h-24 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-red-500 flex items-center gap-2 border-b border-red-500/20 pb-3 relative z-10">
                <AlertTriangle className="h-5 w-5" />
                {t('advisoryTitle')}
              </h3>
              <div className="mt-4 text-xs sm:text-sm leading-relaxed text-red-400 font-medium relative z-10">
                <p>
                  {t('advisoryBody')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Visiting Information */}
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-white/5 p-6 shadow-lg">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-white/5 pb-3">
                <MapPin className="h-5 w-5 text-primary" />
                {t('visitorInstructions')}
              </h3>
              <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-300">
                <div>
                  <strong className="text-accent block">{t('visitingHours')}:</strong>
                  <span>{selectedTempleDetails.visitingInfo.hours}</span>
                </div>
                <div>
                  <strong className="text-accent block">{t('dressCodeConstraint')}:</strong>
                  <span className="text-red-400 font-semibold">{selectedTempleDetails.visitingInfo.dressCode}</span>
                </div>
                <div>
                  <strong className="text-accent block mb-1">{t('strictRules')}:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                    {selectedTempleDetails.visitingInfo.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-900/50 p-3 border border-white/5">
                  <strong className="text-primary block font-bold uppercase tracking-wider text-[10px] mb-1">{t('vipTicketPricing')}</strong>
                  <span className="text-slate-100 font-bold text-base">₹{selectedTempleDetails.vipDarshanInfo.price}</span>
                  <span className="text-slate-500 text-[10px]"> / {t('perDevotee')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Upcoming Festivals (Sanity Event Calendar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h3 className="text-lg font-black text-slate-100 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {t('upcomingFestivals')}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900/40 p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between h-36">
            <div>
              <span className="text-[10px] text-accent uppercase font-bold tracking-wider">Aug 2026</span>
              <h4 className="font-bold text-slate-200 mt-1">{t('festShravan')}</h4>
            </div>
            <div className="text-[11px] text-slate-500 border-t border-white/5 pt-3">
              {t('festShravanDesc')}
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between h-36">
            <div>
              <span className="text-[10px] text-accent uppercase font-bold tracking-wider">Oct 2026</span>
              <h4 className="font-bold text-slate-200 mt-1">{t('festNavratri')}</h4>
            </div>
            <div className="text-[11px] text-slate-500 border-t border-white/5 pt-3">
              {t('festNavratriDesc')}
            </div>
          </div>

          <div className="bg-slate-900/40 p-5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between h-36">
            <div>
              <span className="text-[10px] text-accent uppercase font-bold tracking-wider">Nov 2026</span>
              <h4 className="font-bold text-slate-200 mt-1">{t('festHarihara')}</h4>
            </div>
            <div className="text-[11px] text-slate-500 border-t border-white/5 pt-3">
              {t('festHariharaDesc')}
            </div>
          </div>
        </div>
      </section>

      {/* 5. DPDP Act 2023 Explicit Consent Modal Overlay */}
      {!dpdpAccepted && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-card border border-white/15 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-amber-500">
                <ShieldAlert className="h-8 w-8 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">{t('dpdpTitle')}</h3>
                  <span className="text-[10px] text-slate-500 tracking-wider">{t('dpdpSubtitle')}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <p>
                  {t('dpdpBody')}
                </p>
                <div className="bg-slate-950 p-3 border border-white/5 text-slate-400 space-y-1 text-[11px]">
                  <div>• {t('dpdpDataMin')}</div>
                  <div>• {t('dpdpPurpose')}</div>
                  <div>• {t('dpdpDeletion')}</div>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => alert(t('declineAlert'))}
                  className="w-1/3 py-2 bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 text-xs font-bold cursor-pointer"
                >
                  {t('decline')}
                </button>
                <button
                  onClick={handleAcceptDpdp}
                  className="w-2/3 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" /> {t('agreeAuthorize')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Flow Wizard Modal */}
      <BookingWizard 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
}
