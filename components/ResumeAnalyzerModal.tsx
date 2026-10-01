"use client";

import React, { useState } from "react";
import { usePlyace } from "@/lib/store";
import { Job, ResumeAnalysis } from "@/lib/types";
import {
  FileSearch,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Check,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

export function ResumeAnalyzerView() {
  const { jobs, analyzeResume, resumeAnalyses, currentUser } = usePlyace();
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const [resumeText, setResumeText] = useState<string>(
    `Aditi Rao\nB.Tech Computer Science & Engineering\nCGPA: 8.4/10\n\nTECHNICAL SKILLS:\nLanguages & Frameworks: Python, TypeScript, React, SQL, HTML5, CSS3, Tailwind CSS\nTools & Platforms: Git, Docker, Linux, Postman\nCore Competencies: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems\n\nPROJECTS:\n1. Distributed Task Queue & Scheduler (Python, Redis, Docker)\n- Designed and built asynchronous task scheduler processing 10,000+ jobs/min with fault-tolerant retries.\n- Reduced job execution latency by 42% through connection pooling.\n\n2. Real-Time Collaborative Whiteboard (React, TypeScript, WebSockets)\n- Implemented operational transformation engine for conflict-free multi-user canvas synchronization.\n- Integrated JWT authentication and role-based canvas permissions.`
  );
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ResumeAnalysis | null>(
    resumeAnalyses[0] || null
  );

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);

    try {
      // Simulate intelligent ATS processing latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      const res = await analyzeResume(resumeText, selectedJobId);
      setCurrentResult(res);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setResumeText(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-[#2563EB]" />
            ATS Resume Analyzer & Keyword Matcher
          </h2>
          <p className="text-xs text-[#64748B]">
            Score your resume against target company criteria in under 30 seconds &bull; Earn +10 Points per analysis
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-bold text-[#059669]">
          <Award className="w-4 h-4 text-[#10B981]" />
          <span>+10 Points Added to Profile</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Upload */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-card space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Target Placement Drive / Role
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} - {j.title} ({j.oppType})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Resume Content (Paste Text or Upload)
                </label>
                <label className="text-[11px] font-bold text-[#2563EB] hover:text-[#1E3A8A] cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File (.txt/.md)</span>
                  <input
                    type="file"
                    accept=".txt,.md,.text"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={12}
                placeholder="Paste the raw text of your resume here..."
                className="w-full p-3.5 text-xs font-mono rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] leading-relaxed resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !resumeText.trim()}
              className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating ATS Compatibility & Keywords...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Resume Against Selected Drive</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: ATS Score & Feedback */}
        <div className="lg:col-span-6 space-y-4">
          {currentResult ? (
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-card space-y-6 animate-in fade-in duration-200">
              {/* Score Meter Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[#E2E8F0]">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    ATS Readiness Score
                  </div>
                  <div className="text-base font-bold text-[#0F172A]">
                    {currentResult.company} &bull; {currentResult.jobTitle}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black border ${
                      currentResult.atsScore >= 80
                        ? "bg-[#10B981]/10 text-[#059669] border-[#10B981]/30"
                        : currentResult.atsScore >= 60
                        ? "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/30"
                        : "bg-[#EF4444]/10 text-[#DC2626] border-[#EF4444]/30"
                    }`}
                  >
                    <span className="text-2xl leading-none">{currentResult.atsScore}</span>
                    <span className="text-[10px] font-semibold text-slate-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Keywords */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#059669] mb-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    Matched Keywords ({currentResult.matchedKeywords.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentResult.matchedKeywords.length > 0 ? (
                      currentResult.matchedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#10B981]/10 text-[#059669] border border-[#10B981]/25"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">No exact keywords matched yet.</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626] mb-2">
                    <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                    Missing High-Priority Keywords ({currentResult.missingKeywords.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentResult.missingKeywords.length > 0 ? (
                      currentResult.missingKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#EF4444]/10 text-[#DC2626] border border-[#EF4444]/25"
                        >
                          + {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">All required keywords covered!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Key Strengths
                </h4>
                <div className="space-y-1.5">
                  {currentResult.strengths.map((str, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#0F172A]">
                      <span className="text-[#10B981] font-bold">&check;</span>
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                  Optimization Recommendations
                </h4>
                <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                  {currentResult.suggestions.map((sug, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#0F172A]">
                      <span className="text-[#2563EB] font-bold">&bull;</span>
                      <span className="leading-snug">{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 border border-[#E2E8F0] shadow-card text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-3">
                <FileSearch className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[#0F172A] text-sm mb-1">No Active Analysis Yet</h3>
              <p className="text-xs text-[#64748B] max-w-sm mb-4">
                Select your target company on the left and click &apos;Analyze Resume&apos; to generate your instant ATS shortlisting breakdown.
              </p>
              <button
                onClick={handleAnalyze}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-[#0F172A] transition-colors"
              >
                Run Sample Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
