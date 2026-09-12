import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Puts each new page at the top and moves focus into it.
 *
 * React Router keeps the window's scroll position across route changes, so
 * following a footer link while scrolled to the bottom landed the visitor on
 * the next page already scrolled past its heading, and they had to scroll up
 * themselves.
 *
 * Deliberate exceptions, so this helps rather than fights the visitor:
 *   - A hash link (`/learn/passport#steps`) is an explicit request for a spot
 *     partway down a page, so it is honoured instead of overridden.
 *   - Back and forward should return you where you were, so only pushed
 *     navigations reset.
 *   - A query-string change is a filter on the page you are already reading —
 *     the marketplace audience buttons, for instance — so it must not yank
 *     you to the top mid-interaction.
 *
 * Focus moves to the #main landmark as well as scrolling, because a keyboard
 * or screen-reader user is otherwise left where the old page had them.
 */
export function RouteFocus() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const samePage = previousPath.current === pathname;
    previousPath.current = pathname;

    // A query-only change (filters, audience choice) is not a new page.
    if (samePage) return;
    // Let the browser restore position on back/forward.
    if (navigationType === "POP") return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "auto";

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior, block: "start" });
        if (target instanceof HTMLElement) {
          if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
          target.focus({ preventScroll: true });
        }
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior });
    const main = document.getElementById("main");
    if (main) main.focus({ preventScroll: true });
  }, [pathname, hash, navigationType]);

  return null;
}
