import { useEffect, useState } from "react";
import "./BackToTop.css";

const SHOW_AFTER_PX = 480;

/**
 * A single global back-to-top button, mounted once at the app shell level so
 * it follows the visitor across every route rather than being rebuilt per
 * page. Long pages (marketplace results, events, the FAQ, dashboards) had no
 * way back up except scrolling by hand.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  function handleClick() {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
    document.getElementById("main")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      className="backToTop"
      onClick={handleClick}
      aria-label="Back to top"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
