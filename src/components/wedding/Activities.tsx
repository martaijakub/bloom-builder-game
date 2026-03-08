import { useLang } from "@/contexts/LangContext";

const Activities = () => {
  const { t } = useLang();

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
    <section id="activities" className="py-24 px-5 max-w-6xl mx-auto">
      <h2 className="font-script text-5xl text-primary text-center mb-6">
        {t("Co warto zobaczyć", "Places to Visit")}
      </h2>
      <p className="text-center text-muted-foreground font-sans text-sm max-w-3xl mx-auto mb-12 leading-relaxed">
        {t(
          "Chcemy pokazać Wam nasze ulubione zakątki! Oto miejsca idealne na spacer i zwiedzanie w pobliżu kościoła i sali weselnej.",
          "We want to show you our favorite spots! Here are perfect places for a walk and sightseeing near the church and reception venue."
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {places.map((place, i) => (
          <div
            key={i}
            className="bg-card p-8 rounded-lg border-t-[3px] border-wedding-sage shadow-md"
          >
            <h3 className="font-serif text-xl text-foreground mb-3">
              {t(place.titlePl, place.titleEn)}
            </h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              {t(place.descPl, place.descEn)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Activities;
