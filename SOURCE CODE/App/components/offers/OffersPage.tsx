import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { mockOffers, Offer } from "../../services/offers";
import { Tag, Percent, Copy, Check, Calendar, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export function OffersPage() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    // Fallback for when clipboard API is blocked
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          setCopiedCode(code);
          toast.success("Coupon code copied!");
          setTimeout(() => setCopiedCode(null), 2000);
        }).catch(() => {
          fallbackCopyTextToClipboard(code);
        });
      } else {
        fallbackCopyTextToClipboard(code);
      }
    } catch (err) {
      fallbackCopyTextToClipboard(code);
    }
  };

  const fallbackCopyTextToClipboard = (code: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedCode(code);
      toast.success("Coupon code copied!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error("Failed to copy. Please copy manually.");
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-[#1a56db] text-white pb-3">
          <CardTitle className="flex items-center text-lg md:text-xl">
            <Tag className="w-5 h-5" />
            Special Offers
          </CardTitle>
          <CardDescription className="text-red-100">Save more on your bus bookings with exclusive deals</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockOffers.map((offer) => (
          <Card key={offer.id} className="border-2 border-dashed border-[#1a56db] bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-md">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-[#1a56db] rounded-full">
                      <Percent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-base dark:text-white">{offer.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{offer.description}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-800 border-2 border-dashed border-[#1a56db] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Coupon Code</p>
                      <p className="text-lg font-bold text-[#1a56db]">{offer.code}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(offer.code)}
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Badge variant="secondary" className="mr-2">
                      {offer.discountType === "percentage"
                        ? `${offer.discountValue}% OFF`
                        : `₹${offer.discountValue} OFF`}
                    </Badge>
                    {offer.maxDiscount && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Max discount: ₹{offer.maxDiscount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </div>
                </div>

                <div className="pt-3 border-t dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Terms & Conditions:</p>
                  <ul className="space-y-1">
                    {offer.termsAndConditions.map((term, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 overflow-hidden shadow-md">
        <div className="bg-[#1a56db] px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-[#FEBB02] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 20 20" className="w-4 h-4 fill-[#1a56db]">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <h3 className="text-white font-bold text-base">How to Use Coupons</h3>
          </div>
        </div>
        <CardContent className="p-0">
          {[
            { step: "1", text: "Copy your desired coupon code from the list above" },
            { step: "2", text: "Complete seat selection and passenger details" },
            { step: "3", text: "Paste the code in the coupon field at checkout" },
            { step: "4", text: "Discount applied instantly — enjoy your savings!" },
          ].map((item, i, arr) => (
            <div
              key={i}
              className={`flex items-start gap-4 px-5 py-3 ${i < arr.length - 1 ? "border-b border-[#dce8f5] dark:border-[#1e3555]" : ""}`}
            >
              <div className="w-7 h-7 rounded-full bg-[#1a56db] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {item.step}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug pt-1">{item.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}