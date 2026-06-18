import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { authService, User } from "../../services/auth";
import { User as UserIcon, Mail, Phone, Wallet, ChevronLeft, MapPin, Calendar, Award, Heart, Settings, Lock, Bell, HelpCircle, FileText, Shield, Crown, Star, Zap, Globe, DollarSign, Languages, Moon, Sun, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { ticketService } from "../../services/tickets";

export function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [totalTrips, setTotalTrips] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Preferences state
  const [country, setCountry] = useState(localStorage.getItem("country") || "in");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "inr");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [womenBooking, setWomenBooking] = useState(
    localStorage.getItem("womenBooking") === "true"
  );

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
      });
      // Use user's totalTrips if available, otherwise count from tickets
      setTotalTrips(currentUser.totalTrips || ticketService.getTickets().length);
    }
  }, []);

  const handleSave = () => {
    if (user) {
      authService.updateUser(formData);
      setUser(authService.getCurrentUser());
      setEditing(false);
      toast.success("Profile updated successfully");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
    setEditing(false);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    localStorage.setItem("country", value);
    toast.success("Country updated");
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    localStorage.setItem("currency", value);
    toast.success("Currency updated");
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    toast.success("Language updated");
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem("theme", value);
    window.dispatchEvent(new Event("themeChange"));
    toast.success("Theme updated");
  };

  const handleWomenBookingToggle = (checked: boolean) => {
    setWomenBooking(checked);
    localStorage.setItem("womenBooking", checked.toString());
    toast.success("Booking preference updated");
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>Please log in to view your profile</p>
        </CardContent>
      </Card>
    );
  }

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
        <CardHeader className="bg-[#1a56db] text-white pb-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg">
              <UserIcon className="w-10 h-10 text-[#1a56db]" />
            </div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-red-100 text-sm">{user?.email}</p>
            <Badge className={`mt-2 ${
              user?.membershipTier === "platinum"
                ? "bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:from-gray-800 hover:to-gray-600"
                : user?.membershipTier === "gold"
                ? "bg-gradient-to-r from-yellow-600 to-yellow-500 text-white hover:from-yellow-600 hover:to-yellow-500"
                : "bg-gradient-to-r from-gray-400 to-gray-300 text-white hover:from-gray-400 hover:to-gray-300"
            }`}>
              {user?.membershipTier === "platinum" && <Crown className="w-3 h-3 mr-1" />}
              {user?.membershipTier === "gold" && <Star className="w-3 h-3 mr-1" />}
              {user?.membershipTier === "silver" && <Zap className="w-3 h-3 mr-1" />}
              {user?.membershipTier?.toUpperCase()} Member
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="text-center p-2 md:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-lg md:text-2xl font-bold text-[#1a56db] truncate">{user?.totalTrips || totalTrips || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Trips</p>
            </div>
            <div className="text-center p-2 md:p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg cursor-pointer" onClick={() => navigate("/app/wallet")}>
              <p className="text-lg md:text-2xl font-bold text-[#1a56db] truncate">₹{((user?.walletBalance || 0) * 80).toFixed(0)}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Wallet</p>
            </div>
            <div className="text-center p-2 md:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-lg md:text-2xl font-bold text-[#1a56db] truncate">4.8</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleCancel} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-[#1a56db] hover:bg-[#1242b0]">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Personal Info */}
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{user?.phone}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                    <p className="font-semibold text-gray-800 dark:text-white">May 2026</p>
                  </div>
                </div>
              </div>

              <Button onClick={() => setEditing(true)} className="w-full bg-[#1a56db] hover:bg-[#1242b0]">
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-[#1a56db]" />
            Preferences
          </CardTitle>
          <CardDescription>Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Country */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center">
              <Globe className="w-4 h-4 mr-2 text-[#1a56db]" />
              Country
            </Label>
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">🇮🇳 India</SelectItem>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="gb">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="ae">🇦🇪 United Arab Emirates</SelectItem>
                <SelectItem value="sg">🇸🇬 Singapore</SelectItem>
                <SelectItem value="au">🇦🇺 Australia</SelectItem>
                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Currency */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-[#1a56db]" />
              Currency
            </Label>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inr">₹ Indian Rupee (INR)</SelectItem>
                <SelectItem value="usd">$ US Dollar (USD)</SelectItem>
                <SelectItem value="gbp">£ British Pound (GBP)</SelectItem>
                <SelectItem value="eur">€ Euro (EUR)</SelectItem>
                <SelectItem value="aed">د.إ UAE Dirham (AED)</SelectItem>
                <SelectItem value="sgd">S$ Singapore Dollar (SGD)</SelectItem>
                <SelectItem value="aud">A$ Australian Dollar (AUD)</SelectItem>
                <SelectItem value="cad">C$ Canadian Dollar (CAD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Language */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center">
              <Languages className="w-4 h-4 mr-2 text-[#1a56db]" />
              Language
            </Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* App Appearance */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center">
              {theme === "dark" ? (
                <Moon className="w-4 h-4 mr-2 text-[#1a56db]" />
              ) : (
                <Sun className="w-4 h-4 mr-2 text-[#1a56db]" />
              )}
              App Appearance
            </Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </div>
                </SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Women Booking Preference */}
          <div className="flex items-center justify-between py-2">
            <div className="flex-1">
              <Label htmlFor="women-booking" className="text-sm font-semibold flex items-center cursor-pointer">
                <UserCheck className="w-4 h-4 mr-2 text-[#1a56db]" />
                Women-Only Booking
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                Show only women-friendly seats and buses
              </p>
            </div>
            <Switch
              id="women-booking"
              checked={womenBooking}
              onCheckedChange={handleWomenBookingToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Membership Tiers */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-[#1a56db]" />
            Membership Tiers
          </CardTitle>
          <CardDescription>Unlock exclusive benefits as you travel more</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Silver Tier */}
          <div className={`p-4 rounded-lg border-2 ${
            user?.membershipTier === "silver"
              ? "border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-300 rounded-full flex items-center justify-center mr-3">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Silver</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">0-10 trips</p>
                </div>
              </div>
              {user?.membershipTier === "silver" && (
                <Badge className="bg-gray-400 text-white">Current</Badge>
              )}
            </div>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• 5% discount on bookings</li>
              <li>• Priority customer support</li>
              <li>• ₹100 welcome bonus</li>
            </ul>
          </div>

          {/* Gold Tier */}
          <div className={`p-4 rounded-lg border-2 ${
            user?.membershipTier === "gold"
              ? "border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Gold</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">11-50 trips</p>
                </div>
              </div>
              {user?.membershipTier === "gold" && (
                <Badge className="bg-yellow-600 text-white">Current</Badge>
              )}
            </div>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• 10% discount on bookings</li>
              <li>• Free cancellation protection</li>
              <li>• Priority boarding</li>
              <li>• Exclusive offers & deals</li>
            </ul>
          </div>

          {/* Platinum Tier */}
          <div className={`p-4 rounded-lg border-2 ${
            user?.membershipTier === "platinum"
              ? "border-gray-700 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center mr-3">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Platinum</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">50+ trips</p>
                </div>
              </div>
              {user?.membershipTier === "platinum" && (
                <Badge className="bg-gray-800 text-white">Current</Badge>
              )}
            </div>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• 15% discount on bookings</li>
              <li>• Free travel insurance</li>
              <li>• VIP lounge access</li>
              <li>• Personal travel manager</li>
              <li>• Early access to new routes</li>
            </ul>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Your Progress:</strong> You've completed {user?.totalTrips || 0} trips.
              {user?.membershipTier === "silver" && " Complete 1 more trip to reach Gold tier!"}
              {user?.membershipTier === "gold" && " Complete 26 more trips to reach Platinum tier!"}
              {user?.membershipTier === "platinum" && " Congratulations! You're at the highest tier!"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => navigate("/app/passengers")}
          >
            <MapPin className="w-5 h-5 mr-3 text-[#1a56db]" />
            <span>Saved Passengers</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => navigate("/app/change-password")}
          >
            <Lock className="w-5 h-5 mr-3 text-[#1a56db]" />
            <span>Change Password</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => navigate("/app/settings")}
          >
            <Settings className="w-5 h-5 mr-3 text-[#1a56db]" />
            <span>Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => navigate("/app/help")}
          >
            <HelpCircle className="w-5 h-5 mr-3 text-[#1a56db]" />
            <span>Help & Support</span>
          </Button>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Legal & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => navigate("/app/terms")}
          >
            <FileText className="w-5 h-5 mr-3 text-gray-600" />
            <span>Terms & Conditions</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => navigate("/app/privacy")}
          >
            <Shield className="w-5 h-5 mr-3 text-gray-600" />
            <span>Privacy Policy</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
