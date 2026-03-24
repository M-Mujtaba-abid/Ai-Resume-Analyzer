// app/dashboard/PaymentPage.tsx (Client Component)
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
// import { SuccessAlert, CancelAlert } from "@/components/dashboard/PaymentStatusAlert";

// components/dashboard/PaymentStatusAlert.tsx
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export const SuccessAlert = () => (
  <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
    <div className="bg-emerald-500 p-2 rounded-full text-white">
      <CheckCircle2 size={24} />
    </div>
    <div className="grow">
      <h3 className="text-emerald-900 font-bold text-lg italic">Payment Successful!</h3>
      <p className="text-emerald-700 text-sm font-medium">
        Aapka account upgrade ho gaya hai. Ab aap premium features aur zyada scans enjoy kar sakte hain.
      </p>
    </div>
  </div>
);

export const CancelAlert = () => (
  <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
    <div className="bg-amber-500 p-2 rounded-full text-white">
      <XCircle size={24} />
    </div>
    <div className="grow">
      <h3 className="text-amber-900 font-bold text-lg italic">Payment Cancelled</h3>
      <p className="text-amber-700 text-sm font-medium">
        Checkout process cancel kar diya gaya tha. Agar koi masla hai toh support se raabta karein.
      </p>
    </div>
  </div>
);



export default function PaymentPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"success" | "cancelled" | null>(null);
  
  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    if (paymentStatus === "success") {
      setStatus("success");
      toast.success("Upgrade Successful!");
      
      // Data sync karein
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      
      // 5 seconds baad alert gayab karne ke liye (Optional)
      const timer = setTimeout(() => {
        window.history.replaceState({}, "", "/dashboard");
        // setStatus(null); // Agar aap chahte hain ke alert gayab ho jaye
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (paymentStatus === "cancelled") {
      setStatus("cancelled");
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [paymentStatus, queryClient]);

  if (!status) return null;

  return (
    <div className="w-full max-w-4xl">
      {status === "success" ? <SuccessAlert /> : <CancelAlert />}
    </div>
  );
}