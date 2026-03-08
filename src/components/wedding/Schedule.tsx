import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";
import { useState } from "react";
import { MapPin } from "lucide-react";

interface EventCardProps {
  titlePl: string;
  titleEn: string;
  lines: { pl: string; en: string; accent?: boolean; subtle?: boolean }[];
  mapUrl?: string;
  directionsUrl?: string;
}

const EventCard = ({ titlePl, titleEn, lines, mapUrl, directionsUrl }: EventCardProps) => {
  const { t } = useLang();
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="reveal-child group">
      <div className="border border-border/60 bg-card/50 backdrop-blur-sm p-8 md:p-10 transition-all duration-500 hover:border-wedding-gold/40 hover:bg-card">
        <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-4 tracking-tight">
          {t(titlePl, titleEn)}
        </h3>
        <div className="divider-gold w-12 mb-5" />
        {lines.map((line, i) => (
          <p
            key={i}
            className={`font-sans text-sm leading-relaxed mt-2 ${
              line.accent
                ? "text-wedding-gold font-medium tracking-wide text-xs uppercase"
                : line.subtle
                ? "text-wedding-sage font-medium text-xs"
                : "text-muted-foreground"
            }`}
          >
            {t(line.pl, line.en)}
          </p>
        ))}

        {mapUrl && (
          <div className="mt-5">
            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-1.5 font-sans text-xs text-wedding-gold hover:text-wedding-gold/80 transition-colors uppercase tracking-wider"
            >
              <MapPin className="w-3.5 h-3.5" />
              {showMap ? t("Ukryj mapę", "Hide map") : t("Pokaż mapę", "Show map")}
            </button>

            {showMap && (
              <div className="mt-3 rounded overflow-hidden border border-border/40 animate-fade-up">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t(titlePl, titleEn)}
                />
              </div>
            )}

            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 font-sans text-[11px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                <MapPin className="w-3 h-3" />
                {t("Nawiguj", "Get directions")} →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Schedule = () => {
  const { t } = useLang();
  const { ref, visible } = useReveal();

  const events: EventCardProps[] = [
    {
      titlePl: "Ślub", titleEn: "Ceremony",
      lines: [
        { pl: "Ceremonia | 14:00", en: "Ceremony | 2:00 PM", accent: true },
        { pl: "Kościół św. Jakuba", en: "St. James Church", subtle: true },
        { pl: "Oliwa, Gdańsk", en: "Oliwa, Gdansk" },
      ],
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2318.5!2d18.5556!3d54.4103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd0a1a2a7e0001%3A0x4e0b9c71e57e9b0!2sKo%C5%9Bci%C3%B3%C5%82%20%C5%9Bw.%20Jakuba%20Aposto%C5%82a!5e0!3m2!1spl!2spl!4v1700000000000",
      directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Kościół+św.+Jakuba+Oliwa+Gdańsk",
    },
    {
      titlePl: "Wesele", titleEn: "Reception",
      lines: [
        { pl: "Wesele | 16:00", en: "Reception | 4:00 PM", accent: true },
        { pl: "Restauracja Tabun", en: "Tabun Restaurant", subtle: true },
        { pl: "ul. Konna 29, Otomin, Gdańsk", en: "29 Konna Street, Otomin, Gdansk" },
      ],
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2320.0!2d18.5280!3d54.3680!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd744db9d1c64f%3A0x4b8a1d3f1c8f1c0a!2sRestauracja%20Tabun!5e0!3m2!1spl!2spl!4v1700000000000",
      directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Restauracja+Tabun+Otomin+Gdańsk",
    },
    {
      titlePl: "Dress code", titleEn: "Dress Code",
      lines: [
        { pl: "Strój wizytowy", en: "Formal Attire", accent: true },
        { pl: "Panie: suknia koktajlowa lub wieczorowa", en: "Ladies: cocktail dress or gown" },
        { pl: "Panowie: garnitur lub smoking", en: "Gentlemen: suit or tuxedo" },
      ],
    },
    {
      titlePl: "Transport", titleEn: "Transport",
      lines: [
        { pl: "Po ceremonii zapewniamy transport z kościoła do Restauracji Tabun dla Gości niezmotoryzowanych.", en: "After the ceremony, transportation from the church to Tabun Restaurant will be provided for guests without a car." },
      ],
    },
    {
      titlePl: "Prezenty", titleEn: "Gifts",
      lines: [
        { pl: "Jeśli planujecie podarunek, będziemy wdzięczni za upominek w kopercie, który pomoże nam realizować wspólne plany i marzenia.", en: "If you are planning a gift, we would be grateful for a contribution in an envelope to help us achieve our shared plans and dreams." },
      ],
    },
    {
      titlePl: "Dzieci", titleEn: "Children",
      lines: [
        { pl: "Uroczystość dla dorosłych", en: "Adults-only celebration", accent: true },
        { pl: "Kochamy Wasze pociechy, jednak nasze wesele planujemy jako imprezę wyłącznie dla dorosłych.", en: "We love your little ones, however, we are planning our wedding as an adults-only celebration." },
        { pl: "Mamy nadzieję, że pozwoli Wam to na chwilę wytchnienia i swobodną zabawę do białego rana!", en: "We hope this will allow you a well-deserved night off and a chance to celebrate with us until dawn." },
      ],
    },
  ];

  return (
    <section id="schedule" className="py-28 md:py-36 px-6">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto reveal-stagger ${visible ? "visible" : ""}`}
      >
        <div className="reveal-child text-center mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            {t("Szczegóły", "Details")}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground tracking-tight">
            {t("O wydarzeniu", "About the Event")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((ev, i) => (
            <EventCard key={i} {...ev} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
