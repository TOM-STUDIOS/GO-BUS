import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle, Download, Ticket } from "lucide-react";
import confetti from "canvas-confetti";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ticket, transactionId } = location.state || {};

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (!ticket) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>No ticket information found</p>
          <Button onClick={() => navigate("/app")} className="mt-4">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">Booking Confirmed!</CardTitle>
          <CardDescription>Your bus ticket has been successfully booked</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
            <p className="font-mono text-sm">{transactionId}</p>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Ticket ID:</span>
              <span className="font-semibold">{ticket.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bus Number:</span>
              <span className="font-semibold">{ticket.busNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Route:</span>
              <span className="font-semibold">{ticket.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-semibold">{ticket.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-semibold">{ticket.time}</span>
            </div>
            {ticket.seatNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Seat Number:</span>
                <span className="font-semibold">{ticket.seatNumber}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t">
              <span className="font-bold">Total Paid:</span>
              <span className="font-bold text-green-600">₹{(ticket.fare * 80).toFixed(0)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate(`/app/tickets/${ticket.id}`)} className="w-full bg-[#1a56db] hover:bg-[#1242b0]">
              <Ticket className="h-4 w-4" />
              VIEW MY TICKET
            </Button>
            <Button variant="outline" onClick={() => navigate("/app")} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
