import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { authService } from "../../services/auth";
import { User, Mail, Phone, Users } from "lucide-react";

export function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const route = location.state?.route;
  const user = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    passengers: 1,
  });

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

  const totalFare = route.fare * formData.passengers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app/payment", {
      state: {
        route,
        bookingData: formData,
        totalFare,
      },
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>Bus {route.busNumber} - {route.from} to {route.to}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your name"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter your phone"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengers">Number of Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max={route.seatsAvailable}
                  value={formData.passengers}
                  onChange={(e) => handleChange("passengers", parseInt(e.target.value))}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-sm text-gray-600">{route.seatsAvailable} seats available</p>
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Fare per passenger:</span>
                <span className="font-semibold">${route.fare}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Number of passengers:</span>
                <span className="font-semibold">{formData.passengers}</span>
              </div>
              <div className="flex justify-between items-center text-xl">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold text-blue-600">${totalFare.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Proceed to Payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
