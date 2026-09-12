import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, HelpCircle } from "lucide-react";
import {
  faqEntries,
  type LearnAudience,
  learnArticles,
} from "../../lib/learn-content";
import "./Learn.css";

const audienceOrder: (LearnAudience | "All")[] = [
  "All",
  "Guardians",
  "Vendors and businesses",
  "Shelters and rescues",
  "Everyone",
];

export function FaqPage() {
  const [audience, setAudience] = useState<LearnAudience | "All">("All");
  const visible = useMemo(
    () =>
      audience === "All"
        ? faqEntries
        : faqEntries.filter((entry) => entry.audience === audience),
    [audience],
  );

  return (
    <div className="learnPage">
      <section className="learnHero">
        <div className="learnWrap">
          <span className="learnEyebrow">
            <HelpCircle /> FAQ
          </span>
          <h1>Questions we would rather answer up front.</h1>
          <p className="learnLead">
            Including what things cost, what is not built yet, and what we will
            not claim.
          </p>
        </div>
      </section>

      <section className="learnFaqSection">
        <div className="learnWrap">
          <div
            className="learnFaqFilters"
            role="group"
            aria-label="Filter questions by audience"
          >
            {audienceOrder.map((option) => (
              <button
                type="button"
                key={option}
                className={audience === option ? "active" : ""}
                aria-pressed={audience === option}
                onClick={() => setAudience(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <dl className="learnFaqList">
            {visible.map((entry) => (
              <div className="learnFaqItem" key={entry.question}>
                <dt>{entry.question}</dt>
                <dd>{entry.answer}</dd>
              </div>
            ))}
          </dl>

          {visible.length === 0 && (
            <p className="learnFaqEmpty">
              No questions are filed under this audience yet.
            </p>
          )}
        </div>
      </section>

      <section className="learnIndexSection" aria-labelledby="faq-more">
        <div className="learnWrap">
          <h2 id="faq-more">Read more</h2>
          <div className="learnIndexGrid">
            {learnArticles.slice(0, 4).map((article) => (
              <Link
                className="learnIndexCard"
                key={article.slug}
                to={`/learn/${article.slug}`}
              >
                <span className="learnAudienceTag">{article.audience}</span>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <span className="learnIndexMore">
                  Read this <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
