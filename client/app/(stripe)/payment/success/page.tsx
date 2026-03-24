"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const sessionId = params.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      router.push("/pricing");
    }

    // OPTIONAL: backend hit kar sakta hai verify ke liye
    // await verifySession(sessionId)
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md">
        
        <div className="flex justify-center mb-6">
          <CheckCircle2 size={60} className="text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-2">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-500 mb-6">
          Your subscription has been activated successfully.
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-black text-white px-6 py-3 rounded-xl w-full"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}