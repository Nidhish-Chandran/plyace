import { describe, it } from "node:test";
import assert from "node:assert";
import {
  getUserByEmail,
  createUser,
  createSession,
  getSession,
  deleteSession,
  getAllJobs,
  createJob,
  getApplications,
  createApplication,
  getAllAnnouncements,
} from "../lib/db";

describe("Plyace SQLite Database Operations", () => {
  it("should have seeded institutional users", () => {
    const student = getUserByEmail("aditi.rao@college.edu");
    assert.ok(student, "Student user should exist");
    assert.strictEqual(student?.role, "student");
    assert.strictEqual(student?.rollNumber, "23CS014");

    const admin = getUserByEmail("placement.head@college.edu");
    assert.ok(admin, "Admin user should exist");
    assert.strictEqual(admin?.role, "admin");
  });

  it("should create a new student and retrieve by email", () => {
    const uniqueEmail = `test.student.${Date.now()}@college.edu`;
    const created = createUser({
      name: "Rohan Patel",
      rollNumber: "23IT055",
      email: uniqueEmail,
      password: "securepass123",
      branch: "Information Technology",
      batch: "2023-2027",
      graduationDate: "2027-06-30",
      cgpa: 8.75,
      backlogs: 0,
      skills: ["Python", "Django", "PostgreSQL"],
    });

    assert.ok(created.id, "User ID should be generated");
    assert.strictEqual(created.email, uniqueEmail);
    assert.strictEqual(created.rollNumber, "23IT055");

    const fetched = getUserByEmail(uniqueEmail);
    assert.ok(fetched);
    assert.strictEqual(fetched?.name, "Rohan Patel");
    assert.strictEqual(fetched?.cgpa, 8.75);
    assert.strictEqual(fetched?.backlogs, 0);
  });

  it("should handle session creation, retrieval, and expiration", () => {
    const student = getUserByEmail("aditi.rao@college.edu");
    assert.ok(student);

    const sessionId = createSession(student.id, 7);
    assert.ok(sessionId.startsWith("sess_"));

    const sessionUser = getSession(sessionId);
    assert.ok(sessionUser, "Session should resolve to user");
    assert.strictEqual(sessionUser?.id, student.id);

    deleteSession(sessionId);
    const expiredSessionUser = getSession(sessionId);
    assert.strictEqual(expiredSessionUser, null, "Deleted session should return null");
  });

  it("should fetch all placement drives from SQLite", () => {
    const jobs = getAllJobs();
    assert.ok(Array.isArray(jobs));
    assert.ok(jobs.length >= 4, "Should have seeded jobs");
    const google = jobs.find((j) => j.company === "Google");
    assert.ok(google, "Google job drive should exist");
    assert.strictEqual(google?.minCgpa, 8.5);
  });

  it("should create and query applications", () => {
    const student = getUserByEmail("aditi.rao@college.edu");
    assert.ok(student);

    const newApp = createApplication({
      jobId: "job_1",
      studentId: student.id,
      studentName: student.name,
      studentBranch: student.branch,
      studentCgpa: student.cgpa,
      matchScore: 92,
      company: "Microsoft",
      jobTitle: "Software Engineer",
    });

    assert.ok(newApp.id);
    assert.strictEqual(newApp.status, "Applied");

    const myApps = getApplications(student.id);
    const found = myApps.find((a) => a.id === newApp.id);
    assert.ok(found, "Application should be persisted in database");
    assert.strictEqual(found?.company, "Microsoft");
  });

  it("should fetch announcements", () => {
    const announcements = getAllAnnouncements();
    assert.ok(announcements.length >= 2);
  });
});
