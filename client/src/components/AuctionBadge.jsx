import { useState, useEffect } from 'react';
import { G } from '../constants';

export default function AuctionBadge({ endsAt }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endsAt) - Date.now();
      setIsUrgent(diff < 3600000);
      if (diff <= 0) { setTimeLeft("Ended"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (h > 24) setTimeLeft(`${Math.floor(h/24)}d ${h%24}h`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m`);
      else setTimeLeft(`${m}m ${s}s`);
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [endsAt]);

  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: isUrgent ? G.redBg : G.goldBg, color: isUrgent ? G.red : G.goldDark, fontFamily: "DM Sans,sans-serif", display: "inline-flex", alignItems: "center", gap: 3 }}>⏱ {timeLeft}</span>
  );
}
