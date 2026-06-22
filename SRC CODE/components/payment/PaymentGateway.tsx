import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { paymentService } from "../../services/payment";
import { walletService } from "../../services/wallet";
import { ticketService } from "../../services/tickets";
import { authService } from "../../services/auth";
import { offerService, Offer } from "../../services/offers";
import { Wallet, CreditCard, Smartphone, Loader2, Tag, Percent, X, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { BookingFlowHeader } from "../booking/BookingFlowHeader";

const PRIMARY = "#1a56db";
const ORANGE  = "#ff5500";

export function PaymentGateway() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { route, selectedSeats, selectedBoarding, selectedDropping, bookingData, totalFare, discount, travelInsurance, appliedOffer } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card" | "upi">("wallet");
  const [loading,       setLoading]       = useState(false);
  const [walletBalance, setWalletBalance] = useState(authService.getCurrentUser()?.walletBalance || 0);
  const [cardDetails,   setCardDetails]   = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [upiId,         setUpiId]         = useState("");
  const [couponCode,    setCouponCode]    = useState("");
  const [appliedOfferState, setAppliedOfferState] = useState<Offer | null>(appliedOffer || null);
  const [currentDiscount,   setCurrentDiscount]   = useState(discount || 0);

  const baseFare   = totalFare + (currentDiscount || 0);
  const finalAmount = baseFare - currentDiscount;

  if (!route || !bookingData || !selectedSeats) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">Invalid booking details</p>
        <Button onClick={() => navigate("/app/search")} style={{ backgroundColor: PRIMARY }} className="text-white">Back to Search</Button>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    const result = offerService.validateOffer(couponCode, baseFare);
    if (result.valid && result.offer) {
      const d = offerService.calculateDiscount(result.offer, baseFare);
      setAppliedOfferState(result.offer);
      setCurrentDiscount(d);
      toast.success(`Saved ₹${(d * 80).toFixed(0)}!`);
    } else {
      toast.error(result.error || "Invalid coupon");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await paymentService.processPayment({
        amount: finalAmount,
        description: `Bus ticket - ${route.busNumber}`,
        method: paymentMethod,
        ...(paymentMethod === "card" && { cardDetails }),
        ...(paymentMethod === "upi" && { upiId }),
      });

      if (response.success) {
        const ticket = ticketService.generateTicket({
          busNumber: route.busNumber,
          route: `${route.from} to ${route.to}`,
          from: selectedBoarding?.name || route.from,
          to: selectedDropping?.name || route.to,
          date: new Date().toISOString().split("T")[0],
          time: route.departureTime,
          fare: finalAmount,
          seatNumber: selectedSeats.map((s: any) => s.number).join(", "),
        });
        navigate("/app/payment/success", { state: { ticket, transactionId: response.transactionId } });
      } else {
        navigate("/app/payment/failure", { state: { message: response.message, transactionId: response.transactionId } });
      }
    } catch (error) {
      navigate("/app/payment/failure", { state: { message: error instanceof Error ? error.message : "Payment failed" } });
    } finally {
      setLoading(false);
    }
  };

  const insufficientWallet = paymentMethod === "wallet" && walletBalance < finalAmount;

  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      <BookingFlowHeader
        from={route.from}
        to={route.to}
        date={new Date().toISOString().split("T")[0]}
        subtitle={`${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""} · ${route.operator.name}`}
        step={3}
      />

      <div className="px-4 py-4 pb-36 space-y-3">
        {/* Fare summary */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-black text-gray-900">{route.operator.name}</p>
              <p className="text-xs text-gray-400">{route.busType}</p>
            </div>
            <div className="flex items-center gap-0.5 bg-[#f5a623] text-white px-2 py-0.5 rounded text-xs font-bold">
              <Star className="w-3 h-3 fill-white" />{route.rating}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mb-3">
            {selectedSeats.map((s: any) => (
              <span key={s.id} className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: PRIMARY }}>
                Seat {s.number}
              </span>
            ))}
          </div>
          <div className="space-y-1.5 pt-3 border-t border-[#f0f4ff] text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Base fare</span>
              <span className="font-semibold text-gray-800">₹{(baseFare * 80).toFixed(0)}</span>
            </div>
            {currentDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedOfferState?.code})</span>
                <span className="font-semibold">-₹{(currentDiscount * 80).toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-[#f0f4ff]">
              <span className="font-black text-gray-900">Total</span>
              <span className="font-black text-xl" style={{ color: PRIMARY }}>₹{(finalAmount * 80).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Coupon */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] p-4">
          <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5 mb-3">
            <Tag className="w-4 h-4" style={{ color: ORANGE }} />Coupon Code
          </p>
          {!appliedOfferState ? (
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                className="h-11 rounded-xl flex-1"
              />
              <Button onClick={handleApplyCoupon} variant="outline" className="h-11 px-5 rounded-xl font-bold border-[#dde5f4]">Apply</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
              <div>
                <p className="font-bold text-green-700 text-sm">{appliedOfferState.code} · Saved ₹{(currentDiscount * 80).toFixed(0)}</p>
              </div>
              <button
                onClick={() => { setAppliedOfferState(null); setCurrentDiscount(0); setCouponCode(""); }}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f0f4ff]">
            <p className="font-bold text-gray-800 text-sm">Payment Method</p>
          </div>
          <div className="p-4">
            <Tabs value={paymentMethod} onValueChange={v => setPaymentMethod(v as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-4 rounded-xl">
                <TabsTrigger value="wallet" className="rounded-xl text-xs gap-1">
                  <Wallet className="w-3.5 h-3.5" />Wallet
                </TabsTrigger>
                <TabsTrigger value="card" className="rounded-xl text-xs gap-1">
                  <CreditCard className="w-3.5 h-3.5" />Card
                </TabsTrigger>
                <TabsTrigger value="upi" className="rounded-xl text-xs gap-1">
                  <Smartphone className="w-3.5 h-3.5" />UPI
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-[#f0f4ff] rounded-xl">
                  <span className="text-sm text-gray-600">Available Balance</span>
                  <span className="text-2xl font-black" style={{ color: PRIMARY }}>₹{(walletBalance * 80).toFixed(0)}</span>
                </div>
                {insufficientWallet && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-xs text-red-600 font-semibold mb-2">Insufficient balance</p>
                    <Button size="sm" variant="outline" onClick={() => navigate("/app/wallet")} className="text-xs h-8 rounded-lg">
                      Add Money to Wallet
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="card" className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Card Number</label>
                  <Input placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })} maxLength={19} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Cardholder Name</label>
                  <Input placeholder="Full name on card" value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })} className="h-11 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Expiry</label>
                    <Input placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} maxLength={5} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">CVV</label>
                    <Input type="password" placeholder="•••" value={cardDetails.cvv} onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })} maxLength={3} className="h-11 rounded-xl" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upi" className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">UPI ID</label>
                  <Input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} className="h-11 rounded-xl" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["GPay", "PhonePe", "Paytm", "BHIM"].map(app => (
                    <button key={app} className="px-3 py-1.5 rounded-xl border border-[#dde5f4] text-xs font-semibold text-gray-600 hover:border-blue-300 hover:bg-blue-50 transition-all">
                      {app}
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Secured by 256-bit SSL encryption
        </div>
      </div>

      {/* Sticky pay button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#dde5f4] px-4 py-3 shadow-lg z-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">You pay</p>
            <p className="text-xl font-black" style={{ color: PRIMARY }}>₹{(finalAmount * 80).toFixed(0)}</p>
          </div>
          <Button
            onClick={handlePayment}
            disabled={loading || insufficientWallet}
            className="text-white font-bold h-12 px-8 rounded-xl flex-shrink-0"
            style={{ backgroundColor: insufficientWallet ? "#D1D5DB" : ORANGE }}
          >
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Processing...</span>
            ) : (
              `PAY ₹${(finalAmount * 80).toFixed(0)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
