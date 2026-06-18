import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ticketService, Ticket } from "../../services/tickets";
import { Ticket as TicketIcon, Calendar, Clock, MapPin, Bus, Train, Navigation, ChevronRight } from "lucide-react";

const typeIcon = (type: Ticket["type"]) => {
  switch (type) {
    case "metro": return <Train className="w-4 h-4" />;
    case "route": return <Navigation className="w-4 h-4" />;
    default: return <Bus className="w-4 h-4" />;
  }
};

const typeLabel = (type: Ticket["type"]) => {
  switch (type) {
    case "metro": return "Metro";
    case "route": return "Multi-Modal";
    default: return "Bus";
  }
};

const typeColor = (type: Ticket["type"]) => {
  // all red per brand
  return "#1a56db";
};

const statusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "used": return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    case "cancelled": return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    case "expired": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    default: return "bg-gray-100 text-gray-600";
  }
};

function TicketCard({ ticket }: { ticket: Ticket }) {
  const navigate = useNavigate();
  const color = typeColor(ticket.type);

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => navigate(`/app/tickets/${ticket.id}`)}
      className="cursor-pointer"
    >
      <Card className="border-0 shadow-md overflow-hidden">
        {/* Top color stripe */}
        <div className="h-1" style={{ backgroundColor: color }} />
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            {/* Type + ID */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: color }}>
                {typeIcon(ticket.type)}
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{typeLabel(ticket.type)} Ticket</p>
                <p className="text-xs text-gray-400 font-mono">{ticket.id}</p>
              </div>
            </div>
            <Badge className={`text-xs ${statusColor(ticket.status)}`}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
          </div>

          {/* Route */}
          <div className="flex items-center gap-2 mb-3 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">From</p>
              <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{ticket.from}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center flex-shrink-0 shadow-sm">
              <ChevronRight className="w-4 h-4 text-[#1a56db]" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">To</p>
              <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{ticket.to}</p>
            </div>
          </div>

          {/* Details row */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />{ticket.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />{ticket.time}
            </span>
            {ticket.type === "metro" && ticket.totalTime && (
              <span className="flex items-center gap-1">
                <Train className="w-3 h-3" />{ticket.metroStops} stops
              </span>
            )}
            {ticket.type === "route" && ticket.totalTime && (
              <span className="flex items-center gap-1">
                <Navigation className="w-3 h-3" />{ticket.totalTime} min
              </span>
            )}
            {ticket.type === "bus" && ticket.seatNumber && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />Seat {ticket.seatNumber}
              </span>
            )}
          </div>

          {/* Metro line badge */}
          {ticket.type === "metro" && ticket.metroLine && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
              <Train className="w-3 h-3" />{ticket.metroLine} · {ticket.metroCity}
            </p>
          )}
          {ticket.type === "route" && ticket.routeLabel && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
              <Navigation className="w-3 h-3" />{ticket.routeLabel} Route · {ticket.transfers} transfer{ticket.transfers !== 1 ? "s" : ""}
            </p>
          )}

          {/* Fare */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Fare</span>
            <span className="font-bold text-[#1a56db]">₹{ticket.fare}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function MyTickets() {
  const navigate = useNavigate();
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [pastTickets, setPastTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const all = ticketService.getTickets();
    setActiveTickets(all.filter(t => t.status === "active"));
    setPastTickets(all.filter(t => t.status !== "active"));
  }, []);

  const EmptyState = ({ message, actionLabel, onAction }: { message: string; actionLabel: string; onAction: () => void }) => (
    <Card className="border-0 shadow-md">
      <CardContent className="py-14 text-center">
        <div className="w-16 h-16 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <TicketIcon className="w-8 h-8 text-[#1a56db]" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{message}</p>
        <Button className="bg-[#1a56db] hover:bg-[#1242b0]" onClick={onAction}>{actionLabel}</Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#1a56db] rounded-xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <TicketIcon className="w-5 h-5" />
          <h2 className="font-bold text-lg">My Tickets</h2>
        </div>
        <div className="flex gap-3">
          {[
            { label: "Active", count: activeTickets.length, icon: <Bus className="w-3.5 h-3.5" /> },
            { label: "Past", count: pastTickets.length, icon: <Clock className="w-3.5 h-3.5" /> },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
              {stat.icon}
              <span className="text-xs font-medium">{stat.count} {stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="data-[state=active]:bg-[#1a56db] data-[state=active]:text-white">
            Active ({activeTickets.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-[#1a56db] data-[state=active]:text-white">
            Past ({pastTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3 mt-3">
          {activeTickets.length === 0 ? (
            <EmptyState
              message="No active tickets. Book a bus, metro, or smart route to see your tickets here."
              actionLabel="Book a Journey"
              onAction={() => navigate("/app")}
            />
          ) : (
            activeTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-3">
          {pastTickets.length === 0 ? (
            <EmptyState
              message="No past tickets yet."
              actionLabel="Book a Journey"
              onAction={() => navigate("/app")}
            />
          ) : (
            pastTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
