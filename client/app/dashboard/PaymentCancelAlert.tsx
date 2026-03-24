import { XCircle } from "lucide-react";

export const CancelAlert = () => (
  <div className="mb-8 p-8 bg-linear-to-br from-rose-50 to-white border border-rose-200 rounded-[2.5rem] shadow-lg shadow-rose-100/50">
    <div className="flex items-center gap-6">
      <div className="bg-rose-500 p-4 rounded-3xl text-white shadow-lg shadow-rose-200">
        <XCircle size={32} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-rose-950 font-black text-2xl italic tracking-tight mb-1">PAYMENT STOPPED</h3>
        <p className="text-rose-700 font-medium">
          Aapne checkout cancel kar diya tha. Plan upgrade nahi hua.
        </p>
      </div>
    </div>
  </div>
);