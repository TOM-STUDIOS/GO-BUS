import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { MapPin, Navigation, Clock, Phone, AlertCircle, CheckCircle2 } from "lucide-react";

interface BusLocation {
  currentLocation: string;
  nextStop: string;
  progress: number;
  estimatedArrival: string;
  speed: number;
  delay: number;
}

export function LiveTracking() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [busLocation, setBusLocation] = useState<BusLocation>({
    currentLocation: "Highway Junction, Mile 45",
    nextStop: "Green Valley Rest Stop",
    progress: 35,
    estimatedArrival: "09:15 AM",
    speed: 65,
    delay: 0,
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Simulate live tracking updates
    const interval = setInterval(() => {
      setBusLocation(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 3, 100),
        speed: 60 + Math.random() * 20,
      }));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stops = [
    { name: "Downtown Terminal", time: "06:00 AM", status: "completed" },
    { name: "West Gate", time: "06:15 AM", status: "completed" },
    { name: "Highway Junction", time: "06:30 AM", status: "completed" },
    { name: "Green Valley Rest Stop", time: "07:45 AM", status: "in-progress" },
    { name: "Mountain Pass", time: "08:30 AM", status: "pending" },
    { name: "Central Station", time: "09:30 AM", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5" />
            Live Bus Tracking
          </CardTitle>
          <CardDescription>Real-time location of your bus</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-[#1a56db] text-white border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-red-100 text-sm">Current Location</p>
              <p className="text-xl font-bold">{busLocation.currentLocation}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">
              <Navigation className="w-8 h-8" />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Journey Progress</span>
              <span>{busLocation.progress.toFixed(0)}%</span>
            </div>
            <Progress value={busLocation.progress} className="h-3 bg-white/20" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-blue-100 text-xs">Speed</p>
              <p className="font-semibold">{busLocation.speed.toFixed(0)} km/h</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs">ETA</p>
              <p className="font-semibold">{busLocation.estimatedArrival}</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs">Delay</p>
              <p className="font-semibold">
                {busLocation.delay > 0 ? `+${busLocation.delay} min` : "On Time"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journey Timeline</CardTitle>
          <CardDescription>Track your bus journey in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stops.map((stop, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stop.status === "completed"
                        ? "bg-green-600"
                        : stop.status === "in-progress"
                        ? "bg-[#1a56db] animate-pulse"
                        : "bg-gray-300"
                    }`}
                  >
                    {stop.status === "completed" && (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    )}
                    {stop.status === "in-progress" && (
                      <MapPin className="w-5 h-5 text-white" />
                    )}
                  </div>
                  {index < stops.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        stop.status === "completed" ? "bg-green-600" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{stop.name}</p>
                      <p className="text-sm text-gray-600">{stop.time}</p>
                    </div>
                    {stop.status === "in-progress" && (
                      <Badge className="bg-blue-600">In Transit</Badge>
                    )}
                    {stop.status === "completed" && (
                      <Badge className="bg-green-600">Completed</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button variant="outline" size="sm" onClick={() => setLastUpdated(new Date())}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="py-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-orange-900">Need Help?</p>
              <p className="text-sm text-orange-700 mt-1">
                Contact the bus operator for any queries
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Phone className="w-4 h-4" />
                Call Driver
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" onClick={() => navigate("/app/tickets")} className="w-full">
        Back to Tickets
      </Button>
    </div>
  );
}
