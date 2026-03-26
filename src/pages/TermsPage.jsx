import Section from '../components/Section.jsx';

export default function TermsPage() {
  return (
    <div style={{ paddingTop: 90 }}>
      <Section>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>Terms of Service</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 48 }}>Last updated: March 26, 2026</p>

        <div style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.8, maxWidth: 720 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, marginTop: 0 }}>1. Acceptance of Terms</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            By accessing or using Clavira Finance ("Clavira," "we," "our"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>2. Description of Service</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Clavira provides AI-powered credit card management tools including debt payoff calculators, rewards optimization, credit score monitoring, and an AI financial assistant. Our tools are designed to help you make better financial decisions, but they do not constitute financial advice.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>3. Not Financial Advice</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Clavira is an educational and informational tool. The information provided by our platform, including our AI assistant, should not be considered as professional financial, investment, tax, or legal advice. Always consult with a qualified financial advisor before making financial decisions. We are not responsible for any financial decisions you make based on our tools.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>4. User Accounts & Waitlist</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            When you join our waitlist or create an account, you agree to provide accurate information. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use Clavira.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>5. Acceptable Use</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            You agree not to: use Clavira for any unlawful purpose, attempt to gain unauthorized access to our systems, interfere with or disrupt our services, submit false or misleading information, use automated tools to scrape or extract data from our platform, or reverse engineer our algorithms or AI systems.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>6. Subscription Plans</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Clavira offers Free, Premium, and Business subscription tiers. Paid subscriptions are billed monthly. You may cancel your subscription at any time. Refunds are provided in accordance with our refund policy. We reserve the right to modify pricing with 30 days notice to existing subscribers.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>7. Intellectual Property</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            All content, features, and functionality of Clavira — including text, graphics, logos, algorithms, and software — are owned by Clavira Finance, Inc. and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>8. Limitation of Liability</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            Clavira Finance shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services. Our total liability shall not exceed the amount paid by you to Clavira in the twelve months preceding the claim.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>9. Data Accuracy</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            While we strive for accuracy, we do not guarantee that all calculations, projections, or recommendations are error-free. Financial calculations are based on the information you provide and standard mathematical models. Actual results may vary based on factors not accounted for by our tools.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>10. Modifications</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            We reserve the right to modify these terms at any time. Material changes will be communicated via email to registered users. Your continued use of Clavira after modifications constitutes acceptance of the updated terms.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>11. Termination</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            We may suspend or terminate your access to Clavira at any time for violations of these terms or for any other reason at our sole discretion. You may terminate your account at any time by contacting support@clavirafinance.com.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>12. Governing Law</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            These terms shall be governed by the laws of the State of Delaware, United States, without regard to conflict of law provisions.
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>13. Contact</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
            For questions about these terms, contact us at:<br />
            Email: support@clavirafinance.com<br />
            Clavira Finance, Inc.
          </p>
        </div>
      </Section>
    </div>
  );
}
