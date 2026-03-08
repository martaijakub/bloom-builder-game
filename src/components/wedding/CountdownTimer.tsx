import { useState, useEffect, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const FlipDigit = ({ value, prevValue }: { value: string; prevValue: string }) => {
  const changed = value !== prevValue;

  return (
    <span className="relative inline-block overflow-hidden">
      <span
        key={value}
        className={`inline-block ${changed ? "animate-flip-in" : ""}`}
      >
        {value}
      </span>
    </span>
  );
};

const TimeUnit = ({
  value,
  label,
  prevValue,
  delay,
}: {
  value: number;
  label: string;
  prevValue: number;
  delay: number;
}) => {
  const current = String(value).padStart(2, "0");
  const prev = String(prevValue).padStart(2, "0");

  return (
    <div
      className="flex flex-col items-center opacity-0 translate-y-4 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="bg-card border border-wedding-gold/30 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 min-w-[60px] sm:min-w-[70px] md:min-w-[90px] transition-shadow duration-500 hover:shadow-[0_0_20px_hsl(var(--wedding-gold)/0.15)]">
        <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-wedding-gold tabular-nums">
          <FlipDigit value={current[0]} prevValue={prev[0]} />
          <FlipDigit value={current[1]} prevValue={prev[1]} />
        </p>
      </div>
      <p className="font-sans text-[10px] sm:text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.15em] uppercase text-muted-foreground mt-1.5 sm:mt-2">
        {label}
      </p>
    </div>
  );
};

const CountdownTimer = () => {
  const { t } = useLang();
  const { ref, visible } = useReveal();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const prevTimeLeft = useRef<TimeLeft>(timeLeft);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const weddingDate = new Date(2026, 7, 8, 0, 0, 0).getTime();
      const now = new Date().getTime();
      const difference = weddingDate - now;

      prevTimeLeft.current = timeLeft;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update prevTimeLeft after render
  useEffect(() => {
    prevTimeLeft.current = timeLeft;
  });

  const PulseDot = () => (
    <div className="flex flex-col justify-center mb-8">
      <span className="text-wedding-gold/50 text-xl md:text-2xl animate-pulse">:</span>
    </div>
  );

  return (
    <section className="py-20 md:py-28 px-6 bg-accent/20 overflow-hidden">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
          {t("Do wielkiego dnia", "Until the big day")}
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-14">
          {t("Odliczanie", "Countdown")}
        </h2>

        <div className="flex justify-center items-center gap-1.5 sm:gap-3 md:gap-6">
          <TimeUnit value={timeLeft.days} prevValue={prevTimeLeft.current.days} label={t("Dni", "Days")} delay={0} />
          <PulseDot />
          <TimeUnit value={timeLeft.hours} prevValue={prevTimeLeft.current.hours} label={t("Godziny", "Hours")} delay={100} />
          <PulseDot />
          <TimeUnit value={timeLeft.minutes} prevValue={prevTimeLeft.current.minutes} label={t("Minuty", "Minutes")} delay={200} />
          <PulseDot />
          <TimeUnit value={timeLeft.seconds} prevValue={prevTimeLeft.current.seconds} label={t("Sekundy", "Seconds")} delay={300} />
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
