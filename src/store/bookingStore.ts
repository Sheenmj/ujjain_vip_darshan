import { create } from 'zustand';

export interface Devotee {
  name: string;
  age: number;
  gender: string;
  aadhaarLast4: string;
  idFile?: string; // For Aadhaar e-KYC upload (VIP tier)
  kycVerified?: boolean;
}

export interface BookingDetails {
  id: string;
  templeId: string;
  templeName: string;
  date: string;
  slot: string;
  phone: string;
  devotees: Devotee[];
  paymentId?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  qrCode?: string; // Decrypted or signature payload
  amount: number;
  timestamp: string;
  vipRequestNote?: string;
  vipApproved?: boolean;
}

export interface Temple {
  id: string;
  name: string;
  slug: string;
  deity: {
    name: string;
    description: string;
    iconography: string;
    primaryFestivals: string[];
  };
  history: {
    foundingPeriod: string;
    architecturalStyle: string;
    historicalBackground: string;
    heritageListing: string;
  };
  visitingInfo: {
    hours: string;
    dressCode: string;
    rules: string[];
    address: string;
  };
  vipDarshanInfo: {
    description: string;
    duration: string;
    price: number;
    specialBenefits: string[];
  };
}

interface BookingState {
  // Locale State
  language: 'en' | 'hi' | 'ta' | 'te' | 'gu';
  setLanguage: (lang: 'en' | 'hi' | 'ta' | 'te' | 'gu') => void;

  // Session State
  userPhone: string | null;
  userRole: 'Devotee' | 'Temple Staff' | 'VIP Officer' | 'Temple Administrator' | 'Super Admin';
  setUserSession: (phone: string | null, role?: 'Devotee' | 'Temple Staff' | 'VIP Officer' | 'Temple Administrator' | 'Super Admin') => void;

  // Booking Flow Wizard State
  currentStep: number;
  setStep: (step: number) => void;
  resetBookingFlow: () => void;

  selectedTemple: Temple | null;
  setSelectedTemple: (temple: Temple | null) => void;
  
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  
  selectedSlot: string; // e.g. "06:00 AM - 08:00 AM"
  setSelectedSlot: (slot: string) => void;

  devotees: Devotee[];
  setDevotees: (devotees: Devotee[]) => void;
  addDevotee: (devotee: Devotee) => void;
  removeDevotee: (index: number) => void;
  
  vipNote: string;
  setVipNote: (note: string) => void;

  isOtpSent: boolean;
  isOtpVerified: boolean;
  setOtpStatus: (sent: boolean, verified: boolean) => void;

  isKycInProgress: boolean;
  isKycCompleted: boolean;
  setKycStatus: (inProgress: boolean, completed: boolean) => void;

  // Bookings list (for dashboard mock persistence)
  bookings: BookingDetails[];
  addBooking: (booking: BookingDetails) => void;
  cancelBooking: (id: string) => void;
  
  // Admin VIP Approval actions
  approveVipRequest: (bookingId: string) => void;
  rejectVipRequest: (bookingId: string) => void;

  // Audit Logs for Mock
  auditLogs: Array<{ action: string; user: string; timestamp: string; details: string }>;
  addAuditLog: (action: string, user: string, details: string) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),

  userPhone: null,
  userRole: 'Devotee',
  setUserSession: (phone, role = 'Devotee') => set({ userPhone: phone, userRole: role }),

  currentStep: 1,
  setStep: (step) => set({ currentStep: step }),
  
  resetBookingFlow: () => set({
    currentStep: 1,
    selectedTemple: null,
    selectedDate: '',
    selectedSlot: '',
    devotees: [],
    vipNote: '',
    isOtpSent: false,
    isOtpVerified: false,
    isKycInProgress: false,
    isKycCompleted: false,
  }),

  selectedTemple: null,
  setSelectedTemple: (temple) => set({ selectedTemple: temple }),

  selectedDate: '',
  setSelectedDate: (date) => set({ selectedDate: date }),

  selectedSlot: '',
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  devotees: [],
  setDevotees: (devotees) => set({ devotees }),
  addDevotee: (devotee) => set((state) => ({ devotees: [...state.devotees, devotee] })),
  removeDevotee: (index) => set((state) => ({ devotees: state.devotees.filter((_, i) => i !== index) })),
  
  vipNote: '',
  setVipNote: (vipNote) => set({ vipNote }),

  isOtpSent: false,
  isOtpVerified: false,
  setOtpStatus: (sent, verified) => set({ isOtpSent: sent, isOtpVerified: verified }),

  isKycInProgress: false,
  isKycCompleted: false,
  setKycStatus: (inProgress, completed) => set({ isKycInProgress: inProgress, isKycCompleted: completed }),

  bookings: [],
  addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
  cancelBooking: (id) => set((state) => ({
    bookings: state.bookings.map((b) => 
      b.id === id ? { ...b, status: 'CANCELLED' } : b
    )
  })),

  approveVipRequest: (bookingId) => set((state) => ({
    bookings: state.bookings.map((b) => 
      b.id === bookingId ? { ...b, vipApproved: true } : b
    )
  })),
  
  rejectVipRequest: (bookingId) => set((state) => ({
    bookings: state.bookings.map((b) => 
      b.id === bookingId ? { ...b, vipApproved: false, status: 'CANCELLED' } : b
    )
  })),

  auditLogs: [],
  addAuditLog: (action, user, details) => set((state) => ({
    auditLogs: [{ action, user, timestamp: new Date().toISOString(), details }, ...state.auditLogs]
  }))
}));
