import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, HelpCircle } from "lucide-react";
import { learnArticles } from "../../lib/learn-content";
import { ExplainerTiles } from "./ExplainerTiles";
import "./Learn.css";

export function LearnHub() {
  // Counted from the content itself so the panel cannot drift out of date.
  const audiences = [
    ...learnArticles
      .reduce((counts, article) => {
        counts.set(article.audience, (counts.get(article.audience) ?? 0) + 1);
        return counts;
      }, new Map<string, number>())
      .entries(),
  ];

  return (
    <div className="learnPage">
      <section className="learnHero">
        <div className="learnWrap learnHeroGrid">
          <div>
            <span className="learnEyebrow">
              <BookOpen /> Learn
            </span>
            <h1>Understand how this works before you commit to anything.</h1>
            <p className="learnLead">
              Plain explanations of the Passport, the two marketplaces, events,
              and how business-funded shelter support is meant to work —
              including what is still being built.
            </p>
            <Link className="learnButton" to="/faq">
              Jump to the FAQ <ArrowRight />
            </Link>
          </div>
          <aside className="learnHeroPanel" aria-label="What is covered here">
            <p className="learnHeroPanelTitle">Written for</p>
            <ul>
              {audiences.map(([audience, count]) => (
                <li key={audience}>
                  <span>{audience}</span>
                  <b>
                    {count} {count === 1 ? "topic" : "topics"}
                  </b>
                </li>
              ))}
            </ul>
            <p className="learnHeroPanelNote">
              Every topic says plainly what is live today and what is still
              planned.
            </p>
          </aside>
        </div>
      </section>

      <ExplainerTiles />

      <section className="learnIndexSection" aria-labelledby="learn-index">
        <div className="learnWrap">
          <h2 id="learn-index">Topics</h2>
          <div className="learnIndexGrid">
            {learnArticles.map((article) => (
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

      <section className="learnFaqTeaser" aria-labelledby="learn-faq-teaser">
        <div className="learnWrap learnFaqTeaserInner">
          <div>
            <span className="learnEyebrow">
              <HelpCircle /> Still have questions?
            </span>
            <h2 id="learn-faq-teaser">
              Straight answers, including the uncomfortable ones.
            </h2>
            <p>
              What things cost, what is not built yet, what we will not claim,
              and why LostPaws is independent of the festivals its community
              loves.
            </p>
          </div>
          <Link className="learnButton" to="/faq">
            Read the FAQ <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
