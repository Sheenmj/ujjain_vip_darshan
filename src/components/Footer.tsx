import React from 'react';
import { ShieldCheck, Landmark, CheckCircle, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#07080b] border-t border-white/5 py-10 mt-auto text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Section 1 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
              <Landmark className="h-4 w-4 text-primary" />
              <span>Madhya Pradesh Devasthan</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Official portal of Ujjain District Temple Administration. Responsible for Darshan planning, pilgrim hospitality, and VIP quota allocation.
            </p>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-2">
            <span className="text-slate-200 font-bold text-sm mb-1">Important Helplines</span>
            <div className="flex flex-col gap-1 text-slate-500">
              <span>Mahakal Toll-Free: 1800-233-1008</span>
              <span>Collectorate Office: +91 734 2511211</span>
              <span>Police Control Room: +91 734 2527100</span>
              <span>Technical Support: support.devasthan@mp.gov.in</span>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-2">
            <span className="text-slate-200 font-bold text-sm mb-1">Compliance & Policies</span>
            <div className="flex flex-col gap-1 text-slate-500">
              <span className="hover:text-primary transition-colors cursor-pointer">Digital Personal Data Protection (DPDP) Act 2023 Compliance</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Security Audits (CERT-In Empanelled Auditor)</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service & Cancellation Refund Policy</span>
              <span className="hover:text-primary transition-colors cursor-pointer">Grievance Officer Redressal Board</span>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex flex-col gap-3">
            <span className="text-slate-200 font-bold text-sm mb-1">Trust Certifications</span>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 border border-white/5">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-300">UIDAI Sandbox Active</div>
                  <div className="text-[10px] text-slate-500">Secure Aadhaar e-KYC Verification</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 border border-white/5">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <div className="font-bold text-slate-300">Razorpay Encrypted</div>
                  <div className="text-[10px] text-slate-500">PCI-DSS Level 1 Secure Payments</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/5 my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600">
          <div>
            © {new Date().getFullYear()} Government of Madhya Pradesh. All rights reserved.
          </div>
          <div className="flex items-center gap-2.5">
            <span className="bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-[10px] font-bold uppercase px-2 py-0.5">
              DPDP Act 2023 Compliant
            </span>
            <span className="bg-slate-950 border border-slate-900 text-slate-500 text-[10px] font-bold uppercase px-2 py-0.5">
              v1.2.0-STABLE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
