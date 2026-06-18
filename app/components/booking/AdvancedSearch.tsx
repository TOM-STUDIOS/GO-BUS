import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { getBusRoutes } from "../../services/busData";
import { indianCities } from "../../services/cities";
import { BusRoute } from "../../types/bus";
import {
  Star, ArrowRight, Wifi, BatteryCharging, Wind, Droplet,
  Tv, Snowflake, MapPinned, ChevronLeft, SlidersHorizontal,
  Clock, MapPin, Calendar, Search,
} from "lucide-react";

const PRIMARY = "#1a56db";
const ORANGE  = "#ff5500";

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi, charging: BatteryCharging, blanket: Wind,
  water: Droplet, tv: Tv, ac: Snowflake,
};

function formatDate(dateStr: string) {
  if (!dateStr) return { day: "", dow: "" };
  const d = new Date(dateStr);
  const day = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const dow = d.toLocaleDateString("en-IN", { weekday: "short" });
  return { day, dow };
}

export function AdvancedSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string; to?: string; date?: string } | null;

  const [from, setFrom] = useState(state?.from || "");
  const [to, setTo]     = useState(state?.to || "");
  const [date, setDate] = useState(state?.date || new Date().toISOString().split("T")[0]);
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [searched, setSearched] = useState(false);

  /* filters */
  const [busTypes, setBusTypes]         = useState<string[]>([]);
  const [departureTime, setDepartureTime] = useState<string[]>([]);
  const [priceRange, setPriceRange]     = useState([0, 100]);
  const [minRating, setMinRating]       = useState(0);
  const [amenities, setAmenities]       = useState<string[]>([]);
  const [sortBy, setSortBy]             = useState<"price"|"duration"|"rating"|"departure">("departure");
  const [filterOpen, setFilterOpen]     = useState(false);

  const doSearch = (overrideFilters?: boolean) => {
    const filtered = getBusRoutes({
      busType:       busTypes.length       ? busTypes       : undefined,
      departureTime: departureTime.length  ? departureTime  : undefined,
      priceRange:    { min: priceRange[0], max: priceRange[1] },
      minRating,
      amenities:     amenities.length      ? amenities      : undefined,
      sortBy,
    });
    setRoutes(filtered);
    setSearched(true);
  };

  useEffect(() => {
    if (state?.from && state?.to) doSearch();
  }, []);

  const toggle = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    cur: string[],
  ) => setter(cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val]);

  const { day, dow } = formatDate(date);
  const activeFilters = busTypes.length + departureTime.length + amenities.length + (minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#f0f4ff] flex flex-col">

      {/* ── RedBus-style compact header ── */}
      <div className="bg-white border-b border-[#dde5f4] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        {/* Back arrow only — no "Back" text */}
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Route + count */}
        <div className="flex-1 min-w-0">
          {from && to ? (
            <>
              <div className="flex items-center gap-1.5 font-black text-gray-900 text-base leading-tight">
                <span className="truncate">{from}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <span className="truncate">{to}</span>
              </div>
              {searched && (
                <p className="text-xs text-gray-400 mt-0.5">{routes.length} Buses</p>
              )}
            </>
          ) : (
            <p className="font-bold text-gray-900 text-base">Search Buses</p>
          )}
        </div>

        {/* Date pill — matches RedBus exactly */}
        {day && (
          <div className="flex-shrink-0 bg-[#fff0f0] border border-[#ffd5d5] rounded-2xl px-3 py-1.5 text-center min-w-[60px]">
            <p className="text-xs font-black text-gray-800 leading-tight">{day}</p>
            <p className="text-[10px] text-gray-400 leading-tight">{dow}</p>
          </div>
        )}
      </div>

      <div className="px-4 space-y-3 pt-3">
        {/* Search form — shown when no route selected yet */}
        {(!from || !to) && (
          <Card className="border border-[#dde5f4] shadow-sm rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" style={{ color: PRIMARY }} />From
                </label>
                <Input
                  placeholder="Starting city"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  list="as-from"
                  className="h-11 rounded-xl"
                />
                <datalist id="as-from">
                  {indianCities.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" style={{ color: ORANGE }} />To
                </label>
                <Input
                  placeholder="Destination city"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  list="as-to"
                  className="h-11 rounded-xl"
                />
                <datalist id="as-to">
                  {indianCities.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" style={{ color: PRIMARY }} />Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="h-11 rounded-xl"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <Button
                onClick={() => { if (from && to) doSearch(); }}
                className="w-full h-12 font-bold rounded-xl text-white"
                style={{ backgroundColor: ORANGE }}
              >
                <Search className="h-4 w-4" />
                SEARCH BUSES
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filter chips — RedBus style */}
        {searched && (
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {/* Filter & Sort */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#dde5f4] bg-white text-xs font-semibold text-gray-700 whitespace-nowrap flex-shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filter & Sort
                  {activeFilters > 0 && (
                    <span className="w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
                      {activeFilters}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filter & Sort</SheetTitle>
                  <SheetDescription>Refine your bus search</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6 pb-4">
                  <div>
                    <h4 className="mb-3 font-bold text-sm text-gray-800">Sort By</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: "departure", l: "Departure" },
                        { v: "price", l: "Price" },
                        { v: "duration", l: "Duration" },
                        { v: "rating", l: "Rating" },
                      ].map(({ v, l }) => (
                        <button
                          key={v}
                          onClick={() => setSortBy(v as any)}
                          className="py-2 rounded-xl text-xs font-semibold border transition-all"
                          style={sortBy === v
                            ? { backgroundColor: PRIMARY, color: "white", borderColor: PRIMARY }
                            : { backgroundColor: "white", color: "#374151", borderColor: "#dde5f4" }}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-bold text-sm text-gray-800">Bus Type</h4>
                    <div className="space-y-2.5">
                      {["AC", "Non-AC", "Sleeper", "Semi-Sleeper", "Volvo"].map(t => (
                        <div key={t} className="flex items-center gap-2">
                          <Checkbox
                            id={`bt-${t}`}
                            checked={busTypes.includes(t)}
                            onCheckedChange={() => toggle(t, setBusTypes, busTypes)}
                          />
                          <label htmlFor={`bt-${t}`} className="text-sm cursor-pointer">{t}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-bold text-sm text-gray-800">Departure Time</h4>
                    <div className="space-y-2.5">
                      {[
                        { v: "morning",   l: "Morning (6 AM – 12 PM)" },
                        { v: "afternoon", l: "Afternoon (12 PM – 6 PM)" },
                        { v: "evening",   l: "Evening (6 PM – 10 PM)" },
                        { v: "night",     l: "Night (10 PM – 6 AM)" },
                      ].map(({ v, l }) => (
                        <div key={v} className="flex items-center gap-2">
                          <Checkbox
                            id={`dt-${v}`}
                            checked={departureTime.includes(v)}
                            onCheckedChange={() => toggle(v, setDepartureTime, departureTime)}
                          />
                          <label htmlFor={`dt-${v}`} className="text-sm cursor-pointer">{l}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-bold text-sm text-gray-800">Price Range</h4>
                    <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={5} className="w-full" />
                    <div className="flex justify-between text-sm mt-2 text-gray-600">
                      <span>₹{priceRange[0] * 80}</span>
                      <span>₹{priceRange[1] * 80}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-bold text-sm text-gray-800">Minimum Rating</h4>
                    <div className="flex gap-2">
                      {[3, 3.5, 4, 4.5].map(r => (
                        <button
                          key={r}
                          onClick={() => setMinRating(minRating === r ? 0 : r)}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
                          style={minRating === r
                            ? { backgroundColor: PRIMARY, color: "white", borderColor: PRIMARY }
                            : { backgroundColor: "white", color: "#374151", borderColor: "#dde5f4" }}
                        >
                          {r}+
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1" onClick={() => {
                      setBusTypes([]); setDepartureTime([]); setPriceRange([0, 100]);
                      setMinRating(0); setAmenities([]); doSearch(); setFilterOpen(false);
                    }}>Clear All</Button>
                    <Button
                      className="flex-1 text-white"
                      style={{ backgroundColor: PRIMARY }}
                      onClick={() => { doSearch(); setFilterOpen(false); }}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Quick filter chips */}
            {[
              { l: "AC Buses",    v: "AC",      set: setBusTypes,      cur: busTypes },
              { l: "Sleeper",     v: "Sleeper",  set: setBusTypes,      cur: busTypes },
              { l: "Non-AC",      v: "Non-AC",   set: setBusTypes,      cur: busTypes },
              { l: "% Deals",     v: "deals",    set: setAmenities,     cur: amenities },
            ].map(({ l, v, set, cur }) => (
              <button
                key={v}
                onClick={() => toggle(v, set as any, cur)}
                className="px-3 py-2 rounded-full border text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all"
                style={cur.includes(v)
                  ? { backgroundColor: PRIMARY, color: "white", borderColor: PRIMARY }
                  : { backgroundColor: "white", color: "#374151", borderColor: "#dde5f4" }}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Bus listings */}
        {searched && (
          routes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">No buses found. Try adjusting filters.</p>
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {routes.map((route) => {
                const hasOffer = route.discount;
                const limitedSeats = route.seatsAvailable <= 5;
                return (
                  <div key={route.id} className="bg-white rounded-2xl border border-[#dde5f4] shadow-sm overflow-hidden relative">
                    {/* Offer ribbon */}
                    {hasOffer && (
                      <div
                        className="absolute top-0 right-0 text-[10px] font-bold text-white px-3 py-1 rounded-bl-xl"
                        style={{ backgroundColor: "#f5a623" }}
                      >
                        {route.discount!.percentage}% OFF
                      </div>
                    )}

                    <div className="p-4">
                      {/* Time row — RedBus style: large bold times */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-left">
                          <p className="text-2xl font-black text-gray-900 leading-none">{route.departureTime}</p>
                          <p className="text-xs text-gray-400 mt-1">{route.from}</p>
                        </div>

                        <div className="flex flex-col items-center flex-1 px-3">
                          <div className="flex items-center w-full">
                            <div className="h-px bg-gray-200 flex-1" />
                            <Clock className="w-3 h-3 text-gray-400 mx-1.5" />
                            <div className="h-px bg-gray-200 flex-1" />
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">{route.duration}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-black text-gray-900 leading-none">{route.arrivalTime}</p>
                          <p className="text-xs text-gray-400 mt-1">{route.to}</p>
                        </div>
                      </div>

                      {/* Seats */}
                      <p className="text-xs mb-3" style={{ color: limitedSeats ? ORANGE : "#6B7280" }}>
                        {route.duration} · {" "}
                        <span style={{ color: limitedSeats ? ORANGE : "#16a34a" }}>
                          {route.seatsAvailable} Seats
                        </span>
                      </p>

                      {/* Divider */}
                      <div className="border-t border-[#f0f0f0] my-3" />

                      {/* Operator row */}
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-sm text-gray-800 truncate">{route.operator.name}</p>
                            {route.liveTracking && <MapPinned className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
                            {route.operator.verified && (
                              <span className="text-[10px] text-green-600 font-semibold flex-shrink-0">✓</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{route.busType}</p>
                        </div>

                        {/* Price + Rating */}
                        <div className="text-right flex-shrink-0 ml-3">
                          {hasOffer && (
                            <p className="text-xs text-gray-400 line-through">₹{Math.round(route.baseFare * 80 * 1.15)}</p>
                          )}
                          <p className="text-xl font-black text-gray-900">₹{route.baseFare * 80}</p>
                          <p className="text-[10px] text-gray-400">Onwards</p>
                        </div>
                      </div>

                      {/* Amenities */}
                      {route.amenities.length > 0 && (
                        <div className="flex gap-1.5 mt-3 flex-wrap">
                          {route.amenities.slice(0, 5).map(a => {
                            const Icon = amenityIcons[a.id] || Wifi;
                            return (
                              <span key={a.id} className="flex items-center gap-1 bg-[#f5f7ff] rounded-full px-2 py-0.5 text-[10px] text-gray-500">
                                <Icon className="w-3 h-3" />{a.name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Bottom action row */}
                    <div className="border-t border-[#f0f0f0] px-4 py-3 flex items-center justify-between bg-[#fafbff]">
                      {/* Rating badge — gold like RedBus */}
                      <div className="flex items-center gap-1.5 bg-[#f5a623] text-white px-2.5 py-1 rounded-lg">
                        <Star className="w-3 h-3 fill-white" />
                        <span className="text-xs font-black">{route.rating}</span>
                        <span className="text-[10px] opacity-80">/ {route.reviews}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/app/reviews/${route.id}`, { state: { route } })}
                          className="text-xs h-9 px-3 rounded-xl border-[#dde5f4]"
                        >
                          Reviews
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/app/bus/${route.id}`, { state: { route } })}
                          className="text-xs h-9 px-4 rounded-xl text-white font-bold"
                          style={{ backgroundColor: PRIMARY }}
                        >
                          View Seats
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
