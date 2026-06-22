import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  MapPin, Clock, Zap, Train, Car, Bus, ArrowRight,
  Navigation, Leaf, Wallet, Star, ChevronDown, ChevronUp,
  QrCode, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { indianCities } from "../../services/cities";
import { ticketService, RouteSegment } from "../../services/tickets";

type RouteType = "fastest" | "cheapest" | "eco" | "comfortable";

interface SmartRoute {
  id: RouteType;
  label: string;
  icon: React.ReactNode;
  totalTime: number;
  totalCost: number;
  transfers: number;
  segments: RouteSegment[];
  badge?: string;
  recommended?: boolean;
}

const modeIcon = (mode: RouteSegment["mode"]) => {
  switch (mode) {
    case "walk": return <Navigation className="w-3.5 h-3.5" />;
    case "bus": return <Bus className="w-3.5 h-3.5" />;
    case "metro": return <Train className="w-3.5 h-3.5" />;
    case "auto": return <Car className="w-3.5 h-3.5" />;
  }
};

const modeColor = (mode: RouteSegment["mode"]) => {
  switch (mode) {
    case "walk": return "#6B7280";
    case "bus": return "#1a56db";
    case "metro": return "#1a56db";
    case "auto": return "#F59E0B";
  }
};

const modeLabel = (mode: RouteSegment["mode"]) => {
  switch (mode) {
    case "walk": return "Walking";
    case "bus": return "Bus";
    case "metro": return "Metro";
    case "auto": return "Auto";
  }
};

function generateRoutes(from: string, to: string): SmartRoute[] {
  return [
    {
      id: "fastest",
      label: "Fastest",
      icon: <Zap className="w-4 h-4" />,
      totalTime: 38,
      totalCost: 85,
      transfers: 1,
      recommended: true,
      badge: "Recommended",
      segments: [
        { mode: "walk", from: "Your Location", to: `${from} Metro Station`, time: 5, cost: 0, distance: 0.4, detail: "5 min walk to metro" },
        { mode: "metro", from: `${from} Metro Station`, to: "City Centre Metro", time: 18, cost: 35, distance: 12, detail: "Blue Line · 6 stops" },
        { mode: "bus", from: "City Centre", to: to, time: 15, cost: 25, distance: 8, detail: "Route 42A · Direct" },
      ],
    },
    {
      id: "cheapest",
      label: "Cheapest",
      icon: <Wallet className="w-4 h-4" />,
      totalTime: 58,
      totalCost: 30,
      transfers: 2,
      badge: "Save ₹55",
      segments: [
        { mode: "walk", from: "Your Location", to: `${from} Bus Stop`, time: 8, cost: 0, distance: 0.6, detail: "8 min walk to bus stop" },
        { mode: "bus", from: `${from} Bus Stop`, to: "Junction", time: 26, cost: 18, distance: 15, detail: "Route 7 · 12 stops" },
        { mode: "bus", from: "Junction", to: to, time: 24, cost: 12, distance: 10, detail: "Route 19 · Direct" },
      ],
    },
    {
      id: "eco",
      label: "Eco Friendly",
      icon: <Leaf className="w-4 h-4" />,
      totalTime: 44,
      totalCost: 35,
      transfers: 1,
      badge: "Zero Carbon",
      segments: [
        { mode: "walk", from: "Your Location", to: `${from} Metro Station`, time: 5, cost: 0, distance: 0.4, detail: "5 min walk" },
        { mode: "metro", from: `${from} Metro Station`, to: `${to} Metro Station`, time: 30, cost: 35, distance: 18, detail: "Green Line · 9 stops" },
        { mode: "walk", from: `${to} Metro Station`, to: to, time: 9, cost: 0, distance: 0.7, detail: "9 min walk" },
      ],
    },
    {
      id: "comfortable",
      label: "Most Comfortable",
      icon: <Star className="w-4 h-4" />,
      totalTime: 28,
      totalCost: 180,
      transfers: 0,
      segments: [
        { mode: "auto", from: "Your Location", to: to, time: 28, cost: 180, distance: 20, detail: "Direct door-to-door · No transfers" },
      ],
    },
  ];
}

export function SmartRoutePlanner() {
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [routes, setRoutes] = useState<SmartRoute[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [expandedRoute, setExpandedRoute] = useState<RouteType | null>("fastest");
  const [bookingId, setBookingId] = useState<RouteType | null>(null);

  const handleSearch = () => {
    if (!fromCity || !toCity) {
      toast.error("Please enter both source and destination");
      return;
    }
    if (fromCity.trim().toLowerCase() === toCity.trim().toLowerCase()) {
      toast.error("Source and destination cannot be the same");
      return;
    }
    setSearching(true);
    setRoutes(null);
    setExpandedRoute("fastest");
    setTimeout(() => {
      setRoutes(generateRoutes(fromCity, toCity));
      setSearching(false);
      toast.success("Routes found!");
    }, 1500);
  };

  const handleBook = (route: SmartRoute) => {
    setBookingId(route.id);
    setTimeout(() => {
      try {
        const ticket = ticketService.generateRouteTicket({
          from: fromCity,
          to: toCity,
          fare: route.totalCost,
          routeLabel: route.label,
          segments: route.segments,
          totalTime: route.totalTime,
          transfers: route.transfers,
        });
        setBookingId(null);
        toast.success("Journey booked! Redirecting to ticket...");
        setTimeout(() => navigate(`/app/tickets/${ticket.id}`), 400);
      } catch {
        setBookingId(null);
        toast.error("Failed to book journey");
      }
    }, 1200);
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="bg-[#1a56db] rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Navigation className="w-5 h-5" />
          <h2 className="font-bold text-lg">Smart Route Planner</h2>
          <Badge className="bg-white/20 text-white text-xs ml-auto">AI</Badge>
        </div>
        <p className="text-white/70 text-xs mb-4">Combines Bus + Metro + Auto for best routes</p>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#1a56db]" /> From
              </label>
              <Input
                placeholder="Starting location or city"
                value={fromCity}
                onChange={e => setFromCity(e.target.value)}
                list="route-from-list"
                className="border-2 focus:border-[#1a56db] h-10"
              />
              <datalist id="route-from-list">
                {indianCities.map((c, i) => <option key={i} value={c} />)}
              </datalist>
            </div>

            <div className="flex justify-center -my-1">
              <Button
                variant="ghost" size="sm"
                onClick={() => { const t = fromCity; setFromCity(toCity); setToCity(t); }}
                className="rounded-full h-7 w-7 p-0 hover:bg-red-50"
              >
                <ArrowRight className="w-4 h-4 text-[#1a56db] rotate-90" />
              </Button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#1a56db]" /> To
              </label>
              <Input
                placeholder="Destination location or city"
                value={toCity}
                onChange={e => setToCity(e.target.value)}
                list="route-to-list"
                className="border-2 focus:border-[#1a56db] h-10"
              />
              <datalist id="route-to-list">
                {indianCities.map((c, i) => <option key={i} value={c} />)}
              </datalist>
            </div>

            <Button
              onClick={handleSearch}
              disabled={searching}
              className="w-full h-11 font-bold bg-[#1a56db] hover:bg-[#1242b0]"
            >
              {searching
                ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Finding Best Routes...</span>
                : <span className="flex items-center gap-2"><Navigation className="w-4 h-4" />Plan My Journey</span>}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Route Results */}
      <AnimatePresence>
        {routes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between px-1">
              <p className="font-bold text-gray-800 dark:text-white text-sm">{routes.length} Routes Found</p>
              <p className="text-xs text-gray-500">{fromCity} → {toCity}</p>
            </div>

            {routes.map((route, i) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className={`border-0 shadow-md overflow-hidden ${route.recommended ? "ring-2 ring-[#1a56db]/40" : ""}`}>
                  <CardContent className="p-0">
                    {/* Collapsible header */}
                    <button
                      className="w-full p-4 text-left"
                      onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-[#1a56db]">
                            {route.icon}
                          </div>
                          <span className="font-bold text-gray-800 dark:text-white text-sm">{route.label}</span>
                          {route.badge && (
                            <Badge className="bg-[#1a56db] text-white text-xs">{route.badge}</Badge>
                          )}
                        </div>
                        {expandedRoute === route.id
                          ? <ChevronUp className="w-4 h-4 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>

                      {/* Mode color bar */}
                      <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden mb-2">
                        {route.segments.map((seg, j) => (
                          <div key={j} className="flex-1 rounded-full" style={{ backgroundColor: modeColor(seg.mode) }} />
                        ))}
                      </div>

                      {/* Summary row */}
                      <div className="flex items-center gap-2 text-xs">
                        {route.segments.map((seg, j) => (
                          <span key={j} className="flex items-center gap-0.5" style={{ color: modeColor(seg.mode) }}>
                            {modeIcon(seg.mode)}
                            {j < route.segments.length - 1 && (
                              <ArrowRight className="w-2.5 h-2.5 text-gray-300" />
                            )}
                          </span>
                        ))}
                        <span className="ml-auto flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{route.totalTime} min</span>
                          <span className="font-bold text-gray-800 dark:text-white">₹{route.totalCost}</span>
                        </span>
                      </div>
                    </button>

                    {/* Expanded segments */}
                    <AnimatePresence>
                      {expandedRoute === route.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t dark:border-gray-700 pt-3 space-y-0">
                            {route.segments.map((seg, j) => (
                              <div key={j} className="flex gap-3">
                                {/* Left timeline */}
                                <div className="flex flex-col items-center w-8 flex-shrink-0">
                                  <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                                    style={{ backgroundColor: modeColor(seg.mode) }}
                                  >
                                    {modeIcon(seg.mode)}
                                  </div>
                                  {j < route.segments.length - 1 && (
                                    <div className="w-0.5 flex-1 min-h-[24px] my-1" style={{ backgroundColor: modeColor(seg.mode) + "50" }} />
                                  )}
                                </div>

                                {/* Right content */}
                                <div className={`flex-1 ${j < route.segments.length - 1 ? "pb-4" : "pb-0"}`}>
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="text-xs font-bold text-gray-800 dark:text-white">{seg.from}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{seg.detail}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                      <p className="text-xs text-gray-500">{seg.time} min</p>
                                      {seg.cost > 0 && <p className="text-xs font-bold text-[#1a56db]">₹{seg.cost}</p>}
                                    </div>
                                  </div>
                                  {j === route.segments.length - 1 && (
                                    <p className="text-xs font-bold text-gray-800 dark:text-white mt-3">{seg.to}</p>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Fare breakdown */}
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                              <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Fare Breakdown</p>
                              {route.segments.filter(s => s.cost > 0).map((seg, j) => (
                                <div key={j} className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  <span className="flex items-center gap-1" style={{ color: modeColor(seg.mode) }}>
                                    {modeIcon(seg.mode)} {modeLabel(seg.mode)}
                                  </span>
                                  <span>₹{seg.cost}</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-white border-t dark:border-gray-700 pt-1 mt-1">
                                <span>Total</span>
                                <span>₹{route.totalCost}</span>
                              </div>
                            </div>

                            <Button
                              className="w-full h-11 font-bold bg-[#1a56db] hover:bg-[#1242b0] mt-3 text-sm"
                              disabled={bookingId === route.id}
                              onClick={() => handleBook(route)}
                            >
                              {bookingId === route.id
                                ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Booking Journey...</span>
                                : <span className="flex items-center gap-2"><QrCode className="w-4 h-4" />Book Journey — ₹{route.totalCost}</span>}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it works — shown when no results yet */}
      {!routes && !searching && (
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm text-gray-800 dark:text-white">How Smart Routes Work</CardTitle>
          </CardHeader>
          <CardContent className="pb-4 space-y-3">
            {[
              { icon: <Bus className="w-4 h-4 text-[#1a56db]" />, label: "Bus", text: "Intercity & local buses for long distances" },
              { icon: <Train className="w-4 h-4 text-blue-600" />, label: "Metro", text: "Fast urban metro for city transit" },
              { icon: <Car className="w-4 h-4 text-amber-500" />, label: "Auto / Cab", text: "Last-mile connectivity and comfort rides" },
              { icon: <Navigation className="w-4 h-4 text-gray-500" />, label: "Walking", text: "Short walks between transit points" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.text}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
