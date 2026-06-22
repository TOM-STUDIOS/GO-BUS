import { useLocation, useNavigate, useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MapPin, Clock, DollarSign, Users, ArrowRight } from "lucide-react";

export function SelectRoute() {
  const navigate = useNavigate();
  const { routeId } = useParams();
  const location = useLocation();
  const route = location.state?.route;

  if (!route) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>Route not found</p>
          <Button onClick={() => navigate("/app/search")} className="mt-4">
            Back to Search
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bus {route.busNumber}</CardTitle>
          <CardDescription>Review route details before booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="text-xl font-bold">{route.from}</p>
              <p className="text-sm text-gray-600">{route.departure}</p>
            </div>
            <div className="flex flex-col items-center">
              <ArrowRight className="w-6 h-6 text-blue-600" />
              <p className="text-sm text-gray-600 mt-1">{route.duration}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">To</p>
              <p className="text-xl font-bold">{route.to}</p>
              <p className="text-sm text-gray-600">{route.arrival}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Fare</p>
                <p className="font-bold">${route.fare}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="font-bold">{route.seatsAvailable} seats</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Route Information</h4>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                <div>
                  <p className="font-medium">Boarding Point</p>
                  <p className="text-sm text-gray-600">{route.from} Bus Terminal</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-2 mt-1 text-gray-400" />
                <div>
                  <p className="font-medium">Estimated Duration</p>
                  <p className="text-sm text-gray-600">{route.duration}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate("/app/search")} className="flex-1">
              Back
            </Button>
            <Button onClick={() => navigate(`/app/booking/${routeId}`, { state: { route } })} className="flex-1">
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
