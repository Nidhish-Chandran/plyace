# Plyace — Gamified College Placement Platform

<p align="center">
  <img src="public/plyace-logo.png" alt="Plyace Logo" width="360" />
</p>

> **Team:** H03 &bull; **Version:** 1.0 (Hackathon MVP) &bull; **Date:** 1 October 2026 &bull; **Style:** Modern Career-Tech SaaS

**Plyace** bridges students and the Career Guidance and Placement Unit (CGPU). It brings every verified opening, announcement, and application status into a single feed, calculates real-time eligibility with precise reasons for ineligibility, scores resumes with an instant ATS engine, and offers secure, proctored skill assessments with **ExamGuard**. Current students and passed-out alumni both enjoy equal support, with passout alumni eligible for an 18-month access window.

---

## 🎨 Brand & Design Palette

| Usage | Color | Hex Code |
|---|---|---|
| **Primary** | Deep Blue | `#2563EB` |
| **Primary Dark** | Navy Blue | `#1E3A8A` |
| **Success / Growth** | Emerald Green | `#10B981` |
| **Background** | Very Light Blue | `#F8FAFC` |
| **Cards / Surface** | White | `#FFFFFF` |
| **Main Text** | Dark Navy | `#0F172A` |
| **Secondary Text** | Slate | `#64748B` |
| **Borders** | Light Slate | `#E2E8F0` |
| **Warning** | Amber | `#F59E0B` |
| **Error / Alert** | Red | `#EF4444` |

---

## 🚀 Key Features

### 1. Opportunities & Drives Feed
- **Real-Time Eligibility Engine:** Compares student CGPA, backlogs, branch, and status against job criteria.
- **Visual Feedback:** Eligible drives feature an emerald badge and 1-click apply; ineligible drives are greyed out with exact reasons (e.g. *"Needs 7.5 CGPA, you have 7.2"* or *"Campus-only drive; not open to passouts"*).
- **Skill Gap & Match %:** Color-coded progress bar (Blue <50%, Amber 50-79%, Green 80%+) with missing skill tags.
- **Filters & Search:** Filter by Full-Time, Internship, PPO, and Off-Campus drives.

### 2. Account Lifecycle & 18-Month Passout Window
- **Status Calculation:** Computed automatically from graduation date: `current` &rarr; `passout` &rarr; `expired`.
- **60-Day Expiry Warning:** Passouts in their final 60 days see a persistent reminder banner.
- **Access Period Ended Screen:** Expired accounts (>18 months) are blocked with guidance to contact CGPU.
- **Simulate Date Control:** Interactive fast-forward control allowing hackathon judges to witness student &rarr; passout &rarr; expired transitions in seconds.

### 3. ATS Resume Analyzer
- Upload PDF/text resume and select target company.
- Radial 0-100 ATS score gauge, matched vs missing high-priority keywords, strengths, and actionable suggestions.
- Awards **+10 gamification points** on analysis.

### 4. ExamGuard Secure Skill Assessments
- Aptitude & Core Technical question banks.
- Fullscreen enforcement and real-time event monitoring (`visibilitychange`, `blur`, `copy`, `paste`, `contextmenu`).
- **3-Strike Violation Rule:** Auto-submits on 3 strikes or when timer expires.
- Full audit log displayed in CGPU admin portal.

### 5. Gamification & Leaderboard
- Placement points earned for resumes (+10), applications (+5), and test scores.
- Live leaderboard highlighting student ranks.

### 6. Mentorship & Alumni Network
- Internal referral board with verified alumni at Amazon, Uber, and Microsoft.
- 1:1 Mock interview and Group Discussion reservations with live capacity limits.

### 7. Plyace AI Placement Assistant
- Conversational assistant answering queries regarding company cutoffs, deadlines, and drive eligibility grounded in placement records.

### 8. CGPU Admin Portal
- Post and edit placement drives with strict criteria.
- Candidate application pipeline with status updates (`Applied`, `Shortlisted`, `Interview`, `Selected`, `Rejected`).
- **One-Click CSV Export** for corporate HR shortlists.
- ExamGuard proctoring audit log viewer.
- Student lifecycle directory with access extension override.

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/Nidhish-Chandran/plyace.git
cd plyace

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🎭 4-Minute Hackathon Demo Script

1. **Student Feed & Eligibility:** Log in as **Aditi Rao** (Student). Observe the feed displaying Goldman Sachs and Cisco as eligible, and Google greyed out due to CGPA cutoff (8.5 vs 8.4).
2. **One-Click Apply:** Apply to an eligible drive and observe the application tracker update.
3. **ATS Resume Analyzer:** Run the analyzer on Aditi's resume against Goldman Sachs &mdash; see the radial score meter, matched keywords, and +10 points award.
4. **ExamGuard Test:** Start the Aptitude or Technical test, switch tabs to trigger violation strikes, and demonstrate auto-submission and audit logs.
5. **Simulate Date (Passout Conversion):** Open the **Simulate Date** widget and select **July 15, 2027**. Aditi graduates and transitions into a Passout &mdash; notice the 18-month countdown and feed adaptation.
6. **Simulate Date (Access Expiry):** Select **Jan 15, 2029** (>18 months). The screen transitions to the blocked **Access Period Concluded** view.
7. **Admin Access Extension:** Switch to **Dr. K. S. Nair** (Admin), extend access override to 2029, update candidate application statuses, and click **Export CSV for Corporate HR**.
