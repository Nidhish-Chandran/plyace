"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePlyace } from "@/lib/store";
import { checkEligibility } from "@/lib/eligibility";
import {
  Bot,
  Send,
  User,
  Sparkles,
  HelpCircle,
  Briefcase,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export function ChatBotView() {
  const { currentUser, jobs, announcements, simulatedDate, currentStatus } = usePlyace();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m_init",
      sender: "bot",
      text: `Hello ${currentUser.name}! I am your Plyace AI Placement Assistant. I can check your real-time eligibility for any company, tell you about upcoming deadlines, or guide you through off-campus drives and preparation. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setIsTyping(true);

    // AI intelligent grounding engine based on active database
    setTimeout(() => {
      let botResponse = "";
      const query = textToSend.toLowerCase();

      // Check specific company eligibility query
      const matchedJob = jobs.find((j) => query.includes(j.company.toLowerCase()));
      if (matchedJob) {
        const eligibility = checkEligibility(matchedJob, currentUser, new Date(simulatedDate));
        if (eligibility.eligible) {
          botResponse = `Yes! You are fully eligible for **${matchedJob.company} - ${matchedJob.title}** (${matchedJob.packageStipend}). Your CGPA (${currentUser.cgpa.toFixed(1)}) exceeds the minimum cutoff of ${matchedJob.minCgpa.toFixed(1)}, and your branch (${currentUser.branch}) is approved. The deadline to apply is **${new Date(matchedJob.deadline).toLocaleDateString()}**.`;
        } else {
          botResponse = `Currently, you are **not eligible** for **${matchedJob.company} - ${matchedJob.title}** due to the following criteria:\n\n${eligibility.reasons.map((r) => `&bull; ${r}`).join("\n")}\n\nI recommend targeting other drives where your profile matches 100%!`;
        }
      } else if (query.includes("deadline") || query.includes("closing") || query.includes("soon")) {
        const sortedByDeadline = [...jobs].sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        const topJobs = sortedByDeadline.slice(0, 3);
        botResponse = `Here are the nearest upcoming placement deadlines:\n\n` +
          topJobs.map((j) => `&bull; **${j.company} (${j.title})**: Closes on ${new Date(j.deadline).toLocaleDateString()} (${j.packageStipend})`).join("\n") +
          `\n\nBe sure to complete your application before the midnight cutoff.`;
      } else if (query.includes("passout") || query.includes("alumni") || query.includes("off-campus")) {
        if (currentStatus === "passout") {
          botResponse = `As a recent passout, you enjoy 18 months of college placement support! You are eligible for open drives such as **Zoho Member Technical Staff** and **Goldman Sachs Analyst**, plus alumni referrals on the Mentorship board. Note that campus-exclusive drives (like Google/Cisco on-campus rounds) are reserved for current students.`;
        } else {
          botResponse = `Plyace provides an exclusive 18-month career bridge for alumni following graduation. Off-campus hiring drives and alumni referral channels are continuously curated by CGPU.`;
        }
      } else if (query.includes("announcement") || query.includes("update") || query.includes("news")) {
        const latest = announcements[0];
        botResponse = `The latest official notice from CGPU is:\n\n**${latest.title}** (${latest.tag})\n${latest.body}\n\nPosted by ${latest.author}.`;
      } else if (query.includes("resume") || query.includes("ats") || query.includes("score")) {
        botResponse = `To maximize your shortlisting rate, visit our **ATS Resume Analyzer** tab! You can upload your PDF or paste your text to get an instant 0-100 score against any posted job, view missing keywords, and earn +10 placement points.`;
      } else {
        botResponse = `Based on your profile (${currentUser.branch}, CGPA ${currentUser.cgpa.toFixed(1)}, Status: ${currentStatus}), I can help you check eligibility for specific companies (e.g. Google, Goldman Sachs, Cisco, Zoho), review closing deadlines, or guide test preparation. If you have inquiries regarding special backlog waivers or attendance, please contact the placement cell (CGPU) directly at placement@college.edu.`;
      }

      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const samplePrompts = [
    "Am I eligible for Google?",
    "Am I eligible for Cisco?",
    "What jobs are closing soon?",
    "What opportunities are available for passouts?",
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-card flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Plyace AI Placement Assistant</h3>
            <p className="text-[11px] text-[#64748B]">
              Grounded on college placement records &bull; Verified CGPU data
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#10B981]/15 text-[#059669]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          Online
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isBot = m.sender === "bot";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                isBot ? "" : "flex-row-reverse"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isBot
                    ? "bg-[#2563EB] text-white"
                    : "bg-[#1E3A8A] text-white"
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : currentUser.name.charAt(0)}
              </div>

              <div
                className={`max-w-md sm:max-w-lg rounded-2xl p-4 text-xs leading-relaxed ${
                  isBot
                    ? "bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A]"
                    : "bg-[#2563EB] text-white"
                }`}
              >
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: m.text
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/&bull;/g, "&bull;"),
                  }}
                />
                <div
                  className={`text-[10px] mt-2 text-right ${
                    isBot ? "text-slate-400" : "text-blue-100"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center text-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3 text-xs flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-6 py-2 bg-white border-t border-[#E2E8F0] flex flex-wrap gap-1.5">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            className="text-[11px] px-3 py-1 rounded-lg bg-slate-100 hover:bg-[#2563EB]/10 hover:text-[#2563EB] text-slate-700 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="p-4 bg-white border-t border-[#E2E8F0] flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything about eligibility, deadlines, or placements..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F8FAFC] text-[#0F172A]"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="p-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
