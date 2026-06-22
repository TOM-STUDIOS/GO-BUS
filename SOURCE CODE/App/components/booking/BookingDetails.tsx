import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { authService } from "../../services/auth";
import { offerService, Offer } from "../../services/offers";
import { User, Mail, Phone, Tag, Percent, Shield, AlertCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { BookingFlowHeader } from "./BookingFlowHeader";

const PRIMARY = "#1a56db";
const ORANGE  = "#ff5500";

export function BookingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { route, selectedSeats, selectedBoarding, selectedDropping, totalFare } = location.state || {};
  const user = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    name:             user?.name  || "",
    email:            user?.email || "",
    phone:            user?.phone || "",
    emergencyContact: "",
  });

  const [couponCode,          setCouponCode]          = useState("");
  const [appliedOffer,        setAppliedOffer]        = useState<Offer | null>(null);
  const [travelInsurance,     setTravelInsurance]     = useState(false);
  const [cancellationProtection, setCancellationProtection] = useState(false);

  const insuranceFee    = 2.5;
  const cancellationFee = 3;
  const discount        = appliedOffer ? offerService.calculateDiscount(appliedOffer, totalFare) : 0;
  const finalAmount     = totalFare - discount + (travelInsurance ? insuranceFee : 0) + (cancellationProtection ? cancellationFee : 0);

  const handleApplyCoupon = () => {
    const result = offerService.validateOffer(couponCode, totalFare);
    if (result.valid && result.offer) {
      setAppliedOffer(result.offer);
      toast.success(`Saved ₹${(offerService.calculateDiscount(result.offer, totalFare) * 80).toFixed(0)}!`);
    } else {
      toast.error(result.error || "Invalid coupon");
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    navigate("/app/payment", {
      state: { route, selectedSeats, selectedBoarding, selectedDropping, bookingData: formData, totalFare: finalAmount, discount, travelInsurance, appliedOffer },
    });
  };

  if (!route || !selectedSeats) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">Invalid booking</p>
        <Button onClick={() => navigate("/app/search")} style={{ backgroundColor: PRIMARY }} className="text-white">
          Back to Search
        </Button>
      </div>
    );
  }

  const Field = ({ id, label, icon: Icon, type = "text", placeholder = "", value, onChange, required = false }: any) => (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs font-bold text-gray-500">{label}{required && " *"}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 h-11 rounded-xl"
          required={required}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      <BookingFlowHeader
        from={route.from}
        to={route.to}
        date={new Date().toISOString().split("T")[0]}
        subtitle={`${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""} · ${route.operator.name}`}
        step={2}
      />

      <div className="px-4 py-4 pb-36 space-y-3">
        {/* Journey summary */}
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
          <div className="flex items-center gap-2 text-sm">
            <div className="text-center">
              <p className="font-black text-gray-900">{route.departureTime}</p>
              <p className="text-[10px] text-gray-400">{route.from}</p>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <p className="text-xs text-gray-400">{route.duration}</p>
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-center">
              <p className="font-black text-gray-900">{route.arrivalTime}</p>
              <p className="text-[10px] text-gray-400">{route.to}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {selectedSeats.map((s: any) => (
              <span key={s.id} className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: PRIMARY }}>
                Seat {s.number}
              </span>
            ))}
          </div>
        </div>

        {/* Passenger details */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f0f4ff]">
            <p className="font-bold text-gray-800 text-sm">Passenger Details</p>
          </div>
          <div className="p-4 space-y-3">
            <Field id="name"      label="Full Name"            icon={User}  value={formData.name}  onChange={(v: string) => setFormData({ ...formData, name: v })} required />
            <Field id="email"     label="Email Address"        icon={Mail}  type="email" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} required />
            <Field id="phone"     label="Phone Number"         icon={Phone} type="tel" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} required />
            <Field id="emergency" label="Emergency Contact"    icon={Phone} type="tel" value={formData.emergencyContact} onChange={(v: string) => setFormData({ ...formData, emergencyContact: v })} placeholder="Optional" />
          </div>
        </div>

        {/* Coupon */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f0f4ff]">
            <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
              <Tag className="w-4 h-4" style={{ color: ORANGE }} />Apply Coupon
            </p>
          </div>
          <div className="p-4">
            {!appliedOffer ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="h-11 rounded-xl flex-1"
                />
                <Button onClick={handleApplyCoupon} variant="outline" className="h-11 px-5 rounded-xl font-bold border-[#dde5f4]">
                  Apply
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                <div>
                  <p className="font-bold text-green-700 text-sm">{appliedOffer.code}</p>
                  <p className="text-xs text-green-600">You saved ₹{(discount * 80).toFixed(0)}</p>
                </div>
                <button onClick={() => { setAppliedOffer(null); setCouponCode(""); }} className="text-xs text-red-500 font-semibold">Remove</button>
              </div>
            )}
            <button onClick={() => navigate("/app/offers")} className="flex items-center gap-1 mt-2 text-xs font-semibold" style={{ color: PRIMARY }}>
              <Percent className="w-3 h-3" />View all offers
            </button>
          </div>
        </div>

        {/* Add-ons */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#f0f4ff]">
            <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
              <Shield className="w-4 h-4" style={{ color: PRIMARY }} />Travel Protection
            </p>
          </div>
          <div className="divide-y divide-[#f0f4ff]">
            {[
              { id: "ins",  label: "Travel Insurance",       desc: "Coverage for cancellation, delays & emergencies", fee: insuranceFee,    checked: travelInsurance,       set: setTravelInsurance },
              { id: "can",  label: "Cancellation Protection", desc: "100% refund even 2 hours before departure",        fee: cancellationFee, checked: cancellationProtection, set: setCancellationProtection },
            ].map(({ id, label, desc, fee, checked, set }) => (
              <label key={id} htmlFor={id} className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50/50">
                <Checkbox id={id} checked={checked} onCheckedChange={v => set(v as boolean)} className="mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  <p className="text-xs font-bold mt-1" style={{ color: PRIMARY }}>+₹{(fee * 80).toFixed(0)}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Fare summary */}
        <div className="bg-white rounded-2xl border border-[#dde5f4] p-4 space-y-2">
          <p className="font-bold text-gray-800 text-sm mb-3">Fare Summary</p>
          {[
            { label: `Base fare (${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""})`, val: `₹${(totalFare * 80).toFixed(0)}` },
            ...(discount > 0 ? [{ label: "Coupon discount", val: `-₹${(discount * 80).toFixed(0)}`, green: true }] : []),
            ...(travelInsurance ? [{ label: "Travel insurance", val: `+₹${(insuranceFee * 80).toFixed(0)}` }] : []),
            ...(cancellationProtection ? [{ label: "Cancellation protection", val: `+₹${(cancellationFee * 80).toFixed(0)}` }] : []),
          ].map(({ label, val, green }: any) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className={green ? "text-green-600 font-semibold" : "text-gray-800 font-semibold"}>{val}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 border-t border-[#f0f4ff]">
            <span className="font-black text-gray-900">Total</span>
            <span className="text-xl font-black" style={{ color: PRIMARY }}>₹{(finalAmount * 80).toFixed(0)}</span>
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Free cancellation up to {route.cancellationPolicy?.[0]?.refundPercentage || 85}% refund available
        </p>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#dde5f4] px-4 py-3 shadow-lg z-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">Total Amount</p>
            <p className="text-xl font-black" style={{ color: PRIMARY }}>₹{(finalAmount * 80).toFixed(0)}</p>
          </div>
          <Button
            onClick={handleSubmit}
            className="text-white font-bold h-12 px-8 rounded-xl flex-shrink-0"
            style={{ backgroundColor: ORANGE }}
          >
            PROCEED TO PAY
          </Button>
        </div>
      </div>
    </div>
  );
}
