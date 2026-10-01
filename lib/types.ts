export type Role = "student" | "admin";
export type Status = "current" | "passout" | "expired";

export interface UserProfile {
  id: string;
  name: string;
  rollNumber?: string;
  email: string;
  role: Role;
  branch: string;
  batch: string;
  graduationDate: string; // ISO string YYYY-MM-DD
  accessOverrideUntil?: string | null;
  cgpa: number;
  backlogs: number;
  skills: string[];
  resumeUrl?: string;
  points: number;
  avatar?: string;
}

export type JobType = "internship" | "ppo" | "full-time" | "off-campus";

export interface Job {
  id: string;
  company: string;
  companyLogo?: string;
  title: string;
  description: string;
  requiredSkills: string[];
  minCgpa: number;
  allowedBranches: string[];
  maxBacklogs: number;
  deadline: string; // ISO date
  oppType: JobType;
  packageStipend: string;
  location: string;
  campusOnly?: boolean; // if true, passouts are ineligible
  registrationLink?: string; // Official link provided by the placement officer to register for the drive
  postedDate: string;
}

export type ApplicationStatus = "Applied" | "Shortlisted" | "Interview" | "Selected" | "Rejected";

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName?: string;
  studentBranch?: string;
  studentCgpa?: number;
  status: ApplicationStatus;
  matchScore: number;
  appliedAt: string;
  company: string;
  jobTitle: string;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  tag: "Urgent" | "Drive" | "Preparation" | "General";
  author: string;
}

export interface ResumeAnalysis {
  id: string;
  studentId: string;
  jobId?: string;
  jobTitle?: string;
  company?: string;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  suggestions: string[];
  analyzedAt: string;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface SkillTest {
  id: string;
  title: string;
  category: "Aptitude" | "Technical";
  durationMin: number;
  description: string;
  totalMarks: number;
  questions: TestQuestion[];
}

export interface ViolationLog {
  id: string;
  attemptId: string;
  studentId: string;
  studentName: string;
  testTitle: string;
  type: "fullscreen_exit" | "tab_switch" | "window_blur" | "copy_paste_attempt" | "right_click";
  description: string;
  timestamp: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  endsAt: string;
  submittedAt?: string;
  score?: number;
  totalPossible: number;
  violationsCount: number;
  autoSubmitted: boolean;
  answers: Record<string, number>; // questionId -> selectedOption
}

export interface Referral {
  id: string;
  alumniName: string;
  batch: string;
  company: string;
  role: string;
  slots: number;
  location: string;
  skillsNeeded: string[];
  requestsCount: number;
}

export interface ReferralRequest {
  id: string;
  referralId: string;
  studentId: string;
  studentName: string;
  status: "Pending" | "Referred" | "Declined";
  createdAt: string;
}

export interface MockSlot {
  id: string;
  hostName: string;
  hostRole: string;
  hostCompany: string;
  type: "Mock Interview" | "Group Discussion";
  topic: string;
  startsAt: string;
  capacity: number;
  bookedCount: number;
}

export interface MockBooking {
  id: string;
  slotId: string;
  studentId: string;
  bookedAt: string;
}
