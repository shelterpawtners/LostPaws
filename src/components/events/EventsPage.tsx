import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Pencil, Plus, Users } from "lucide-react";
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
import { LoadingState } from "../LoadingState";
import { MediaUpload } from "../MediaUpload";
import { mediaPublicUrl } from "../OfferCard";
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
  const [myEvents, setMyEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [orgs, setOrgs] = useState<ManageableOrg[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [publishBusyId, setPublishBusyId] = useState<string | null>(null);

  const blankForm = {
    title: "",
    summary: "",
    category: "Adoption Event",
    audience: "pet" as EventAudience,
    organizationId: "",
    serviceArea: "",
    isOnline: false,
    startsAt: "",
    endsAt: "",
    imagePath: "",
  };
  const [form, setForm] = useState(blankForm);

  function toLocalInput(iso: string | null) {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function startCreate() {
    setEditingId(null);
    setForm(blankForm);
    setStatus("");
    setShowForm(true);
  }

  function startEdit(item: PublicEvent) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      summary: item.summary,
      category: item.category,
      audience: item.audience,
      organizationId: item.organization_id ?? "",
      serviceArea: item.service_area ?? "",
      isOnline: item.is_online,
      startsAt: toLocalInput(item.starts_at),
      endsAt: toLocalInput(item.ends_at),
      imagePath: item.image_path ?? "",
    });
    setStatus("");
    setShowForm(true);
  }

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
        "id,organization_id,audience,category,title,summary,details,service_area,is_online,starts_at,ends_at,status,published_at,image_path",
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

  const loadMyEvents = useCallback(async () => {
    if (!db || !session) {
      setMyEvents([]);
      return;
    }
    const { data } = await db
      .from("events")
      .select(
        "id,organization_id,audience,category,title,summary,details,service_area,is_online,starts_at,ends_at,status,published_at,created_at,image_path",
      )
      .eq("created_by", session.user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    setMyEvents((data as PublicEvent[]) ?? []);
  }, [session]);

  useEffect(() => {
    void loadMyEvents();
  }, [loadMyEvents]);

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
    const fields = {
      organization_id: form.organizationId || null,
      audience: form.audience,
      category: form.category,
      title: form.title.trim(),
      summary: form.summary.trim(),
      service_area: form.serviceArea.trim() || null,
      is_online: form.isOnline,
      starts_at: form.startsAt || null,
      ends_at: form.endsAt || null,
      image_path: form.imagePath || null,
    };
    const { data: inserted, error } = editingId
      ? await db
          .from("events")
          .update(fields)
          .eq("id", editingId)
          .select("id")
          .maybeSingle()
      : await db
          .from("events")
          .insert({ ...fields, created_by: session.user.id })
          .select("id")
          .single();
    setSubmitting(false);
    if (error) {
      setStatus(
        editingId
          ? "We could not save those changes. Please try again."
          : "We could not create that event. Please try again.",
      );
      return;
    }
    setStatus(
      editingId
        ? "Saved. This did not change whether the event is published."
        : "Saved as a draft. Use Publish below to make it public.",
    );
    if (!editingId && inserted?.id) {
      setForm((current) => ({ ...current, title: "", summary: "" }));
      setEditingId(inserted.id);
    }
    void load();
    void loadMyEvents();
  }

  async function publishEvent(item: PublicEvent) {
    if (!db || publishBusyId) return;
    setPublishBusyId(item.id);
    const { error } = await db
      .from("events")
      .update({
        status: "active",
        published_at: item.published_at ?? new Date().toISOString(),
      })
      .eq("id", item.id);
    setPublishBusyId(null);
    setStatus(
      error
        ? "We could not publish that event. Please try again."
        : "Published. It now appears in the public Events listing.",
    );
    void load();
    void loadMyEvents();
  }

  async function unpublishEvent(item: PublicEvent) {
    if (!db || publishBusyId) return;
    if (!window.confirm("Take this event off the public Events listing?")) {
      return;
    }
    setPublishBusyId(item.id);
    const { error } = await db
      .from("events")
      .update({ status: "suspended" })
      .eq("id", item.id);
    setPublishBusyId(null);
    setStatus(
      error
        ? "We could not update that event. Please try again."
        : "Unpublished. It no longer appears in the public Events listing.",
    );
    void load();
    void loadMyEvents();
  }

  async function removeEvent(item: PublicEvent) {
    if (!db || publishBusyId) return;
    const isDraft = item.status !== "active";
    if (
      !window.confirm(
        isDraft
          ? "Delete this draft event? This cannot be undone."
          : "Remove this event? It will immediately come off the public Events listing.",
      )
    ) {
      return;
    }
    setPublishBusyId(item.id);
    const { data, error } = await db.rpc("remove_event", {
      p_event_id: item.id,
    });
    setPublishBusyId(null);
    if (error) {
      setStatus("We could not remove that event. Please try again.");
      return;
    }
    setStatus(
      data === "deleted"
        ? "Deleted."
        : "Removed. It no longer appears in the public Events listing, and its attendance history is preserved.",
    );
    if (editingId === item.id) {
      setEditingId(null);
      setShowForm(false);
    }
    void load();
    void loadMyEvents();
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
                onClick={() => {
                  if (showForm) {
                    setShowForm(false);
                    setEditingId(null);
                  } else {
                    startCreate();
                  }
                }}
              >
                <Plus /> {showForm ? "Close" : "Add an event"}
              </button>
            )}
          </div>

          {session && status && (
            <p className="evStatus" role="status" aria-live="polite">
              {status}
            </p>
          )}

          {showForm && session && (
            <form className="evForm" onSubmit={submit}>
              <h2>{editingId ? "Edit event" : "Add an event"}</h2>
              <div className="evFormGrid">
                <label>
                  <span>
                    Who is it for?
                    <span
                      className="fieldHelp"
                      role="img"
                      aria-label="Audience help: choose pet for pet-centered events, human for music and community events, or both when both audiences are welcome."
                      title="Choose pet for pet-centered events, human for music and community events, or both when both audiences are welcome."
                    >
                      ?
                    </span>
                  </span>
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
                  <span>
                    Hosting organization
                    <span
                      className="fieldHelp"
                      role="img"
                      aria-label="Hosting organization help: select your organization when it hosts the event; leave this blank for a community event."
                      title="Select your organization when it hosts the event; leave this blank for a community event."
                    >
                      ?
                    </span>
                  </span>
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
                <label className="fields-wide">
                  Cover photo
                  <MediaUpload
                    ownerId={form.organizationId || session?.user.id || ""}
                    recordId={editingId ?? ""}
                    value={form.imagePath}
                    onChange={(path) =>
                      setForm((current) => ({ ...current, imagePath: path }))
                    }
                  />
                </label>
              </div>
              <button className="evSubmit" disabled={submitting}>
                {submitting
                  ? "Saving…"
                  : editingId
                    ? "Save changes"
                    : "Save event"}
              </button>
            </form>
          )}

          {session && myEvents.length > 0 && (
            <section className="evDrafts" aria-labelledby="my-events">
              <h2 id="my-events">Your events</h2>
              <p>
                Drafts are saved but not public. Publish one to add it to the
                listing below; you can edit or unpublish it at any time.
              </p>
              <ul>
                {myEvents.map((item) => {
                  const isPublished = item.status === "active";
                  return (
                    <li key={item.id} className="evMyEvent">
                      <div className="evMyEventInfo">
                        <span
                          className={
                            isPublished
                              ? "evStatusBadge evStatusBadgeLive"
                              : "evStatusBadge"
                          }
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>
                        <strong>{item.title}</strong>
                        <span>{item.category}</span>
                      </div>
                      <div className="evMyEventActions">
                        <button
                          type="button"
                          className="evEditButton"
                          onClick={() => startEdit(item)}
                        >
                          <Pencil aria-hidden="true" /> Edit
                        </button>
                        {isPublished ? (
                          <button
                            type="button"
                            className="evUnpublishButton"
                            disabled={publishBusyId === item.id}
                            onClick={() => void unpublishEvent(item)}
                          >
                            {publishBusyId === item.id
                              ? "Working…"
                              : "Unpublish"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="evPublishButton"
                            disabled={publishBusyId === item.id}
                            onClick={() => void publishEvent(item)}
                          >
                            {publishBusyId === item.id ? "Working…" : "Publish"}
                          </button>
                        )}
                        <button
                          type="button"
                          className="evDeleteButton"
                          disabled={publishBusyId === item.id}
                          onClick={() => void removeEvent(item)}
                        >
                          {publishBusyId === item.id
                            ? "Working…"
                            : isPublished
                              ? "Delete/Remove"
                              : "Delete"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {loading ? (
            <LoadingState>Loading events…</LoadingState>
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
                  {mediaPublicUrl(item.image_path) && (
                    <img
                      className="evCardPhoto"
                      src={mediaPublicUrl(item.image_path)}
                      alt=""
                      loading="lazy"
                    />
                  )}
                  <span className="evCardTags">
                    <em>{eventAudienceLabels[item.audience]}</em>
                    <span>{item.category}</span>
                  </span>
                  <h2>
                    <Link to={`/events/${item.id}`}>{item.title}</Link>
                  </h2>
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
