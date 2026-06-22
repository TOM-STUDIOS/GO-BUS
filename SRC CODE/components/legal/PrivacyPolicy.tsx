import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { Shield, ChevronLeft } from "lucide-react";

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-[#1a56db] text-white pb-3">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <CardTitle className="flex items-center text-lg md:text-xl">
                <Shield className="w-5 h-5" />
                Privacy Policy
              </CardTitle>
              <CardDescription className="text-red-100 text-sm">
                Last updated: May 7, 2026
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6 space-y-6 text-sm">
          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">1. Information We Collect</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              We collect various types of information to provide and improve our services:
            </p>
            <div className="space-y-3 ml-2">
              <div>
                <p className="font-semibold text-gray-800 dark:text-white mb-1">Personal Information:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
                  <li>Name, email address, phone number</li>
                  <li>Date of birth, gender</li>
                  <li>Payment information (encrypted)</li>
                  <li>Government ID (for verification purposes)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white mb-1">Usage Information:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
                  <li>Booking history and travel preferences</li>
                  <li>Search queries and browsing behavior</li>
                  <li>Device information (IP address, browser type)</li>
                  <li>Location data (with your permission)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">2. How We Use Your Information</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              We use the collected information for:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
              <li>Processing and managing your bookings</li>
              <li>Sending booking confirmations and travel updates</li>
              <li>Improving our services and user experience</li>
              <li>Personalizing recommendations and offers</li>
              <li>Detecting and preventing fraud</li>
              <li>Complying with legal obligations</li>
              <li>Marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">3. Information Sharing</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
              <li>Bus operators to fulfill your booking</li>
              <li>Payment processors for transaction processing</li>
              <li>Service providers who assist our operations</li>
              <li>Law enforcement when required by law</li>
              <li>Business partners for joint promotions (with consent)</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">4. Data Security</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              We implement robust security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Encrypted storage of sensitive information</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">5. Cookies & Tracking</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Deliver personalized content and ads</li>
              <li>Improve site functionality and performance</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
              You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">6. Your Rights</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
              <li>Data portability (receive your data in a standard format)</li>
              <li>Lodge a complaint with data protection authorities</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">7. Data Retention</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We retain your personal information only as long as necessary for the purposes outlined in this policy or as required by law. Booking and transaction records are typically retained for 7 years for accounting and legal purposes.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">8. Children's Privacy</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our services are not intended for children under 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">9. International Data Transfers</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">10. Changes to Privacy Policy</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of significant changes via email or through our app. Your continued use of our services after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">11. Contact Us</h3>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
              <p>For privacy-related questions or to exercise your rights:</p>
              <p className="font-semibold">Email: privacy@gobus.in</p>
              <p className="font-semibold">Data Protection Officer: dpo@gobus.in</p>
              <p className="font-semibold">Phone: 1800-123-4567 (Toll-Free)</p>
              <p className="font-semibold">Address: Bangalore, Karnataka, India</p>
            </div>
          </section>

          <div className="pt-4 border-t dark:border-gray-700 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-xs text-gray-700 dark:text-white">
              <strong>Your privacy matters to us.</strong> We are committed to protecting your personal information and being transparent about how we use it. If you have any concerns or questions, please don't hesitate to contact us.
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        className="w-full h-10"
      >
        Back
      </Button>

      <div className="h-4"></div>
    </div>
  );
}