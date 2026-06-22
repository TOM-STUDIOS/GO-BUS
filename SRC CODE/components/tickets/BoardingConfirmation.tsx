import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ticketService, Ticket } from "../../services/tickets";
import { bluetoothService } from "../../services/bluetooth";
import { QrCode, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function BoardingConfirmation() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (ticketId) {
      const found = ticketService.getTicketById(ticketId);
      setTicket(found || null);
    }
  }, [ticketId]);

  const handleScanAndBoard = async () => {
    if (!ticket) return;

    setScanning(true);
    try {
      const busPresent = await bluetoothService.checkBusPresence(ticket.busNumber);

      if (busPresent) {
        await ticketService.useTicket(ticket.id);
        setVerified(true);
        toast.success("Boarding confirmed! Have a great journey!");
        setTimeout(() => {
          navigate("/app/tickets");
        }, 3000);
      } else {
        toast.error("Bus not found nearby. Please move closer to the bus.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Boarding failed");
    } finally {
      setScanning(false);
    }
  };

  if (!ticket) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p>Ticket not found</p>
          <Button onClick={() => navigate("/app/tickets")} className="mt-4">
            Back to Tickets
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (ticket.status !== "active") {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <p className="text-gray-600 mb-4">This ticket is not active</p>
          <Button onClick={() => navigate("/app/tickets")}>Back to Tickets</Button>
        </CardContent>
      </Card>
    );
  }

  if (verified) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Boarding Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your ticket has been validated. Enjoy your journey!</p>
            <div className="space-y-2 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-gray-600">Bus:</span>
                <span className="font-semibold">{ticket.busNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-semibold">{ticket.route}</span>
              </div>
              {ticket.seatNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-semibold">{ticket.seatNumber}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Board Your Bus</CardTitle>
          <CardDescription>Show this QR code to the driver</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
            <p className="text-2xl font-bold mb-2">Bus {ticket.busNumber}</p>
            <p className="text-blue-100">{ticket.route}</p>
            {ticket.seatNumber && (
              <p className="text-blue-100 mt-2">Seat: {ticket.seatNumber}</p>
            )}
          </div>

          <div className="flex justify-center py-8">
            <div className="bg-white p-8 rounded-lg border-4 border-dashed border-gray-300 shadow-lg">
              <QrCode className="w-48 h-48 text-gray-700" />
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">QR Code</p>
            <p className="font-mono text-xs">{ticket.qrCode}</p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Show this QR code to the driver when boarding.
              The driver will scan it to validate your ticket.
            </p>
          </div>

          <Button onClick={handleScanAndBoard} className="w-full" disabled={scanning}>
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirm Boarding
              </>
            )}
          </Button>

          <Button variant="outline" onClick={() => navigate(`/app/tickets/${ticket.id}`)} className="w-full">
            Back to Ticket
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
