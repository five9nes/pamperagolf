import { useEffect, useMemo, useState } from "react";
import bitmap from "./bitmap.png";
import icon from "./icon.svg";
import linkUnderline from "./link-underline.svg";
import owl1 from "./owl-1.png";
import owl2 from "./owl-2.png";
import pampaLogo from "./pampa-logo.png";
import social from "./social.png";
import tree1 from "./tree-1.png";
import tree2 from "./tree-2.png";
import tree3 from "./tree-3.png";

type TimeUnit = {
  label: string;
  value: string;
  widthClass: string;
  leftClass: string;
  valueClassName: string;
  labelClassName: string;
};

const getTimeRemaining = (targetDate: Date) => {
  const total = Math.max(targetDate.getTime() - Date.now(), 0);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return {
    days: String(days),
    hours: String(hours),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
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

  const [email, setEmail] = useState("example@mail.com");
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetDate]);

  const timerUnits: TimeUnit[] = [
    {
      label: "days",
      value: timeLeft.days,
      widthClass: "w-[7.19%]",
      leftClass: "left-0",
      valueClassName:
        "absolute w-full top-[calc(50.00%_-_50px)] left-0 [font-family:'Montserrat-ExtraLight',Helvetica] font-extralight text-white text-[70px] tracking-[0] leading-[normal]",
      labelClassName:
        "absolute w-[78.26%] top-[calc(50.00%_+_31px)] left-[10.87%] [font-family:'Montserrat-Light',Helvetica] font-light text-white text-base text-center tracking-[0] leading-[normal]",
    },
    {
      label: "hours",
      value: timeLeft.hours,
      widthClass: "w-[7.19%]",
      leftClass: "left-[28.75%]",
      valueClassName:
        "w-[95.65%] left-[2.17%] absolute top-[calc(50.00%_-_50px)] [font-family:'Montserrat-ExtraLight',Helvetica] font-extralight text-white text-[70px] tracking-[0] leading-[normal]",
      labelClassName:
        "absolute w-full top-[calc(50.00%_+_31px)] left-0 [font-family:'Montserrat-Light',Helvetica] font-light text-white text-base text-center tracking-[0] leading-[normal]",
    },
    {
      label: "minutes",
      value: timeLeft.minutes,
      widthClass: "w-[10.31%]",
      leftClass: "left-[57.50%]",
      valueClassName:
        "w-[95.45%] left-0 absolute top-[calc(50.00%_-_50px)] [font-family:'Montserrat-ExtraLight',Helvetica] font-extralight text-white text-[70px] tracking-[0] leading-[normal]",
      labelClassName:
        "absolute w-full top-[calc(50.00%_+_31px)] left-0 [font-family:'Montserrat-Light',Helvetica] font-light text-white text-base text-center tracking-[0] leading-[normal]",
    },
    {
      label: "seconds",
      value: timeLeft.seconds,
      widthClass: "w-[10.47%]",
      leftClass: "left-[89.53%]",
      valueClassName:
        "absolute w-full top-[calc(50.00%_-_50px)] left-0 [font-family:'Montserrat-ExtraLight',Helvetica] font-extralight text-white text-[70px] tracking-[0] leading-[normal]",
      labelClassName:
        "absolute w-[98.51%] top-[calc(50.00%_+_31px)] left-0 [font-family:'Montserrat-Light',Helvetica] font-light text-white text-base text-center tracking-[0] leading-[normal]",
    },
  ];

  const separators = [
    { value: ":", leftClass: "left-[17.19%]" },
    { value: ":", leftClass: "left-[45.47%]" },
    { value: ":", leftClass: "left-[77.34%]" },
  ];

  return (
    <main className="bg-[url(/bg.png)] bg-[100%_100%] w-full min-w-[1400px] h-[788px] relative overflow-hidden">
      <footer className="absolute w-[11.21%] top-[calc(50.00%_+_366px)] left-[43.79%] [font-family:'Montserrat-Regular',Helvetica] font-normal text-white text-[10px] text-center tracking-[0] leading-[normal]">
        Created by Five9nes.io
      </footer>
      <form
        className="absolute w-[16.64%] h-[6.35%] top-[92.39%] left-[75.14%] overflow-hidden"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Newsletter subscription"
      >
        <button
          type="submit"
          aria-label="Subscribe to newsletter"
          className="absolute w-[21.46%] h-full top-0 left-[78.54%]"
        >
          <div className="absolute w-[104.00%] h-[104.00%] top-0 left-0 rounded-[26px] border border-solid border-[#ffffff4c]" />
          <img
            className="absolute w-[66.00%] h-[62.00%] top-[38.00%] left-[34.00%]"
            alt=""
            src={icon}
          />
        </button>
        <img
          className="absolute w-[99.57%] h-[14.00%] top-[86.00%] left-0 pointer-events-none"
          alt=""
          src={linkUnderline}
        />
        <label
          htmlFor="newsletter-email"
          className="absolute w-[66.09%] top-[calc(50.00%_-_19px)] left-0 opacity-50 [font-family:'Montserrat-Medium',Helvetica] font-medium text-white text-[11px] tracking-[0] leading-[normal]"
        >
          Subscribe to our newsletter
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-label="Email address"
          className="absolute w-[73.82%] top-[50.00%] left-0 [font-family:'Montserrat-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] placeholder:text-white"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </form>
      <aside className="absolute w-[171px] top-7 left-[114px] flex flex-col items-start min-h-[750px] gap-[686px]">
        <button
          type="button"
          aria-label="Open menu"
          className="w-4 h-3.5 ml-[0.5px] bg-[url(/menu.svg)] bg-[100%_100%]"
        />
        <img className="w-[171px]" alt="Social media links" src={social} />
      </aside>
      <section
        className="absolute w-[41.43%] h-[33.63%] top-[19.67%] left-[29.57%]"
        aria-label="Hero heading"
      >
        <h1 className="absolute w-[99.48%] top-[calc(50.00%_-_132px)] left-0 [font-family:'Montserrat-Black',Helvetica] font-black text-white text-[130px] tracking-[0] leading-[normal]">
          COMING
        </h1>
        <div className="absolute w-[65.34%] top-[calc(50.00%_-_14px)] left-[15.17%] [font-family:'Montserrat-Black',Helvetica] font-black text-white text-[120px] tracking-[0] leading-[normal]">
          SOON
        </div>
      </section>
      <div className="absolute w-[63.14%] h-[73.22%] top-0 left-[22.64%]">
        <img
          className="absolute w-[25.45%] h-full top-0 left-[74.55%]"
          alt="Forest tree"
          src={tree3}
        />
        <img
          className="absolute w-[85.75%] h-full top-0 left-[14.25%]"
          alt="Forest tree"
          src={tree1}
        />
        <img
          className="absolute w-[55.66%] h-full top-0 left-[44.34%]"
          alt="Forest tree"
          src={tree2}
        />
        <img
          className="absolute w-[42.42%] h-[54.59%] top-[45.41%] left-[57.58%]"
          alt="Owl perched on a branch"
          src={owl2}
        />
        <img
          className="absolute w-full h-[80.76%] top-[19.24%] left-0"
          alt="Owl in the forest"
          src={owl1}
        />
      </div>
      <section className="absolute w-[28.43%] h-[27.54%] top-[55.96%] left-[35.79%] text-center">
        <p className="absolute w-full top-[calc(50.00%_-_108px)] left-0 [text-shadow:0px_0px_10px_#00000099] [font-family:'Montserrat-Medium',Helvetica] font-medium text-white text-xl text-center tracking-[0] leading-[normal]">
          There will be something very awesome
        </p>
        <p className="absolute w-[72.86%] top-[calc(50.00%_+_84px)] left-[13.57%] [text-shadow:0px_0px_10px_#00000099] [font-family:'Montserrat-Medium',Helvetica] font-medium text-white text-xl text-center tracking-[0] leading-[normal]">
          ... as awesome as these owls.
        </p>
      </section>
      <section
        className="absolute w-[45.71%] h-[12.69%] top-[64.72%] left-[27.14%]"
        aria-label="Countdown timer"
      >
        {timerUnits.map((unit) => (
          <div
            key={unit.label}
            className={`absolute ${unit.widthClass} h-full top-0 ${unit.leftClass} overflow-hidden`}
          >
            <div className={unit.labelClassName}>{unit.label}</div>
            <div className={unit.valueClassName}>{unit.value}</div>
          </div>
        ))}

        {separators.map((separator, index) => (
          <div
            key={`${separator.leftClass}-${index}`}
            className={`${separator.leftClass} absolute w-[2.19%] top-[calc(50.00%_-_50px)] [font-family:'Montserrat-ExtraLight',Helvetica] font-extralight text-white text-[70px] tracking-[0] leading-[normal]`}
            aria-hidden="true"
          >
            {separator.value}
          </div>
        ))}
      </section>
      <nav
        className="absolute w-[7.29%] h-0 top-[3.55%] left-[84.50%]"
        aria-label="Language selector"
      >
        <button
          type="button"
          aria-current="true"
          className="absolute w-[46.08%] top-[calc(50.00%_-_8px)] left-0 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-xs leading-[normal] text-left"
        >
          <span className="tracking-[0.36px]">ENG </span>
          <span className="tracking-[0]">/</span>
        </button>
        <button
          type="button"
          className="absolute w-[33.33%] top-[calc(50.00%_-_8px)] left-[65.69%] opacity-50 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-xs tracking-[3.00px] leading-[normal] text-left"
        >
          ESP
        </button>
      </nav>
      <img
        className="absolute w-[51.21%] h-[97.59%] top-[2.41%] left-[48.79%]"
        alt="Pampora logo"
        src={pampaLogo}
      />
      <img
        className="absolute w-[57.57%] h-[92.01%] top-[7.99%] left-[42.43%]"
        alt=""
        src={bitmap}
      />
    </main>
  );
};

export default ComingSoon;
