import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="section shell notFoundPage">
      <Compass aria-hidden="true" />
      <span className="eyebrow">Page not found</span>
      <h1>That trail does not lead anywhere yet.</h1>
      <p className="lead">
        The link may be old, or the page may have moved. Start from the home
        page or browse the resources that are available now.
      </p>
      <div className="actions">
        <Link className="btn" to="/">
          Go home
        </Link>
        <Link className="btn quiet" to="/learn">
          Explore resources
        </Link>
      </div>
    </section>
  );
}
