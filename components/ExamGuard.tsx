"use client";

import React, { useState, useEffect, useRef } from "react";
import { SkillTest, TestQuestion } from "@/lib/types";
import { usePlyace } from "@/lib/store";
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  RotateCcw,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface ExamGuardProps {
  test: SkillTest;
  onExit: () => void;
}

export function ExamGuard({ test, onExit }: ExamGuardProps) {
  const { logViolation, submitTestAttempt } = usePlyace();
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [violations, setViolations] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(test.durationMin * 60);
  const [submitted, setSubmitted] = useState(false);
  const [autoSubmittedReason, setAutoSubmittedReason] = useState<string | null>(null);
  const [scoreResult, setScoreResult] = useState<{ score: number; totalPossible: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const attemptIdRef = useRef<string>(`att_${Date.now()}`);

  const MAX_VIOLATIONS = 3;

  // Record infraction
  const registerViolation = (type: any, desc: string) => {
    if (submitted) return;

    logViolation(attemptIdRef.current, test.title, type, desc);
    setViolations((prev) => {
      const updated = [...prev, `${desc} at ${new Date().toLocaleTimeString()}`];
      if (updated.length >= MAX_VIOLATIONS) {
        handleAutoSubmit("3 Violation Strikes Reached (Security Protocol Enforced)");
      }
      return updated;
    });
  };

  // Auto-submit handler
  const handleAutoSubmit = (reason: string) => {
    if (submitted) return;
    setSubmitted(true);
    setAutoSubmittedReason(reason);
    const result = submitTestAttempt(
      test.id,
      answers,
      violations.length + 1,
      true
    );
    setScoreResult(result);
  };

  // Standard submit handler
  const handleManualSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const result = submitTestAttempt(
      test.id,
      answers,
      violations.length,
      false
    );
    setScoreResult(result);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Timer hook
  useEffect(() => {
    if (!started || submitted) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit("Exam Time Limit Reached");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, submitted]);

  // Security event listeners (visibility, blur, copy, paste, contextmenu)
  useEffect(() => {
    if (!started || submitted) return;

    const handleVisibility = () => {
      if (document.hidden) {
        registerViolation("tab_switch", "Tab switch detected (navigated away from exam)");
      }
    };

    const handleBlur = () => {
      registerViolation("window_blur", "Window focus lost (switched application)");
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      registerViolation("copy_paste_attempt", "Unauthorized copy attempt blocked");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      registerViolation("copy_paste_attempt", "Unauthorized paste attempt blocked");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      registerViolation("right_click", "Context menu / right-click blocked");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        registerViolation("fullscreen_exit", "Exited full-screen exam mode");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [started, submitted]);

  // Fullscreen trigger
  const startExam = async () => {
    try {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
    } catch {
      // fallback
    }
    setStarted(true);
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const currentQuestion = test.questions[currentQuestionIndex];

  // Pre-test Instructions Screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">{test.title}</h2>
            <p className="text-xs text-[#64748B]">ExamGuard Secure Proctored Environment</p>
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0] space-y-3 mb-6 text-xs text-[#0F172A]">
          <div className="font-bold uppercase tracking-wider text-[#64748B] text-[11px]">
            Security Protocols & Rules:
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Full-screen browser mode is strictly enforced during test execution.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>
              <strong>3-Strike Violation Rule:</strong> Tab switching, window minimization, or right-clicking logs infractions. Reaching 3 strikes triggers immediate automatic submission.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Duration: <strong>{test.durationMin} minutes</strong> &bull; Total Marks: <strong>{test.totalMarks}</strong> &bull; Questions: <strong>{test.questions.length}</strong></span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
          >
            Cancel & Return
          </button>
          <button
            onClick={startExam}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Enter Fullscreen & Begin Assessment</span>
          </button>
        </div>
      </div>
    );
  }

  // Result Screen after Submission
  if (submitted && scoreResult) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-card text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 text-[#059669] mx-auto flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-[#0F172A] mb-1">Assessment Completed!</h2>
        <p className="text-xs text-[#64748B] mb-6">
          Your answers were securely evaluated and accredited to your placement profile.
        </p>

        {autoSubmittedReason && (
          <div className="mb-6 p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#DC2626] font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Auto-submitted: {autoSubmittedReason}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="text-[11px] text-[#64748B]">Score Achieved</div>
            <div className="text-2xl font-black text-[#2563EB] mt-0.5">
              {scoreResult.score} <span className="text-sm font-medium text-slate-400">/ {scoreResult.totalPossible}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="text-[11px] text-[#64748B]">Security Audit</div>
            <div className="text-2xl font-black text-[#0F172A] mt-0.5">
              {violations.length} <span className="text-sm font-medium text-slate-400">strikes</span>
            </div>
          </div>
        </div>

        {violations.length > 0 && (
          <div className="mb-6 text-left p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
            <div className="font-bold text-[#0F172A]">Recorded Proctored Infractions:</div>
            {violations.map((v, i) => (
              <div key={i} className="text-[#DC2626]">&bull; Strike {i + 1}: {v}</div>
            ))}
          </div>
        )}

        <button
          onClick={onExit}
          className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-all shadow-sm"
        >
          Return to Tests Catalog
        </button>
      </div>
    );
  }

  // Active Exam Interface
  return (
    <div
      ref={containerRef}
      className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card overflow-hidden flex flex-col min-h-[600px]"
    >
      {/* Exam Header */}
      <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-[#10B981]" />
          <div>
            <div className="font-bold text-sm leading-tight">{test.title}</div>
            <div className="text-[11px] text-slate-400">ExamGuard Active Monitoring</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Strikes Counter */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
              violations.length > 0
                ? "bg-[#EF4444]/20 text-red-300 border border-red-500/40 animate-pulse"
                : "bg-white/10 text-slate-300"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Strikes: {violations.length}/{MAX_VIOLATIONS}</span>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-xs font-mono font-bold text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Warning banner if strikes occurred */}
      {violations.length > 0 && (
        <div className="bg-[#EF4444]/15 border-b border-[#EF4444]/30 px-6 py-2 text-xs text-[#DC2626] font-semibold flex items-center justify-between">
          <span>Security Alert: Infraction detected ({violations[violations.length - 1]}). {MAX_VIOLATIONS - violations.length} strikes remaining before forced submission.</span>
        </div>
      )}

      {/* Question Body */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </span>
            <span className="text-xs font-semibold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-0.5 rounded-full">
              Single Choice
            </span>
          </div>

          <h3 className="text-base font-bold text-[#0F172A] leading-relaxed mb-6">
            {currentQuestion.text}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx }))
                  }
                  className={`w-full text-left p-4 rounded-2xl border text-xs transition-all flex items-center gap-3 ${
                    isSelected
                      ? "border-[#2563EB] bg-[#2563EB]/5 font-semibold text-[#0F172A] shadow-xs"
                      : "border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A]"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? "bg-[#2563EB] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-[#E2E8F0] mt-8 flex items-center justify-between">
          <button
            onClick={() =>
              setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
            }
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100 disabled:opacity-30 transition-colors"
          >
            &larr; Previous
          </button>

          <div className="flex items-center gap-1.5">
            {test.questions.map((_, i) => {
              const isAnswered = answers[test.questions[i].id] !== undefined;
              const isCurrent = i === currentQuestionIndex;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-[#2563EB] text-white"
                      : isAnswered
                      ? "bg-[#10B981]/20 text-[#059669]"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {currentQuestionIndex === test.questions.length - 1 ? (
            <button
              onClick={handleManualSubmit}
              className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Submit Assessment
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(test.questions.length - 1, prev + 1)
                )
              }
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
