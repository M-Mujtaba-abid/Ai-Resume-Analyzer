"use client";

import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { analyzeResume } from "@/services/resumeService";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const params = useSearchParams();
  const router = useRouter();

  const resumeId = params.get("resumeId");
  const [jobDescription, setJobDescription] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (data) => {
      toast.success("Analysis completed successfully!");
      router.push(`/result/${data.data._id}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Analysis failed. Please check your monthly limit.";
      toast.error(message);
    },
  });

  const handleAnalyze = () => {
    if (!resumeId) return toast.error("Resume ID missing. Please upload again.");
    mutate({ resumeId, jobDescription });
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground transition-colors duration-300 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Semantic Matching Engine
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Match with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Job Role</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Paste the target job description. Our AI will perform a deep-scan against your resume to find skill gaps.
          </p>
        </div>

        {/* --- INPUT CARD --- */}
        <div className="relative group p-1 rounded-[2.5rem] bg-gradient-to-b from-border to-transparent shadow-2xl">
          <div className="bg-card rounded-[2.3rem] p-8 md:p-10 border border-border transition-all">
            <div className="flex justify-between items-center mb-6">
              <label className="text-sm font-bold uppercase tracking-widest text-blue-500/80">
                Target Job Description
              </label>
              <div className="px-3 py-1 rounded-full bg-background border border-border text-[10px] font-mono opacity-60">
                {jobDescription.length} chars
              </div>
            </div>

            <textarea
              rows={10}
              className="w-full bg-background border-2 border-border rounded-[1.5rem] p-6 text-foreground focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none placeholder:text-slate-500/50 leading-relaxed text-sm md:text-base"
              placeholder="Paste the full job responsibilities and requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />

            <div className="mt-10 flex flex-col items-center">
              <button
                disabled={!resumeId || !jobDescription || isPending}
                onClick={handleAnalyze}
                className={`group relative w-full md:w-2/3 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 flex justify-center items-center gap-3 overflow-hidden
                  ${!resumeId || !jobDescription || isPending
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-border"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20"
                  }`}
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Crunching Data...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 START AI ANALYSIS</span>
                  </>
                )}
              </button>
              
              
            </div>
          </div>
        </div>

        {/* --- STEP INDICATORS --- */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", text: "Paste Job Text", color: "text-blue-500" },
            { step: "02", text: "AI Comparison", color: "text-indigo-500" },
            { step: "03", text: "Get ATS Insights", color: "text-purple-500" }
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-4 bg-card/50 border border-border p-4 rounded-2xl">
              <span className={`text-2xl font-black ${item.color} opacity-20`}>{item.step}</span>
              <span className="text-sm font-bold opacity-70 italic">{item.text}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}