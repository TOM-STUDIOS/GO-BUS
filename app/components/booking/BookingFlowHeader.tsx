import { useNavigate } from "react-router";
import { ChevronLeft, ArrowRight } from "lucide-react";

interface Props {
  from?: string;
  to?: string;
  date?: string;
  subtitle?: string;
  title?: string;           // fallback when no from/to
  step?: number;            // 1=seats, 2=details, 3=payment
}

function formatDate(dateStr?: string) {
  if (!dateStr) return { day: "", dow: "" };
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    dow: d.toLocaleDateString("en-IN", { weekday: "short" }),
  };
}

const STEPS = ["Seats", "Details", "Payment"];

export function BookingFlowHeader({ from, to, date, subtitle, title, step }: Props) {
  const navigate = useNavigate();
  const { day, dow } = formatDate(date);

  return (
    <div className="bg-white border-b border-[#dde5f4] sticky top-0 z-20">
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Back arrow — no text */}
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 flex-shrink-0 -ml-1"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Route info */}
        <div className="flex-1 min-w-0">
          {from && to ? (
            <>
              <div className="flex items-center gap-1.5 font-black text-gray-900 text-base leading-tight">
                <span className="truncate">{from}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="truncate">{to}</span>
              </div>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>
              )}
            </>
          ) : (
            <p className="font-black text-gray-900 text-base">{title || "Booking"}</p>
          )}
        </div>

        {/* Date pill */}
        {day && (
          <div className="flex-shrink-0 bg-[#fff0f0] border border-[#ffd5d5] rounded-2xl px-3 py-1.5 text-center min-w-[58px]">
            <p className="text-xs font-black text-gray-800 leading-tight">{day}</p>
            <p className="text-[10px] text-gray-400 leading-tight">{dow}</p>
          </div>
        )}
      </div>

      {/* Step indicator */}
      {step !== undefined && (
        <div className="flex border-t border-[#f0f4ff]">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div key={label} className="flex-1 relative">
                <div className={`py-2 text-center text-[11px] font-bold transition-colors ${
                  isActive ? "text-[#1a56db]" : isDone ? "text-green-600" : "text-gray-400"
                }`}>
                  {isDone ? "✓ " : ""}{label}
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a56db] rounded-full" />
                )}
                {isDone && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
