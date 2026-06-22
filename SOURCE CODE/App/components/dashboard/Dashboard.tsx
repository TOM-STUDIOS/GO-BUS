import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { authService } from "../../services/auth";
import { bluetoothService, NearbyBus } from "../../services/bluetooth";
import { ticketService } from "../../services/tickets";
import { indianCities } from "../../services/cities";
import {
  Search, MapPin, Wallet, Bluetooth, Loader2, Clock,
  Users, Tag, Calendar, ArrowLeftRight, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { MetroPlanner } from "../metro/MetroPlanner";
import { SmartRoutePlanner } from "../routes/SmartRoutePlanner";

/* ── Brand tokens ── */
const PRIMARY = "#1a56db";
const ORANGE  = "#ff5500";

/* ── Custom SVG tab icons ── */
function BusIcon({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
      <rect x="3" y="7" width="22" height="14" rx="3.5" fill={active ? "white" : PRIMARY} opacity={active ? 1 : 0.15}/>
      <rect x="3" y="7" width="22" height="14" rx="3.5" stroke={active ? PRIMARY : PRIMARY} strokeWidth="1.8"/>
      <rect x="5.5" y="9.5" width="6" height="4" rx="1.2" fill={active ? PRIMARY : PRIMARY}/>
      <rect x="16.5" y="9.5" width="6" height="4" rx="1.2" fill={active ? PRIMARY : PRIMARY}/>
      <path d="M3 16h22" stroke={active ? PRIMARY : PRIMARY} strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M14 7v14" stroke={active ? PRIMARY : PRIMARY} strokeWidth="1.3" strokeLinecap="round" opacity="0.25"/>
      <circle cx="7.5" cy="23" r="2" fill={active ? PRIMARY : PRIMARY}/>
      <circle cx="20.5" cy="23" r="2" fill={active ? PRIMARY : PRIMARY}/>
    </svg>
  );
}
function MetroIcon({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
      <rect x="5" y="5" width="18" height="16" rx="4" fill={active ? "white" : PRIMARY} opacity={active ? 1 : 0.15}/>
      <rect x="5" y="5" width="18" height="16" rx="4" stroke={active ? PRIMARY : PRIMARY} strokeWidth="1.8"/>
      <rect x="7.5" y="8" width="5" height="6" rx="1.5" fill={active ? PRIMARY : PRIMARY}/>
      <rect x="15.5" y="8" width="5" height="6" rx="1.5" fill={active ? PRIMARY : PRIMARY}/>
      <path d="M5 18h18" stroke={active ? PRIMARY : PRIMARY} strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="10" cy="22.5" r="1.8" fill={active ? PRIMARY : PRIMARY}/>
      <circle cx="18" cy="22.5" r="1.8" fill={active ? PRIMARY : PRIMARY}/>
      <path d="M2.5 26h5M20.5 26h5" stroke={active ? PRIMARY : PRIMARY} strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}
function RoutesIcon({ active }: { active?: boolean }) {
  const c = active ? PRIMARY : PRIMARY;
  return (
    <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
      <circle cx="7" cy="7" r="3" fill={c} opacity="0.2" stroke={c} strokeWidth="1.6"/>
      <circle cx="21" cy="21" r="3" fill={c} opacity="0.2" stroke={c} strokeWidth="1.6"/>
      <circle cx="21" cy="7" r="2" fill={c} opacity="0.15" stroke={c} strokeWidth="1.4"/>
      <path d="M7 7 C7 14 21 14 21 21" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2.5 2"/>
      <path d="M7 7 L21 7" stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity="0.35"/>
      <circle cx="7" cy="7" r="1.8" fill={c}/>
      <circle cx="21" cy="21" r="1.8" fill={c}/>
      <path d="M17 21l3 3 3-3" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

type TransportTab = "bus" | "metro" | "routes";
const TAB_LABELS: Record<TransportTab, string> = { bus: "Bus", metro: "Metro", routes: "Routes" };

export function Dashboard() {
  /* ── State ── */
  const navigate = useNavigate();
  const [user] = useState(authService.getCurrentUser());
  const [nearbyBuses, setNearbyBuses] = useState<NearbyBus[]>([]);
  const [scanning, setScanning] = useState(false);
  const [activeTicketsCount, setActiveTicketsCount] = useState(0);
  const [activeTab, setActiveTab] = useState<TransportTab>("bus");
  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    setActiveTicketsCount(ticketService.getActiveTickets().length);
  }, []);

  const handleScan = async () => {
    setScanning(true);
    try {
      const buses = await bluetoothService.startScan();
      setNearbyBuses(buses);
      if (!buses.length) toast.info("No nearby buses found.");
    } catch { toast.error("Failed to scan for buses"); }
    finally { setScanning(false); }
  };

  const handleSearch = () => {
    if (!searchForm.from || !searchForm.to) {
      toast.error("Please enter both starting point and destination");
      return;
    }
    navigate("/app/search", { state: searchForm });
  };

  const occupancyColor = (o: string) =>
    o === "low" ? "bg-green-500" : o === "medium" ? "bg-yellow-500" : "bg-red-500";

  const popularRoutes = [
    { from: "Mumbai", to: "Pune" },
    { from: "Bangalore", to: "Chennai" },
    { from: "Delhi", to: "Jaipur" },
    { from: "Hyderabad", to: "Vijayawada" },
  ];

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* MARKER-MAKE-KIT-INVOKED */}

      {/* ── Transport Mode Tab Bar ── */}
      <Card className="border border-[#dde5f4] shadow-sm rounded-2xl overflow-hidden p-0">
        <div className="flex">
          {(["bus", "metro", "routes"] as TransportTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all duration-200 relative"
                style={{
                  color: isActive ? "white" : "#64748b",
                  backgroundColor: isActive ? PRIMARY : "white",
                  borderRadius: isActive ? "12px" : "0",
                }}
              >
                {tab === "bus" && <BusIcon active={isActive} />}
                {tab === "metro" && <MetroIcon active={isActive} />}
                {tab === "routes" && <RoutesIcon active={isActive} />}
                <span className="uppercase tracking-widest text-[10px]">{TAB_LABELS[tab]}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {activeTab === "bus" && (
          <motion.div
            key="bus"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Search card */}
            <Card className="border border-[#dde5f4] shadow-sm rounded-2xl">
              <CardContent className="p-4 space-y-3">
                {/* From */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" style={{ color: PRIMARY }} />From
                  </label>
                  <Input
                    placeholder="Enter starting city"
                    value={searchForm.from}
                    onChange={e => setSearchForm({ ...searchForm, from: e.target.value })}
                    className="h-11 rounded-xl border-[#dde5f4]"
                    list="from-cities"
                  />
                  <datalist id="from-cities">
                    {indianCities.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>

                {/* Swap */}
                <div className="flex justify-center -my-1">
                  <motion.button
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSearchForm({ ...searchForm, from: searchForm.to, to: searchForm.from })}
                    className="w-8 h-8 rounded-full border-2 border-[#dde5f4] bg-white flex items-center justify-center shadow-sm"
                  >
                    <ArrowLeftRight className="w-4 h-4" style={{ color: PRIMARY }} />
                  </motion.button>
                </div>

                {/* To */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" style={{ color: ORANGE }} />To
                  </label>
                  <Input
                    placeholder="Enter destination city"
                    value={searchForm.to}
                    onChange={e => setSearchForm({ ...searchForm, to: e.target.value })}
                    className="h-11 rounded-xl border-[#dde5f4]"
                    list="to-cities"
                  />
                  <datalist id="to-cities">
                    {indianCities.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" style={{ color: PRIMARY }} />Date
                  </label>
                  <Input
                    type="date"
                    value={searchForm.date}
                    onChange={e => setSearchForm({ ...searchForm, date: e.target.value })}
                    className="h-11 rounded-xl border-[#dde5f4]"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Orange CTA — matches image exactly */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSearch}
                    className="w-full h-12 font-bold rounded-xl text-white shadow-md"
                    style={{ backgroundColor: ORANGE }}
                  >
                    <Search className="h-4 w-4" />
                    SEARCH BUSES
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Popular Routes — horizontal scroll chips like the image */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-sm font-bold text-gray-700">Popular Routes</p>
                <button className="text-xs font-semibold" style={{ color: PRIMARY }}>View All →</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {popularRoutes.map((r, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchForm({ ...searchForm, from: r.from, to: r.to })}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border"
                    style={{ backgroundColor: "#e8f0fe", color: PRIMARY, borderColor: "#c7d9fb" }}
                  >
                    <MapPin className="w-3 h-3" />
                    {r.from} → {r.to}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Wallet + Tickets row */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Card
                  className="border border-[#dde5f4] shadow-sm rounded-2xl cursor-pointer"
                  onClick={() => navigate("/app/wallet")}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#e8f0fe" }}>
                      <Wallet className="w-5 h-5" style={{ color: PRIMARY }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">Wallet Balance</p>
                      <p className="font-black text-lg leading-tight truncate" style={{ color: PRIMARY }}>
                        ₹{((user?.walletBalance || 0) * 80).toFixed(0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Card
                  className="border border-[#dde5f4] shadow-sm rounded-2xl cursor-pointer"
                  onClick={() => navigate("/app/tickets")}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#fff1eb" }}>
                      <Tag className="w-5 h-5" style={{ color: ORANGE }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">My Tickets</p>
                      <p className="font-black text-lg leading-tight" style={{ color: "#111827" }}>{activeTicketsCount}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Nearby Buses */}
            <Card className="border border-[#dde5f4] shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: "#e8f0fe" }}>
                    <MapPin className="w-4 h-4 m-2" style={{ color: PRIMARY }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Nearby Buses</p>
                    <p className="text-xs text-gray-400">Scan at your location</p>
                  </div>
                </div>
                <Button
                  onClick={handleScan}
                  disabled={scanning}
                  variant="outline"
                  className="w-full h-10 font-bold rounded-xl border-2"
                  style={{ borderColor: PRIMARY, color: PRIMARY }}
                >
                  {scanning
                    ? <><Loader2 className="h-4 w-4 animate-spin" />Scanning...</>
                    : <><Bluetooth className="h-4 w-4" />SCAN NEARBY BUSES</>}
                </Button>

                {nearbyBuses.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {nearbyBuses.map(bus => (
                      <div
                        key={bus.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#dde5f4] cursor-pointer hover:border-blue-300 transition-colors"
                        onClick={() => navigate("/app/search", { state: { selectedBus: bus } })}
                      >
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Bus {bus.number}</p>
                          <p className="text-xs text-gray-500">{bus.route} · {bus.destination}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${occupancyColor(bus.occupancy)} text-white text-xs mb-1`}>{bus.occupancy}</Badge>
                          <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />{bus.arrivalTime} min
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* More Transport + Offers row — matches image bottom section */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2 px-1">More Transport Options</p>
              <div className="grid grid-cols-2 gap-3">
                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Card
                    className="border border-[#dde5f4] shadow-sm rounded-2xl cursor-pointer"
                    onClick={() => setActiveTab("metro")}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e8f0fe" }}>
                          <MetroIcon />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Metro</p>
                          <p className="text-xs text-gray-400">5 Cities</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Card
                    className="border border-[#dde5f4] shadow-sm rounded-2xl cursor-pointer"
                    onClick={() => setActiveTab("routes")}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e8f0fe" }}>
                          <RoutesIcon />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">Smart Routes</p>
                          <p className="text-xs text-gray-400">AI Powered</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Offers + Refer row */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Card
                  className="border border-[#dde5f4] shadow-sm rounded-2xl cursor-pointer"
                  onClick={() => navigate("/app/offers")}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fff1eb" }}>
                        <Tag className="w-5 h-5" style={{ color: ORANGE }} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">4 Offers</p>
                        <p className="text-xs text-gray-400">Available</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Card
                  className="border border-[#dde5f4] shadow-sm rounded-2xl cursor-pointer"
                  onClick={() => navigate("/app/refer")}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fff1eb" }}>
                        <Users className="w-5 h-5" style={{ color: ORANGE }} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">Earn ₹40</p>
                        <p className="text-xs text-gray-400">Per Referral</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Special Offers banner */}
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="border border-[#dde5f4] shadow-sm rounded-2xl cursor-pointer overflow-hidden"
                onClick={() => navigate("/app/offers")}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#e8f0fe" }}>
                      <Tag className="w-5 h-5" style={{ color: PRIMARY }} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Special Offers</p>
                      <p className="text-xs text-gray-500">Save up to 15% on all modes</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "metro" && (
          <motion.div key="metro" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <MetroPlanner />
          </motion.div>
        )}

        {activeTab === "routes" && (
          <motion.div key="routes" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            <SmartRoutePlanner />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
