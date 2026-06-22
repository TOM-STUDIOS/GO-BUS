import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { ticketService, Ticket, RouteSegment } from "../../services/tickets";
import { walletService } from "../../services/wallet";
import {
  MapPin, Calendar, Clock, Download, XCircle, CheckCircle2,
  Share2, Printer, ChevronLeft, Bus, Train, Navigation, Car,
  ChevronRight, QrCode, Zap,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const modeIcon = (mode: RouteSegment["mode"]) => {
  switch (mode) {
    case "walk": return <Navigation className="w-3 h-3" />;
    case "bus": return <Bus className="w-3 h-3" />;
    case "metro": return <Train className="w-3 h-3" />;
    case "auto": return <Car className="w-3 h-3" />;
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

function QRCodeSVG({ value }: { value: string }) {
  // Build a realistic 25x25 QR-like pattern
  const SIZE = 25;
  // Seed from value
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = Math.imul(31, h) + value.charCodeAt(i) | 0;
  }
  const rand = (n: number) => { h = Math.imul(1664525, h) + 1013904223 | 0; return ((h >>> 0) % n); };

  // Helper: set a rectangular block
  const grid: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
  const set = (r: number, c: number, v = true) => { if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) grid[r][c] = v; };
  const fillRect = (r: number, c: number, h: number, w: number, v = true) => {
    for (let dr = 0; dr < h; dr++) for (let dc = 0; dc < w; dc++) set(r + dr, c + dc, v);
  };

  // Finder pattern 7x7: solid border, white interior 5x5 border, solid 3x3 center
  const finder = (r: number, c: number) => {
    fillRect(r, c, 7, 7, true);        // outer solid
    fillRect(r+1, c+1, 5, 5, false);  // white ring
    fillRect(r+2, c+2, 3, 3, true);   // inner solid
  };

  // Draw three finders (TL, TR, BL)
  finder(0, 0);
  finder(0, SIZE - 7);
  finder(SIZE - 7, 0);

  // Separators (white rows/cols around finders)
  for (let i = 0; i <= 7; i++) {
    set(7, i, false); set(i, 7, false);          // TL
    set(7, SIZE-1-i, false); set(i, SIZE-8, false);  // TR
    set(SIZE-8, i, false); set(SIZE-1-i, 7, false);  // BL
  }

  // Timing patterns (row 6, col 6 between finders)
  for (let i = 8; i < SIZE - 8; i++) {
    set(6, i, i % 2 === 0);
    set(i, 6, i % 2 === 0);
  }

  // Small alignment pattern at (SIZE-9, SIZE-9) = position 16,16 for 25x25
  const align = (r: number, c: number) => {
    fillRect(r-2, c-2, 5, 5, true);
    fillRect(r-1, c-1, 3, 3, false);
    set(r, c, true);
  };
  align(SIZE - 7, SIZE - 7); // bottom-right alignment

  // Format info strips (dark modules around finders, simplified)
  const fmtPositions = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
  fmtPositions.forEach(([r, c]) => { if (!grid[r][c]) set(r, c, rand(3) > 0); });

  // Fill data modules with seeded noise (skip reserved areas)
  const isReserved = (r: number, c: number) => {
    if (r <= 8 && c <= 8) return true; // TL finder + format
    if (r <= 8 && c >= SIZE-8) return true; // TR finder + format
    if (r >= SIZE-8 && c <= 8) return true; // BL finder + format
    if (r === 6 || c === 6) return true; // timing
    if (r >= SIZE-9 && c >= SIZE-9) return true; // alignment
    return false;
  };

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!isReserved(r, c)) {
        grid[r][c] = rand(10) < 6; // ~60% fill like real QR data
      }
    }
  }

  const CELL = 8; // px per module
  const QUIET = 12; // quiet zone px
  const totalW = SIZE * CELL + QUIET * 2;
  const totalH = SIZE * CELL + QUIET * 2;

  return (
    <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 inline-flex">
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="w-48 h-48"
        shapeRendering="crispEdges"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* White background */}
        <rect width={totalW} height={totalH} fill="white"/>
        {/* Modules */}
        {grid.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <rect
                key={`${r}-${c}`}
                x={QUIET + c * CELL}
                y={QUIET + r * CELL}
                width={CELL}
                height={CELL}
                fill="#111827"
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

const typeLabel = (t: Ticket) => {
  switch (t.type) {
    case "metro": return "Metro Ticket";
    case "route": return "Multi-Modal Ticket";
    default: return `Bus Ticket`;
  }
};

const typeIcon = (type: Ticket["type"]) => {
  switch (type) {
    case "metro": return <Train className="w-5 h-5" />;
    case "route": return <Navigation className="w-5 h-5" />;
    default: return <Bus className="w-5 h-5" />;
  }
};

const statusBadge = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "used": return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    case "cancelled": return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    default: return "bg-yellow-100 text-yellow-700";
  }
};

export function TicketDetail() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (ticketId) {
      const found = ticketService.getTicketById(ticketId);
      setTicket(found || null);
      if (found?.status === "active") {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 }, colors: ["#1a56db", "#FF8A80", "#FFCDD2"] });
      }
    }
  }, [ticketId]);

  const handleCancel = async () => {
    if (!ticket) return;
    setCancelling(true);
    try {
      const { ticket: cancelled, refundAmount } = await ticketService.cancelTicket(ticket.id);
      await walletService.refund(refundAmount, `Refund for ticket ${ticket.id}`);
      toast.success(`Cancelled. ₹${refundAmount.toFixed(0)} refunded to wallet.`);
      navigate("/app/tickets");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  if (!ticket) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="py-14 text-center">
          <p className="text-gray-500 mb-4">Ticket not found</p>
          <Button className="bg-[#1a56db] hover:bg-[#1242b0]" onClick={() => navigate("/app/tickets")}>
            Back to Tickets
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate("/app/tickets")} className="mb-1">
        <ChevronLeft className="w-4 h-4" />My Tickets
      </Button>

      {/* Ticket card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-0 shadow-lg overflow-hidden">
          {/* Header band */}
          <div className="bg-[#1a56db] p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {typeIcon(ticket.type)}
                </div>
                <div>
                  <p className="font-bold text-base">{typeLabel(ticket)}</p>
                  <p className="text-white/70 text-xs font-mono">{ticket.id}</p>
                </div>
              </div>
              <Badge className={`${statusBadge(ticket.status)} border-0`}>
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Badge>
            </div>
          </div>

          <CardContent className="p-0">
            {/* From → To */}
            <div className="flex items-center p-4 gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">From</p>
                <p className="font-bold text-gray-800 dark:text-white truncate">{ticket.from}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-4 h-4 text-[#1a56db]" />
              </div>
              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs text-gray-400 mb-0.5">To</p>
                <p className="font-bold text-gray-800 dark:text-white truncate">{ticket.to}</p>
              </div>
            </div>

            {/* Dashed divider */}
            <div className="relative flex items-center mx-4">
              <div className="absolute -left-7 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800" />
              <div className="flex-1 border-t-2 border-dashed border-gray-200 dark:border-gray-700" />
              <div className="absolute -right-7 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>

            {/* QR Code — only for active tickets */}
            {ticket.status === "active" && (
              <div className="flex flex-col items-center py-5">
                <QRCodeSVG value={ticket.qrCode} />
                <p className="text-xs text-gray-400 mt-2 font-mono">{ticket.qrCode}</p>
                {ticket.type === "metro" && ticket.validUntil && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" />Valid until {ticket.validUntil}
                  </p>
                )}
                {ticket.type === "route" && (
                  <p className="text-xs text-gray-400 mt-1">Valid for today's journey</p>
                )}
                {ticket.type === "bus" && (
                  <p className="text-xs text-gray-400 mt-1">Show at bus gate for boarding</p>
                )}
              </div>
            )}

            {/* Dashed divider */}
            <div className="relative flex items-center mx-4 mb-4">
              <div className="absolute -left-7 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800" />
              <div className="flex-1 border-t-2 border-dashed border-gray-200 dark:border-gray-700" />
              <div className="absolute -right-7 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 px-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" />Date</p>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">{ticket.date}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" />Time</p>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">{ticket.time}</p>
              </div>

              {/* Bus specific */}
              {ticket.type === "bus" && ticket.busNumber && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Bus className="w-3 h-3" />Bus No.</p>
                  <p className="font-semibold text-gray-800 dark:text-white text-sm">{ticket.busNumber}</p>
                </div>
              )}
              {ticket.type === "bus" && ticket.seatNumber && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" />Seat</p>
                  <p className="font-bold text-[#1a56db] text-lg">{ticket.seatNumber}</p>
                </div>
              )}

              {/* Metro specific */}
              {ticket.type === "metro" && (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Train className="w-3 h-3" />City</p>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{ticket.metroCity}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Stops</p>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{ticket.metroStops} stops · {ticket.totalTime} min</p>
                  </div>
                  <div className="col-span-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Train className="w-3 h-3" />Line</p>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{ticket.metroLine}</p>
                    {ticket.interchange && (
                      <p className="text-xs text-orange-500 mt-0.5">Interchange at {ticket.interchange}</p>
                    )}
                  </div>
                </>
              )}

              {/* Route specific */}
              {ticket.type === "route" && (
                <>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Route Type</p>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{ticket.routeLabel}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" />Duration</p>
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{ticket.totalTime} min · {ticket.transfers} transfer{ticket.transfers !== 1 ? "s" : ""}</p>
                  </div>
                </>
              )}
            </div>

            {/* Route segments — for multi-modal */}
            {ticket.type === "route" && ticket.segments && ticket.segments.length > 0 && (
              <div className="mx-4 mb-4">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Journey Breakdown</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-0">
                  {ticket.segments.map((seg, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="flex flex-col items-center w-7 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: modeColor(seg.mode) }}>
                          {modeIcon(seg.mode)}
                        </div>
                        {i < ticket.segments!.length - 1 && (
                          <div className="w-0.5 flex-1 min-h-[16px] my-0.5" style={{ backgroundColor: modeColor(seg.mode) + "40" }} />
                        )}
                      </div>
                      <div className={`flex-1 ${i < ticket.segments!.length - 1 ? "pb-3" : "pb-0"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-semibold text-gray-800 dark:text-white">{seg.from}</p>
                            <p className="text-xs text-gray-400">{seg.detail}</p>
                          </div>
                          <div className="text-right ml-2">
                            <p className="text-xs text-gray-400">{seg.time}m</p>
                            {seg.cost > 0 && <p className="text-xs font-bold text-[#1a56db]">₹{seg.cost}</p>}
                          </div>
                        </div>
                        {i === ticket.segments!.length - 1 && (
                          <p className="text-xs font-semibold text-gray-800 dark:text-white mt-2">{seg.to}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fare */}
            <div className="mx-4 mb-4 flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
              <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">Total Fare</span>
              <span className="text-xl font-black text-[#1a56db]">₹{ticket.fare}</span>
            </div>

            {/* Boarded banner */}
            {ticket.boardingTime && (
              <div className="mx-4 mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <div>
                    <p className="font-semibold text-sm">Journey Completed</p>
                    <p className="text-xs">{new Date(ticket.boardingTime).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-4 pb-4 space-y-2">
              {ticket.status === "active" && (
                <>
                  {ticket.type === "bus" && (
                    <Button
                      onClick={() => navigate(`/app/boarding/${ticket.id}`)}
                      className="w-full bg-[#1a56db] hover:bg-[#1242b0] h-11 font-bold"
                    >
                      <QrCode className="h-4 w-4" />Show QR for Boarding
                    </Button>
                  )}

                  {ticket.type === "metro" && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center mb-2">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-0.5">Scan at Metro Gate</p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">Present the QR code above at any entry gate</p>
                    </div>
                  )}

                  {ticket.type === "route" && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center mb-2">
                      <p className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-0.5">Multi-Modal Journey Pass</p>
                      <p className="text-xs text-purple-600 dark:text-purple-300">Show QR at each boarding point along your route</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast.success("Ticket downloaded!")} className="flex items-center gap-1 justify-center">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { window.print(); toast.success("Sent to printer"); }} className="flex items-center gap-1 justify-center">
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.success("Ticket shared!")} className="flex items-center gap-1 justify-center">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {ticket.type === "bus" && (
                    <Button variant="outline" className="w-full" onClick={() => navigate(`/app/tracking/${ticket.id}`)}>
                      <MapPin className="h-4 w-4" />Track Live Location
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full text-red-600 hover:text-red-700 border-red-200" disabled={cancelling}>
                        <XCircle className="h-4 w-4" />Cancel Ticket
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Ticket?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will cancel your ticket and refund 85% of the fare (₹{(ticket.fare * 0.85).toFixed(0)}) to your wallet. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Ticket</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>Cancel Ticket</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              <Button variant="outline" className="w-full" onClick={() => navigate("/app/tickets")}>
                Back to My Tickets
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
