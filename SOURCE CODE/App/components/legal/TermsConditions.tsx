import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { FileText, ChevronLeft } from "lucide-react";

export function TermsConditions() {
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
                <FileText className="w-5 h-5" />
                Terms & Conditions
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
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white dark:text-white">1. Acceptance of Terms</h3>
            <p className="text-gray-700 dark:text-gray-300 dark:text-gray-300 leading-relaxed">
              By accessing and using Go Bus services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">2. Use of Service</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              Go Bus provides a platform for booking bus tickets. You agree to use the service only for lawful purposes and in accordance with these terms.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
              <li>You must be at least 18 years old to use this service</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree to provide accurate and complete information</li>
              <li>You will not use the service for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">3. Booking & Payment</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              When you make a booking through Go Bus:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
              <li>All bookings are subject to availability</li>
              <li>Payment must be made in full at the time of booking</li>
              <li>Prices are subject to change without prior notice</li>
              <li>You will receive a booking confirmation via email and SMS</li>
              <li>Tickets are non-transferable unless specified otherwise</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">4. Cancellation & Refund Policy</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              Cancellation policies vary by bus operator:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
              <li>Cancellations made 24+ hours before departure: 85% refund</li>
              <li>Cancellations made 12-24 hours before: 50% refund</li>
              <li>Cancellations made 6-12 hours before: 25% refund</li>
              <li>Cancellations made less than 6 hours before: No refund</li>
              <li>Refunds are processed within 5-7 business days</li>
              <li>Cancellation charges may apply as per operator policy</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">5. User Responsibilities</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              As a user of Go Bus, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-2">
              <li>Arrive at the boarding point at least 15 minutes before departure</li>
              <li>Carry valid identification and ticket (digital or printed)</li>
              <li>Comply with all bus operator rules and regulations</li>
              <li>Not carry prohibited items (weapons, explosives, illegal substances)</li>
              <li>Respect other passengers and maintain proper conduct</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">6. Limitation of Liability</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Go Bus acts only as a facilitator and is not responsible for the services provided by bus operators. We are not liable for any delays, cancellations, accidents, or loss of belongings during travel. The bus operator is solely responsible for passenger safety and service quality.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">7. Privacy & Data Protection</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your privacy is important to us. We collect and process personal data in accordance with our Privacy Policy. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">8. Intellectual Property</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All content on the Go Bus platform, including logos, text, graphics, and software, is the property of Go Bus and protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">9. Dispute Resolution</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Any disputes arising from the use of Go Bus services will be governed by the laws of India. For any complaints or disputes, please contact our customer support team. We will make reasonable efforts to resolve the issue amicably.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">10. Modifications to Terms</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Go Bus reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2 text-gray-800 dark:text-white">11. Contact Information</h3>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
              <p>For questions about these terms, please contact us:</p>
              <p className="font-semibold">Email: support@Go Bus.in</p>
              <p className="font-semibold">Phone: 1800-123-4567 (Toll-Free)</p>
              <p className="font-semibold">Address: Bangalore, Karnataka, India</p>
            </div>
          </section>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-600 italic">
              By using Go Bus services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
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
