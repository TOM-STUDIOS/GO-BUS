import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { authService } from "../../services/auth";
import { Settings as SettingsIcon, Globe, Bell, Lock, Moon, Sun, ChevronRight, FileText, Shield, LogOut, User, CreditCard, HelpCircle, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export function Settings() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Language settings
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(
    localStorage.getItem("emailNotifications") !== "false"
  );
  const [smsNotifications, setSmsNotifications] = useState(
    localStorage.getItem("smsNotifications") !== "false"
  );
  const [pushNotifications, setPushNotifications] = useState(
    localStorage.getItem("pushNotifications") !== "false"
  );
  const [offerNotifications, setOfferNotifications] = useState(
    localStorage.getItem("offerNotifications") !== "false"
  );

  // Appearance settings
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Privacy settings
  const [shareData, setShareData] = useState(
    localStorage.getItem("shareData") !== "false"
  );
  const [locationTracking, setLocationTracking] = useState(
    localStorage.getItem("locationTracking") !== "false"
  );

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिन्दी (Hindi)", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ் (Tamil)", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు (Telugu)", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
    { code: "ml", name: "മലയാളം (Malayalam)", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা (Bengali)", flag: "🇮🇳" },
    { code: "mr", name: "मराठी (Marathi)", flag: "🇮🇳" },
    { code: "gu", name: "ગુજરાતી (Gujarati)", flag: "🇮🇳" },
  ];

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    toast.success("Language changed successfully");
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    window.dispatchEvent(new Event("themeChange"));
    toast.success("Theme changed successfully");
  };

  const handleNotificationToggle = (type: string, value: boolean) => {
    localStorage.setItem(type, value.toString());
    toast.success("Notification preferences updated");
  };

  const handlePrivacyToggle = (type: string, value: boolean) => {
    localStorage.setItem(type, value.toString());
    toast.success("Privacy settings updated");
  };

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="space-y-4">
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
            <SettingsIcon className="w-5 h-5" />
            Settings
          </CardTitle>
          <CardDescription className="text-red-100 text-sm">
            Manage your account and preferences
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Account Section */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <User className="w-4 h-4 mr-2 text-[#1a56db]" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate("/app/profile")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1a56db] rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <Separator />

          <div
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate("/app/wallet")}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="text-sm">Wallet & Payments</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Globe className="w-4 h-4 mr-2 text-[#1a56db]" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm">Select Language</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            {theme === "dark" ? (
              <Moon className="w-4 h-4 mr-2 text-[#1a56db]" />
            ) : (
              <Sun className="w-4 h-4 mr-2 text-[#1a56db]" />
            )}
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm">Theme</Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Bell className="w-4 h-4 mr-2 text-[#1a56db]" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notif" className="text-sm font-semibold">Email Notifications</Label>
              <p className="text-xs text-gray-600">Receive booking confirmations via email</p>
            </div>
            <Switch
              id="email-notif"
              checked={emailNotifications}
              onCheckedChange={(checked) => {
                setEmailNotifications(checked);
                handleNotificationToggle("emailNotifications", checked);
              }}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notif" className="text-sm font-semibold">SMS Notifications</Label>
              <p className="text-xs text-gray-600">Get trip reminders via SMS</p>
            </div>
            <Switch
              id="sms-notif"
              checked={smsNotifications}
              onCheckedChange={(checked) => {
                setSmsNotifications(checked);
                handleNotificationToggle("smsNotifications", checked);
              }}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notif" className="text-sm font-semibold">Push Notifications</Label>
              <p className="text-xs text-gray-600">Real-time updates on your device</p>
            </div>
            <Switch
              id="push-notif"
              checked={pushNotifications}
              onCheckedChange={(checked) => {
                setPushNotifications(checked);
                handleNotificationToggle("pushNotifications", checked);
              }}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="offer-notif" className="text-sm font-semibold">Offers & Promotions</Label>
              <p className="text-xs text-gray-600">Get notified about special deals</p>
            </div>
            <Switch
              id="offer-notif"
              checked={offerNotifications}
              onCheckedChange={(checked) => {
                setOfferNotifications(checked);
                handleNotificationToggle("offerNotifications", checked);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Lock className="w-4 h-4 mr-2 text-[#1a56db]" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-data" className="text-sm font-semibold">Share Analytics Data</Label>
              <p className="text-xs text-gray-600">Help us improve the app</p>
            </div>
            <Switch
              id="share-data"
              checked={shareData}
              onCheckedChange={(checked) => {
                setShareData(checked);
                handlePrivacyToggle("shareData", checked);
              }}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="location" className="text-sm font-semibold">Location Services</Label>
              <p className="text-xs text-gray-600">For live bus tracking</p>
            </div>
            <Switch
              id="location"
              checked={locationTracking}
              onCheckedChange={(checked) => {
                setLocationTracking(checked);
                handlePrivacyToggle("locationTracking", checked);
              }}
            />
          </div>

          <Separator />

          <div
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate("/app/change-password")}
          >
            <span className="text-sm font-semibold">Change Password</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <FileText className="w-4 h-4 mr-2 text-[#1a56db]" />
            Legal & Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate("/app/terms")}
          >
            <span className="text-sm">Terms & Conditions</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate("/app/privacy")}
          >
            <span className="text-sm">Privacy Policy</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          <div
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate("/app/help")}
          >
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Help & Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="border-0 shadow-md">
        <CardContent className="py-4 text-center text-xs text-gray-600">
          <p className="mb-1">Go Bus - India's No. 1 Bus Booking App</p>
          <p>Version 2.8.0 • Build 1234</p>
        </CardContent>
      </Card>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full h-11 text-red-600 border-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>

      <div className="h-4"></div>
    </div>
  );
}
