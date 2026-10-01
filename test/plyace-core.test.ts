import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getStatus, isExpiringSoon } from "../lib/status";
import { checkEligibility } from "../lib/eligibility";
import { calculateSkillMatch } from "../lib/match";
import type { Job, UserProfile } from "../lib/types";

describe("Plyace Core Business Logic Tests", () => {
  describe("1. Account Lifecycle & Status Calculation (lib/status.ts)", () => {
    const today = new Date("2026-10-01T00:00:00Z");

    test("Future graduation date should be 'current'", () => {
      const status = getStatus("2027-06-30", today);
      assert.equal(status, "current");
    });

    test("Graduated within 18 months should be 'passout'", () => {
      // 15 months ago
      const status = getStatus("2025-06-30", today);
      assert.equal(status, "passout");
    });

    test("Graduated > 18 months ago should be 'expired'", () => {
      // Graduated May 2024 (28 months ago)
      const status = getStatus("2024-05-15", today);
      assert.equal(status, "expired");
    });

    test("Admin access override should extend passout access even if > 18 months", () => {
      const status = getStatus("2024-05-15", today, "2027-12-31");
      assert.equal(status, "passout");
    });

    test("60-day expiry warning flag should be triggered when within 60 days of 18m window", () => {
      // 17 months ago (around 30 days left)
      const gradDate = "2025-05-01";
      const warning = isExpiringSoon(gradDate, today);
      assert.equal(warning.warning, true);
      assert.ok(warning.daysLeft > 0 && warning.daysLeft <= 60);
    });
  });

  describe("2. Real-Time Eligibility Engine (lib/eligibility.ts)", () => {
    const baseStudent: UserProfile = {
      id: "std_1",
      name: "Aditi Rao",
      email: "aditi@college.edu",
      role: "student",
      branch: "Computer Science & Engineering",
      batch: "2023-2027",
      graduationDate: "2027-06-30",
      cgpa: 8.4,
      backlogs: 0,
      skills: ["React", "TypeScript", "Python"],
      points: 40,
    };

    const baseJob: Job = {
      id: "job_test",
      company: "Tech Corp",
      title: "Software Engineer",
      description: "Sample",
      requiredSkills: ["React", "TypeScript", "SQL"],
      minCgpa: 8.0,
      allowedBranches: ["Computer Science & Engineering"],
      maxBacklogs: 0,
      deadline: "2026-11-01T00:00:00Z",
      oppType: "full-time",
      packageStipend: "15 LPA",
      location: "Bangalore",
      postedDate: "2026-10-01",
    };

    test("Eligible student meeting all criteria should pass", () => {
      const result = checkEligibility(baseJob, baseStudent, new Date("2026-10-01"));
      assert.equal(result.eligible, true);
      assert.equal(result.reasons.length, 0);
    });

    test("CGPA below cutoff should fail with exact reason", () => {
      const highCutoffJob = { ...baseJob, minCgpa: 8.5 };
      const result = checkEligibility(highCutoffJob, baseStudent, new Date("2026-10-01"));
      assert.equal(result.eligible, false);
      assert.ok(result.reasons.some((r) => r.includes("Requires minimum CGPA of 8.5")));
    });

    test("Active backlogs above max backlogs should fail with exact reason", () => {
      const studentWithBacklogs = { ...baseStudent, backlogs: 2 };
      const result = checkEligibility(baseJob, studentWithBacklogs, new Date("2026-10-01"));
      assert.equal(result.eligible, false);
      assert.ok(result.reasons.some((r) => r.includes("No active backlogs permitted")));
    });

    test("Branch mismatch should fail with branch restriction reason", () => {
      const eceStudent = { ...baseStudent, branch: "Mechanical Engineering" };
      const result = checkEligibility(baseJob, eceStudent, new Date("2026-10-01"));
      assert.equal(result.eligible, false);
      assert.ok(result.reasons.some((r) => r.includes("Open to Computer Science & Engineering only")));
    });

    test("Passout student applying to campus-only drive should fail with passout restriction", () => {
      const passoutStudent: UserProfile = {
        ...baseStudent,
        graduationDate: "2025-06-30", // passout
      };
      const campusOnlyJob: Job = { ...baseJob, campusOnly: true };
      const result = checkEligibility(campusOnlyJob, passoutStudent, new Date("2026-10-01"));
      assert.equal(result.eligible, false);
      assert.ok(result.reasons.some((r) => r.includes("Exclusive on-campus drive")));
    });

    test("Passout student applying to off-campus drive should be eligible", () => {
      const passoutStudent: UserProfile = {
        ...baseStudent,
        graduationDate: "2025-06-30", // passout
      };
      const offCampusJob: Job = { ...baseJob, campusOnly: false, oppType: "off-campus" };
      const result = checkEligibility(offCampusJob, passoutStudent, new Date("2026-10-01"));
      assert.equal(result.eligible, true);
    });
  });

  describe("3. Skill Matching & Gap Analysis (lib/match.ts)", () => {
    test("Calculates correct match percentage and missing skills", () => {
      const studentSkills = ["Python", "SQL", "Git"];
      const jobSkills = ["Python", "SQL", "Docker", "AWS"];

      const match = calculateSkillMatch(studentSkills, jobSkills);
      assert.equal(match.matchPercentage, 50); // 2 of 4 = 50%
      assert.deepEqual(match.matchedSkills, ["Python", "SQL"]);
      assert.deepEqual(match.missingSkills, ["Docker", "AWS"]);
      assert.equal(match.progressColorHex, "#F59E0B"); // Amber 50-79%
    });

    test("High match (>=80%) gets emerald color", () => {
      const studentSkills = ["React", "TypeScript", "Tailwind CSS", "HTML5", "Git"];
      const jobSkills = ["React", "TypeScript", "Tailwind CSS", "HTML5"];

      const match = calculateSkillMatch(studentSkills, jobSkills);
      assert.equal(match.matchPercentage, 100);
      assert.equal(match.progressColorHex, "#10B981"); // Emerald
    });

    test("Low match (<50%) gets blue color", () => {
      const studentSkills = ["Python"];
      const jobSkills = ["C++", "Java", "Go", "Rust"];

      const match = calculateSkillMatch(studentSkills, jobSkills);
      assert.equal(match.matchPercentage, 0);
      assert.equal(match.progressColorHex, "#2563EB"); // Blue
    });
  });
});
