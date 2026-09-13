import { useEffect, useState } from "react";
import { HandHeart, ShieldCheck } from "lucide-react";
import { supabase as db } from "../../lib/supabase";
import "./Giving.css";

type CommitmentKind =
  | "fixed_per_redemption"
  | "percent_of_paid_amount"
  | "recurring"
  | "one_time_campaign";

type Commitment = {
  id: string;
  commitment_kind: CommitmentKind;
  amount_minor: number | null;
  percentage_bps: number | null;
  cadence: string | null;
  status: string;
  designated_recipient_organization_id: string | null;
};

type Recipient = { id: string; public_name: string };

type ImpactSummary = {
  participation_state: string;
  confirmed_redemptions: number;
  verified_settlement_count: number;
  verified_settlement_amounts: Record<string, number>;
};

function formatMinor(minor: number, currency: string) {
  return (minor / 100).toLocaleString(undefined, {
    style: "currency",
    currency,
  });
}

/**
 * Every table and RPC this panel calls already existed before this session —
 * partner_contribution_commitments, partner_contribution_settlement_evidence,
 * public_partner_impact_summary, and their security-checked functions were
 * built in Phase 2 Checkpoint 6 and never given a UI. See
 * docs/product/DONATION-TRACKING-SCHEMA-PROPOSAL.md. Nothing here moves real
 * money: a commitment is a pledge, and evidence is a business's claim of a
 * payment it made off-platform, which only counts publicly once a platform
 * admin verifies it.
 */
export function PartnerGivingPanel({
  organizationId,
}: {
  organizationId: string;
}) {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const [kind, setKind] = useState<CommitmentKind>("percent_of_paid_amount");
  const [percent, setPercent] = useState("5");
  const [amount, setAmount] = useState("");
  const [recipientId, setRecipientId] = useState("");

  async function load() {
    if (!db) return;
    setLoading(true);
    const [{ data: c }, { data: r }, { data: s }] = await Promise.all([
      db
        .from("partner_contribution_commitments")
        .select(
          "id,commitment_kind,amount_minor,percentage_bps,cadence,status,designated_recipient_organization_id",
        )
        .eq("partner_organization_id", organizationId)
        .order("created_at", { ascending: false }),
      db
        .from("organizations")
        .select("id,public_name")
        .eq("status", "active")
        .in("organization_type_code", ["shelter", "rescue"])
        .order("public_name")
        .limit(200),
      db.rpc("public_partner_impact_summary", {
        p_organization_id: organizationId,
      }),
    ]);
    setCommitments((c as Commitment[]) ?? []);
    setRecipients((r as Recipient[]) ?? []);
    setSummary((s as ImpactSummary) ?? null);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  async function createCommitment(event: React.FormEvent) {
    event.preventDefault();
    if (!db || saving) return;
    setSaving(true);
    setStatus("");
    const terms: Record<string, unknown> = {
      commitment_kind: kind,
      designated_recipient_organization_id: recipientId || null,
    };
    if (kind === "percent_of_paid_amount") {
      const bps = Math.round(Number(percent) * 100);
      terms.percentage_bps = bps;
    } else {
      terms.amount_minor = Math.round(Number(amount) * 100);
      if (kind === "recurring") terms.cadence = "monthly";
    }
    const { error } = await db.rpc("create_partner_contribution_commitment", {
      p_organization_id: organizationId,
      p_terms: terms,
    });
    setSaving(false);
    if (error) {
      setStatus(
        "We could not save that commitment. Check the amount or percentage and try again.",
      );
      return;
    }
    setStatus("Commitment saved. Activate it below when you are ready.");
    setAmount("");
    void load();
  }

  async function activate(id: string) {
    if (!db) return;
    await db.rpc("set_partner_contribution_commitment_state", {
      p_commitment_id: id,
      p_state: "active",
    });
    void load();
  }

  if (loading) return <p role="status">Loading your giving details…</p>;

  return (
    <section className="givingPanel" aria-labelledby="giving-panel-title">
      <h2 id="giving-panel-title">
        <HandHeart aria-hidden="true" /> Giving and impact
      </h2>
      <p className="givingPanelLead">
        Optional. Committing a share of eligible sales to a shelter is never
        required to publish or manage your offers.
      </p>

      {summary && (
        <div className="givingSummary">
          <span className="givingSummaryTier">
            {summary.participation_state}
          </span>
          <span>{summary.confirmed_redemptions} confirmed redemptions</span>
          <span>
            {summary.verified_settlement_count} admin-verified contribution
            {summary.verified_settlement_count === 1 ? "" : "s"}
            {Object.entries(summary.verified_settlement_amounts).length > 0 &&
              " — " +
                Object.entries(summary.verified_settlement_amounts)
                  .map(([currency, minor]) => formatMinor(minor, currency))
                  .join(", ")}
          </span>
        </div>
      )}

      <p className="givingNotice">
        <ShieldCheck aria-hidden="true" />
        <span>
          We do not hold or move this money. A commitment here is a pledge; an
          actual payment you make to a shelter is recorded as evidence below,
          and only counts toward your public total once a platform admin
          verifies it. <a href="/learn/giving">How giving works</a>
        </span>
      </p>

      {commitments.length > 0 && (
        <ul className="givingCommitmentList">
          {commitments.map((c) => (
            <li key={c.id}>
              <span>
                {c.commitment_kind === "percent_of_paid_amount"
                  ? `${((c.percentage_bps ?? 0) / 100).toFixed(1)}% of eligible sales`
                  : c.amount_minor
                    ? formatMinor(c.amount_minor, "USD")
                    : c.commitment_kind}
              </span>
              <em className={`givingStatus givingStatus-${c.status}`}>
                {c.status}
              </em>
              {c.status === "draft" && (
                <button type="button" onClick={() => activate(c.id)}>
                  Activate
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form className="givingForm" onSubmit={createCommitment}>
        <h3>Make a new commitment</h3>
        <div className="givingFormGrid">
          <label>
            <span>Type</span>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as CommitmentKind)}
            >
              <option value="percent_of_paid_amount">
                Percent of eligible sales
              </option>
              <option value="fixed_per_redemption">
                Fixed amount per redemption
              </option>
              <option value="one_time_campaign">One-time campaign gift</option>
              <option value="recurring">Recurring monthly gift</option>
            </select>
          </label>
          {kind === "percent_of_paid_amount" ? (
            <label>
              <span>Percent (5% or more qualifies for Hero Vendor)</span>
              <input
                type="number"
                min="0.01"
                max="100"
                step="0.01"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
              />
            </label>
          ) : (
            <label>
              <span>Amount (USD)</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
          )}
          <label>
            <span>Recipient shelter or rescue</span>
            <select
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
            >
              <option value="">Not designated yet</option>
              {recipients.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.public_name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="givingSubmit" disabled={saving}>
          {saving ? "Saving…" : "Save commitment"}
        </button>
        <p className="givingStatusLine" role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </section>
  );
}
