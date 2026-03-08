import { useLang } from "@/contexts/LangContext";

interface EventCardProps {
  titlePl: string;
  titleEn: string;
  lines: { pl: string; en: string; className?: string }[];
}

const EventCard = ({ titlePl, titleEn, lines }: EventCardProps) => {
  const { t } = useLang();
  return (
    <div className="bg-card p-8 border-l-4 border-primary text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-sm">
      <h3 className="font-serif text-2xl text-foreground mb-2">{t(titlePl, titleEn)}</h3>
      {lines.map((line, i) => (
        <div key={i} className={line.className || "text-sm text-muted-foreground leading-relaxed mt-1"}>
          {t(line.pl, line.en)}
        </div>
      ))}
    </div>
  );
};

const Schedule = () => {
  const { t } = useLang();

  const events: EventCardProps[] = [
    {
      titlePl: "Ślub", titleEn: "Wedding",
      lines: [
        { pl: "Ceremonia | 14:00", en: "Ceremony | 2:00 PM", className: "text-primary font-semibold font-sans mb-3" },
        { pl: "Miejsce ślubu", en: "Miejsce ślubu", className: "text-wedding-sage font-sans font-medium text-sm" },
        { pl: "Kościół św. Jakuba", en: "St. James Church" },
        { pl: "Oliwa, Gdańsk", en: "Oliwa, Gdansk" },
      ],
    },
    {
      titlePl: "Wesele", titleEn: "Reception",
      lines: [
        { pl: "Wesele | 16:00", en: "Reception | 16:00 PM", className: "text-primary font-semibold font-sans mb-3" },
        { pl: "Restauracja Tabun", en: "Tabun Restaurant", className: "text-wedding-sage font-sans font-medium text-sm" },
        { pl: "ul. Konna 29, Otomin, Gdańsk", en: "29, Konna Street, Otomin, Gdansk" },
      ],
    },
    {
      titlePl: "Dress code", titleEn: "Dress code",
      lines: [
        { pl: "Strój wizytowy", en: "Formal Attire", className: "text-primary font-semibold font-sans mb-3" },
        { pl: "Uprzejmie prosimy o strój wizytowy.", en: "We kindly request formal attire.", className: "text-wedding-sage font-sans font-medium text-sm" },
        { pl: "Panie: suknia koktajlowa lub wieczorowa", en: "Ladies: cocktail dress or gown" },
        { pl: "Panowie: garnitur lub smoking", en: "Gentlemen: suit or tuxedo" },
      ],
    },
    {
      titlePl: "Transport", titleEn: "Transport",
      lines: [
        { pl: "Po ceremonii zapewniamy transport z kościoła do Restauracji Tabun dla Gości niezmotoryzowanych.", en: "After the ceremony, transportation from the church to Tabun Restaurant will be provided for guests without a car.", className: "text-wedding-sage font-sans font-medium text-sm" },
      ],
    },
    {
      titlePl: "Prezenty", titleEn: "Gifts",
      lines: [
        { pl: "Jeśli planujecie podarunek, będziemy wdzięczni za upominek w kopercie, który pomoże nam realizować wspólne plany i marzenia.", en: "If you are planning a gift, we would be grateful for a contribution in an envelope to help us achieve our shared plans and dreams.", className: "text-wedding-sage font-sans font-medium text-sm" },
      ],
    },
    {
      titlePl: "Dzieci", titleEn: "Children",
      lines: [
        { pl: "Uroczystość dla dorosłych", en: "Adults-only celebration", className: "text-primary font-semibold font-sans mb-3" },
        { pl: "Kochamy Wasze pociechy, jednak nasze wesele planujemy jako imprezę wyłącznie dla dorosłych.", en: "We love your little ones, however, we are planning our wedding as an adults-only celebration." },
        { pl: "Mamy nadzieję, że pozwoli Wam to na chwilę wytchnienia i swobodną zabawę do białego rana!", en: "We hope this will allow you a well-deserved night off and a chance to celebrate with us until dawn." },
      ],
    },
  ];

  return (
    <section id="schedule" className="py-24 px-5 max-w-6xl mx-auto">
      <h2 className="font-script text-5xl text-primary text-center mb-16">
        {t("O wydarzeniu", "About the event")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((ev, i) => (
          <EventCard key={i} {...ev} />
        ))}
      </div>
    </section>
  );
};

export default Schedule;
