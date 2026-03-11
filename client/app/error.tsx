"use client";

import React, { useEffect } from "react";
import { RefreshCcw, Home, Ghost } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Aap yahan Sentry ya kisi aur logging service ko call kar sakte hain
    console.error("Runtime Error Captured:", error);
  }, [error]);

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6 text-center transition-colors duration-300">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
        <Ghost size={100} className="text-red-500 relative z-10" />
      </div>

      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-foreground">
        Something <span className="text-red-500">Exploded.</span>
      </h1>

      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 leading-relaxed font-medium">
        I am not saying it is your resume, but the AI just asked for a resignation letter. <br />
        <span className="text-sm italic opacity-70">(A minor server-side hiccup!)</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={() => reset()}
          className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95"
        >
          <RefreshCcw size={20} />
          Try Again
        </button>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 bg-card border border-border px-8 py-4 rounded-2xl font-bold text-foreground hover:bg-border transition-all active:scale-95"
        >
          <Home size={20} />
          Go Home
        </Link>
      </div>
      
      {error.digest && (
        <p className="mt-8 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}