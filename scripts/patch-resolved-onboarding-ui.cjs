const fs = require("node:fs");

const path = "src/main.tsx";
let text = fs.readFileSync(path, "utf8");

function replaceOnce(oldText, newText, label) {
  const first = text.indexOf(oldText);
  if (first < 0 || text.indexOf(oldText, first + oldText.length) >= 0) {
    throw new Error(`Expected exactly one match for ${label}`);
  }
  text = text.replace(oldText, newText);
}

replaceOnce(
  `  const [draftId, setDraftId] = useState("");
  const [status, setStatus] = useState("");`,
  `  const [draftId, setDraftId] = useState("");
  const [resolvedOrganizationId, setResolvedOrganizationId] = useState("");
  const [status, setStatus] = useState("");`,
  "resolved organization state",
);

replaceOnce(
  `  async function saveDraft() {
    if (!db || !session) return "";
    const { data, error } = await db`,
  `  async function saveDraft() {
    if (!db || !session) return "";
    if (resolvedOrganizationId && draftId) {
      setStatus("This onboarding is already linked to an organization.");
      return draftId;
    }
    const { data, error } = await db`,
  "resolved draft save guard",
);

replaceOnce(
  `    db.from("organization_onboarding_drafts")
      .select("id, form_data")
      .eq("created_by", session.user.id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) return;
        setDraftId(data.id);
        if (data.form_data && Object.keys(data.form_data).length)
          setForm((current) => ({
            ...current,
            ...(data.form_data as PartnerForm),
          }));`,
  `    db.from("organization_onboarding_drafts")
      .select("id, form_data, status, resolved_organization_id")
      .eq("created_by", session.user.id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) return;
        setDraftId(data.id);
        if (
          (data.status === "resolved_new" || data.status === "resolved_existing") &&
          data.resolved_organization_id
        ) {
          setResolvedOrganizationId(data.resolved_organization_id);
          setStatus("This onboarding is already linked to an organization.");
        }
        if (data.form_data && Object.keys(data.form_data).length)
          setForm((current) => ({
            ...current,
            ...(data.form_data as PartnerForm),
          }));`,
  "resolved draft load",
);

replaceOnce(
  `  const visibleMatches = matches.filter(
    (item) => !dismissed.includes(item.organization_id),
  );
  return (
    <Page>
      <section className="section shell partnerOnboarding">`,
  `  const visibleMatches = matches.filter(
    (item) => !dismissed.includes(item.organization_id),
  );
  if (resolvedOrganizationId) {
    return (
      <Page>
        <section className="section shell narrow">
          <span className="eyebrow">{choice.title} setup</span>
          <h1>This onboarding is already complete.</h1>
          <p className="lead">
            Your saved onboarding is already linked to an organization. Continue
            to your business profile instead of creating a duplicate entry.
          </p>
          <button className="btn" onClick={() => navigate("/business")}>
            Continue to business profile
          </button>
          <p role="status" aria-live="polite" aria-atomic="true">
            {status}
          </p>
        </section>
      </Page>
    );
  }
  return (
    <Page>
      <section className="section shell partnerOnboarding">`,
  "resolved onboarding completion view",
);

fs.writeFileSync(path, text);
