import { useLang } from "@/contexts/LangContext";
import { useState, useRef } from "react";

interface FooterProps {
  onAdminUnlock: () => void;
}

const Footer = ({ onAdminUnlock }: FooterProps) => {
  const { t } = useLang();
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout>>();
  const [heartGreen, setHeartGreen] = useState(false);

  const handleHeartClick = () => {
    clickCount.current++;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 1000);

    if (clickCount.current >= 5) {
      onAdminUnlock();
      setHeartGreen(true);
      setTimeout(() => setHeartGreen(false), 1000);
      clickCount.current = 0;
    }
  };

  return (
    <footer className="bg-foreground text-background py-10 px-5 text-center font-sans text-sm">
      <p className="mb-1">
        {t("Z całego serca", "With all our hearts")}{" "}
        <span
          onClick={handleHeartClick}
          className={`cursor-pointer select-none transition-colors duration-300 ${heartGreen ? "text-green-400" : "text-primary"}`}
        >
          ❤
        </span>
      </p>
      <p className="font-serif text-lg mb-1">Marta & Jakub</p>
      <p className="text-background/60 mb-4">080826.wesele@gmail.com</p>
      <p className="text-background/50 text-xs">
        {t("Dziękujemy za celebrowanie tego dnia z nami!", "Thank you for sharing this day with us!")}
      </p>
    </footer>
  );
};

export default Footer;
