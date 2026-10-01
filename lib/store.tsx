"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  Job,
  Application,
  Announcement,
  ResumeAnalysis,
  SkillTest,
  TestAttempt,
  ViolationLog,
  Referral,
  ReferralRequest,
  MockSlot,
  MockBooking,
  ApplicationStatus,
  Status,
} from "./types";
import {
  DEMO_USERS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TESTS,
  INITIAL_REFERRALS,
  INITIAL_MOCK_SLOTS,
} from "./mock-data";
import { getStatus, isExpiringSoon } from "./status";
import { calculateSkillMatch } from "./match";

interface PlyaceContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  setCurrentUser: (user: UserProfile) => void;
  switchUserById: (userId: string) => void;
  simulatedDate: string; // ISO date string (YYYY-MM-DD)
  setSimulatedDate: (date: string) => void;
  currentStatus: Status;
  isPassoutExpiringSoon: { warning: boolean; daysLeft: number };
  
  // Auth & Session
  isLoggedIn: boolean;
  authChecked: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: {
    name: string;
    rollNumber?: string;
    email: string;
    password?: string;
    branch: string;
    batch: string;
    graduationDate: string;
    cgpa: number;
    backlogs: number;
    skills: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  // Jobs
  jobs: Job[];
  addJob: (job: Omit<Job, "id" | "postedDate">) => Promise<void>;
  
  // Applications
  applications: Application[];
  applyToJob: (jobId: string, notes?: string) => Promise<{ success: boolean; message: string }>;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
  
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (title: string, body: string, tag: Announcement["tag"]) => Promise<void>;
  
  // Resume Analyses
  resumeAnalyses: ResumeAnalysis[];
  analyzeResume: (
    resumeText: string,
    targetJobId?: string
  ) => Promise<ResumeAnalysis>;
  
  // Tests & Violations
  tests: SkillTest[];
  testAttempts: TestAttempt[];
  violationLogs: ViolationLog[];
  logViolation: (
    attemptId: string,
    testTitle: string,
    type: ViolationLog["type"],
    description: string
  ) => void;
  submitTestAttempt: (
    testId: string,
    answers: Record<string, number>,
    violationsCount: number,
    autoSubmitted: boolean
  ) => { score: number; totalPossible: number };
  
  // Referrals
  referrals: Referral[];
  referralRequests: ReferralRequest[];
  requestReferral: (referralId: string) => { success: boolean; message: string };
  
  // Mock Slots
  mockSlots: MockSlot[];
  mockBookings: MockBooking[];
  bookMockSlot: (slotId: string) => { success: boolean; message: string };
  
  // Admin student lifecycle controls
  extendStudentAccess: (studentId: string, newOverrideDate: string) => void;
  updateStudentGraduation: (studentId: string, newGradDate: string) => void;
  
  // Reset demo
  resetToDefaults: () => void;
}

const PlyaceContext = createContext<PlyaceContextType | undefined>(undefined);

export function PlyaceProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [allUsers, setAllUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [currentUser, setCurrentUserState] = useState<UserProfile>(DEMO_USERS[0]);
  const [simulatedDate, setSimulatedDateState] = useState<string>("2026-10-01");
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [resumeAnalyses, setResumeAnalyses] = useState<ResumeAnalysis[]>([]);
  const [tests] = useState<SkillTest[]>(INITIAL_TESTS);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [violationLogs, setViolationLogs] = useState<ViolationLog[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [referralRequests, setReferralRequests] = useState<ReferralRequest[]>([]);
  const [mockSlots, setMockSlots] = useState<MockSlot[]>(INITIAL_MOCK_SLOTS);
  const [mockBookings, setMockBookings] = useState<MockBooking[]>([]);

  // Load from localStorage and SQLite backend on mount
  useEffect(() => {
    setIsClient(true);

    async function initSessionAndData() {
      try {
        // 1. Check server-side session cookie via /api/auth/session
        const sessRes = await fetch("/api/auth/session");
        if (sessRes.ok) {
          const sessData = await sessRes.json();
          if (sessData.authenticated && sessData.user) {
            setCurrentUserState(sessData.user);
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.error("Session verification fetch failed:", err);
      } finally {
        setAuthChecked(true);
      }

      // 2. Fetch jobs from SQLite database
      try {
        const jobsRes = await fetch("/api/jobs");
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          if (jobsData.success && jobsData.jobs && jobsData.jobs.length > 0) {
            setJobs(jobsData.jobs);
          }
        }
      } catch (err) {
        // Fallback to local
      }

      // 3. Fetch announcements from SQLite database
      try {
        const ancRes = await fetch("/api/announcements");
        if (ancRes.ok) {
          const ancData = await ancRes.json();
          if (ancData.success && ancData.announcements && ancData.announcements.length > 0) {
            setAnnouncements(ancData.announcements);
          }
        }
      } catch (err) {
        // Fallback to local
      }

      // 4. Fallbacks from localStorage if any
      try {
        const savedSimDate = localStorage.getItem("plyace_simulated_date");
        const savedApps = localStorage.getItem("plyace_apps");
        const savedLogs = localStorage.getItem("plyace_violation_logs");

        if (savedSimDate) setSimulatedDateState(savedSimDate);
        if (savedApps) setApplications(JSON.parse(savedApps));
        if (savedLogs) setViolationLogs(JSON.parse(savedLogs));
      } catch {
        // ignore
      }
    }

    initSessionAndData();
  }, []);

  // Save changes to localStorage for quick restore
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("plyace_user_id", currentUser.id);
      localStorage.setItem("plyace_simulated_date", simulatedDate);
      localStorage.setItem("plyace_apps", JSON.stringify(applications));
      localStorage.setItem("plyace_jobs", JSON.stringify(jobs));
      localStorage.setItem("plyace_users", JSON.stringify(allUsers));
      localStorage.setItem("plyace_violation_logs", JSON.stringify(violationLogs));
    } catch {
      // ignore
    }
  }, [currentUser, simulatedDate, applications, jobs, allUsers, violationLogs, isClient]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentUserState(data.user);
        setIsLoggedIn(true);
        // Also ensure user is in allUsers
        setAllUsers((prev) => {
          const exists = prev.some((u) => u.id === data.user.id);
          return exists ? prev.map((u) => (u.id === data.user.id ? data.user : u)) : [data.user, ...prev];
        });
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch (err: any) {
      return { success: false, error: "Network error during login" };
    }
  };

  const register = async (userData: {
    name: string;
    rollNumber?: string;
    email: string;
    password?: string;
    branch: string;
    batch: string;
    graduationDate: string;
    cgpa: number;
    backlogs: number;
    skills: string[];
  }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentUserState(data.user);
        setIsLoggedIn(true);
        setAllUsers((prev) => [data.user, ...prev]);
        return { success: true };
      }
      return { success: false, error: data.error || "Registration failed" };
    } catch (err: any) {
      return { success: false, error: "Network error during registration" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setIsLoggedIn(false);
  };

  const setSimulatedDate = (date: string) => {
    setSimulatedDateState(date);
  };

  const switchUserById = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUserState(user);
    }
  };

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);
    setAllUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
  };

  // Compute status on the fly based on current user's graduation date, simulated date, and override
  const currentDateObj = new Date(simulatedDate);
  const currentStatus: Status = getStatus(
    currentUser.graduationDate,
    currentDateObj,
    currentUser.accessOverrideUntil
  );

  const isPassoutExpiringSoon = isExpiringSoon(
    currentUser.graduationDate,
    currentDateObj,
    currentUser.accessOverrideUntil
  );

  const addJob = async (newJobData: Omit<Job, "id" | "postedDate">) => {
    const newJob: Job = {
      ...newJobData,
      id: `job_${Date.now()}`,
      postedDate: simulatedDate,
    };
    setJobs((prev) => [newJob, ...prev]);

    // Persist to backend database
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJobData),
      });
    } catch (err) {
      console.error("Failed to persist job to backend:", err);
    }
  };

  const applyToJob = async (jobId: string, notes?: string) => {
    const existing = applications.find(
      (a) => a.jobId === jobId && a.studentId === currentUser.id
    );
    if (existing) {
      return { success: false, message: "You have already applied for this position." };
    }

    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      return { success: false, message: "Job not found." };
    }

    const match = calculateSkillMatch(currentUser.skills, job.requiredSkills);

    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentBranch: currentUser.branch,
      studentCgpa: currentUser.cgpa,
      status: "Applied",
      matchScore: match.matchPercentage,
      appliedAt: new Date(simulatedDate).toISOString(),
      company: job.company,
      jobTitle: job.title,
      notes: notes || "Submitted through Plyace placement portal.",
    };

    setApplications((prev) => [newApp, ...prev]);

    // Persist application to backend SQLite database
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          company: job.company,
          jobTitle: job.title,
          matchScore: match.matchPercentage,
        }),
      });
    } catch (err) {
      console.error("Failed to save application to SQLite:", err);
    }

    // Award +5 gamification points
    const updatedUser = { ...currentUser, points: currentUser.points + 5 };
    setCurrentUser(updatedUser);

    return { success: true, message: "Application submitted successfully! (+5 points earned)" };
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status } : app))
    );
  };

  const addAnnouncement = async (title: string, body: string, tag: Announcement["tag"]) => {
    const newAnc: Announcement = {
      id: `anc_${Date.now()}`,
      title,
      body,
      createdAt: new Date(simulatedDate).toISOString(),
      tag,
      author: currentUser.name || "CGPU Placement Cell",
    };
    setAnnouncements((prev) => [newAnc, ...prev]);

    // Persist announcement to backend
    try {
      await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, tag }),
      });
    } catch (err) {
      console.error("Failed to save announcement to SQLite:", err);
    }
  };

  const analyzeResume = async (
    resumeText: string,
    targetJobId?: string
  ): Promise<ResumeAnalysis> => {
    const targetJob = jobs.find((j) => j.id === targetJobId);
    const keywordsToFind = targetJob
      ? targetJob.requiredSkills
      : [
          "Python",
          "React",
          "SQL",
          "TypeScript",
          "Data Structures",
          "Algorithms",
          "Docker",
          "Git",
          "REST APIs",
          "Machine Learning",
          "Node.js",
          "AWS",
        ];

    const lowerResume = resumeText.toLowerCase();
    const matched: string[] = [];
    const missing: string[] = [];

    keywordsToFind.forEach((kw) => {
      if (lowerResume.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const matchRatio = keywordsToFind.length > 0 ? matched.length / keywordsToFind.length : 0.6;
    let baseScore = Math.round(matchRatio * 75);

    if (resumeText.length > 300) baseScore += 10;
    if (/gpa|cgpa|percentage/i.test(resumeText)) baseScore += 5;
    if (/project|experience|internship/i.test(resumeText)) baseScore += 10;

    baseScore = Math.min(96, Math.max(35, baseScore));

    const strengths: string[] = [];
    const suggestions: string[] = [];

    if (matched.length > 0) {
      strengths.push(`Found key technical competencies: ${matched.slice(0, 4).join(", ")}`);
    }
    if (resumeText.length > 400) {
      strengths.push("Good descriptive depth for academic and extracurricular projects.");
    }

    if (missing.length > 0) {
      suggestions.push(`Incorporate high-frequency target skills: ${missing.slice(0, 3).join(", ")}.`);
    }
    suggestions.push("Quantify impact with metrics (e.g., 'Optimized response latency by 35%').");
    suggestions.push("Ensure your LinkedIn and GitHub repository URLs are hyperlinked in the header.");

    const analysis: ResumeAnalysis = {
      id: `res_${Date.now()}`,
      studentId: currentUser.id,
      jobId: targetJobId,
      jobTitle: targetJob?.title || "General Software Engineering",
      company: targetJob?.company || "Target Tech Recruiters",
      atsScore: baseScore,
      matchedKeywords: matched,
      missingKeywords: missing,
      strengths,
      suggestions,
      analyzedAt: new Date(simulatedDate).toISOString(),
    };

    setResumeAnalyses((prev) => [analysis, ...prev]);

    // Award +10 gamification points
    const updatedUser = { ...currentUser, points: currentUser.points + 10 };
    setCurrentUser(updatedUser);

    return analysis;
  };

  const logViolation = (
    attemptId: string,
    testTitle: string,
    type: ViolationLog["type"],
    description: string
  ) => {
    const newLog: ViolationLog = {
      id: `viol_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      attemptId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      testTitle,
      type,
      description,
      timestamp: new Date().toLocaleTimeString(),
    };
    setViolationLogs((prev) => [newLog, ...prev]);
  };

  const submitTestAttempt = (
    testId: string,
    answers: Record<string, number>,
    violationsCount: number,
    autoSubmitted: boolean
  ) => {
    const test = tests.find((t) => t.id === testId);
    if (!test) return { score: 0, totalPossible: 0 };

    let score = 0;
    const pointsPerQuestion = test.totalMarks / test.questions.length;

    test.questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) {
        score += pointsPerQuestion;
      }
    });

    const finalScore = Math.round(score);

    const attempt: TestAttempt = {
      id: `att_${Date.now()}`,
      testId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      startedAt: new Date().toISOString(),
      endsAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      score: finalScore,
      totalPossible: test.totalMarks,
      violationsCount,
      autoSubmitted,
      answers,
    };

    setTestAttempts((prev) => [attempt, ...prev]);

    // Award points equal to test score
    const updatedUser = { ...currentUser, points: currentUser.points + finalScore };
    setCurrentUser(updatedUser);

    return { score: finalScore, totalPossible: test.totalMarks };
  };

  const requestReferral = (referralId: string) => {
    const ref = referrals.find((r) => r.id === referralId);
    if (!ref) return { success: false, message: "Referral not found." };

    const existing = referralRequests.find(
      (r) => r.referralId === referralId && r.studentId === currentUser.id
    );
    if (existing) {
      return { success: false, message: "Referral request already pending." };
    }

    const req: ReferralRequest = {
      id: `req_${Date.now()}`,
      referralId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      status: "Pending",
      createdAt: new Date(simulatedDate).toISOString(),
    };

    setReferralRequests((prev) => [req, ...prev]);
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === referralId ? { ...r, requestsCount: r.requestsCount + 1 } : r
      )
    );

    return {
      success: true,
      message: `Referral request sent to ${ref.alumniName} (${ref.company})!`,
    };
  };

  const bookMockSlot = (slotId: string) => {
    const slot = mockSlots.find((s) => s.id === slotId);
    if (!slot) return { success: false, message: "Slot not found." };

    const existing = mockBookings.find(
      (b) => b.slotId === slotId && b.studentId === currentUser.id
    );
    if (existing) {
      return { success: false, message: "You have already reserved this slot." };
    }

    if (slot.bookedCount >= slot.capacity) {
      return { success: false, message: "This session has reached maximum capacity." };
    }

    const booking: MockBooking = {
      id: `book_${Date.now()}`,
      slotId,
      studentId: currentUser.id,
      bookedAt: new Date(simulatedDate).toISOString(),
    };

    setMockBookings((prev) => [booking, ...prev]);
    setMockSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, bookedCount: s.bookedCount + 1 } : s
      )
    );

    return {
      success: true,
      message: `Reserved seat with ${slot.hostName}! Details sent to your student portal.`,
    };
  };

  const extendStudentAccess = (studentId: string, newOverrideDate: string) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === studentId ? { ...u, accessOverrideUntil: newOverrideDate } : u
      )
    );
    if (currentUser.id === studentId) {
      setCurrentUser({ ...currentUser, accessOverrideUntil: newOverrideDate });
    }
  };

  const updateStudentGraduation = (studentId: string, newGradDate: string) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === studentId ? { ...u, graduationDate: newGradDate } : u
      )
    );
    if (currentUser.id === studentId) {
      setCurrentUser({ ...currentUser, graduationDate: newGradDate });
    }
  };

  const resetToDefaults = () => {
    setAllUsers(DEMO_USERS);
    setCurrentUserState(DEMO_USERS[0]);
    setIsLoggedIn(false);
    setSimulatedDateState("2026-10-01");
    setJobs(INITIAL_JOBS);
    setApplications(INITIAL_APPLICATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setViolationLogs([]);
    setTestAttempts([]);
    setResumeAnalyses([]);
    setReferrals(INITIAL_REFERRALS);
    setMockSlots(INITIAL_MOCK_SLOTS);
    setMockBookings([]);
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  };

  return (
    <PlyaceContext.Provider
      value={{
        currentUser,
        allUsers,
        setCurrentUser,
        switchUserById,
        simulatedDate,
        setSimulatedDate,
        currentStatus,
        isPassoutExpiringSoon,
        isLoggedIn,
        authChecked,
        login,
        register,
        logout,
        jobs,
        addJob,
        applications,
        applyToJob,
        updateApplicationStatus,
        announcements,
        addAnnouncement,
        resumeAnalyses,
        analyzeResume,
        tests,
        testAttempts,
        violationLogs,
        logViolation,
        submitTestAttempt,
        referrals,
        referralRequests,
        requestReferral,
        mockSlots,
        mockBookings,
        bookMockSlot,
        extendStudentAccess,
        updateStudentGraduation,
        resetToDefaults,
      }}
    >
      {children}
    </PlyaceContext.Provider>
  );
}

export function usePlyace() {
  const context = useContext(PlyaceContext);
  if (!context) {
    throw new Error("usePlyace must be used within a PlyaceProvider");
  }
  return context;
}
