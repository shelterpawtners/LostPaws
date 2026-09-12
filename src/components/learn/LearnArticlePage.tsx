import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { findLearnArticle, learnArticles } from "../../lib/learn-content";
import "./Learn.css";

export function LearnArticlePage() {
  const { slug } = useParams();
  const article = findLearnArticle(slug);
  if (!article) return <Navigate to="/learn" replace />;

  const related = article.related
    .map((relatedSlug) => findLearnArticle(relatedSlug))
    .filter((item): item is (typeof learnArticles)[number] => Boolean(item));

  return (
    <div className="learnPage">
      <article className="learnArticle">
        <div className="learnWrap">
          <Link className="learnBack" to="/learn">
            <ArrowLeft /> All topics
          </Link>
          <span className="learnAudienceTag">{article.audience}</span>
          <h1>{article.title}</h1>
          <p className="learnLead">{article.summary}</p>

          <ol className="learnSteps">
            {article.steps.map((step) => (
              <li key={step.heading}>
                <h2>{step.heading}</h2>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>

          {article.cta && (
            <Link className="learnButton" to={article.cta.to}>
              {article.cta.label} <ArrowRight />
            </Link>
          )}

          {related.length > 0 && (
            <section className="learnRelated" aria-labelledby="learn-related">
              <h2 id="learn-related">Related topics</h2>
              <ul>
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link to={`/learn/${item.slug}`}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="learnUpdated">Last updated {article.lastUpdated}</p>
        </div>
      </article>
    </div>
  );
}
