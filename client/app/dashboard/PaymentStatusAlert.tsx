// components/dashboard/PaymentStatusAlert.tsx
import { CheckCircle2, XCircle, Sparkles, Calendar } from "lucide-react";

export const SuccessAlert = ({ plan, expiry }: { plan?: string; expiry?: string }) => (
  <div className="relative overflow-hidden mb-8 p-8 bg-linear-to-br from-emerald-50 to-white border border-emerald-200 rounded-[2.5rem] shadow-xl shadow-emerald-100/50 animate-in fade-in zoom-in duration-500">
    {/* Decorative Background Icon */}
    <Sparkles className="absolute -right-4 -top-4 text-emerald-100 size-32 rotate-12" />
    
    <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="bg-emerald-500 p-4 rounded-3xl text-white shadow-lg shadow-emerald-200">
        <CheckCircle2 size={32} strokeWidth={2.5} />
      </div>
      
      <div className="grow">
        <h3 className="text-emerald-950 font-black text-2xl italic tracking-tight mb-1">
          WELCOME TO THE <span className="uppercase text-emerald-600">{plan || "PRO"}</span> CLUB!
        </h3>
        <p className="text-emerald-700 font-medium mb-3">
          Aapka account upgrade ho gaya hai. Ab aapki limits barh chuki hain.
        </p>
        
        {expiry && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold">
            <Calendar size={14} /> Next Billing: {new Date(expiry).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  </div>
);
