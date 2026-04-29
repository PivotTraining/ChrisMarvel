export default function Support() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#0A0E1A',
        color: '#E5E7EB',
        padding: '40px 24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
          Court<span style={{ color: '#FF6B35' }}>IQ</span> Support
        </h1>
        <p style={{ color: '#9CA3AF', marginBottom: '32px' }}>
          We're here to help you get the most out of CourtIQ.
        </p>

        <Section title="Contact Us">
          <p>For questions, feedback, or issues, email us at:</p>
          <a
            href="mailto:support@getcourtiq.com"
            style={{ color: '#FF6B35', fontWeight: 700, textDecoration: 'none' }}
          >
            support@getcourtiq.com
          </a>
          <p style={{ marginTop: '12px', color: '#9CA3AF' }}>
            We typically respond within 24 hours.
          </p>
        </Section>

        <Section title="Frequently Asked Questions">
          <FAQ
            q="How do I track a game?"
            a="Tap Gametime from the home screen or bottom nav. Tap the court to log shots, and use the stat buttons below for assists, rebounds, steals, blocks, turnovers, and fouls. Tap Save when the game is done."
          />
          <FAQ
            q="Where is my data stored?"
            a="Your data is stored locally on your device and synced to our secure cloud servers when you're online. Your stats are never lost, even without internet access."
          />
          <FAQ
            q="How do I export my stats?"
            a="Go to Settings and scroll to the Export Data section. You can export your games, drills, and journal entries as CSV files, or generate a printable stat sheet."
          />
          <FAQ
            q="How do I delete my account?"
            a="Go to Settings, scroll to the Danger Zone section, and tap Erase Profile. This permanently deletes all your data and signs you out."
          />
          <FAQ
            q="What is CourtIQ Pro?"
            a="CourtIQ Pro unlocks advanced features including structured training programs, practice mode, and AI coaching insights."
          />
        </Section>

        <Section title="System Requirements">
          <p>CourtIQ requires iOS 15.0 or later. The app works on iPhone and iPad.</p>
        </Section>

        <Section title="Privacy">
          <p>
            We take your privacy seriously. CourtIQ collects only the data you
            provide (game stats, drill logs, journal entries) and uses it solely
            to power your player dashboard. We do not sell your data to third
            parties. For full details, see our{' '}
            <a
              href="/privacy"
              style={{ color: '#FF6B35', textDecoration: 'none' }}
            >
              Privacy Policy
            </a>.
          </p>
        </Section>

        <p style={{ marginTop: '40px', color: '#6B7280', fontSize: '13px', textAlign: 'center' }}>
          CourtIQ v1.0 · Pivot Training LLC
        </p>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: '#F3F4F6' }}>
        {title}
      </h2>
      <div style={{ color: '#D1D5DB', lineHeight: '1.6', fontSize: '15px' }}>
        {children}
      </div>
    </div>
  )
}

function FAQ({ q, a }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontWeight: 700, color: '#F3F4F6', marginBottom: '4px' }}>{q}</p>
      <p style={{ color: '#9CA3AF', margin: 0 }}>{a}</p>
    </div>
  )
}
