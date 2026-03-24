"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight, Download, Zap } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { getProfile } from '@/services/stripeService';
// import { getProfile } from '@/services/userService';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Latest profile data fetch karein takay naya plan dikhay
  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
  });

  useEffect(() => {
    // Background mein queries refresh karein takay dashboard update ho jaye
    queryClient.invalidateQueries({ queryKey: ["user-profile"] });
  }, [queryClient]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center italic">Processing Payment Details...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-100 border border-slate-100 text-center relative overflow-hidden">
        
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>

        <div className="flex justify-center mb-6">
          <div className="bg-emerald-100 p-4 rounded-full animate-bounce">
            <CheckCircle2 size={48} className="text-emerald-600" />
          </div>
        </div>

        <h1 className="text-4xl font-black italic tracking-tighter mb-2">
          PAYMENT <span className="text-blue-600">SUCCESS!</span>
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          Mubarak ho! Aapka account upgrade ho gaya hai.
        </p>

        {/* Plan Details Card */}
        <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-slate-100 text-left">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Plan</span>
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase italic">
              {user?.data?.plan || "Premium"}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <Zap size={16} className="text-blue-600" /> 
              {user?.data?.maxLimit} AI Scans Unlocked
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
              <Download size={16} className="text-blue-600" /> 
              Unlimited PDF Downloads
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-lg"
          >
            Go to Dashboard <ArrowRight size={20} />
          </button>
          
          <button 
            onClick={() => router.push('/resume/upload')}
            className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            Start First Scan
          </button>
        </div>

        <p className="mt-8 text-[10px] text-slate-400 font-medium">
          A confirmation email has been sent to <strong>{user?.data?.email}</strong>
        </p>
      </div>
    </div>
  );
}