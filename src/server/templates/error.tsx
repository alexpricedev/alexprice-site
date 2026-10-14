import { ErrorLayout } from "@server/components/layouts";
import { SITE_NAME } from "@server/services/seo";

interface ErrorPageProps {
  status: number;
  heading: string;
  message: string;
  // The 503 maintenance page has nowhere to send anyone — every route is
  // offline — so it drops the home button.
  showHome?: boolean;
}

// A plain-language error page: the status, a human heading, an explanation that
// never leaks implementation details, and a way forward. Rendered without any
// client JS via ErrorLayout.
export const ErrorPage = ({
  status,
  heading,
  message,
  showHome = true,
}: ErrorPageProps) => (
  <ErrorLayout title={`${heading} · ${SITE_NAME}`}>
    <section className="error-page">
      <p className="error-status">{status}</p>
      <h1>{heading}</h1>
      <p className="lead">{message}</p>
      {showHome && (
        <p className="error-actions">
          <a className="btn primary" href="/">
            Back to homepage
          </a>
        </p>
      )}
    </section>
  </ErrorLayout>
);
