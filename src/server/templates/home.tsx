import { Flash } from "@server/components/flash";
import { Layout } from "@server/components/layouts";
import type { User } from "@server/services/users";
import type { FlashMessage } from "@server/utils/flash";

interface HomeProps {
  user: User | null;
  csrfToken?: string;
  // Guards that turn someone away redirect here and leave their reason in the
  // "message" flash, and so do the flows that finish elsewhere — accepting an
  // invitation lands here. Rendering it is what makes requireAdmin and
  // requireOrgRole say anything at all — without this the user lands on the
  // homepage with no idea why, which is the "announce dynamic updates" rule in
  // runbooks/ACCESSIBILITY.md going unmet. The writer picks the type: a guard's
  // refusal and "You've joined Acme" both arrive on this key.
  message?: FlashMessage;
}

export const Home = ({ user, csrfToken, message }: HomeProps) => (
  <Layout
    title="Alex Price"
    description="The personal site of Alex Price."
    canonicalPath="/"
    name="home"
    user={user}
    csrfToken={csrfToken}
  >
    {message && (
      <Flash type={message.type}>
        <span>{message.text}</span>
      </Flash>
    )}

    <section className="hero">
      <h1>Alex Price</h1>
      <p>The personal site of Alex Price.</p>
    </section>
  </Layout>
);
