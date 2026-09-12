import type { ReactNode } from "react";

type LegalPolicyShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  status?: "draft" | "published";
};

export function LegalPolicyShell({
  eyebrow,
  title,
  intro,
  children,
  status = "draft",
}: LegalPolicyShellProps) {
  return (
    <section className="section shell formPage legalPolicyPage">
      <div className="panel">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {status === "draft" && (
          <p className="legalPolicyStatus" role="note">
            Pre-launch draft. This policy is not yet approved for publication.
          </p>
        )}
        <p className="lead">{intro}</p>
        <div className="legalPolicyBody">{children}</div>
      </div>
    </section>
  );
}
