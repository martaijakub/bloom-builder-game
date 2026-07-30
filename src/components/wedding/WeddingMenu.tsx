import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";

type Course = {
  icon: string;
  pl: string;
  en: string;
  notePl?: string;
  noteEn?: string;
  items: string[];
};

const courses: Course[] = [
  {
    icon: "🍅",
    pl: "Przystawka",
    en: "Starter",
    notePl: "danie serwowane",
    noteEn: "served to the table",
    items: [
      "Zupa krem z letnich pomidorów z domowym pesto ze świeżej bazylii z rustykalną grzanką",
    ],
  },
  {
    icon: "🍽️",
    pl: "Danie główne",
    en: "Main course",
    notePl: "podane wieloporcjowo na półmiskach na stole",
    noteEn: "shared platters on the table",
    items: [
      "Filet z pstrąga potokowego zapiekany ze szpinakiem w śmietanie i białym winie",
      "Kacze udka pieczone z morelami podane z czatnejem morelowym",
      "Pieczeń z karkówki wieprzowej z sosem ze świeżych kurek",
    ],
  },
  {
    icon: "🌿",
    pl: "Danie główne wege",
    en: "Vegetarian main",
    notePl: "serwowane, tylko dla osób wcześniej deklarujących dietę",
    noteEn: "served, only for guests who declared the diet in advance",
    items: ["Spaghetti z cukinii z sosem z pieczonych pomidorów z burratą"],
  },
  {
    icon: "🥔",
    pl: "Dodatki do dań głównych",
    en: "Sides",
    items: [
      "Ćwiartki ziemniaków zapiekane z czosnkiem i ziołami",
      "Risotto z kaszy pęczak z cebulką",
      "Fasolka szparagowa ze zrumienioną na maśle bułką tartą",
      "Zestaw surówek (z młodej kapusty ze słonecznikiem, z buraczków z jabłkiem i cebulką, pikantna z marchewki)",
    ],
  },
  {
    icon: "🍰",
    pl: "Deser",
    en: "Dessert",
    notePl: "serwowany",
    noteEn: "served",
    items: [
      'Własny tort Pary Młodej z zaprzyjaźnionej pracowni „Upiecz mi tort”',
    ],
  },
  {
    icon: "🥗",
    pl: "Zimne zakąski",
    en: "Cold appetizers",
    notePl: "podane na półmiskach na stole",
    noteEn: "shared platters on the table",
    items: [
      "Ceviche z pstrąga z cebulką, chilli i kolendrą",
      "Tatar wołowy z wiejskim jajkiem, ogórkiem kiszonym, grzybkami i cebulką",
      "Opalany bakłażan na czosnkowym jogurcie",
      "Zestaw past do pieczywa: solone masło ziołowe, domowe pesto pietruszkowe z prażonym słonecznikiem, z suszonych pomidorów",
      "Grzanki ziołowo-czosnkowe",
      "Sałatka z grillowanym kurczakiem i owocami sezonowymi",
      "Sałatka z surowego i pieczonego kalafiora, cytryny i kaparów",
      "Sałatka z arbuzem, świeżym ogórkiem, fetą i świeżym koperkiem",
      "Pieczywo naszego wypieku (żytni chleb na zakwasie, focaccia z rozmarynem)",
    ],
  },
  {
    icon: "🔥",
    pl: "Na gorąco w nocy",
    en: "Hot night buffet",
    notePl: "bufet po oczepinach",
    noteEn: "buffet after the midnight ceremony",
    items: [
      "Długo pieczone żeberka wieprzowe podane z sosem miodowo-musztardowym z cydrem",
    ],
  },
  {
    icon: "☕",
    pl: "Bufet kawowy",
    en: "Coffee buffet",
    notePl: "sala cydrowa",
    noteEn: "cider room",
    items: ["Brownie z malinami", "Ciasto z owocami sezonowymi i kruszonką", "Tiramisu"],
  },
  {
    icon: "🍓",
    pl: "Słodki stół",
    en: "Sweet table",
    notePl: "sala cydrowa",
    noteEn: "cider room",
    items: [
      "Tarta ze świeżymi owocami",
      "Szarlotka",
      "Muffiny z jagodami i płatkami migdałów",
      "Patera owoców sezonowych",
      "Sangria z owocami",
      "Lemoniada",
    ],
  },
  {
    icon: "🧺",
    pl: "Wiejski stół",
    en: "Country table",
    items: [
      "Chłodnik litewski z jajkiem i świeżym koperkiem",
      "Śledź po kaszubsku w occie z cebulką",
      "Pstrąg z lokalnej wędzarni",
      "Podwędzane w naszej wędzarni polędwiczki wieprzowe",
      "Swojska kiełbasa wędzona z zaprzyjaźnionej wędzarni",
      "Swojska szynka z zaprzyjaźnionej wędzarni",
      "Domowa konfitura z żurawiny",
      "Wybór domowych marynat",
      "Sos chrzanowy",
      "Deska serów zagrodowych podana z orzechami, miodem i owocami",
      "Ogórki małosolne",
      "Smalec ze skwarkami",
      "Chleb na zakwasie lokalnego wypieku",
      "Kompot",
      "Nalewki owocowe domowej roboty",
    ],
  },
];

const WeddingMenu = () => {
  const { t } = useLang();
  const { ref, visible } = useReveal();

  return (
    <section id="menu-section" className="py-24 md:py-32 px-5 md:px-6 bg-accent/30">
      <div ref={ref} className={`max-w-2xl mx-auto reveal-stagger ${visible ? "visible" : ""}`}>
        <div className="reveal-child text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            {t("Przy stole", "At the table")}
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light text-foreground tracking-tight mb-4">
            {t("Menu Weselne", "Wedding Menu")}
          </h2>
          <div className="divider-gold max-w-[100px] mx-auto" />
        </div>

        <div className="space-y-5">
          {courses.map((course) => (
            <article
              key={course.pl}
              className="reveal-child border border-wedding-gold/30 bg-card/60 backdrop-blur-sm p-6 md:p-8"
            >
              <header className="text-center mb-5">
                <div className="text-2xl mb-2">{course.icon}</div>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-foreground tracking-tight">
                  {t(course.pl, course.en)}
                </h3>
                {course.notePl && (
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-wedding-gold mt-2">
                    {t(course.notePl, course.noteEn ?? course.notePl)}
                  </p>
                )}
              </header>

              <ul className="space-y-3">
                {course.items.map((item) => (
                  <li
                    key={item}
                    className="font-sans text-sm leading-relaxed text-foreground/90 text-center"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="reveal-child mt-10 text-center font-sans text-xs text-muted-foreground leading-relaxed">
          {t(
            "Masz alergie lub szczególne potrzeby żywieniowe? Daj nam znać — 080826.wesele@gmail.com",
            "Allergies or special dietary needs? Let us know — 080826.wesele@gmail.com"
          )}
        </p>
      </div>
    </section>
  );
};

export default WeddingMenu;
