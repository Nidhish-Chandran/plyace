"use client";

import React, { useState } from "react";
import { PlyaceProvider, usePlyace } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Sidebar, ActiveTab } from "@/components/Sidebar";
import { ExpiryBanner } from "@/components/ExpiryBanner";
import { AccessEndedScreen } from "@/components/AccessEndedScreen";
import { StudentDashboard } from "@/components/StudentDashboard";
import { JobsFeedView } from "@/components/JobsFeedView";
import { ApplicationsView } from "@/components/ApplicationsView";
import { ResumeAnalyzerView } from "@/components/ResumeAnalyzerModal";
import { TestsView } from "@/components/TestsView";
import { LeaderboardView } from "@/components/LeaderboardView";
import { MentorshipView } from "@/components/MentorshipView";
import { ChatBotView } from "@/components/ChatBotModal";
import { AdminPortal } from "@/components/AdminPortal";
import { JobDetailModal } from "@/components/JobDetailModal";
import { AdminSimulateModal } from "@/components/AdminSimulateModal";
import { Job } from "@/lib/types";
import { Bot, Sparkles, MessageSquare } from "lucide-react";

function PlyaceApp() {
  const { currentUser, currentStatus, applications, applyToJob } = usePlyace();
  const isAdmin = currentUser.role === "admin";

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    isAdmin ? "admin_overview" : "dashboard"
  );
  const [selectedJobForModal, setSelectedJobForModal] = useState<Job | null>(null);
  const [showSimulateModal, setShowSimulateModal] = useState<boolean>(false);

  // Sync tab when switching between Admin and Student persona
  React.useEffect(() => {
    if (isAdmin && !activeTab.startsWith("admin_")) {
      setActiveTab("admin_overview");
    } else if (!isAdmin && activeTab.startsWith("admin_")) {
      setActiveTab("dashboard");
    }
  }, [isAdmin, activeTab]);

  const handleApplyToJob = (job: Job) => {
    setSelectedJobForModal(job);
  };

  const handleViewJobDetails = (job: Job) => {
    setSelectedJobForModal(job);
  };

  const isSelectedJobApplied = selectedJobForModal
    ? applications.some(
        (a) => a.jobId === selectedJobForModal.id && a.studentId === currentUser.id
      )
    : false;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navigation */}
      <Navbar onOpenSimulate={() => setShowSimulateModal(true)} />

      {/* 60-day expiry warning for passouts */}
      <ExpiryBanner />

      {/* If user is expired, show the blocked screen */}
      {currentStatus === "expired" ? (
        <AccessEndedScreen onOpenSimulate={() => setShowSimulateModal(true)} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <div className="hidden md:block">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* Mobile Tab Bar */}
            <div className="md:hidden flex overflow-x-auto gap-2 pb-3 mb-4 scrollbar-none">
              {(isAdmin
                ? [
                    { id: "admin_overview", label: "Overview" },
                    { id: "admin_jobs", label: "Drives" },
                    { id: "admin_applications", label: "Applicants" },
                    { id: "admin_announcements", label: "Notices" },
                    { id: "admin_violations", label: "Test Logs" },
                    { id: "admin_students", label: "Students" },
                  ]
                : [
                    { id: "dashboard", label: "Dashboard" },
                    { id: "jobs", label: "Jobs" },
                    { id: "applications", label: "Applications" },
                    { id: "resume", label: "ATS Resume" },
                    { id: "tests", label: "Tests" },
                    { id: "leaderboard", label: "Ranks" },
                    { id: "mentorship", label: "Mentors" },
                    { id: "chat", label: "AI Chat" },
                  ]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-[#2563EB] text-white"
                      : "bg-white text-slate-600 border border-[#E2E8F0]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Student Views */}
            {!isAdmin && activeTab === "dashboard" && (
              <StudentDashboard
                onNavigate={(t) => setActiveTab(t)}
                onSelectJob={handleViewJobDetails}
              />
            )}

            {!isAdmin && activeTab === "jobs" && (
              <JobsFeedView
                onApply={handleApplyToJob}
                onViewDetails={handleViewJobDetails}
              />
            )}

            {!isAdmin && activeTab === "applications" && (
              <ApplicationsView onSelectJob={(jobId) => {}} />
            )}

            {!isAdmin && activeTab === "resume" && <ResumeAnalyzerView />}

            {!isAdmin && activeTab === "tests" && <TestsView />}

            {!isAdmin && activeTab === "leaderboard" && <LeaderboardView />}

            {!isAdmin && activeTab === "mentorship" && <MentorshipView />}

            {!isAdmin && activeTab === "chat" && <ChatBotView />}

            {/* Admin Views */}
            {isAdmin && (
              <AdminPortal
                currentAdminTab={activeTab}
                onOpenSimulate={() => setShowSimulateModal(true)}
              />
            )}
          </main>
        </div>
      )}

      {/* Floating AI Assistant launcher (when not in chat tab) */}
      {!isAdmin && activeTab !== "chat" && currentStatus !== "expired" && (
        <button
          onClick={() => setActiveTab("chat")}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] text-white font-bold text-xs shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-white/20"
        >
          <Bot className="w-5 h-5 text-emerald-300" />
          <span>Ask Plyace AI</span>
        </button>
      )}

      {/* Job Details & Apply Modal */}
      <JobDetailModal
        job={selectedJobForModal}
        onClose={() => setSelectedJobForModal(null)}
        isApplied={isSelectedJobApplied}
      />

      {/* Admin / Demo Simulated Date Modal */}
      <AdminSimulateModal
        isOpen={showSimulateModal}
        onClose={() => setShowSimulateModal(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <PlyaceProvider>
      <PlyaceApp />
    </PlyaceProvider>
  );
}
