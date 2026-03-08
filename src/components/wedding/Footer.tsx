import { useLang } from "@/contexts/LangContext";
import { useState, useRef } from "react";

interface FooterProps {
  onAdminUnlock: () => void;
}

const Footer = ({ onAdminUnlock }: FooterProps) => {
  const { t } = useLang();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout>>();
  const [heartGlow, setHeartGlow] = useState(false);

  const handleHeartClick = () => {
    clickCount.current++;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 1000);

    if (clickCount.current >= 5) {
      onAdminUnlock();
      setHeartGlow(true);
      setTimeout(() => setHeartGlow(false), 1000);
      clickCount.current = 0;
    }
  };

  return (
    <footer className="py-16 px-6 text-center">
      <div className="divider-gold max-w-[120px] mx-auto mb-10" />
      <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
        {t("Z całego serca", "With all our hearts")}
      </p>
      <p className="font-serif text-3xl font-light text-foreground mb-2">
        Marta{" "}
        <span
          onClick={handleHeartClick}
          className={`cursor-pointer select-none inline-block transition-all duration-300 ${
            heartGlow ? "text-wedding-sage scale-125" : "text-wedding-gold"
          }`}
        >
          &
        </span>{" "}
        Jakub
      </p>
      <p className="font-sans text-xs text-muted-foreground tracking-wider mb-8">
        080826.wesele@gmail.com
      </p>
      <p className="font-sans text-xs text-muted-foreground/60">
        {t("Dziękujemy za celebrowanie tego dnia z nami", "Thank you for sharing this day with us")}
      </p>
    </footer>
  );
};

export default Footer;
