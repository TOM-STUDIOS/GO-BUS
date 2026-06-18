import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  ArrowLeftRight, MapPin, Clock, Zap, Train, ChevronRight,
  Search, AlertCircle, QrCode, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ticketService } from "../../services/tickets";

const metroNetworks = [
  {
    city: "Delhi",
    lines: [
      { name: "Red Line", color: "#E53935", stations: ["Dilshad Garden", "Jhilmil", "Mansarovar Park", "Shahdara", "Welcome", "Seelampur", "Shastri Park", "Kashmere Gate", "Tis Hazari", "Pul Bangash", "Pratap Nagar", "Inderlok", "Kanhaiya Nagar", "Keshav Puram", "Netaji Subhash Place", "Kohat Enclave", "Pitampura", "Rohini East", "Rohini West", "Rithala"] },
      { name: "Yellow Line", color: "#F9A825", stations: ["Samaypur Badli", "Rohini Sector 18-19", "Haiderpur Badli Mor", "Jahangirpuri", "Adarsh Nagar", "Azadpur", "Model Town", "GTB Nagar", "Vishwa Vidyalaya", "Vidhan Sabha", "Civil Lines", "Chandni Chowk", "Chawri Bazar", "New Delhi", "Rajiv Chowk", "Patel Chowk", "Central Secretariat", "Udyog Bhawan", "Lok Kalyan Marg", "Jorbagh", "INA", "AIIMS", "Safdurjung", "Hauz Khas", "Malviya Nagar", "Saket", "Qutab Minar", "Chhatarpur", "Sultanpur", "Huda City Centre"] },
      { name: "Blue Line", color: "#1a56db", stations: ["Dwarka Sector 21", "Dwarka Sector 8", "Dwarka", "Dwarka Mor", "Nawada", "Uttam Nagar West", "Uttam Nagar East", "Janakpuri West", "Janakpuri East", "Tilak Nagar", "Subhash Nagar", "Tagore Garden", "Rajouri Garden", "Ramesh Nagar", "Moti Nagar", "Kirti Nagar", "Shadipur", "Patel Nagar", "Rajendra Place", "Karol Bagh", "Jhandewalan", "Ramakrishna Ashram Marg", "Barakhamba Road", "Mandi House", "Indraprastha", "Yamuna Bank", "Akshardham", "Mayur Vihar Phase 1", "New Ashok Nagar", "Noida Sector 15", "Noida Sector 16", "Noida Sector 18", "Botanical Garden"] },
      { name: "Green Line", color: "#2E7D32", stations: ["Inderlok", "Ashok Park Main", "Punjabi Bagh", "Shivaji Park", "Madipur", "Paschim Vihar East", "Paschim Vihar West", "Peeragarhi", "Udyog Nagar", "Surajmal Stadium", "Nangloi", "Nangloi Railway Station", "Rajdhani Park", "Mundka"] },
    ],
  },
  {
    city: "Mumbai",
    lines: [
      { name: "Line 1 (Versova–Ghatkopar)", color: "#E53935", stations: ["Versova", "D N Nagar", "Azad Nagar", "Andheri", "Western Express Highway", "Chakala", "Airport Road", "Marol Naka", "Saki Naka", "Asalpha", "Jagruti Nagar", "Ghatkopar"] },
      { name: "Line 2A (Dahisar–DN Nagar)", color: "#2E7D32", stations: ["Dahisar East", "Anand Nagar", "Kandarpada", "Eksar", "Borivali", "IC Colony", "Poisar", "Magathane", "Devipada", "Gorai", "Pahadi Goregaon", "Aarey", "Bangurnagar", "Kurar Village", "Akurli", "D N Nagar"] },
      { name: "Line 7 (Andheri–Dahisar)", color: "#F57C00", stations: ["Andheri East", "Marol Naka", "Saki Naka", "Asalpha", "Ghatkopar", "Mogharpada", "Vinoba Bhave Nagar", "Shivaji Nagar", "Pratiksha Nagar", "Acharya Atre Chowk", "Wadala", "GTB Nagar", "Dahisar East"] },
    ],
  },
  {
    city: "Bangalore",
    lines: [
      { name: "Purple Line", color: "#6A1B9A", stations: ["Baiyappanahalli", "Swami Vivekananda Road", "Indiranagar", "Halasuru", "Trinity", "Majestic", "Magadi Road", "Hosahalli", "Vijayanagar", "Attiguppe", "Deepanjali Nagar", "Mysuru Road", "Kengeri"] },
      { name: "Green Line", color: "#2E7D32", stations: ["Nagasandra", "Dasarahalli", "Jalahalli", "Peenya Industry", "Peenya", "Yeshwantpur", "Sandal Soap Factory", "Mahalakshmi", "Rajajinagar", "Srirampura", "Majestic", "Chickpete", "National College", "Lalbagh", "South End Circle", "Jayanagar", "Banashankari", "JP Nagar", "Yelachenahalli"] },
    ],
  },
  {
    city: "Chennai",
    lines: [
      { name: "Blue Line", color: "#1a56db", stations: ["Wimco Nagar", "Tiruvotriyur", "Tollgate", "New Washermanpet", "Washermanpet", "Tondiarpet", "Sir Theagaraya College", "Park Town", "Chennai Central", "Government Estate", "LIC", "Thousand Lights", "AG-DMS", "Teynampet", "Nandanam", "Saidapet", "Little Mount", "Guindy", "Alandur", "St Thomas Mount", "Nanganallur Road", "Chennai Airport"] },
    ],
  },
  {
    city: "Hyderabad",
    lines: [
      { name: "Red Line", color: "#E53935", stations: ["Miyapur", "JNTU College", "KPHB Colony", "Kukatpally", "Balanagar", "Moosapet", "Bharat Nagar", "Erragadda", "ESI Hospital", "SR Nagar", "Ameerpet", "Punjagutta", "Irrum Manzil", "Khairatabad", "Lakdikapul", "Assembly", "Nampally", "Gandhi Bhavan", "Osmania Medical College", "MJ Market", "MG Bus Station"] },
      { name: "Blue Line", color: "#1a56db", stations: ["Nagole", "Uppal", "Survey of India", "Tarnaka", "Habsiguda", "Stadium", "Malakpet", "New Market", "Musarambagh", "Dilsukhnagar", "Chaitanyapuri", "LB Nagar"] },
      { name: "Green Line", color: "#2E7D32", stations: ["JNTU College", "Madhura Nagar", "Yusufguda", "Jubilee Hills Road No 5", "Filmnagar", "Hitech City", "Durgam Cheruvu", "Madhapur", "Raidurg"] },
    ],
  },
];

interface RouteResult {
  lineName: string;
  lineColor: string;
  from: string;
  to: string;
  stops: number;
  time: number;
  fare: number;
  interchange?: string;
  isInterchange: boolean;
}

export function MetroPlanner() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [results, setResults] = useState<RouteResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [buyingIdx, setBuyingIdx] = useState<number | null>(null);

  const currentNetwork = metroNetworks.find(n => n.city === selectedCity)!;
  const allStations = [...new Set(currentNetwork.lines.flatMap(l => l.stations))];

  const handleSearch = () => {
    if (!fromStation || !toStation) {
      toast.error("Please enter both source and destination stations");
      return;
    }
    if (fromStation === toStation) {
      toast.error("Source and destination cannot be the same");
      return;
    }
    setSearching(true);
    setResults(null);

    setTimeout(() => {
      const fromLine = currentNetwork.lines.find(l => l.stations.includes(fromStation));
      const toLine = currentNetwork.lines.find(l => l.stations.includes(toStation));

      if (!fromLine || !toLine) {
        toast.error("Station not found in selected city");
        setSearching(false);
        return;
      }

      const routes: RouteResult[] = [];

      if (fromLine.name === toLine.name) {
        const fromIdx = fromLine.stations.indexOf(fromStation);
        const toIdx = fromLine.stations.indexOf(toStation);
        const stops = Math.abs(toIdx - fromIdx);
        routes.push({
          lineName: fromLine.name,
          lineColor: fromLine.color,
          from: fromStation,
          to: toStation,
          stops,
          time: stops * 2 + 3,
          fare: Math.max(10, Math.min(60, stops * 5)),
          isInterchange: false,
        });
      } else {
        // Find interchange station (appears in both lines)
        const interchangeStation =
          fromLine.stations.find(s => toLine.stations.includes(s)) ||
          "Central Station";

        routes.push({
          lineName: `${fromLine.name} → ${toLine.name}`,
          lineColor: fromLine.color,
          from: fromStation,
          to: toStation,
          stops: 8,
          time: 24,
          fare: 40,
          interchange: interchangeStation,
          isInterchange: true,
        });

        // Alternative: longer single line if available
        routes.push({
          lineName: toLine.name,
          lineColor: toLine.color,
          from: fromStation,
          to: toStation,
          stops: 13,
          time: 32,
          fare: 30,
          interchange: interchangeStation,
          isInterchange: true,
        });
      }

      setResults(routes);
      setSearching(false);
      toast.success(`Found ${routes.length} route${routes.length > 1 ? "s" : ""}`);
    }, 1300);
  };

  const handleBuyTicket = (result: RouteResult, idx: number) => {
    setBuyingIdx(idx);
    setTimeout(() => {
      try {
        const ticket = ticketService.generateMetroTicket({
          from: result.from,
          to: result.to,
          fare: result.fare,
          metroCity: selectedCity,
          metroLine: result.lineName,
          metroStops: result.stops,
          interchange: result.interchange,
          time: result.time,
        });
        setBuyingIdx(null);
        toast.success("Metro ticket booked! Redirecting...");
        setTimeout(() => navigate(`/app/tickets/${ticket.id}`), 500);
      } catch {
        setBuyingIdx(null);
        toast.error("Failed to book ticket");
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
        <div className="flex items-center gap-2 mb-3">
          <Train className="w-5 h-5" />
          <h2 className="font-bold text-lg">Metro Planner</h2>
          <Badge className="bg-white/20 text-white text-xs ml-auto">Live</Badge>
        </div>

        {/* City Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
          {metroNetworks.map(n => (
            <button
              key={n.city}
              onClick={() => {
                setSelectedCity(n.city);
                setFromStation("");
                setToStation("");
                setResults(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCity === n.city ? "bg-white text-[#1a56db]" : "bg-white/20 text-white"
              }`}
            >
              {n.city}
            </button>
          ))}
        </div>

        {/* Search Card */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#1a56db]" /> From Station
              </label>
              <Input
                placeholder="Source station"
                value={fromStation}
                onChange={e => setFromStation(e.target.value)}
                list="metro-from-list"
                className="border-2 focus:border-[#1a56db] h-10"
              />
              <datalist id="metro-from-list">
                {allStations.map((s, i) => <option key={i} value={s} />)}
              </datalist>
            </div>

            <div className="flex justify-center -my-1">
              <Button
                variant="ghost" size="sm"
                onClick={() => { const t = fromStation; setFromStation(toStation); setToStation(t); }}
                className="rounded-full h-7 w-7 p-0 hover:bg-red-50"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#1a56db]" />
              </Button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#1a56db]" /> To Station
              </label>
              <Input
                placeholder="Destination station"
                value={toStation}
                onChange={e => setToStation(e.target.value)}
                list="metro-to-list"
                className="border-2 focus:border-[#1a56db] h-10"
              />
              <datalist id="metro-to-list">
                {allStations.map((s, i) => <option key={i} value={s} />)}
              </datalist>
            </div>

            <Button
              onClick={handleSearch}
              disabled={searching}
              className="w-full h-11 font-bold bg-[#1a56db] hover:bg-[#1242b0]"
            >
              {searching
                ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Finding Routes...</span>
                : <span className="flex items-center gap-2"><Search className="w-4 h-4" />Find Metro Route</span>}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Metro Lines Map */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm text-gray-800 dark:text-white flex items-center gap-2">
            <Train className="w-4 h-4 text-[#1a56db]" />
            {selectedCity} Metro Lines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          {currentNetwork.lines.map(line => (
            <div key={line.name} className="flex items-center gap-3 py-1.5">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: line.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{line.name}</p>
                <p className="text-xs text-gray-400 truncate">{line.stations[0]} → {line.stations[line.stations.length - 1]}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{line.stations.length} stations</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Search Results */}
      <AnimatePresence>
        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-sm font-bold text-gray-700 dark:text-white px-1">
              {results.length} Route{results.length > 1 ? "s" : ""} Found
            </p>

            {results.map((result, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border-0 shadow-md overflow-hidden">
                  {/* Line color bar */}
                  <div className="h-1.5" style={{ backgroundColor: result.lineColor }} />
                  <CardContent className="p-4">
                    {/* Route header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{result.lineName}</p>
                        {result.isInterchange && result.interchange && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3 text-orange-500 flex-shrink-0" />
                            <span className="text-xs text-orange-600 dark:text-orange-400">Interchange at {result.interchange}</span>
                          </div>
                        )}
                      </div>
                      <Badge className="text-white text-xs flex-shrink-0" style={{ backgroundColor: result.lineColor }}>
                        ₹{result.fare}
                      </Badge>
                    </div>

                    {/* Journey info */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 mb-3">
                      <span className="font-medium truncate">{result.from}</span>
                      <ChevronRight className="w-3 h-3 flex-shrink-0 text-gray-400" />
                      <span className="font-medium truncate">{result.to}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{result.time} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <Train className="w-3 h-3" />{result.stops} stops
                      </span>
                      {result.isInterchange && (
                        <span className="flex items-center gap-1 text-orange-500">
                          <Zap className="w-3 h-3" />1 interchange
                        </span>
                      )}
                    </div>

                    {/* Station visual */}
                    <div className="flex items-center gap-0 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-400 bg-white dark:bg-gray-800" />
                      <div className="flex-1 h-0.5" style={{ backgroundColor: result.lineColor }} />
                      {result.interchange && (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full border-2 border-orange-400 bg-orange-100 mx-0" />
                          <div className="flex-1 h-0.5 bg-gray-300" />
                        </>
                      )}
                      <div className="w-2.5 h-2.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: result.lineColor, backgroundColor: result.lineColor }} />
                    </div>

                    {/* Book button */}
                    <Button
                      className="w-full h-11 font-bold bg-[#1a56db] hover:bg-[#1242b0] text-sm"
                      disabled={buyingIdx === i}
                      onClick={() => handleBuyTicket(result, i)}
                    >
                      {buyingIdx === i
                        ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Booking Ticket...</span>
                        : <span className="flex items-center gap-2"><QrCode className="w-4 h-4" />Book & Get QR Ticket — ₹{result.fare}</span>}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Status */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm flex items-center gap-2 text-gray-800 dark:text-white">
            <Zap className="w-4 h-4 text-green-500" />Live Service Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4 space-y-0">
          {currentNetwork.lines.map((line, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
                <span className="text-xs text-gray-700 dark:text-gray-300">{line.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">On Time</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
