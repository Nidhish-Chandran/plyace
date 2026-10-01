"use client";

import React from "react";
import { usePlyace } from "@/lib/store";
import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  FileSearch,
  ShieldCheck,
  Trophy,
  Users,
  Bot,
  PlusCircle,
  FileSpreadsheet,
  Megaphone,
  AlertOctagon,
  UserCog,
  CalendarCheck,
} from "lucide-react";

export type ActiveTab =
  // Student tabs
  | "dashboard"
  | "jobs"
  | "applications"
  | "resume"
  | "tests"
  | "leaderboard"
  | "mentorship"
  | "chat"
  // Admin tabs
  | "admin_overview"
  | "admin_jobs"
  | "admin_applications"
  | "admin_announcements"
  | "admin_violations"
  | "admin_students";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { currentUser, jobs, applications, violationLogs } = usePlyace();
  const isAdmin = currentUser.role === "admin";

  const studentNavItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "jobs",
      label: "Opportunities Feed",
      icon: <Briefcase className="w-4 h-4" />,
      badge: jobs.length,
    },
    {
      id: "applications",
      label: "Application Tracker",
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: applications.filter((a) => a.studentId === currentUser.id).length || undefined,
    },
    {
      id: "resume",
      label: "ATS Resume Analyzer",
      icon: <FileSearch className="w-4 h-4" />,
    },
    {
      id: "tests",
      label: "Skill Tests (ExamGuard)",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: "leaderboard",
      label: "Leaderboard & Points",
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: "mentorship",
      label: "Referrals & Mock Prep",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "chat",
      label: "Plyace AI Assistant",
      icon: <Bot className="w-4 h-4" />,
    },
  ];

  const adminNavItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: "admin_overview",
      label: "Admin Overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "admin_jobs",
      label: "Post & Manage Drives",
      icon: <PlusCircle className="w-4 h-4" />,
      badge: jobs.length,
    },
    {
      id: "admin_applications",
      label: "Candidate Pipeline & CSV",
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: applications.length,
    },
    {
      id: "admin_announcements",
      label: "Broadcast Announcements",
      icon: <Megaphone className="w-4 h-4" />,
    },
    {
      id: "admin_violations",
      label: "ExamGuard Test Audit",
      icon: <AlertOctagon className="w-4 h-4" />,
      badge: violationLogs.length > 0 ? violationLogs.length : undefined,
    },
    {
      id: "admin_students",
      label: "Alumni & Lifecycle Access",
      icon: <UserCog className="w-4 h-4" />,
    },
  ];

  const items = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            {isAdmin ? "CGPU Management" : "Career Portal"}
          </div>
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-sm shadow-[#2563EB]/20"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-white" : "text-[#64748B]"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-[#0F172A]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile Snippet */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2563EB]/15 text-[#2563EB] font-bold flex items-center justify-center text-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-[#0F172A] truncate">{currentUser.name}</div>
            <div className="text-[11px] text-[#64748B] truncate">{currentUser.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
