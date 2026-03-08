import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";

interface EventCardProps {
  titlePl: string;
  titleEn: string;
  lines: { pl: string; en: string; accent?: boolean; subtle?: boolean }[];
}

const EventCard = ({ titlePl, titleEn, lines }: EventCardProps) => {
  const { t } = useLang();
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
    },
    {
      titlePl: "Wesele", titleEn: "Reception",
      lines: [
        { pl: "Wesele | 16:00", en: "Reception | 4:00 PM", accent: true },
        { pl: "Restauracja Tabun", en: "Tabun Restaurant", subtle: true },
        { pl: "ul. Konna 29, Otomin, Gdańsk", en: "29 Konna Street, Otomin, Gdansk" },
      ],
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
