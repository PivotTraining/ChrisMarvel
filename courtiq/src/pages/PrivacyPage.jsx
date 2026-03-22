import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'

export default function PrivacyPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-primary">
      <PageShell>
        <article className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <SectionHeader title="Privacy Policy" subtitle="CourtIQ Basketball Training" />
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center">
              <Shield size={28} className="text-success" />
            </div>
          </div>

          <p className="text-xs text-text-muted text-center">
            Last updated: March 1, 2026
          </p>

          {/* Content */}
          <div className="space-y-8 text-sm text-text-secondary leading-relaxed">

            <p>
              At CourtIQ, your privacy is fundamental to everything we build. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our basketball training and analytics platform ("the Service").
            </p>

            {/* 1. Information We Collect */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">1. Information We Collect</h2>

              <h3 className="text-sm font-semibold text-text-primary mt-4 mb-2">Account Information</h3>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                <li>Email address and password (encrypted)</li>
                <li>Display name, profile photo, and biography</li>
                <li>Position, skill level, height, weight, and dominant hand</li>
                <li>Team affiliations and coaching roles</li>
              </ul>

              <h3 className="text-sm font-semibold text-text-primary mt-4 mb-2">Training & Performance Data</h3>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                <li>Game statistics (points, rebounds, assists, shooting percentages, etc.)</li>
                <li>Shot tracking data across 11 court zones</li>
                <li>Drill session logs (drill name, category, duration, intensity, notes)</li>
                <li>Workout completions and training streaks</li>
                <li>Journal entries and personal notes</li>
                <li>Goals and progress tracking data</li>
                <li>Recruiting profile information</li>
              </ul>

              <h3 className="text-sm font-semibold text-text-primary mt-4 mb-2">Device & Usage Information</h3>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                <li>Device type, operating system, and browser information</li>
                <li>App version and feature usage patterns</li>
                <li>Crash reports and error logs</li>
                <li>General location data (city/region level, not precise GPS)</li>
              </ul>

              <h3 className="text-sm font-semibold text-text-primary mt-4 mb-2">Payment Information</h3>
              <p>
                Payment details (credit card numbers, billing address) are processed and stored exclusively by our payment processor, Stripe. CourtIQ does not store or have access to your full payment card details.
              </p>
            </section>

            {/* 2. How We Use Information */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">2. How We Use Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-text-muted">
                <li>Provide, maintain, and improve the Service</li>
                <li>Generate analytics, trends, and AI-powered insights about your performance</li>
                <li>Personalize your training recommendations and drill suggestions</li>
                <li>Calculate XP, badges, streaks, and achievement progress</li>
                <li>Enable team features, coach views, and player comparisons</li>
                <li>Process subscription payments and manage billing</li>
                <li>Send essential account notifications (password resets, billing alerts)</li>
                <li>Send optional product updates and training tips (with your consent)</li>
                <li>Detect and prevent fraud, abuse, and security threats</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="mt-2">
                We do not sell your personal information to third parties. We do not use your training data for advertising purposes.
              </p>
            </section>

            {/* 3. Data Storage & Security */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">3. Data Storage & Security</h2>
              <p>
                Your data is stored securely using Supabase, a trusted cloud database platform built on PostgreSQL. We implement industry-standard security measures, including:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-text-muted">
                <li>Encryption in transit (TLS/SSL) and at rest (AES-256)</li>
                <li>Row-level security policies to ensure users can only access their own data</li>
                <li>Secure password hashing using bcrypt</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Automated backups and disaster recovery procedures</li>
              </ul>
              <p className="mt-2">
                While we take every reasonable precaution to protect your data, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            {/* 4. Third-Party Services */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">4. Third-Party Services</h2>
              <p>We use the following third-party services to operate and improve CourtIQ:</p>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl bg-bg-card border border-border p-4">
                  <p className="font-semibold text-text-primary">Supabase</p>
                  <p className="text-xs text-text-muted mt-1">
                    Backend infrastructure, database hosting, authentication, and real-time data synchronization. Data is stored in secure, SOC 2 compliant data centers.
                  </p>
                </div>
                <div className="rounded-xl bg-bg-card border border-border p-4">
                  <p className="font-semibold text-text-primary">Stripe</p>
                  <p className="text-xs text-text-muted mt-1">
                    Payment processing for Pro and Team subscriptions. Stripe is PCI DSS Level 1 certified, the highest level of payment security certification. See{' '}
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue hover:underline">
                      Stripe's Privacy Policy
                    </a>.
                  </p>
                </div>
              </div>
              <p className="mt-3">
                Each third-party service has its own privacy policy governing its use of your data. We encourage you to review their policies.
              </p>
            </section>

            {/* 5. Data Retention */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">5. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active or as needed to provide the Service. Specifically:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-text-muted">
                <li>Account and training data: retained while your account is active</li>
                <li>After account deletion: data is permanently removed within 30 days</li>
                <li>Backup copies: purged within 90 days of account deletion</li>
                <li>Billing records: retained for up to 7 years as required by tax and financial regulations</li>
                <li>Aggregated, anonymized data: may be retained indefinitely for analytics and service improvement</li>
              </ul>
            </section>

            {/* 6. Your Rights */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">6. Your Rights</h2>
              <p>You have the following rights regarding your personal data:</p>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl bg-bg-card border border-border p-4">
                  <p className="font-semibold text-text-primary">Access</p>
                  <p className="text-xs text-text-muted mt-1">
                    You can view all your personal data within the app at any time through your profile and data settings.
                  </p>
                </div>
                <div className="rounded-xl bg-bg-card border border-border p-4">
                  <p className="font-semibold text-text-primary">Export</p>
                  <p className="text-xs text-text-muted mt-1">
                    Pro and Team subscribers can export their data in CSV and JSON formats. Free users can request a data export by contacting support.
                  </p>
                </div>
                <div className="rounded-xl bg-bg-card border border-border p-4">
                  <p className="font-semibold text-text-primary">Delete</p>
                  <p className="text-xs text-text-muted mt-1">
                    You can delete your account and all associated data at any time from your profile settings or by contacting support.
                  </p>
                </div>
                <div className="rounded-xl bg-bg-card border border-border p-4">
                  <p className="font-semibold text-text-primary">Correct</p>
                  <p className="text-xs text-text-muted mt-1">
                    You can update or correct your personal information at any time through the Edit Profile page.
                  </p>
                </div>
                <div className="rounded-xl bg-bg-card border border-border p-4">
                  <p className="font-semibold text-text-primary">Opt Out</p>
                  <p className="text-xs text-text-muted mt-1">
                    You can opt out of non-essential communications at any time through your notification settings.
                  </p>
                </div>
              </div>
              <p className="mt-3">
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:privacy@courtiq.app" className="text-blue hover:underline">privacy@courtiq.app</a>.
                We will respond to your request within 30 days.
              </p>
            </section>

            {/* 7. Children's Privacy */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">7. Children's Privacy</h2>
              <div className="rounded-xl bg-blue/5 border border-blue-border/30 p-4">
                <p className="text-xs text-text-muted">
                  CourtIQ is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child under 13 has provided us with personal information, please contact us at{' '}
                  <a href="mailto:privacy@courtiq.app" className="text-blue hover:underline">privacy@courtiq.app</a>{' '}
                  and we will promptly delete the information.
                </p>
              </div>
              <p className="mt-3">
                Users between 13 and 18 years of age may use CourtIQ with parental or guardian consent. Parents and guardians may contact us to review, modify, or delete their child's information at any time.
              </p>
            </section>

            {/* 8. Cookies & Tracking */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">8. Cookies & Tracking</h2>
              <p>
                CourtIQ uses minimal tracking technologies to provide and improve the Service:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-text-muted">
                <li><strong className="text-text-secondary">Authentication tokens:</strong> Stored locally to keep you signed in securely</li>
                <li><strong className="text-text-secondary">Local storage:</strong> Used to cache app preferences, theme settings, and offline data</li>
                <li><strong className="text-text-secondary">Essential cookies:</strong> Required for the Service to function properly (session management)</li>
              </ul>
              <p className="mt-2">
                We do not use advertising cookies or third-party tracking pixels. We do not participate in cross-site tracking or targeted advertising networks.
              </p>
            </section>

            {/* 9. Data Transfers */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">9. International Data Transfers</h2>
              <p>
                Your data may be processed and stored in the United States or other countries where our service providers operate. By using the Service, you consent to the transfer of your data to these locations. We ensure appropriate safeguards are in place for international data transfers in accordance with applicable data protection laws.
              </p>
            </section>

            {/* 10. Changes to Policy */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-text-muted">
                <li>Update the "Last updated" date at the top of this policy</li>
                <li>Notify you through the app or via email at least 14 days before changes take effect</li>
                <li>Obtain your consent for any changes that materially affect how we use your data</li>
              </ul>
              <p className="mt-2">
                Your continued use of the Service after the updated policy takes effect constitutes your acceptance of the changes.
              </p>
            </section>

            {/* 11. Contact */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">11. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="mt-3 rounded-xl bg-bg-card border border-border p-4 space-y-2">
                <div>
                  <p className="text-text-primary font-medium">Privacy Inquiries</p>
                  <a href="mailto:privacy@courtiq.app" className="text-blue hover:underline text-xs">
                    privacy@courtiq.app
                  </a>
                </div>
                <div>
                  <p className="text-text-primary font-medium">General Support</p>
                  <a href="mailto:support@courtiq.app" className="text-blue hover:underline text-xs">
                    support@courtiq.app
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 pb-8">
            <p className="text-[10px] text-text-muted">
              &copy; {new Date().getFullYear()} CourtIQ. All rights reserved.
            </p>
          </div>
        </article>
      </PageShell>
    </div>
  )
}
