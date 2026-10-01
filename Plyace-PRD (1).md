# Plyace: Product Requirements Document (PRD)

| | |
|---|---|
| **Product** | Plyace, a gamified placement platform |
| **Team** | H03 |
| **Version** | 1.0 (Hackathon MVP) |
| **Date** | 1 October 2026 |
| **Style** | Modern Career-Tech SaaS |
| **Build window** | About 3 hours |

---

## 1. Overview

**Plyace** bridges students and the Career Guidance and Placement Unit (CGPU). It puts every opportunity, announcement and application status in one place, tells each student exactly which jobs they are eligible for (and why not for the rest), scores their resume, and gives them a protected platform to practice and test their skills. Current students and passed-out students both get access, with passouts limited to an 18-month window after graduation.

### Brand meaning

The logo shows two people (blue and green) joined by a bridge, with a graduation cap above. The blue figure is the student, the green figure is the opportunity or placement cell, and the bridge between them is the product's purpose: closing the communication gap. The wordmark uses navy with a green accent on the "y".

---

## 2. Problem Statement

Students and the CGPU have a large communication gap. The main point of contact is the class representative, so when a rep forgets, an opportunity is lost. Students also struggle with:

- Registering and applying, and knowing which opportunity is best for them
- Understanding eligibility criteria and constraints
- Finding platforms to prepare, train and test
- Passed-out students who are still unemployed, with no continued support from the college

## 3. Vision and Goals

**Vision:** No eligible student, current or recently graduated, should miss an opportunity because information didn't reach them.

### Goals (MVP)

| # | Goal | Success signal |
|---|---|---|
| G1 | Single source of truth for all opportunities | Every job and announcement is visible on one feed |
| G2 | Clear eligibility for every student | Each job shows eligible or ineligible with a reason |
| G3 | Better shortlisting chances | Resume ATS score and suggestions available in under 30 seconds |
| G4 | Trustworthy skill testing | Tests run in secure mode with an audit log |
| G5 | Equal support for passouts | Passouts use the same features for 18 months |
| G6 | Engagement | Points and leaderboard drive repeat use |

### Non-goals (out of scope for MVP)

- Real email, SMS or push notifications
- Webcam or AI-based proctoring
- Student coordinator role and registration verification workflow
- Payments, video interviews, real-time chat, native mobile apps
- Analytics charts (stat cards only)

---

## 4. Users and Personas

| Persona | Description | Main needs |
|---|---|---|
| **Current student** | Enrolled, in final years | Know what to apply to, prepare, track applications |
| **Passout** | Graduated within the last 18 months, still looking | Equal access to openings, referrals and mock interviews |
| **Admin (placement cell)** | CGPU staff | Post jobs, communicate, update statuses, trust test results, export lists |
| **Expired passout** | More than 18 months after graduation | No access, shown a clear message |

---

## 5. Account Lifecycle

```
current ──(graduation_date)──▶ passout ──(+18 months)──▶ expired
                                  └── admin can extend via access_override_until
```

- Status is **calculated** from `graduation_date`, never stored by hand.
- It is checked on every page **and** every API route (server-side), not just in the UI.
- Expired users are redirected to an "Access period ended" page, and APIs return 403.
- No data is deleted on expiry.
- Passouts see a banner during their last 60 days of access.
- The admin can extend access for an individual and edit graduation dates.
- A **Simulate date** control in the admin panel makes this demoable.

---

## 6. Functional Requirements

Priority: **P0** = must build, **P1** = build if time allows, **P2** = static/seeded, **P3** = roadmap only.

### 6.1 Authentication and roles

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Users sign in with email and password (Supabase Auth) | P0 |
| FR-2 | Roles: Student and Admin. Passout and expired are computed from graduation date | P0 |
| FR-3 | Demo accounts for student, passout and admin | P0 |
| FR-4 | Middleware blocks expired users and returns 403 on API routes | P0 |

### 6.2 Jobs and eligibility

| ID | Requirement | Priority |
|---|---|---|
| FR-5 | Admin creates and edits jobs: company, title, description, required skills, min CGPA, allowed branches, max backlogs, deadline, type (internship, PPO, full-time, off-campus) | P0 |
| FR-6 | Student feed shows eligible jobs normally and ineligible jobs greyed out with the reason (for example, "Needs 7.5 CGPA, you have 7.2") | P0 |
| FR-7 | Match % per job (matched skills divided by required skills) and a list of missing skills | P0 |
| FR-8 | Filters and sort by type, deadline and match %; "Closing soon" badge | P0 |
| FR-9 | Campus-only drives are ineligible for passouts, and off-campus jobs are highlighted for them | P0 |

### 6.3 Applications

| ID | Requirement | Priority |
|---|---|---|
| FR-10 | One-click apply on eligible jobs, with duplicate protection | P0 |
| FR-11 | Application tracker with statuses: Applied, Shortlisted, Interview, Selected, Rejected | P0 |
| FR-12 | Admin updates the status of each application | P0 |
| FR-13 | Admin exports applicants or shortlisted students to CSV | P1 |

### 6.4 Communication

| ID | Requirement | Priority |
|---|---|---|
| FR-14 | Announcements board: the admin posts, and all students see one feed | P0 |
| FR-15 | Dashboard shows closing-soon jobs and the latest announcements | P0 |
| FR-16 | AI chatbot answers questions using only jobs, announcements and the student's profile; otherwise says "contact the placement cell" | P1 |

### 6.5 Resume analyzer

| ID | Requirement | Priority |
|---|---|---|
| FR-17 | Student uploads a PDF resume (stored in Supabase Storage) | P0 |
| FR-18 | System returns an ATS score, missing keywords and suggestions using one LLM call against a chosen job's required skills | P0 |
| FR-19 | Analyses are saved to history and award points | P1 |

### 6.6 Secure skill tests

| ID | Requirement | Priority |
|---|---|---|
| FR-20 | Test categories: Aptitude and Technical | P0 |
| FR-21 | Start request creates an attempt with a **server-side** end time; questions and options are shuffled; correct answers are **never** sent to the client | P0 |
| FR-22 | Fullscreen is required; exiting fullscreen, switching tabs, window blur, copy, paste and right-click are detected and logged | P0 |
| FR-23 | After 3 violations, or when time expires, the attempt is auto-submitted | P0 |
| FR-24 | Scoring happens on the server; one attempt per student per test | P0 |
| FR-25 | Admin violation log per attempt | P1 |

### 6.7 Gamification

| ID | Requirement | Priority |
|---|---|---|
| FR-26 | Points: +10 resume upload, +5 per application, plus quiz score | P1 |
| FR-27 | Leaderboard ranked by points | P1 |

### 6.8 Alumni and mentoring

| ID | Requirement | Priority |
|---|---|---|
| FR-28 | Alumni referral board with a "Request referral" action | P1 |
| FR-29 | Mock interview and GD slots: browse, book, with capacity check | P1 |

### 6.9 Static / seeded and roadmap

| ID | Requirement | Priority |
|---|---|---|
| FR-30 | Events and webinars list (seeded) | P2 |
| FR-31 | Placement stats summary page (seeded) | P2 |
| FR-32 | Student coordinator role with admin approval | P3 |
| FR-33 | Season registration with admin verification | P3 |
| FR-34 | Interview experience board | P3 |
| FR-35 | Webcam or AI proctoring | P3 |
| FR-36 | Real email, SMS and push notifications | P3 |
| FR-37 | Analytics charts and company pages | P3 |

---

## 7. User Stories

- As a **student**, I want to see only the jobs I'm eligible for, and why I'm not eligible for others, so I stop asking class reps.
- As a **student**, I want a match % and my missing skills, so I can pick the best job and know what to learn.
- As a **student**, I want to upload my resume and get an ATS score, so I improve my chances of being shortlisted.
- As a **student**, I want to take tests in a fair environment, so my scores mean something.
- As a **passout**, I want the same opportunities and referrals as current students, so I'm not forgotten after graduation.
- As an **admin**, I want to post a job once and have every student see it, so nothing is lost in relays.
- As an **admin**, I want a log of test violations, so I can trust the results.
- As an **admin**, I want to extend a passout's access, so I can handle special cases.

---

## 8. Core Logic

**Status** (`lib/status.ts`)

```ts
export type Status = "current" | "passout" | "expired";

export function getStatus(
  graduationDate: string,
  today = new Date(),
  accessOverrideUntil?: string | null
): Status {
  const grad = new Date(graduationDate);
  if (grad > today) return "current";
  const expiry = new Date(grad);
  expiry.setMonth(expiry.getMonth() + 18);
  if (today < expiry) return "passout";
  if (accessOverrideUntil && new Date(accessOverrideUntil) > today) return "passout";
  return "expired";
}
```

**Eligibility** (`lib/eligibility.ts`): compares CGPA, branch, backlogs and status against the job and returns `{ eligible, reasons[] }`.

**Match %** (`lib/match.ts`): `matched skills / required skills`, plus the missing skills list.

**Resume analyzer** (`/api/resume/analyze`): extract PDF text, then make one LLM call that returns JSON only: `{ ats_score, missing_keywords[], suggestions[] }`.

**Chatbot** (`/api/chat`): context is the student's profile and status, open jobs with deadlines, announcements and eligibility results. No streaming.

**Secure test flow**

1. `/api/test/start` rejects a second attempt, creates the attempt with `ends_at`, shuffles the questions and returns them without answers.
2. `ExamGuard` requests fullscreen, listens for violations and posts each one to `violation_logs`.
3. At 3 violations, or when `ends_at` passes, the attempt auto-submits.
4. `/api/test/submit` scores on the server, awards points and flags `auto_submitted`.

*Honest limit:* browser-based proctoring is deterrence plus an audit trail, not unbreakable security.

---

## 9. Design and Brand Guidelines

**Style:** Modern Career-Tech SaaS. Clean, light, spacious, card-based layouts with confident blue and a fresh green for growth and success.

### 9.1 Color palette

| Usage | Color | Hex |
|---|---|---|
| Primary | Deep Blue | `#2563EB` |
| Primary Dark | Navy Blue | `#1E3A8A` |
| Success / Growth | Emerald Green | `#10B981` |
| Background | Very Light Blue | `#F8FAFC` |
| Cards | White | `#FFFFFF` |
| Main Text | Dark Navy | `#0F172A` |
| Secondary Text | Slate | `#64748B` |
| Borders | Light Slate | `#E2E8F0` |
| Warning | Amber | `#F59E0B` |
| Error | Red | `#EF4444` |

The logo artwork uses slightly different blue, green and navy values from this UI palette, so use the palette above for all interface elements and use the logo file as supplied. Don't recolor it.

### 9.2 Tailwind tokens

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary:  { DEFAULT: "#2563EB", dark: "#1E3A8A" },
      success:  "#10B981",
      warning:  "#F59E0B",
      danger:   "#EF4444",
      surface:  "#FFFFFF",
      canvas:   "#F8FAFC",
      ink:      { DEFAULT: "#0F172A", muted: "#64748B" },
      line:     "#E2E8F0",
    },
    borderRadius: { xl: "0.75rem", "2xl": "1rem" },
    boxShadow: { card: "0 1px 2px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.04)" },
  },
}
```

### 9.3 Semantic color use

| Element | Color |
|---|---|
| Primary buttons, links, active nav | Primary `#2563EB` (hover `#1E3A8A`) |
| Headings, sidebar background (optional) | Dark Navy `#0F172A` / Navy `#1E3A8A` |
| Page background | `#F8FAFC` |
| Cards, modals, inputs | `#FFFFFF` with `#E2E8F0` border |
| Eligible badge, Selected, points earned, progress | Emerald `#10B981` |
| Closing soon, Interview, test warning | Amber `#F59E0B` |
| Ineligible reasons, Rejected, violations, errors | Red `#EF4444` |
| Body and helper text | `#0F172A` and `#64748B` |

### 9.4 Application status pills

| Status | Pill color |
|---|---|
| Applied | Blue `#2563EB` |
| Shortlisted | Navy `#1E3A8A` |
| Interview | Amber `#F59E0B` |
| Selected | Green `#10B981` |
| Rejected | Red `#EF4444` |

Use a tinted background (about 10% opacity) with solid-color text, for example `bg-success/10 text-success`.

### 9.5 Typography and components

- **Font:** Inter (Google Fonts) with a system-sans fallback. Headings semibold, body regular.
- **Cards:** white, `rounded-2xl`, `1px` light-slate border, subtle shadow.
- **Buttons:** primary solid blue, secondary white with border, destructive red. Minimum 40px height.
- **Inputs:** white, light-slate border, blue focus ring.
- **Greyed-out job cards:** reduced opacity with a red-tinted reason line, never fully hidden.
- **Match %:** a progress bar in blue (below 50%), amber (50 to 79%) or green (80% and above).
- **Layout:** left sidebar navigation on desktop, bottom or top menu on mobile. The app must be responsive.
- **Empty and loading states:** every list has a friendly empty state and a skeleton loader.
- **Logo:** top-left of the sidebar and the login page. Use on a white or very light background.

### 9.6 Key screens

| Screen | Highlights |
|---|---|
| Login | Logo, email and password, demo account buttons |
| Student dashboard | Welcome, profile completeness bar, closing-soon jobs, latest announcements, points, expiry banner for passouts |
| Jobs feed | Filter bar, job cards with match % and eligibility badge, greyed-out ineligible jobs |
| Job detail | Description, requirements, skill gap, Apply button |
| Applications | Table with color status pills |
| Resume | Upload, ATS score ring, missing keywords, suggestions |
| Test list and exam | Category cards; full-screen exam with timer and a violation counter |
| Leaderboard | Ranked list with the student's own row highlighted |
| Referrals / Mock slots | Cards with a request or book action |
| Chat | Simple assistant window |
| Admin | Jobs, announcements, applications and statuses, test logs, users (graduation date and access extension), stats cards, simulate-date control |
| Access ended | Logo, short explanation, contact placement cell |

---

## 10. Technical Approach

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| UI | Tailwind CSS and shadcn/ui, themed with the tokens above |
| Auth, DB, files | Supabase (Auth, Postgres, Storage) |
| Server logic | Next.js API routes |
| AI | One LLM API (resume analyzer and chatbot) |
| PDF parsing | `pdf-parse` |
| Hosting | Vercel |

```
Next.js (UI + API routes) on Vercel
  ├── Supabase Auth      → login
  ├── Supabase Postgres  → all tables
  ├── Supabase Storage   → resume PDFs
  └── Server-only routes (hold the LLM key and correct answers)
        /api/resume/analyze · /api/chat
        /api/test/start | answer | submit · /api/admin/export
```

Hackathon shortcuts: RLS off with roles checked in code, SQL-seeded data, hardcoded quiz questions, in-app notifications only.

### Folder structure

```
/app
  /login  /access-ended
  /student  dashboard · jobs · jobs/[id] · applications · resume · tests
            tests/[id] · leaderboard · referrals · mock · events · chat
  /admin    jobs · announcements · applications · test-logs · users · stats
/api        resume/analyze · chat · test/start · test/answer · test/submit · admin/export
/lib        status.ts · eligibility.ts · match.ts · points.ts · supabase.ts · llm.ts
/middleware.ts
/components JobCard · EligibilityBadge · StatusPill · ExamGuard · ChatBox
            StatCard · ExpiryBanner · Logo
/public     plyace-logo.png
```

### Data model

```
profiles(id, name, email, role[student|admin], branch, batch, graduation_date,
         access_override_until, cgpa, backlogs, skills[], resume_url, points)
jobs(id, company, title, description, required_skills[], min_cgpa,
     allowed_branches[], max_backlogs, deadline, opp_type)
applications(id, job_id, student_id, status, match_score, applied_at)
announcements(id, title, body, created_at)
resume_analyses(id, student_id, job_id, ats_score, missing_keywords[], suggestions)
tests(id, title, category, duration_min)
questions(id, test_id, text, options[], correct_index)      -- server-only
test_attempts(id, test_id, student_id, started_at, ends_at, submitted_at,
              score, violations_count, auto_submitted, answers jsonb)
violation_logs(id, attempt_id, type, at)
referrals(id, alumni_name, company, role, slots, link)
referral_requests(id, referral_id, requester_id, status)
mock_slots(id, host_name, type, topic, starts_at, capacity)
mock_bookings(id, slot_id, student_id)
events(id, title, type, starts_at, description)
settings(key, value)                                        -- simulated date
```

---

## 11. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Security | Correct answers and the LLM key stay server-side; status and role checks run on the server; resumes in private storage |
| Performance | Pages load in under 2 seconds on seeded data; resume analysis returns in under 30 seconds |
| Reliability | If the LLM call fails, show a friendly message and keep the rest of the app usable |
| Accessibility | Sufficient color contrast; status is never conveyed by color alone (use labels too); keyboard-friendly forms |
| Responsiveness | Works on desktop and mobile widths |
| Privacy | Students see only their own data; admins see all |

---

## 12. Success Metrics

**Demo-day (hackathon)**

- End-to-end flow works: post job, eligibility feed, apply, track, resume score, secure test, chatbot
- Passout conversion and expiry demonstrated with Simulate date
- Zero crashes in the 4-minute demo

**Post-launch (if piloted)**

| Metric | Target idea |
|---|---|
| Eligible students who applied | Increase vs. the current manual process |
| Opportunities missed due to lack of information | Reduce to near zero |
| Students who used the resume analyzer or a test | Majority of active users |
| Passouts active in their access window | Track monthly |

---

## 13. Build Plan (about 3 hours)

| Time | Task |
|---|---|
| 0:00–0:20 | Scaffold, brand tokens, schema, seed data, demo accounts, deploy |
| 0:20–1:30 | **A:** auth, status logic, jobs feed, eligibility, apply, tracker, admin jobs. **B:** secure test and leaderboard. **C:** resume analyzer and chatbot. **D:** announcements, referrals, mock slots, admin pages, CSV |
| 1:30–2:15 | Integration, points, middleware guard, simulate-date, UI polish |
| 2:15 | **Feature freeze** |
| 2:15–2:30+ | Bug fixes, final seed data, backup screen recording, pitch slides |

**Cut order:** events and stats, then mock slots, then referral board (make it static), then chatbot (rule-based FAQ), then leaderboard polish.
**Never cut:** eligibility feed, tracker, resume analyzer, secure test.

---

## 14. Demo Script (about 4 minutes)

1. Admin posts a job.
2. Student feed shows match %, filters and a greyed-out ineligible job with its reason.
3. Student uploads a resume and gets an ATS score.
4. Student starts a test, switches tabs, reaches 3 strikes and is auto-submitted. Admin shows the violation log.
5. Student asks the chatbot, "Am I eligible for TCS?"
6. Simulate date past graduation: the student becomes a passout and the feed changes.
7. Passout books a mock interview and requests a referral.
8. Simulate date past 18 months: the account is blocked, and the admin extends access.
9. Admin updates an application status and exports the CSV.
10. Roadmap slide.

---

## 15. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Not enough time | Strict P0/P1 order, feature freeze at 2:15, cut order defined |
| LLM latency or failure | Single call per feature, friendly error state, rule-based FAQ fallback for chat |
| Test cheating via second device | State honestly that it is deterrence plus audit; webcam and AI proctoring are on the roadmap |
| RLS disabled for speed | Role and status checks in API routes; flag as a hardening step before real use |
| Date edge cases in expiry | Use a date library (`date-fns` `addMonths`) if admins edit graduation dates freely |
| Demo data looks fake | Seed realistic jobs, names and skills |

---

## 16. Roadmap (post-hackathon)

1. Student coordinator role with admin approval (inspired by IIT Bombay's department coordinators)
2. Season registration with admin verification
3. Interview experience board and company pages
4. Webcam and AI proctoring
5. Real email, SMS and push notifications
6. Analytics dashboard with charts
7. Alumni accounts that post referrals and host mock sessions directly
8. Multi-college support

---

## 17. Open Questions

- Should the default graduation date be June 30 for all batches, or set per department?
- Does the admin need multiple roles (for example, a coordinator who can post but not delete)?
- Which LLM provider and key will the team use at the event?
- Should expired users be able to download their own data and score history before lock-out?
