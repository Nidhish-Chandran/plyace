"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlyace } from "@/lib/store";
import { Navbar } from "./Navbar";
import { ExpiryBanner } from "./ExpiryBanner";
import { AccessEndedScreen } from "./AccessEndedScreen";
import { AdminSimulateModal } from "./AdminSimulateModal";
import { ChatBotView } from "./ChatBotModal";
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
  MessageSquare,
} from "lucide-react";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const pathname = usePathname();
  const { currentUser, currentStatus, jobs, applications, violationLogs } = usePlyace();
  const isAdmin = currentUser.role === "admin";

  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const studentNavItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      href: "/jobs",
      label: "Recruitment Drives",
      icon: <Briefcase className="w-4 h-4" />,
      badge: jobs.length,
    },
    {
      href: "/applications",
      label: "Application Tracker",
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: applications.filter((a) => a.studentId === currentUser.id).length || undefined,
    },
    {
      href: "/resume",
      label: "ATS Resume Analyzer",
      icon: <FileSearch className="w-4 h-4" />,
    },
    {
      href: "/tests",
      label: "Proctored Tests",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      href: "/leaderboard",
      label: "Rankings & Points",
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      href: "/mentorship",
      label: "Alumni & Mock Prep",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const adminNavItems = [
    {
      href: "/admin",
      label: "CGPU Overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      href: "/jobs",
      label: "Placement Drives",
      icon: <Briefcase className="w-4 h-4" />,
      badge: jobs.length,
    },
    {
      href: "/admin#pipeline",
      label: "Candidate Pipeline",
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: applications.length,
    },
    {
      href: "/admin#announcements",
      label: "Broadcast Notices",
      icon: <Megaphone className="w-4 h-4" />,
    },
    {
      href: "/admin#audit",
      label: "ExamGuard Violations",
      icon: <AlertOctagon className="w-4 h-4" />,
      badge: violationLogs.length || undefined,
    },
    {
      href: "/admin#roster",
      label: "Student Roster",
      icon: <UserCog className="w-4 h-4" />,
    },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navbar */}
      <Navbar
        onOpenSimulate={() => setShowSimulateModal(true)}
      />

      {/* Expiry Banner for passouts */}
      <ExpiryBanner />

      {/* If lifecycle is expired, show access blocked message */}
      {currentStatus === "expired" ? (
        <AccessEndedScreen onOpenSimulate={() => setShowSimulateModal(true)} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E2E8F0] p-4 justify-between shrink-0">
            <div className="space-y-6">
              {/* User Profile Mini Card */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] flex items-center justify-center font-bold text-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-xs text-[#0F172A] truncate">
                      {currentUser.name}
                    </h3>
                    <p className="text-[10px] text-[#64748B] truncate">
                      {currentUser.rollNumber ? `${currentUser.rollNumber} • ` : ""}
                      {currentUser.branch}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-[10px]">
                  <span className="text-[#64748B]">CGPA: <strong className="text-[#0F172A]">{currentUser.cgpa.toFixed(1)}</strong></span>
                  <span className="text-[#64748B]">Backlogs: <strong className="text-[#0F172A]">{currentUser.backlogs}</strong></span>
                  <span className="font-bold text-[#10B981]">{currentUser.points} pts</span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#64748B] px-3 pb-2">
                  {isAdmin ? "CGPU Administration" : "Student Placement Hub"}
                </div>

                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href) && item.href !== "/admin");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#2563EB] text-white shadow-sm shadow-[#2563EB]/25"
                          : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-[#2563EB]/10 text-[#2563EB]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Support Info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#64748B] space-y-1">
              <div className="font-bold text-[#0F172A]">CGPU Helpdesk</div>
              <p className="text-[10px]">Office Hours: 9:00 AM - 5:00 PM</p>
              <p className="text-[10px] text-[#2563EB]">placement@college.edu</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* Mobile Tab Bar */}
            <div className="md:hidden flex overflow-x-auto gap-2 pb-3 mb-4 scrollbar-none">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? "bg-[#2563EB] text-white"
                        : "bg-white border border-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {children}
          </main>
        </div>
      )}

      {/* Floating AI Assistant Trigger */}
      <button
        onClick={() => setShowChatModal(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white shadow-xl shadow-[#2563EB]/30 transition-all hover:scale-105 flex items-center gap-2 group"
        title="Open Plyace AI Career Assistant"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline font-bold text-xs pr-1">Placement Assistant</span>
      </button>

      {/* Floating Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 bg-[#1E3A8A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#60A5FA]" />
                <h3 className="font-bold text-sm">CGPU Placement Assistant</h3>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-white/80 hover:text-white text-xs font-bold px-2 py-1 rounded-lg hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <ChatBotView />
            </div>
          </div>
        </div>
      )}

      {/* Admin Simulate Modal */}
      {showSimulateModal && (
        <AdminSimulateModal onClose={() => setShowSimulateModal(false)} />
      )}
    </div>
  );
}
