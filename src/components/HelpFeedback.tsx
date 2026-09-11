import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase as db } from "../lib/supabase";

type SupportCategory =
  | "bug"
  | "account_auth"
  | "suggestion"
  | "ui_accessibility"
  | "marketplace_offer"
  | "adoption_verification"
  | "privacy_safety"
  | "other";

type TicketSummary = {
  id: string;
  reference_code: string;
  category: SupportCategory;
  subject: string;
  status: string;
  created_at: string;
};

const categoryLabels: Record<SupportCategory, string> = {
  bug: "Report a bug",
  account_auth: "Account / sign-in help",
  suggestion: "Suggest an improvement",
  ui_accessibility: "UI / accessibility issue",
  marketplace_offer: "Marketplace / offer problem",
  adoption_verification: "Adoption / shelter verification help",
  privacy_safety: "Privacy / safety concern",
  other: "Other",
};

function deviceClass() {
  if (typeof window === "undefined") return "unknown";
  const mobile = window.matchMedia("(max-width: 640px)").matches;
  return mobile ? "mobile" : "desktop";
}

function browserFamily() {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("Chrome/")) return "chrome";
  if (ua.includes("Firefox/")) return "firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "safari";
  return "other";
}

export function HelpFeedback({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<SupportCategory>("bug");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [tickets, setTickets] = useState<TicketSummary[]>([]);

  async function loadTickets() {
    if (!db || !session) return;
    const { data } = await db
      .from("support_tickets")
      .select("id,reference_code,category,subject,status,created_at")
      .eq("reporter_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    setTickets((data || []) as TicketSummary[]);
  }

  useEffect(() => {
    void loadTickets();
  }, [session]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db || !session || submitting) return;
    const cleanSubject = subject.trim();
    const cleanDescription = description.trim();
    if (cleanSubject.length < 3 || cleanDescription.length < 3) {
      setStatus("Add a short subject and description before submitting.");
      return;
    }

    setSubmitting(true);
    setStatus("Submitting your report…");
    const { data, error } = await db
      .from("support_tickets")
      .insert({
        reporter_id: session.user.id,
        category,
        subject: cleanSubject,
        description: cleanDescription,
        persona_code: "guardian",
        app_route: window.location.pathname + window.location.search,
        device_class: deviceClass(),
        browser_family: browserFamily(),
      })
      .select("reference_code")
      .single();
    setSubmitting(false);

    if (error || !data) {
      setStatus(error?.message || "Unable to submit your report right now.");
      return;
    }

    setSubject("");
    setDescription("");
    setStatus(`Submitted. Your reference is ${data.reference_code}.`);
    await loadTickets();
  }

  return (
    <section className="panel" aria-labelledby="help-feedback-heading">
      <span className="eyebrow">Support</span>
      <h3 id="help-feedback-heading">Help & feedback</h3>
      <p>
        Report a problem or share feedback. Do not include passwords, auth
        codes, payment details, or private medical information.
      </p>
      <button
        className="btn quiet"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Close help form" : "Report an issue or suggestion"}
      </button>

      {open && (
        <form className="detail" onSubmit={submit}>
          <div className="fields">
            <label>
              What can we help with?
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as SupportCategory)
                }
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Subject
              <input
                value={subject}
                maxLength={180}
                onChange={(event) => setSubject(event.target.value)}
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={description}
                maxLength={8000}
                rows={5}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </label>
          </div>
          <button className="btn" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit report"}
          </button>
          <p role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
        </form>
      )}

      {tickets.length > 0 && (
        <div>
          <h4>Your recent support requests</h4>
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <strong>{ticket.reference_code}</strong>
                <span> — {ticket.subject}</span>
                <span> — {ticket.status.replaceAll("_", " ")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
