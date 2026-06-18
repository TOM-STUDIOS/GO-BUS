import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { generateSeatLayout } from "../../services/busData";
import { BusRoute, Seat, SeatLayout, BoardingPoint, DroppingPoint } from "../../types/bus";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Armchair, Star, MapPin, Clock, Info } from "lucide-react";
import { BookingFlowHeader } from "./BookingFlowHeader";
import { motion } from "motion/react";

const PRIMARY = "#1a56db";
const ORANGE  = "#ff5500";

export function SeatSelection() {
  const { busId } = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();
  const route: BusRoute = location.state?.route;

  const [seatLayout, setSeatLayout]         = useState<SeatLayout | null>(null);
  const [selectedSeats, setSelectedSeats]   = useState<Seat[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<BoardingPoint | null>(null);
  const [selectedDropping, setSelectedDropping] = useState<DroppingPoint | null>(null);

  useEffect(() => {
    if (route) setSeatLayout(generateSeatLayout(route.totalSeats, route.busType));
  }, [route]);

  if (!route || !seatLayout) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">Route not found</p>
        <Button onClick={() => navigate("/app/search")} style={{ backgroundColor: PRIMARY }} className="text-white">
          Back to Search
        </Button>
      </div>
    );
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== "available") return;
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else if (selectedSeats.length < 6) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatStyle = (seat: Seat): string => {
    if (selectedSeats.find(s => s.id === seat.id))
      return "bg-[#1a56db] text-white shadow-md border-[#1a56db]";
    if (seat.status === "booked")   return "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300";
    if (seat.status === "ladies")   return "bg-pink-100 text-pink-600 border-pink-300";
    if (seat.status === "blocked")  return "bg-gray-200 cursor-not-allowed border-gray-200";
    return "bg-white border-2 border-gray-200 hover:border-[#1a56db] hover:bg-blue-50 cursor-pointer";
  };

  const totalFare = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const canProceed = selectedSeats.length > 0 && selectedBoarding && selectedDropping;

  const handleProceed = () => {
    if (!canProceed) return;
    navigate("/app/booking-details", {
      state: { route, selectedSeats, selectedBoarding, selectedDropping, totalFare },
    });
  };

  const SeatGrid = ({ deck }: { deck: Seat[][] }) => (
    <div className="space-y-2.5">
      {deck.map((row, ri) => (
        <div key={ri} className="flex justify-center gap-2">
          {row.map((seat, ci) => (
            <div key={seat.id} className="relative">
              {ci === Math.floor(row.length / 2) && <div className="w-6" />}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.status !== "available"}
                className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center text-xs font-bold border-2 transition-all ${getSeatStyle(seat)}`}
              >
                <Armchair className="w-4 h-4" />
                <span className="text-[9px] mt-0.5">{seat.number}</span>
              </motion.button>
              {seat.price > route.baseFare && (
                <div className="absolute -top-1 -right-1 text-white text-[7px] px-1 rounded-full font-bold" style={{ backgroundColor: ORANGE }}>
                  W
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      <BookingFlowHeader
        from={route.from}
        to={route.to}
        date={new Date().toISOString().split("T")[0]}
        subtitle={`${route.operator.name} · ${route.busType}`}
        step={1}
      />

      <div className="px-4 py-4 space-y-3 pb-36">
        {/* Bus info strip */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-black text-gray-900">{route.operator.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{route.busNumber} · {route.busType}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <div className="flex items-center gap-0.5 bg-[#f5a623] text-white px-1.5 py-0.5 rounded text-[11px] font-bold">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  {route.rating}
                </div>
                <span className="text-xs text-gray-400">({route.reviews} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900">₹{(route.baseFare * 80).toFixed(0)}</p>
              <p className="text-[10px] text-gray-400">per seat</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#f0f4ff]">
            <div className="text-center">
              <p className="font-black text-gray-900">{route.departureTime}</p>
              <p className="text-[10px] text-gray-400">{route.from}</p>
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-px bg-gray-200 flex-1" />
              <Clock className="w-3 h-3 text-gray-400 mx-1.5" />
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            <div className="text-center">
              <p className="font-black text-gray-900">{route.arrivalTime}</p>
              <p className="text-[10px] text-gray-400">{route.to}</p>
            </div>
          </div>
        </div>

        {/* Seat legend */}
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Available",  cls: "bg-white border-2 border-gray-200" },
            { label: "Selected",   cls: "bg-[#1a56db]" },
            { label: "Booked",     cls: "bg-gray-300" },
            { label: "Ladies",     cls: "bg-pink-100 border-2 border-pink-300" },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-md ${cls}`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Seat map */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] overflow-hidden">
          <div className="bg-gray-800 text-white text-center py-2 text-xs font-bold tracking-widest">
            DRIVER
          </div>
          <div className="p-4">
            {seatLayout.upperDeck ? (
              <Tabs defaultValue="lower">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="lower">Lower Deck</TabsTrigger>
                  <TabsTrigger value="upper">Upper Deck</TabsTrigger>
                </TabsList>
                <TabsContent value="lower"><SeatGrid deck={seatLayout.lowerDeck} /></TabsContent>
                <TabsContent value="upper"><SeatGrid deck={seatLayout.upperDeck} /></TabsContent>
              </Tabs>
            ) : (
              <SeatGrid deck={seatLayout.lowerDeck} />
            )}
          </div>
        </div>

        {/* Boarding Point */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f0f4ff]">
            <p className="font-bold text-gray-800 text-sm">Boarding Point</p>
          </div>
          <RadioGroup
            value={selectedBoarding?.id}
            onValueChange={v => setSelectedBoarding(route.boardingPoints.find(p => p.id === v) || null)}
          >
            {route.boardingPoints.map(point => (
              <label
                key={point.id}
                htmlFor={`bp-${point.id}`}
                className="flex items-start gap-3 px-4 py-3 border-b border-[#f0f4ff] last:border-0 cursor-pointer hover:bg-blue-50/50 transition-colors"
              >
                <RadioGroupItem value={point.id} id={`bp-${point.id}`} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{point.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{point.address}</p>
                  {point.landmark && <p className="text-xs text-gray-400 truncate">{point.landmark}</p>}
                </div>
                <p className="font-bold text-sm flex-shrink-0" style={{ color: PRIMARY }}>{point.time}</p>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Dropping Point */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f0f4ff]">
            <p className="font-bold text-gray-800 text-sm">Dropping Point</p>
          </div>
          <RadioGroup
            value={selectedDropping?.id}
            onValueChange={v => setSelectedDropping(route.droppingPoints.find(p => p.id === v) || null)}
          >
            {route.droppingPoints.map(point => (
              <label
                key={point.id}
                htmlFor={`dp-${point.id}`}
                className="flex items-start gap-3 px-4 py-3 border-b border-[#f0f4ff] last:border-0 cursor-pointer hover:bg-blue-50/50 transition-colors"
              >
                <RadioGroupItem value={point.id} id={`dp-${point.id}`} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{point.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{point.address}</p>
                </div>
                <p className="font-bold text-sm flex-shrink-0" style={{ color: PRIMARY }}>{point.time}</p>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#dde5f4] px-4 py-3 shadow-lg z-10">
        {selectedSeats.length > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex gap-1 flex-wrap">
                {selectedSeats.map(s => (
                  <span key={s.id} className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: PRIMARY }}>
                    {s.number}
                  </span>
                ))}
              </div>
              <p className="text-lg font-black text-gray-900 mt-0.5">₹{(totalFare * 80).toFixed(0)}</p>
            </div>
            <Button
              onClick={handleProceed}
              disabled={!canProceed}
              className="text-white font-bold h-12 px-6 rounded-xl flex-shrink-0"
              style={{ backgroundColor: canProceed ? ORANGE : "#D1D5DB" }}
            >
              {canProceed ? "PROCEED" : (
                <span className="flex items-center gap-1.5 text-xs">
                  <Info className="w-3.5 h-3.5" />
                  Select points
                </span>
              )}
            </Button>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400 font-medium">Select at least one seat</p>
        )}
      </div>
    </div>
  );
}
