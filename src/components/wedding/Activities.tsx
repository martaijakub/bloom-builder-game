import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";

const Activities = () => {
  const { t } = useLang();
  const { ref, visible } = useReveal();

  const places = [
    {
      titlePl: "Park Oliwski", titleEn: "Oliwa Park",
      descPl: "Tuż obok kościoła. Przepiękny ogród francuski, palmiarnia i Groty Szeptów. Idealny na spacer przed ceremonią.",
      descEn: "Right next to the church. Beautiful French gardens, palm house, and Whispering Grottoes. Perfect for a pre-ceremony walk.",
    },
    {
      titlePl: "Archikatedra Oliwska", titleEn: "Oliwa Cathedral",
      descPl: "Słynna z rokokowych organów. Warto zajrzeć do środka tego zabytku, znajdującego się tuż obok naszego kościoła św. Jakuba.",
      descEn: "Famous for its Rococo organ. Worth stepping inside this historic monument, located right next to our St. James Church.",
    },
    {
      titlePl: "Wzgórze Pachołek", titleEn: "Pachołek Hill",
      descPl: "Punkt widokowy w Oliwie. 15-metrowa wieża, z której rozpościera się panorama na całe Trójmiasto i Zatokę.",
      descEn: "Viewpoint in Oliwa. A 15-meter tower offering a panoramic view of the entire Tricity and the Bay.",
    },
    {
      titlePl: "Jezioro Otomińskie", titleEn: "Otomin Lake",
      descPl: "Znajduje się tuż przy sali weselnej (Tabun). Malowniczy las i jezioro, idealne na relaks i kontakt z naturą.",
      descEn: "Located right by the reception venue (Tabun). Scenic forest and lake, perfect for relaxing and connecting with nature.",
    },
    {
      titlePl: "Stare Miasto Gdańsk", titleEn: "Gdańsk Old Town",
      descPl: "Jeśli macie więcej czasu, odwiedźcie ulicę Długą i Żurawia. To serce historycznego Gdańska.",
      descEn: "If you have more time, visit Long Market and the Crane. This is the heart of historic Gdańsk.",
    },
    {
      titlePl: "Molo w Sopocie", titleEn: "Sopot Pier",
      descPl: "Najdłuższe drewniane molo w Europie. Z Oliwy to tylko 10 minut pociągiem SKM lub taksówką.",
      descEn: "The longest wooden pier in Europe. From Oliwa, it's just a 10-minute train ride or taxi.",
    },
  ];

  return (
    <section id="activities" className="py-28 md:py-36 px-6 bg-accent/30">
      <div ref={ref} className={`max-w-6xl mx-auto reveal-stagger ${visible ? "visible" : ""}`}>
        <div className="reveal-child text-center mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            {t("Okolica", "Explore")}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground tracking-tight mb-6">
            {t("Co warto zobaczyć", "Places to Visit")}
          </h2>
          <p className="font-sans text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              "Chcemy pokazać Wam nasze ulubione zakątki! Oto miejsca idealne na spacer w pobliżu kościoła i sali weselnej.",
              "We want to show you our favorite spots! Here are perfect places near the church and reception venue."
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {places.map((place, i) => (
            <div
              key={i}
              className="reveal-child border border-border/60 bg-card/50 backdrop-blur-sm p-8 md:p-10 transition-all duration-500 hover:border-wedding-sage/50"
            >
              <h3 className="font-serif text-2xl font-light text-foreground mb-3 tracking-tight">
                {t(place.titlePl, place.titleEn)}
              </h3>
              <div className="w-8 h-px bg-wedding-sage/40 mb-4" />
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {t(place.descPl, place.descEn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
