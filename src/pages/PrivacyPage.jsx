import Section from '../components/Section.jsx';

export default function PrivacyPage() {
  return (
    <div style={{ paddingTop: 90 }}>
      <Section>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 48 }}>Last updated: March 26, 2026</p>

        <div style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.8, maxWidth: 720 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, marginTop: 0 }}>1. Information We Collect</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            When you use Clavira, we collect information you provide directly: your email address when joining our waitlist, your name and message when contacting us, and any financial data you choose to input into our calculator tools. We do not collect or store credit card numbers, bank account numbers, or social security numbers.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>2. How We Use Your Information</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            We use your information to: provide and improve our services, send you updates about Clavira (only if you've opted in via the waitlist), respond to your inquiries, and analyze usage patterns to improve user experience. We never sell your personal data to third parties.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>3. Data Security</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            We implement industry-standard security measures including 256-bit AES encryption, secure HTTPS connections, and access controls. Financial calculations are processed in real-time and are not stored on our servers. Our AI assistant conversations are not stored permanently.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>4. Third-Party Services</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            We use trusted third-party services for hosting (Vercel, Render), email delivery (SMTP), and AI processing (Anthropic). These providers are bound by their own privacy policies and data protection agreements. We do not share your personal data with advertisers.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>5. Cookies & Tracking</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Clavira uses minimal cookies necessary for the website to function. We do not use advertising cookies or third-party tracking pixels. We may use anonymous analytics to understand how users interact with our platform.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>6. Your Rights</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            You have the right to: access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, opt out of marketing communications, and export your data. To exercise these rights, contact us at support@clavirafinance.com.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>7. Data Retention</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Waitlist and contact information is retained until you request deletion or until it is no longer needed for its original purpose. You can request deletion at any time by emailing support@clavirafinance.com.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>8. Children's Privacy</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Clavira is not intended for use by individuals under 18 years of age. We do not knowingly collect information from children.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>9. Changes to This Policy</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            We may update this privacy policy from time to time. We will notify registered users of significant changes via email. Continued use of Clavira after changes constitutes acceptance of the updated policy.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>10. Contact Us</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            For privacy-related questions or requests, contact us at:<br />
            Email: support@clavirafinance.com<br />
            Clavira Finance, Inc.
          </p>
        </div>
      </Section>
    </div>
  );
}
