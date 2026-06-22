import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Gift, Share2, Copy, Check, Users, DollarSign, Trophy, ChevronLeft, FileText } from "lucide-react";
import { toast } from "sonner";

export function ReferEarn() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const referralCode = "GOBUS" + Math.random().toString(36).substr(2, 6).toUpperCase();
  const referralLink = `https://gobus.in/refer/${referralCode}`;

  const stats = {
    totalReferrals: 12,
    successfulBookings: 8,
    totalEarnings: 320,
    pendingRewards: 80,
  };

  const referralHistory = [
    { name: "Amit Kumar", status: "completed", reward: 40, date: "2026-05-02" },
    { name: "Priya Sharma", status: "completed", reward: 40, date: "2026-04-28" },
    { name: "Rahul Verma", status: "pending", reward: 40, date: "2026-04-25" },
    { name: "Sneha Patel", status: "completed", reward: 40, date: "2026-04-20" },
  ];

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy. Please copy manually.");
    }
    document.body.removeChild(textArea);
  };

  const handleCopy = (text: string) => {
    // Fallback for when clipboard API is blocked
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          toast.success("Copied to clipboard!");
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          fallbackCopyTextToClipboard(text);
        });
      } else {
        fallbackCopyTextToClipboard(text);
      }
    } catch (err) {
      fallbackCopyTextToClipboard(text);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Get ₹40 off on your first bus booking!",
        text: `Use my referral code ${referralCode} to get ₹40 discount on Go Bus`,
        url: referralLink,
      });
    } else {
      handleCopy(referralLink);
    }
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
            <Gift className="w-5 h-5" />
            Refer & Earn
          </CardTitle>
          <CardDescription className="text-red-100">
            Invite friends and earn rewards for every booking
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="pt-4">
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto bg-[#1a56db] rounded-full flex items-center justify-center mb-3">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Give ₹40, Get ₹40
            </h3>
            <p className="text-gray-600">
              Invite your friends to Go Bus. They get ₹40 off on their first booking,
              and you get ₹40 when they complete their first trip!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Your Referral Code</label>
              <div className="flex space-x-2">
                <Input
                  value={referralCode}
                  readOnly
                  className="flex-1 text-center text-xl font-bold tracking-wider bg-white"
                />
                <Button
                  onClick={() => handleCopy(referralCode)}
                  variant="outline"
                  className="px-6"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Referral Link</label>
              <div className="flex space-x-2">
                <Input
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-white"
                />
                <Button
                  onClick={() => handleCopy(referralLink)}
                  variant="outline"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleShare}
              className="w-full bg-[#1a56db] hover:bg-[#1242b0] h-11 font-bold"
            >
              <Share2 className="h-4 w-4" />
              Share with Friends
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="pt-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-[#1a56db]" />
            <p className="text-xl font-bold text-gray-800">{stats.totalReferrals}</p>
            <p className="text-xs text-gray-600 mt-1">Total Referrals</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="pt-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-xl font-bold text-gray-800">{stats.successfulBookings}</p>
            <p className="text-xs text-gray-600 mt-1">Successful</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="pt-4 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-xl font-bold text-gray-800">₹{stats.totalEarnings}</p>
            <p className="text-xs text-gray-600 mt-1">Total Earned</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="pt-4 text-center">
            <Gift className="w-6 h-6 mx-auto mb-2 text-orange-600" />
            <p className="text-xl font-bold text-gray-800">₹{stats.pendingRewards}</p>
            <p className="text-xs text-gray-600 mt-1">Pending</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: 1, title: "Share your code", desc: "Send your referral code or link to friends" },
              { step: 2, title: "Friend books", desc: "They get ₹40 off on their first booking" },
              { step: 3, title: "You earn rewards", desc: "Get ₹40 when they complete their trip" },
              { step: 4, title: "Unlimited earnings", desc: "Refer more friends, earn more rewards!" },
            ].map((item) => (
              <div key={item.step} className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#1a56db] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referralHistory.map((ref, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-gray-800">{ref.name}</p>
                  <p className="text-xs text-gray-600">{new Date(ref.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1a56db]">₹{ref.reward}</p>
                  <Badge
                    className={
                      ref.status === "completed"
                        ? "bg-green-600"
                        : "bg-orange-500"
                    }
                  >
                    {ref.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader className="bg-[#1a56db] text-white pb-3">
          <CardTitle className="flex items-center text-base">
            <FileText className="w-5 h-5" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="text-sm text-gray-700 space-y-2 leading-relaxed">
            <li>• Referral reward is credited after friend's first successful trip</li>
            <li>• Minimum booking value of ₹200 required</li>
            <li>• Rewards expire after 90 days if not used</li>
            <li>• Cannot be combined with first-time user offers</li>
            <li>• Go Bus reserves the right to modify or cancel the referral program at any time</li>
            <li>• Fraudulent referrals will result in account suspension</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
