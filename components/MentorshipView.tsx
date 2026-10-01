"use client";

import React, { useState } from "react";
import { usePlyace } from "@/lib/store";
import {
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock,
  Send,
  Video,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

export function MentorshipView() {
  const {
    referrals,
    referralRequests,
    requestReferral,
    mockSlots,
    mockBookings,
    bookMockSlot,
    currentUser,
  } = usePlyace();

  const [referralFeedback, setReferralFeedback] = useState<string | null>(null);
  const [bookingFeedback, setBookingFeedback] = useState<string | null>(null);

  const handleRequestReferral = (id: string) => {
    const res = requestReferral(id);
    setReferralFeedback(res.message);
    if (res.success) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    setTimeout(() => setReferralFeedback(null), 3000);
  };

  const handleBookSlot = (id: string) => {
    const res = bookMockSlot(id);
    setBookingFeedback(res.message);
    if (res.success) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
    setTimeout(() => setBookingFeedback(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-[#2563EB]" />
          Alumni Referral Board & Mock Interview Prep
        </h2>
        <p className="text-xs text-[#64748B]">
          Connect directly with verified alumni working at top tech firms &bull; Equal access for current students and passouts
        </p>
      </div>

      {referralFeedback && (
        <div className="p-3.5 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#059669] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          {referralFeedback}
        </div>
      )}

      {bookingFeedback && (
        <div className="p-3.5 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#059669] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          {bookingFeedback}
        </div>
      )}

      {/* Section 1: Alumni Referral Openings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
            Verified Alumni Internal Referrals ({referrals.length})
          </h3>
          <span className="text-xs text-[#64748B]">Fast-tracks direct recruiter screening</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {referrals.map((ref) => {
            const hasRequested = referralRequests.some(
              (r) => r.referralId === ref.id && r.studentId === currentUser.id
            );
            return (
              <div
                key={ref.id}
                className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2563EB]/10 text-[#2563EB]">
                      {ref.company}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {ref.slots - ref.requestsCount} slots left
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#0F172A] leading-snug mb-1">
                    {ref.role}
                  </h4>
                  <p className="text-xs text-[#64748B] mb-3">
                    Referred by: <strong className="text-[#0F172A]">{ref.alumniName}</strong> (Batch &apos;{ref.batch.slice(-2)})
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ref.skillsNeeded.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-slate-700 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  {hasRequested ? (
                    <div className="w-full py-2 rounded-xl text-center text-xs font-bold text-[#1E3A8A] bg-[#1E3A8A]/10 border border-[#1E3A8A]/20">
                      Request Pending Review
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRequestReferral(ref.id)}
                      className="w-full py-2 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-[#1E3A8A] text-white transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Request Internal Referral</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Mock Interview & GD Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
            Alumni Mock Interviews & Group Discussions
          </h3>
          <span className="text-xs text-[#64748B]">1:1 and Group Simulation Practice</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockSlots.map((slot) => {
            const hasBooked = mockBookings.some(
              (b) => b.slotId === slot.id && b.studentId === currentUser.id
            );
            const isFull = slot.bookedCount >= slot.capacity;

            return (
              <div
                key={slot.id}
                className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        slot.type === "Mock Interview"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {slot.type}
                    </span>
                    <span className="text-[11px] font-semibold text-[#64748B]">
                      {slot.bookedCount}/{slot.capacity} seats filled
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#0F172A] leading-snug mb-1">
                    {slot.topic}
                  </h4>
                  <div className="text-xs text-[#64748B] mb-2">
                    Mentor: <strong className="text-[#0F172A]">{slot.hostName}</strong>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#2563EB] font-medium bg-[#2563EB]/5 p-2 rounded-xl border border-[#2563EB]/15 mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(slot.startsAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0]">
                  {hasBooked ? (
                    <div className="w-full py-2 rounded-xl text-center text-xs font-bold text-[#059669] bg-[#10B981]/15 border border-[#10B981]/30">
                      Slot Confirmed &check;
                    </div>
                  ) : isFull ? (
                    <div className="w-full py-2 rounded-xl text-center text-xs font-bold text-slate-400 bg-slate-100">
                      Capacity Full
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBookSlot(slot.id)}
                      className="w-full py-2 rounded-xl text-xs font-bold bg-[#10B981] hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Reserve Practice Slot</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
