import { Job, UserProfile } from "./types";
import { getStatus } from "./status";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export function checkEligibility(
  job: Job,
  student: UserProfile,
  simulatedDate: Date = new Date()
): EligibilityResult {
  const reasons: string[] = [];
  const studentStatus = getStatus(student.graduationDate, simulatedDate, student.accessOverrideUntil);

  // 1. Status Check (Passout vs Campus-Only)
  if (studentStatus === "expired") {
    reasons.push("Account access period has expired (>18 months post-graduation).");
  } else if (studentStatus === "passout" && job.campusOnly) {
    reasons.push("Exclusive on-campus drive: strictly for currently enrolled students.");
  }

  // 2. CGPA Check
  if (student.cgpa < job.minCgpa) {
    reasons.push(`Requires minimum CGPA of ${job.minCgpa.toFixed(1)} (Your CGPA: ${student.cgpa.toFixed(1)}).`);
  }

  // 3. Backlogs Check
  if (student.backlogs > job.maxBacklogs) {
    if (job.maxBacklogs === 0) {
      reasons.push(`No active backlogs permitted (You have ${student.backlogs} backlog${student.backlogs > 1 ? "s" : ""}).`);
    } else {
      reasons.push(`Max ${job.maxBacklogs} backlog allowed (You have ${student.backlogs}).`);
    }
  }

  // 4. Branch Check
  if (job.allowedBranches.length > 0) {
    const isAllowedBranch = job.allowedBranches.some(
      (b) => b.toLowerCase() === "all" || b.toLowerCase() === student.branch.toLowerCase()
    );
    if (!isAllowedBranch) {
      reasons.push(`Open to ${job.allowedBranches.join(", ")} only (Your branch: ${student.branch}).`);
    }
  }

  // 5. Deadline Check
  const deadlineDate = new Date(job.deadline);
  if (deadlineDate < simulatedDate) {
    reasons.push(`Application deadline closed on ${deadlineDate.toLocaleDateString()}.`);
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}
