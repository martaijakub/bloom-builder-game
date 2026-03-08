import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const { t } = useLang();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Wedding date: August 8, 2026
      const weddingDate = new Date(2026, 7, 8, 0, 0, 0).getTime();
      const now = new Date().getTime();
      const difference = weddingDate - now;

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

  const TimeUnit = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <div className="bg-card border border-wedding-gold/30 rounded-lg px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
        <p className="font-serif text-3xl md:text-4xl font-light text-wedding-gold">
          {String(value).padStart(2, "0")}
        </p>
      </div>
      <p className="font-sans text-xs md:text-sm tracking-[0.15em] uppercase text-muted-foreground mt-2">
        {label}
      </p>
    </div>
  );

  return (
    <section className="py-20 md:py-28 px-6 bg-accent/20">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
          {t("Do wielkiego dnia", "Until the big day")}
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground mb-14">
          {t("Odliczanie", "Countdown")}
        </h2>

        <div className="flex justify-center items-center gap-3 md:gap-6">
          <TimeUnit
            value={timeLeft.days}
            label={t("Dni", "Days")}
          />
          <div className="text-wedding-gold/40 text-xl md:text-2xl mb-8">:</div>
          <TimeUnit
            value={timeLeft.hours}
            label={t("Godziny", "Hours")}
          />
          <div className="text-wedding-gold/40 text-xl md:text-2xl mb-8">:</div>
          <TimeUnit
            value={timeLeft.minutes}
            label={t("Minuty", "Minutes")}
          />
          <div className="text-wedding-gold/40 text-xl md:text-2xl mb-8">:</div>
          <TimeUnit
            value={timeLeft.seconds}
            label={t("Sekundy", "Seconds")}
          />
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
