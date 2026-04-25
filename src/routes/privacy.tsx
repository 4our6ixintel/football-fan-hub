import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SimpleBetHub" },
      { name: "description", content: "How SimpleBetHub collects, uses and protects your personal data." },
      { property: "og:title", content: "Privacy Policy — SimpleBetHub" },
      { property: "og:description", content: "How we handle your data at SimpleBetHub." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-invert mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">1. Information We Collect</h2>
          <p>We collect information you provide when creating an account (email, username), payment data processed by our payment partners, and usage data (pages visited, predictions viewed) to improve our service.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">2. How We Use Your Data</h2>
          <p>To deliver predictions and tips, process VIP subscriptions, send service emails, prevent fraud, and comply with legal obligations. We never sell your personal data to third parties.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">3. Cookies</h2>
          <p>We use essential cookies for authentication and analytics cookies (anonymized) to understand site usage. You can disable non-essential cookies in your browser.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">4. Data Security</h2>
          <p>Passwords are hashed. Payments are processed by PCI-DSS compliant providers. We use HTTPS everywhere.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">5. Your Rights</h2>
          <p>You may request access, correction or deletion of your data at any time by emailing <a href="mailto:privacy@simplebethub.com" className="text-primary">privacy@simplebethub.com</a>.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">6. Age Restriction</h2>
          <p>SimpleBetHub is for users 18 years and older. We do not knowingly collect data from minors.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-foreground mb-2">7. Changes</h2>
          <p>We may update this policy. Material changes will be announced on the site.</p>
        </section>
      </div>
    </div>
  );
}
