import { useRouteError } from "react-router";
import { ErrorFallback } from "./ErrorBoundary";

/**
 * Designed to be used as `errorElement` on React Router routes.
 *
 * React Router catches errors thrown during route loading (including
 * lazy chunk imports) and surfaces them via `useRouteError()`.
 * This component renders the same polished fallback UI used by the
 * class-based ErrorBoundary.
 */
export default function RouteErrorFallback() {
  const error = useRouteError();

  // Log so developers can still debug in the console
  console.error("[RouteErrorFallback]", error);

  return <ErrorFallback error={error} isRouteError />;
}
