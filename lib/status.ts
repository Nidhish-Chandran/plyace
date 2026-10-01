import { Status } from "./types";

export function getStatus(
  graduationDate: string,
  today: Date = new Date(),
  accessOverrideUntil?: string | null
): Status {
  const grad = new Date(graduationDate);
  if (isNaN(grad.getTime())) return "current";

  // Check if graduation date is in the future
  if (grad > today) {
    return "current";
  }

  // 18-month passout access window
  const expiry = new Date(grad);
  expiry.setMonth(expiry.getMonth() + 18);

  if (today < expiry) {
    return "passout";
  }

  // Admin extension override check
  if (accessOverrideUntil) {
    const overrideDate = new Date(accessOverrideUntil);
    if (!isNaN(overrideDate.getTime()) && overrideDate > today) {
      return "passout";
    }
  }

  return "expired";
}

export function getExpiryDate(graduationDate: string, accessOverrideUntil?: string | null): Date {
  const grad = new Date(graduationDate);
  const expiry = new Date(grad);
  expiry.setMonth(expiry.getMonth() + 18);

  if (accessOverrideUntil) {
    const overrideDate = new Date(accessOverrideUntil);
    if (!isNaN(overrideDate.getTime()) && overrideDate > expiry) {
      return overrideDate;
    }
  }

  return expiry;
}

export function getDaysRemaining(
  graduationDate: string,
  today: Date = new Date(),
  accessOverrideUntil?: string | null
): number {
  const expiry = getExpiryDate(graduationDate, accessOverrideUntil);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isExpiringSoon(
  graduationDate: string,
  today: Date = new Date(),
  accessOverrideUntil?: string | null
): { warning: boolean; daysLeft: number } {
  const status = getStatus(graduationDate, today, accessOverrideUntil);
  if (status !== "passout") {
    return { warning: false, daysLeft: 0 };
  }

  const daysLeft = getDaysRemaining(graduationDate, today, accessOverrideUntil);
  return {
    warning: daysLeft > 0 && daysLeft <= 60,
    daysLeft: Math.max(0, daysLeft),
  };
}

/**
 * Deterministic date formatter ensuring 100% server and client hydration parity
 */
export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return "";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getUTCMonth()];
    const day = String(d.getUTCDate()).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return String(dateInput);
  }
}
