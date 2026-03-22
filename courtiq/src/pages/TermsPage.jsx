import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'

export default function TermsPage() {
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
            <SectionHeader title="Terms of Service" subtitle="CourtIQ Basketball Training" />
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue-border flex items-center justify-center">
              <FileText size={28} className="text-blue" />
            </div>
          </div>

          <p className="text-xs text-text-muted text-center">
            Last updated: March 1, 2026
          </p>

          {/* Content */}
          <div className="space-y-8 text-sm text-text-secondary leading-relaxed">

            {/* 1. Acceptance of Terms */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using CourtIQ ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms apply to all users, including players, coaches, trainers, and team administrators.
              </p>
              <p className="mt-2">
                By creating an account, you represent that you are at least 13 years of age and have the legal capacity to enter into these Terms. If you are under 18, you must have parental or guardian consent to use the Service.
              </p>
            </section>

            {/* 2. Description of Service */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">2. Description of Service</h2>
              <p>
                CourtIQ is a basketball training and analytics platform that allows users to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-text-muted">
                <li>Log game statistics and track performance over time</li>
                <li>Record and analyze shooting sessions across court zones</li>
                <li>Track drill sessions and training workouts</li>
                <li>Access a curated library of basketball drills</li>
                <li>View analytics, trends, and AI-powered insights</li>
                <li>Maintain a training journal and set personal goals</li>
                <li>Create recruiting profiles and shareable stat cards</li>
                <li>Manage teams and collaborate with coaches</li>
              </ul>
              <p className="mt-2">
                We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
              </p>
            </section>

            {/* 3. User Accounts & Responsibilities */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">3. User Accounts & Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-text-muted">
                <li>Provide accurate and complete registration information</li>
                <li>Keep your login credentials secure and not share them with others</li>
                <li>Notify us immediately of any unauthorized access to your account</li>
                <li>Not create accounts through automated means or under false pretenses</li>
                <li>Not use the Service for any unlawful or prohibited purpose</li>
              </ul>
              <p className="mt-2">
                We reserve the right to suspend or terminate accounts that violate these Terms or that we believe are being used fraudulently.
              </p>
            </section>

            {/* 4. Subscription & Billing */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">4. Subscription & Billing</h2>
              <p>
                CourtIQ offers the following subscription tiers:
              </p>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl bg-bg-card border border-border p-4">
                  <p className="font-semibold text-text-primary">Free Plan - $0/month</p>
                  <p className="text-xs text-text-muted mt-1">
                    Core features including game logging, shot tracking (11 zones), up to 50 drill sessions, basic analytics, journal, goal tracking, and drill library access.
                  </p>
                </div>
                <div className="rounded-xl bg-bg-card border border-blue-border p-4">
                  <p className="font-semibold text-text-primary">Pro Plan - $7.99/month</p>
                  <p className="text-xs text-text-muted mt-1">
                    Everything in Free plus unlimited drill sessions, advanced analytics and trends, shot heatmaps, AI-powered insights, workout templates, data export, shareable stat cards, and priority support.
                  </p>
                </div>
                <div className="rounded-xl bg-bg-card border border-gold/20 p-4">
                  <p className="font-semibold text-text-primary">Team Plan - $19.99/month</p>
                  <p className="text-xs text-text-muted mt-1">
                    Everything in Pro plus up to 25 player profiles, team dashboard and roster management, coach view and permissions, player comparison tools, team leaderboards, recruiting profiles, custom branding, and a dedicated account manager.
                  </p>
                </div>
              </div>
              <p className="mt-3">
                Paid subscriptions are billed on a recurring monthly or annual basis through our payment processor, Stripe. You may cancel at any time, and your subscription will remain active until the end of the current billing period. Refunds are not provided for partial billing periods.
              </p>
              <p className="mt-2">
                We reserve the right to change subscription pricing with at least 30 days' notice. Price changes will not affect your current billing period.
              </p>
            </section>

            {/* 5. Intellectual Property */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">5. Intellectual Property</h2>
              <p>
                The Service, including its design, features, content, drill library, branding, logos, and underlying technology, is owned by CourtIQ and is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of the Service without our written permission.
              </p>
              <p className="mt-2">
                "CourtIQ" and associated logos are trademarks of CourtIQ. You may not use these marks without prior written consent.
              </p>
            </section>

            {/* 6. User Content & Data */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">6. User Content & Data</h2>
              <p>
                You retain ownership of all data and content you create within the Service, including game logs, training notes, journal entries, and profile information. By using the Service, you grant CourtIQ a limited, non-exclusive license to store, process, and display your content solely for the purpose of providing and improving the Service.
              </p>
              <p className="mt-2">
                You are responsible for the accuracy of the data you enter. CourtIQ is not liable for any decisions made based on data within the platform.
              </p>
            </section>

            {/* 7. Privacy */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">7. Privacy</h2>
              <p>
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our{' '}
                <Link to="/privacy" className="text-blue hover:underline font-medium">Privacy Policy</Link>,
                which is incorporated into these Terms by reference. By using the Service, you consent to the practices described in the Privacy Policy.
              </p>
            </section>

            {/* 8. Disclaimers */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">8. Disclaimers</h2>
              <div className="rounded-xl bg-warning/5 border border-warning/20 p-4 space-y-2">
                <p className="text-xs text-warning font-semibold">Important Notice</p>
                <p className="text-xs text-text-muted">
                  CourtIQ is a training and analytics tool. It does not provide medical, health, or professional athletic advice. Always consult a qualified healthcare provider or certified trainer before starting any new training program.
                </p>
              </div>
              <p className="mt-3">
                The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or secure.
              </p>
              <p className="mt-2">
                All physical training and basketball activities performed based on information from the Service are done at your own risk. CourtIQ is not responsible for any injuries, physical harm, or adverse effects resulting from the use of the platform, drills, or workout recommendations.
              </p>
            </section>

            {/* 9. Limitation of Liability */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, CourtIQ and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, profits, or goodwill, arising from your use of or inability to use the Service.
              </p>
              <p className="mt-2">
                Our total liability for any claim arising from or related to these Terms or the Service shall not exceed the amount you paid to CourtIQ in the twelve (12) months preceding the claim.
              </p>
            </section>

            {/* 10. Termination */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">10. Termination</h2>
              <p>
                You may terminate your account at any time by deleting it from your profile settings or by contacting support. Upon termination, your right to use the Service ceases immediately.
              </p>
              <p className="mt-2">
                We may suspend or terminate your account at our discretion if we believe you have violated these Terms, engaged in fraudulent activity, or if required by law. We will make reasonable efforts to notify you before termination unless doing so would compromise the security of the Service.
              </p>
              <p className="mt-2">
                Upon account deletion, your data will be removed in accordance with our Privacy Policy. Some data may be retained as required by law or for legitimate business purposes.
              </p>
            </section>

            {/* 11. Changes to Terms */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">11. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time to reflect changes in our Service, legal requirements, or business practices. When we make material changes, we will notify you through the app or via email at least 14 days before the changes take effect.
              </p>
              <p className="mt-2">
                Your continued use of the Service after the updated Terms take effect constitutes your acceptance of the changes. If you do not agree with the updated Terms, you should stop using the Service and delete your account.
              </p>
            </section>

            {/* 12. Governing Law */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration, except where prohibited by law.
              </p>
            </section>

            {/* 13. Contact Information */}
            <section>
              <h2 className="text-base font-bold text-text-primary mb-3">13. Contact Information</h2>
              <p>
                If you have questions, concerns, or feedback about these Terms of Service, please contact us at:
              </p>
              <div className="mt-3 rounded-xl bg-bg-card border border-border p-4">
                <p className="text-text-primary font-medium">CourtIQ Support</p>
                <a href="mailto:support@courtiq.app" className="text-blue hover:underline text-xs">
                  support@courtiq.app
                </a>
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
