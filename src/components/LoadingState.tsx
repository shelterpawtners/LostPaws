import "./LoadingState.css";

/**
 * Shared in-page loading indicator (spinner + message) for the many
 * components that fetch data on mount. Before this, most of them rendered a
 * bare "Loading…" line with no motion, so a slow connection looked frozen
 * rather than working. Mirrors the spinner already used on the marketplace.
 */
export function LoadingState({ children }: { children: React.ReactNode }) {
  return (
    <p className="loadingState" role="status">
      <span className="loadingStateSpinner" aria-hidden="true" />
      {children}
    </p>
  );
}
