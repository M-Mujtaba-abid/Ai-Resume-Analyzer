"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
        
        <div className="flex justify-center mb-6">
          <XCircle size={60} className="text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-2">
          Payment Cancelled ❌
        </h1>

        <p className="text-gray-500 mb-6">
          You cancelled the payment. No changes were made.
        </p>

        <button
          onClick={() => router.push("/pricing")}
          className="bg-black text-white px-6 py-3 rounded-xl w-full"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}