import { useEffect, useMemo, useState } from "react";

const getTimeRemaining = (targetDate: Date) => {
  const total = Math.max(targetDate.getTime() - Date.now(), 0);
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
};

export const ComingSoon = (): JSX.Element => {
  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    date.setHours(date.getHours() + 8);
    date.setMinutes(date.getMinutes() + 15);
    date.setSeconds(date.getSeconds() + 16);
    return date;
  }, []);

  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "days", value: timeLeft.days },
    { label: "hours", value: timeLeft.hours },
    { label: "minutes", value: timeLeft.minutes },
    { label: "seconds", value: timeLeft.seconds },
  ];

  return (
    <main className="min-h-screen w-full bg-[url(/bg.png)] bg-cover bg-center flex flex-col items-center justify-center">
      <div className="flex gap-8 md:gap-16">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-white text-6xl md:text-8xl font-extralight tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-white text-sm font-light tracking-widest uppercase mt-1">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-white text-5xl md:text-7xl font-extralight self-start mt-2" aria-hidden="true">
                :
              </span>
            )}
          </div>
        ))}
      </div>
      <footer className="absolute bottom-4 text-white text-xs opacity-60">
        Created by Five9nes.io
      </footer>
    </main>
  );
};

export default ComingSoon;
