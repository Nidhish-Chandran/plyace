import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { UserProfile, Job, Application, Announcement, SkillTest, TestAttempt, ViolationLog } from "./types";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "plyace.sqlite");
const db = new Database(dbPath);

// Enable WAL mode for high performance and concurrency
db.pragma("journal_mode = WAL");

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    roll_number TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT 'password123',
    role TEXT NOT NULL CHECK(role IN ('student', 'admin')),
    branch TEXT NOT NULL,
    batch TEXT NOT NULL,
    graduation_date TEXT NOT NULL,
    access_override_until TEXT,
    cgpa REAL DEFAULT 0.0,
    backlogs INTEGER DEFAULT 0,
    skills TEXT DEFAULT '[]',
    points INTEGER DEFAULT 0,
    avatar TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    company_logo TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT NOT NULL,
    min_cgpa REAL NOT NULL DEFAULT 0.0,
    allowed_branches TEXT NOT NULL,
    max_backlogs INTEGER NOT NULL DEFAULT 0,
    deadline TEXT NOT NULL,
    opp_type TEXT NOT NULL,
    package_stipend TEXT NOT NULL,
    location TEXT NOT NULL,
    campus_only INTEGER NOT NULL DEFAULT 0,
    registration_link TEXT,
    posted_date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_branch TEXT,
    student_cgpa REAL,
    status TEXT NOT NULL CHECK(status IN ('Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected')),
    match_score INTEGER NOT NULL DEFAULT 0,
    applied_at TEXT NOT NULL,
    company TEXT NOT NULL,
    job_title TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    tag TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    duration_min INTEGER NOT NULL,
    description TEXT NOT NULL,
    total_marks INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    text TEXT NOT NULL,
    options TEXT NOT NULL,
    correct_index INTEGER NOT NULL,
    FOREIGN KEY (test_id) REFERENCES tests(id)
  );

  CREATE TABLE IF NOT EXISTS test_attempts (
    id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    started_at TEXT NOT NULL,
    ends_at TEXT NOT NULL,
    submitted_at TEXT,
    score INTEGER,
    total_possible INTEGER NOT NULL,
    violations_count INTEGER DEFAULT 0,
    auto_submitted INTEGER DEFAULT 0,
    answers TEXT,
    FOREIGN KEY (test_id) REFERENCES tests(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS violation_logs (
    id TEXT PRIMARY KEY,
    attempt_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    test_title TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    alumni_name TEXT NOT NULL,
    batch TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    slots INTEGER NOT NULL,
    location TEXT NOT NULL,
    skills_needed TEXT NOT NULL,
    requests_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS mock_slots (
    id TEXT PRIMARY KEY,
    host_name TEXT NOT NULL,
    host_role TEXT NOT NULL,
    host_company TEXT NOT NULL,
    type TEXT NOT NULL,
    topic TEXT NOT NULL,
    starts_at TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    booked_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Safe SQLite migration for registration_link column
try {
  db.exec("ALTER TABLE jobs ADD COLUMN registration_link TEXT");
} catch {
  // column already exists
}

// Seed default institutional users if empty
const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, roll_number, email, password, role, branch, batch, graduation_date, access_override_until, cgpa, backlogs, skills, points, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    "usr_student_1",
    "Aditi Rao",
    "23CS014",
    "aditi.rao@college.edu",
    "student123",
    "student",
    "Computer Science & Engineering",
    "2023-2027",
    "2027-06-30",
    null,
    8.4,
    0,
    JSON.stringify(["React", "TypeScript", "Python", "SQL", "Git", "Data Structures", "Tailwind CSS"]),
    45,
    "2026-09-01T00:00:00Z"
  );

  insertUser.run(
    "usr_passout_1",
    "Rahul Verma",
    "21EC089",
    "rahul.verma@alumni.college.edu",
    "alumni123",
    "student",
    "Electronics & Communication",
    "2021-2025",
    "2025-06-30",
    null,
    7.4,
    0,
    JSON.stringify(["Java", "Spring Boot", "SQL", "C++", "System Design", "AWS", "Docker"]),
    60,
    "2025-07-01T00:00:00Z"
  );

  insertUser.run(
    "usr_admin_1",
    "Dr. K. S. Nair",
    "CGPU-DIR-01",
    "placement.head@college.edu",
    "admin123",
    "admin",
    "Career Guidance & Placement Unit",
    "Faculty Placement Director",
    "2030-01-01",
    null,
    10.0,
    0,
    JSON.stringify(["Placement Administration", "Corporate Relations", "Student Welfare"]),
    999,
    "2024-01-01T00:00:00Z"
  );
}

// Seed jobs if empty
const jobCount = db.prepare("SELECT count(*) as count FROM jobs").get() as { count: number };
if (jobCount.count === 0) {
  const insertJob = db.prepare(`
    INSERT INTO jobs (id, company, title, description, required_skills, min_cgpa, allowed_branches, max_backlogs, deadline, opp_type, package_stipend, location, campus_only, posted_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertJob.run(
    "job_1",
    "Google",
    "Associate Software Engineer",
    "Core platform engineering team in Bangalore. Design, build, and deploy distributed systems impacting billions of users across Search, Cloud, and Android.",
    JSON.stringify(["Data Structures", "Algorithms", "C++", "Python", "System Design"]),
    8.5,
    JSON.stringify(["Computer Science & Engineering", "Information Technology", "Electronics & Communication"]),
    0,
    "2026-10-18T23:59:59Z",
    "full-time",
    "₹32.5 LPA",
    "Bangalore, India",
    1,
    "2026-09-28"
  );

  insertJob.run(
    "job_2",
    "Goldman Sachs",
    "Engineering Analyst",
    "Build financial engineering tools, algorithmic execution engines, and risk models with global financial scale and ultra low-latency compute infrastructure.",
    JSON.stringify(["Java", "Python", "SQL", "Data Structures", "Financial Markets", "Git"]),
    8.0,
    JSON.stringify(["Computer Science & Engineering", "Electronics & Communication", "Electrical Engineering"]),
    0,
    "2026-10-14T23:59:59Z",
    "full-time",
    "₹24.0 LPA",
    "Hyderabad, India",
    0,
    "2026-09-29"
  );

  insertJob.run(
    "job_3",
    "Cisco Systems",
    "Cloud & Network Software Intern",
    "Work on cloud networking, telemetry pipelines, and cybersecurity protocols. Fast-track conversion to full-time PPO based on summer performance.",
    JSON.stringify(["Python", "Networking", "Linux", "Docker", "Git", "REST APIs"]),
    7.5,
    JSON.stringify(["Computer Science & Engineering", "Electronics & Communication"]),
    0,
    "2026-10-08T23:59:59Z",
    "internship",
    "₹65,000 / month",
    "Bangalore (Hybrid)",
    1,
    "2026-09-25"
  );

  insertJob.run(
    "job_4",
    "Zoho Corporation",
    "Member Technical Staff",
    "Full stack product engineering across Chennai and Tenkasi development centers. Open to current batches and recent graduates.",
    JSON.stringify(["Java", "C++", "Data Structures", "SQL", "JavaScript"]),
    6.5,
    JSON.stringify(["All"]),
    2,
    "2026-10-30T23:59:59Z",
    "off-campus",
    "₹8.5 LPA",
    "Chennai / Tenkasi",
    0,
    "2026-09-27"
  );
}

// Seed announcements if empty
const ancCount = db.prepare("SELECT count(*) as count FROM announcements").get() as { count: number };
if (ancCount.count === 0) {
  const insertAnc = db.prepare(`
    INSERT INTO announcements (id, title, body, tag, author, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertAnc.run(
    "anc_1",
    "Cisco Systems Registration Closes Tomorrow 5:00 PM!",
    "All eligible CSE and ECE students must complete their registration and upload verified grade sheets. The aptitude assessment link will be distributed by CGPU at 7:00 PM.",
    "Urgent",
    "CGPU Office",
    "2026-10-01T09:00:00Z"
  );

  insertAnc.run(
    "anc_2",
    "Google Technical Screening Test Pattern & Guidelines",
    "The test will comprise 3 algorithmic questions. Students are advised to take the online practice assessment in ExamGuard before Friday.",
    "Drive",
    "Technical Training Cell",
    "2026-09-30T16:00:00Z"
  );
}

// Seed sample test if empty
const testCount = db.prepare("SELECT count(*) as count FROM tests").get() as { count: number };
if (testCount.count === 0) {
  db.prepare(`
    INSERT INTO tests (id, title, category, duration_min, description, total_marks)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    "test_1",
    "Core CS & Data Structures Assessment",
    "Technical",
    25,
    "Official institutional proctored assessment for upcoming software engineering drives.",
    30
  );

  const insertQ = db.prepare(`
    INSERT INTO questions (id, test_id, text, options, correct_index)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertQ.run(
    "q1",
    "test_1",
    "What is the average time complexity of searching in a Balanced Binary Search Tree (e.g., Red-Black Tree)?",
    JSON.stringify(["O(1)", "O(n)", "O(log n)", "O(n log n)"]),
    2
  );

  insertQ.run(
    "q2",
    "test_1",
    "Which data structure is primarily used to implement Breadth-First Search (BFS) in a graph?",
    JSON.stringify(["Stack", "Queue", "Priority Queue", "Linked List"]),
    1
  );

  insertQ.run(
    "q3",
    "test_1",
    "Which protocol operates at the Transport Layer of the OSI Model and guarantees reliable delivery?",
    JSON.stringify(["UDP", "IP", "TCP", "ICMP"]),
    2
  );
}

// -------------------------------------------------------------
// HELPER FUNCTIONS & DB OPERATIONS
// -------------------------------------------------------------

function rowToUser(row: any): UserProfile & { password?: string } {
  return {
    id: row.id,
    name: row.name,
    rollNumber: row.roll_number || undefined,
    email: row.email,
    password: row.password,
    role: row.role,
    branch: row.branch,
    batch: row.batch,
    graduationDate: row.graduation_date,
    accessOverrideUntil: row.access_override_until || null,
    cgpa: row.cgpa,
    backlogs: row.backlogs,
    skills: JSON.parse(row.skills || "[]"),
    points: row.points,
    avatar: row.avatar || undefined,
  };
}

export function getUserByEmail(email: string): (UserProfile & { password?: string }) | null {
  const row = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").get(email.trim());
  return row ? rowToUser(row) : null;
}

export function getUserById(id: string): (UserProfile & { password?: string }) | null {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return row ? rowToUser(row) : null;
}

export function getAllUsers(): UserProfile[] {
  const rows = db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
  return rows.map((r) => {
    const user = rowToUser(r);
    delete user.password;
    return user;
  });
}

export function createUser(userData: {
  name: string;
  rollNumber?: string;
  email: string;
  password?: string;
  role?: "student" | "admin";
  branch: string;
  batch: string;
  graduationDate: string;
  cgpa: number;
  backlogs: number;
  skills: string[];
}): UserProfile {
  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const password = userData.password || "password123";
  const role = userData.role || "student";
  const points = 25; // Joining bonus
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (id, name, roll_number, email, password, role, branch, batch, graduation_date, cgpa, backlogs, skills, points, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    userData.name.trim(),
    userData.rollNumber?.trim() || null,
    userData.email.trim().toLowerCase(),
    password,
    role,
    userData.branch,
    userData.batch,
    userData.graduationDate,
    userData.cgpa,
    userData.backlogs,
    JSON.stringify(userData.skills || []),
    points,
    createdAt
  );

  return {
    id,
    name: userData.name.trim(),
    rollNumber: userData.rollNumber?.trim(),
    email: userData.email.trim().toLowerCase(),
    role,
    branch: userData.branch,
    batch: userData.batch,
    graduationDate: userData.graduationDate,
    cgpa: userData.cgpa,
    backlogs: userData.backlogs,
    skills: userData.skills || [],
    points,
  };
}

export function updateUserOverride(userId: string, overrideDate: string | null): boolean {
  const info = db.prepare("UPDATE users SET access_override_until = ? WHERE id = ?").run(overrideDate, userId);
  return info.changes > 0;
}

// -------------------------------------------------------------
// SESSIONS
// -------------------------------------------------------------

export function createSession(userId: string, durationDays: number = 7): string {
  const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`
    INSERT INTO sessions (id, user_id, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(sessionId, userId, createdAt, expiresAt);

  return sessionId;
}

export function getSession(sessionId: string): UserProfile | null {
  const now = new Date().toISOString();
  const row = db.prepare(`
    SELECT u.* FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > ?
  `).get(sessionId, now);

  if (!row) return null;
  const user = rowToUser(row);
  delete user.password;
  return user;
}

export function deleteSession(sessionId: string): void {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}

// -------------------------------------------------------------
// JOBS
// -------------------------------------------------------------

function rowToJob(row: any): Job {
  return {
    id: row.id,
    company: row.company,
    companyLogo: row.company_logo || undefined,
    title: row.title,
    description: row.description,
    requiredSkills: JSON.parse(row.required_skills || "[]"),
    minCgpa: row.min_cgpa,
    allowedBranches: JSON.parse(row.allowed_branches || "[]"),
    maxBacklogs: row.max_backlogs,
    deadline: row.deadline,
    oppType: row.opp_type,
    packageStipend: row.package_stipend,
    location: row.location,
    campusOnly: Boolean(row.campus_only),
    registrationLink: row.registration_link || "https://forms.gle/cgpu-placement-drive",
    postedDate: row.posted_date,
  };
}

export function getAllJobs(): Job[] {
  const rows = db.prepare("SELECT * FROM jobs ORDER BY posted_date DESC").all();
  return rows.map(rowToJob);
}

export function getJobById(id: string): Job | null {
  const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(id);
  return row ? rowToJob(row) : null;
}

export function createJob(jobData: Omit<Job, "id" | "postedDate">): Job {
  const id = `job_${Date.now()}`;
  const postedDate = new Date().toISOString().split("T")[0];
  const registrationLink = jobData.registrationLink || "https://forms.gle/cgpu-placement-drive";

  db.prepare(`
    INSERT INTO jobs (id, company, company_logo, title, description, required_skills, min_cgpa, allowed_branches, max_backlogs, deadline, opp_type, package_stipend, location, campus_only, registration_link, posted_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    jobData.company,
    jobData.companyLogo || null,
    jobData.title,
    jobData.description,
    JSON.stringify(jobData.requiredSkills),
    jobData.minCgpa,
    JSON.stringify(jobData.allowedBranches),
    jobData.maxBacklogs,
    jobData.deadline,
    jobData.oppType,
    jobData.packageStipend,
    jobData.location,
    jobData.campusOnly ? 1 : 0,
    registrationLink,
    postedDate
  );

  return {
    ...jobData,
    registrationLink,
    id,
    postedDate,
  };
}

// -------------------------------------------------------------
// APPLICATIONS
// -------------------------------------------------------------

function rowToApplication(row: any): Application {
  return {
    id: row.id,
    jobId: row.job_id,
    studentId: row.student_id,
    studentName: row.student_name,
    studentBranch: row.student_branch || undefined,
    studentCgpa: row.student_cgpa || undefined,
    status: row.status,
    matchScore: row.match_score,
    appliedAt: row.applied_at,
    company: row.company,
    jobTitle: row.job_title,
    notes: row.notes || undefined,
  };
}

export function getApplications(studentId?: string): Application[] {
  if (studentId) {
    const rows = db.prepare("SELECT * FROM applications WHERE student_id = ? ORDER BY applied_at DESC").all(studentId);
    return rows.map(rowToApplication);
  }
  const rows = db.prepare("SELECT * FROM applications ORDER BY applied_at DESC").all();
  return rows.map(rowToApplication);
}

export function createApplication(app: {
  jobId: string;
  studentId: string;
  studentName: string;
  studentBranch?: string;
  studentCgpa?: number;
  matchScore: number;
  company: string;
  jobTitle: string;
}): Application {
  const id = `app_${Date.now()}`;
  const appliedAt = new Date().toISOString();
  const status = "Applied";

  db.prepare(`
    INSERT INTO applications (id, job_id, student_id, student_name, student_branch, student_cgpa, status, match_score, applied_at, company, job_title)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    app.jobId,
    app.studentId,
    app.studentName,
    app.studentBranch || null,
    app.studentCgpa || null,
    status,
    app.matchScore,
    appliedAt,
    app.company,
    app.jobTitle
  );

  return {
    id,
    jobId: app.jobId,
    studentId: app.studentId,
    studentName: app.studentName,
    studentBranch: app.studentBranch,
    studentCgpa: app.studentCgpa,
    status,
    matchScore: app.matchScore,
    appliedAt,
    company: app.company,
    jobTitle: app.jobTitle,
  };
}

export function updateApplicationStatus(id: string, status: Application["status"]): boolean {
  const info = db.prepare("UPDATE applications SET status = ? WHERE id = ?").run(status, id);
  return info.changes > 0;
}

// -------------------------------------------------------------
// ANNOUNCEMENTS
// -------------------------------------------------------------

function rowToAnnouncement(row: any): Announcement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    tag: row.tag,
    author: row.author,
    createdAt: row.created_at,
  };
}

export function getAllAnnouncements(): Announcement[] {
  const rows = db.prepare("SELECT * FROM announcements ORDER BY created_at DESC").all();
  return rows.map(rowToAnnouncement);
}

export function createAnnouncement(annc: Omit<Announcement, "id" | "createdAt">): Announcement {
  const id = `anc_${Date.now()}`;
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO announcements (id, title, body, tag, author, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, annc.title, annc.body, annc.tag, annc.author, createdAt);

  return {
    id,
    ...annc,
    createdAt,
  };
}

// -------------------------------------------------------------
// TESTS & PROCTORING
// -------------------------------------------------------------

export function getSkillTests(): SkillTest[] {
  const testRows = db.prepare("SELECT * FROM tests").all() as any[];
  return testRows.map((t) => {
    const qRows = db.prepare("SELECT * FROM questions WHERE test_id = ?").all(t.id) as any[];
    return {
      id: t.id,
      title: t.title,
      category: t.category,
      durationMin: t.duration_min,
      description: t.description,
      totalMarks: t.total_marks,
      questions: qRows.map((q) => ({
        id: q.id,
        text: q.text,
        options: JSON.parse(q.options || "[]"),
        correctIndex: q.correct_index,
      })),
    };
  });
}

export function logViolation(violation: Omit<ViolationLog, "id">): void {
  const id = `vlog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  db.prepare(`
    INSERT INTO violation_logs (id, attempt_id, student_id, student_name, test_title, type, description, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    violation.attemptId,
    violation.studentId,
    violation.studentName,
    violation.testTitle,
    violation.type,
    violation.description,
    violation.timestamp
  );
}

export function getViolations(): ViolationLog[] {
  const rows = db.prepare("SELECT * FROM violation_logs ORDER BY timestamp DESC").all() as any[];
  return rows.map((r) => ({
    id: r.id,
    attemptId: r.attempt_id,
    studentId: r.student_id,
    studentName: r.student_name,
    testTitle: r.test_title,
    type: r.type,
    description: r.description,
    timestamp: r.timestamp,
  }));
}

export default db;
