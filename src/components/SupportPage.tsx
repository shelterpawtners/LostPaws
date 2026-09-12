import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LifeBuoy, Mail, ShieldCheck } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase as db } from "../lib/supabase";
import "./SupportPage.css";

const categoryLabels: Record<string, string> = {
  bug: "Something is broken",
  account: "Account or sign-in",
  billing: "Billing or offers",
  privacy: "Privacy or data",
  feedback: "Feedback or an idea",
  other: "Something else",
};

type TicketSummary = {
  id: string;
  reference_code: string;
  subject: string;
  status: string;
};

/**
 * The support request form lives on its own page.
 *
 * It used to render inside the account dropdown, behind its own second
 * collapse toggle, so reaching it took three clicks through nested hidden
 * panels. Owner direction (2026-09-12) was to move the form out of the menu
 * and make the path obvious: the menu now links here, and the form is visible
 * on arrival with no further clicks.
 */
export function SupportPage({ session }: { session: Session | null }) {
  const [category, setCategory] = useState("bug");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [tickets, setTickets] = useState<TicketSummary[]>([]);

  useEffect(() => {
    if (!db || !session) return;
    void (async () => {
      const { data } = await db
        .from("support_tickets")
        .select("id,reference_code,subject,status")
        .eq("reporter_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setTickets((data as TicketSummary[]) ?? []);
    })();
  }, [session]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!db || !session || submitting) return;
    const cleanSubject = subject.trim();
    const cleanDescription = description.trim();
    if (cleanSubject.length < 3 || cleanDescription.length < 3) {
      setStatus("Add a little more detail so we can help.");
      return;
    }
    setSubmitting(true);
    setStatus("");
    const { data, error } = await db
      .from("support_tickets")
      .insert({
        reporter_id: session.user.id,
        category,
        subject: cleanSubject,
        description: cleanDescription,
      })
      .select("id,reference_code,subject,status")
      .single();
    setSubmitting(false);
    if (error || !data) {
      setStatus("We could not submit that request. Please try again.");
      return;
    }
    setStatus(
      `Thanks. Your reference is ${(data as TicketSummary).reference_code}.`,
    );
    setSubject("");
    setDescription("");
    setTickets((current) => [data as TicketSummary, ...current].slice(0, 5));
  }

  return (
    <div className="supportPage">
      <section className="supportHero">
        <div className="supportWrap">
          <span className="supportEyebrow">
            <LifeBuoy /> Support
          </span>
          <h1>How can we help?</h1>
          <p className="supportLead">
            Report a problem, ask a question, or send us an idea. We read every
            one.
          </p>
        </div>
      </section>

      <section className="supportBody">
        <div className="supportWrap supportGrid">
          {session ? (
            <form className="supportForm" onSubmit={submit}>
              <h2>Send us a request</h2>
              <label>
                <span>What can we help with?</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Subject</span>
                <input
                  value={subject}
                  maxLength={180}
                  onChange={(event) => setSubject(event.target.value)}
                  required
                />
              </label>
              <label>
                <span>What happened?</span>
                <textarea
                  value={description}
                  maxLength={8000}
                  rows={6}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
              </label>
              <button className="supportSubmit" disabled={submitting}>
                {submitting ? "Sending…" : "Send request"}
              </button>
              <p
                className="supportStatus"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                {status}
              </p>
            </form>
          ) : (
            <div className="supportForm supportSignedOut">
              <h2>Send us a request</h2>
              <p>
                Sign in and your request is tracked with a reference code so you
                can follow it. You can also email us directly.
              </p>
              <div className="supportSignedOutActions">
                <Link className="supportSubmit" to="/login">
                  Sign in to send a request
                </Link>
                <a href="mailto:contact@shelterpawtners.com">
                  Email contact@shelterpawtners.com
                </a>
              </div>
            </div>
          )}

          <aside className="supportAside">
            <div className="supportCard">
              <h2>
                <ShieldCheck aria-hidden="true" /> Keep these out of your
                message
              </h2>
              <p>
                Never send passwords, authentication codes, payment details, or
                private medical information. We will never ask for them.
              </p>
            </div>

            <div className="supportCard">
              <h2>
                <Mail aria-hidden="true" /> Email us instead
              </h2>
              <ul className="supportContacts">
                <li>
                  <a href="mailto:contact@shelterpawtners.com">
                    General questions
                  </a>
                </li>
                <li>
                  <a href="mailto:adoptions@shelterpawtners.com">
                    Adoption support
                  </a>
                </li>
                <li>
                  <a href="mailto:petbiz@shelterpawtners.com">
                    Businesses and vendors
                  </a>
                </li>
              </ul>
            </div>

            <div className="supportCard">
              <h2>Answers without waiting</h2>
              <p>
                Many questions are already covered, including what things cost
                and what is not built yet.
              </p>
              <Link className="supportAsideLink" to="/faq">
                Read the FAQ
              </Link>
            </div>
          </aside>
        </div>

        {session && tickets.length > 0 && (
          <div className="supportWrap">
            <div className="supportHistory">
              <h2>Your recent requests</h2>
              <ul>
                {tickets.map((ticket) => (
                  <li key={ticket.id}>
                    <strong>{ticket.reference_code}</strong>
                    <span>{ticket.subject}</span>
                    <em>{ticket.status.replaceAll("_", " ")}</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
