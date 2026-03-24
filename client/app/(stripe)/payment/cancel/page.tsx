"use client";

import { useRouter } from "next/navigation";
import { X, AlertCircle, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-6 relative overflow-hidden">
      {/* Background Decor - Reddish touch for cancel */}
      <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-red-600/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-orange-400/10 blur-[100px] rounded-full" />

      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 bg-card border border-border p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-center max-w-md w-full"
        >
          {/* Animated X Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-red-500/10 p-5 rounded-full border-2 border-red-500/20 relative">
              <X size={40} className="text-red-500 stroke-[3px]" />
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1 -right-1 text-red-500 bg-background rounded-full"
              >
                <AlertCircle size={22} fill="currentColor" className="text-red-500 bg-white dark:bg-black rounded-full" />
              </motion.div>
            </div>
          </motion.div>

          {/* Cancel Typography */}
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter italic leading-none">
            Payment <span className="text-red-500 uppercase">Cancelled.</span>
          </h1>

          <p className="text-base text-slate-500 dark:text-slate-400 mb-8 font-medium px-2 leading-relaxed">
            No worries! Your account was not charged. You can try again whenever you are ready.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => router.push("/pricing")}
              className="group w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(239,68,68,0.2)]"
            >
              <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
              Try Again
            </button>
            
            <button
              onClick={() => router.push("/")}
              className="w-full bg-transparent text-slate-400 hover:text-foreground py-1 text-sm font-bold transition-colors flex items-center justify-center gap-1"
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}