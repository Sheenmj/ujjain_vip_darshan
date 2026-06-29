'use client';

import React from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Flame, LogOut, Shield, User, Globe, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const { t, language } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  
  const { 
    language: storeLang,
    setLanguage, 
    userPhone, 
    userRole, 
    setUserSession,
    resetBookingFlow
  } = useBookingStore();

  const handleLogout = () => {
    setUserSession(null, 'Devotee');
    resetBookingFlow();
    router.push('/');
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as any;
    setUserSession(userPhone || '9876543210', role);
    useBookingStore.getState().addAuditLog(
      "ROLE_CHANGE",
      role,
      `Switched session simulation role to: ${role}`
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Portal Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center bg-linear-to-br from-primary to-secondary text-white shadow-lg group-hover:scale-105 transition-all duration-300">
              <Flame className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-accent uppercase">{t('title')}</span>
              </div>
              <h1 className="text-lg font-bold text-slate-100 group-hover:text-primary transition-colors">
                {t('portalName')}
              </h1>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-slate-300'}`}
            >
              {t('home')}
            </Link>
            
            {userPhone && (
              <Link 
                href="/bookings" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/bookings' ? 'text-primary' : 'text-slate-300'}`}
              >
                {t('myBookings')}
              </Link>
            )}

            {(userRole === 'Super Admin' || userRole === 'Temple Administrator' || userRole === 'VIP Officer') && (
              <Link 
                href="/admin" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/admin' ? 'text-primary' : 'text-slate-300'}`}
              >
                {t('adminDash')}
              </Link>
            )}

            {(userRole === 'Temple Staff' || userRole === 'Super Admin') && (
              <Link 
                href="/staff" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/staff' ? 'text-primary' : 'text-slate-300'}`}
              >
                {t('staffScan')}
              </Link>
            )}
          </nav>

          {/* Actions: i18n + Role + Auth */}
          <div className="flex items-center gap-4">
            {/* Multi-language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 border border-slate-700">
              <Globe className="h-3.5 w-3.5 text-accent" />
              <select
                value={storeLang}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-200 border-none outline-hidden cursor-pointer"
              >
                <option value="en" className="bg-slate-900 text-slate-200">EN</option>
                <option value="hi" className="bg-slate-900 text-slate-200">हिन्दी</option>
                <option value="ta" className="bg-slate-900 text-slate-200">தமிழ்</option>
                <option value="te" className="bg-slate-900 text-slate-200">తెలుగు</option>
                <option value="gu" className="bg-slate-900 text-slate-200">ગુજરાતી</option>
              </select>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] uppercase font-bold text-slate-400 hidden lg:inline-block">Role:</span>
              <select
                value={userRole}
                onChange={handleRoleChange}
                className="bg-transparent text-xs font-bold text-primary border-none outline-hidden cursor-pointer"
              >
                <option value="Devotee" className="bg-slate-900 text-slate-200">Devotee</option>
                <option value="Temple Staff" className="bg-slate-900 text-slate-200">Staff Scanner</option>
                <option value="VIP Officer" className="bg-slate-900 text-slate-200">VIP Officer</option>
                <option value="Temple Administrator" className="bg-slate-900 text-slate-200">Temple Admin</option>
                <option value="Super Admin" className="bg-slate-900 text-slate-200">Super Admin</option>
              </select>
            </div>

            {/* User Session */}
            {userPhone ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs text-slate-400">Authenticated</span>
                  <span className="text-xs font-bold text-slate-200">{userPhone}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex h-9 w-9 items-center justify-center bg-red-950/40 border border-red-900/60 text-red-400 hover:bg-red-900/50 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setUserSession('9876543210', 'Devotee')}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 text-xs font-bold shadow-md hover:shadow-primary/30 transition-all cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Sign In (Demo)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
