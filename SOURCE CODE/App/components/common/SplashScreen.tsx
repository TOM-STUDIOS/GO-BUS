import { useEffect } from "react";
import { useNavigate } from "react-router";

export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1a56db] flex items-center justify-center">
      <div className="animate-fadeIn text-center select-none">
        <p
          className="text-white font-black tracking-tighter leading-none"
          style={{
            fontSize: "clamp(4rem, 20vw, 9rem)",
            fontFamily: "'League Spartan', sans-serif",
            letterSpacing: "-0.04em",
          }}
        >
          GO BUS
        </p>
      </div>
    </div>
  );
}
