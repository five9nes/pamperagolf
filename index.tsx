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
    date.setDate(date.getDate() + 30);
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
    <main className="min-h-[100dvh] w-full bg-[url(/background1.png)] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-end pb-[20vh]">
      <div className="flex items-start gap-3 sm:gap-8 md:gap-12 px-4">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex items-start gap-3 sm:gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-white text-4xl sm:text-6xl md:text-8xl font-extralight tabular-nums [font-family:'Montserrat',sans-serif]">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-white text-[10px] sm:text-xs font-light tracking-widest uppercase mt-1 [font-family:'Montserrat',sans-serif]">
                {unit.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-white text-3xl sm:text-5xl md:text-7xl font-extralight mt-1 sm:mt-2 [font-family:'Montserrat',sans-serif]" aria-hidden="true">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default ComingSoon;
