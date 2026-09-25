"use client";

// Pages are prerendered, so the year is re-read in the browser — the footer
// stays correct after New Year without a rebuild.
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
