import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Plus, Users } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase as db } from "../../lib/supabase";
import {
  audiencesFor,
  eventAudienceLabels,
  formatEventWhen,
  formatEventWhere,
  humanEventCategories,
  petEventCategories,
  type EventAudience,
  type EventAudienceFilter,
  type PublicEvent,
} from "../../lib/events";
import "./Events.css";

type ManageableOrg = { organization_id: string; public_name: string };

const filters: { value: EventAudienceFilter; label: string }[] = [
  { value: "all", label: "All events" },
  { value: "pet", label: "Pet events" },
  { value: "human", label: "Human events" },
];

export function EventsPage({ session }: { session: Session | null }) {
  const [audience, setAudience] = useState<EventAudienceFilter>("all");
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [orgs, setOrgs] = useState<ManageableOrg[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    category: "Adoption Event",
    audience: "pet" as EventAudience,
    organizationId: "",
    serviceArea: "",
    isOnline: false,
    startsAt: "",
    endsAt: "",
  });

  const load = useCallback(async () => {
    if (!db) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    const { data, error } = await db
      .from("events")
      .select(
        "id,organization_id,audience,category,title,summary,details,service_area,is_online,starts_at,ends_at,status,published_at",
      )
      .in("audience", audiencesFor(audience))
      .eq("status", "active")
      .not("published_at", "is", null)
      .order("starts_at", { ascending: true, nullsFirst: false })
      .limit(60);
    if (error) {
      // The table does not exist until the Track 2 migration is applied, so
      // say that plainly rather than showing an empty calendar.
      setLoadError(
        "Events are not available on this deployment yet. The events migration has not been applied here.",
      );
      setEvents([]);
    } else {
      setEvents((data as PublicEvent[]) ?? []);
    }
    setLoading(false);
  }, [audience]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!db || !session) return;
    void (async () => {
      const { data } = await db
        .from("organization_memberships")
        .select("organization_id,role,status,organizations(public_name)")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .in("role", ["owner", "administrator", "publisher"]);
      const rows = (data ?? []) as unknown as {
        organization_id: string;
        organizations: { public_name: string } | null;
      }[];
      setOrgs(
        rows.map((row) => ({
          organization_id: row.organization_id,
          public_name: row.organizations?.public_name ?? "Your organization",
        })),
      );
    })();
  }, [session]);

  const categories = useMemo(
    () =>
      form.audience === "human"
        ? humanEventCategories
        : form.audience === "pet"
          ? petEventCategories
          : [...petEventCategories, ...humanEventCategories],
    [form.audience],
  );

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!db || !session || submitting) return;
    if (form.title.trim().length < 3 || form.summary.trim().length < 3) {
      setStatus("Add a title and a short summary.");
      return;
    }
    setSubmitting(true);
    setStatus("");
    const { error } = await db.from("events").insert({
      organization_id: form.organizationId || null,
      created_by: session.user.id,
      audience: form.audience,
      category: form.category,
      title: form.title.trim(),
      summary: form.summary.trim(),
      service_area: form.serviceArea.trim() || null,
      is_online: form.isOnline,
      starts_at: form.startsAt || null,
      ends_at: form.endsAt || null,
    });
    setSubmitting(false);
    if (error) {
      setStatus("We could not create that event. Please try again.");
      return;
    }
    setStatus(
      "Saved as a draft. Publishing controls are coming next, so it is not public yet.",
    );
    setForm((current) => ({ ...current, title: "", summary: "" }));
    void load();
  }

  return (
    <div className="evPage">
      <section className="evHero">
        <div className="evWrap">
          <span className="evEyebrow">
            <CalendarDays /> Events
          </span>
          <h1>Adoption days, festivals, and markets in one place.</h1>
          <p className="evLead">
            Pet events and human events share one system, so an adoption day and
            a music festival can sit side by side without either audience wading
            through the other's listings.
          </p>
        </div>
      </section>

      <section className="evBody">
        <div className="evWrap">
          <div className="evToolbar">
            <div
              className="evFilters"
              role="group"
              aria-label="Filter events by audience"
            >
              {filters.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={audience === option.value ? "active" : ""}
                  aria-pressed={audience === option.value}
                  onClick={() => setAudience(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {session && (
              <button
                type="button"
                className="evAddButton"
                aria-expanded={showForm}
                onClick={() => setShowForm((current) => !current)}
              >
                <Plus /> {showForm ? "Close" : "Add an event"}
              </button>
            )}
          </div>

          {showForm && session && (
            <form className="evForm" onSubmit={submit}>
              <h2>Add an event</h2>
              <div className="evFormGrid">
                <label>
                  <span>Who is it for?</span>
                  <select
                    value={form.audience}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        audience: e.target.value as EventAudience,
                      })
                    }
                  >
                    {Object.entries(eventAudienceLabels).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Category</span>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="evFormWide">
                  <span>Title</span>
                  <input
                    value={form.title}
                    maxLength={180}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </label>
                <label className="evFormWide">
                  <span>Summary</span>
                  <textarea
                    value={form.summary}
                    maxLength={600}
                    rows={3}
                    onChange={(e) =>
                      setForm({ ...form, summary: e.target.value })
                    }
                    required
                  />
                </label>
                <label>
                  <span>Starts</span>
                  <input
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(e) =>
                      setForm({ ...form, startsAt: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Ends</span>
                  <input
                    type="datetime-local"
                    value={form.endsAt}
                    onChange={(e) =>
                      setForm({ ...form, endsAt: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Location or service area</span>
                  <input
                    value={form.serviceArea}
                    maxLength={180}
                    placeholder="Legend Valley, OH"
                    onChange={(e) =>
                      setForm({ ...form, serviceArea: e.target.value })
                    }
                  />
                </label>
                <label>
                  <span>Hosting organization</span>
                  <select
                    value={form.organizationId}
                    onChange={(e) =>
                      setForm({ ...form, organizationId: e.target.value })
                    }
                  >
                    <option value="">No organization (community event)</option>
                    {orgs.map((org) => (
                      <option
                        key={org.organization_id}
                        value={org.organization_id}
                      >
                        {org.public_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="evCheckbox">
                  <input
                    type="checkbox"
                    checked={form.isOnline}
                    onChange={(e) =>
                      setForm({ ...form, isOnline: e.target.checked })
                    }
                  />
                  <span>This event is online</span>
                </label>
              </div>
              <button className="evSubmit" disabled={submitting}>
                {submitting ? "Saving…" : "Save event"}
              </button>
              <p className="evStatus" role="status" aria-live="polite">
                {status}
              </p>
            </form>
          )}

          {loading ? (
            <p className="evEmpty" role="status">
              Loading events…
            </p>
          ) : loadError ? (
            <p className="evEmpty">{loadError}</p>
          ) : events.length === 0 ? (
            <div className="evEmpty">
              <p>
                <strong>No published events yet.</strong>
              </p>
              <p>
                Adoption events, festivals, vendor markets, and pet-friendly
                gatherings will appear here as organizers add them.
              </p>
              {!session && (
                <Link className="evSubmit" to="/register">
                  Create an account to add one
                </Link>
              )}
            </div>
          ) : (
            <ul className="evGrid">
              {events.map((item) => (
                <li className="evCard" key={item.id}>
                  <span className="evCardTags">
                    <em>{eventAudienceLabels[item.audience]}</em>
                    <span>{item.category}</span>
                  </span>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <dl className="evCardMeta">
                    <div>
                      <dt>
                        <CalendarDays aria-hidden="true" /> When
                      </dt>
                      <dd>{formatEventWhen(item.starts_at, item.ends_at)}</dd>
                    </div>
                    <div>
                      <dt>
                        <MapPin aria-hidden="true" /> Where
                      </dt>
                      <dd>
                        {formatEventWhere(item.is_online, item.service_area)}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          )}

          <p className="evFootNote">
            <Users aria-hidden="true" />
            <span>
              Businesses control their own participation in an event —
              attending, vending, hosting, or available for hire. An organizer
              cannot list another business without that business acting.{" "}
              <Link to="/learn/events">How events work</Link>
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
