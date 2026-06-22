import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";

interface Route {
  id: string;
  busNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  fare: number;
  seatsAvailable: number;
}

const mockRoutes: Route[] = [
  {
    id: "route_1",
    busNumber: "42A",
    from: "Downtown",
    to: "Central Station",
    departure: "09:00 AM",
    arrival: "10:30 AM",
    duration: "1h 30m",
    fare: 15.00,
    seatsAvailable: 23,
  },
  {
    id: "route_2",
    busNumber: "15",
    from: "Downtown",
    to: "Airport",
    departure: "10:15 AM",
    arrival: "11:45 AM",
    duration: "1h 30m",
    fare: 25.00,
    seatsAvailable: 12,
  },
  {
    id: "route_3",
    busNumber: "7B",
    from: "Downtown",
    to: "University",
    departure: "11:00 AM",
    arrival: "12:15 PM",
    duration: "1h 15m",
    fare: 12.00,
    seatsAvailable: 8,
  },
];

export function SearchBus() {
  const navigate = useNavigate();
  const location = useLocation();
  const [from, setFrom] = useState("Downtown");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const filtered = mockRoutes.filter(
      route => route.from.toLowerCase().includes(from.toLowerCase()) &&
              route.to.toLowerCase().includes(to.toLowerCase())
    );
    setRoutes(filtered);
    setSearched(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5" />
            Search Buses
          </CardTitle>
          <CardDescription>Find your perfect journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Enter departure location"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Enter destination"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full">
            <Search className="h-4 w-4" />
            Search Buses
          </Button>
        </CardContent>
      </Card>

      {searched && routes.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-600">No buses found for this route. Try different locations.</p>
          </CardContent>
        </Card>
      )}

      {routes.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Available Routes</h3>
          {routes.map((route) => (
            <Card key={route.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/app/route/${route.id}`, { state: { route } })}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xl font-bold">Bus {route.busNumber}</p>
                    <p className="text-sm text-gray-600">{route.seatsAvailable} seats available</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${route.fare}</p>
                    <p className="text-sm text-gray-600">per person</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{route.from}</p>
                    <p className="text-sm text-gray-600">{route.departure}</p>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <ArrowRight className="w-5 h-5" />
                    <span className="text-sm mx-2">{route.duration}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{route.to}</p>
                    <p className="text-sm text-gray-600">{route.arrival}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
