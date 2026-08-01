import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";

type Dish = { pl: string; en: string };

type Course = {
  icon: string;
  pl: string;
  en: string;
  notePl?: string;
  noteEn?: string;
  items: Dish[];
};

const courses: Course[] = [
  {
    icon: "🍅",
    pl: "Pierwsze Danie",
    en: "First Course",
    notePl: "danie serwowane",
    noteEn: "served to the table",
    items: [
      {
        pl: "Zupa krem z letnich pomidorów z domowym pesto ze świeżej bazylii z rustykalną grzanką",
        en: "Cream of summer tomato soup with homemade fresh basil pesto and a rustic crouton",
      },
    ],
  },
  {
    icon: "🍽️",
    pl: "Danie główne",
    en: "Main course",
    notePl: "podane wieloporcjowo na półmiskach na stole",
    noteEn: "shared platters on the table",
    items: [
      {
        pl: "Filet z pstrąga potokowego zapiekany ze szpinakiem w śmietanie i białym winie",
        en: "Brook trout fillet baked with spinach in cream and white wine",
      },
      {
        pl: "Kacze udka pieczone z morelami podane z czatnejem morelowym",
        en: "Roast duck legs with apricots, served with apricot chutney",
      },
      {
        pl: "Pieczeń z karkówki wieprzowej z sosem ze świeżych kurek",
        en: "Roast pork neck with a fresh chanterelle sauce",
      },
    ],
  },
  {
    icon: "🌿",
    pl: "Danie główne wege",
    en: "Vegetarian main",
    notePl: "serwowane, tylko dla osób wcześniej deklarujących dietę",
    noteEn: "served, only for guests who declared the diet in advance",
    items: [
      {
        pl: "Spaghetti z cukinii z sosem z pieczonych pomidorów z burratą",
        en: "Courgette spaghetti with roasted tomato sauce and burrata",
      },
    ],
  },
  {
    icon: "🥔",
    pl: "Dodatki do dań głównych",
    en: "Sides",
    items: [
      {
        pl: "Ćwiartki ziemniaków zapiekane z czosnkiem i ziołami",
        en: "Potato wedges baked with garlic and herbs",
      },
      {
        pl: "Risotto z kaszy pęczak z cebulką",
        en: "Pearl barley risotto with onion",
      },
      {
        pl: "Fasolka szparagowa ze zrumienioną na maśle bułką tartą",
        en: "Green beans with butter-toasted breadcrumbs",
      },
      {
        pl: "Zestaw surówek (z młodej kapusty ze słonecznikiem, z buraczków z jabłkiem i cebulką, pikantna z marchewki)",
        en: "Selection of fresh salads (young cabbage with sunflower seeds, beetroot with apple and onion, spicy carrot)",
      },
    ],
  },
  {
    icon: "🍰",
    pl: "Deser",
    en: "Dessert",
    notePl: "serwowany",
    noteEn: "served",
    items: [
      {
        pl: "Własny tort Pary Młodej z zaprzyjaźnionej pracowni „Upiecz mi tort”",
        en: "The couple's own wedding cake from our friends at the “Upiecz mi tort” bakery",
      },
    ],
  },
  {
    icon: "🥗",
    pl: "Zimne zakąski",
    en: "Cold appetizers",
    notePl: "podane na półmiskach na stole",
    noteEn: "shared platters on the table",
    items: [
      {
        pl: "Ceviche z pstrąga z cebulką, chilli i kolendrą",
        en: "Trout ceviche with onion, chilli and coriander",
      },
      {
        pl: "Tatar wołowy z wiejskim jajkiem, ogórkiem kiszonym, grzybkami i cebulką",
        en: "Beef tartare with farm egg, pickled cucumber, mushrooms and onion",
      },
      {
        pl: "Opalany bakłażan na czosnkowym jogurcie",
        en: "Flame-roasted aubergine on garlic yoghurt",
      },
      {
        pl: "Zestaw past do pieczywa: solone masło ziołowe, domowe pesto pietruszkowe z prażonym słonecznikiem, z suszonych pomidorów",
        en: "Selection of bread spreads: salted herb butter, homemade parsley pesto with toasted sunflower seeds, sun-dried tomato",
      },
      { pl: "Grzanki ziołowo-czosnkowe", en: "Herb and garlic crostini" },
      {
        pl: "Sałatka z grillowanym kurczakiem i owocami sezonowymi",
        en: "Salad with grilled chicken and seasonal fruit",
      },
      {
        pl: "Sałatka z surowego i pieczonego kalafiora, cytryny i kaparów",
        en: "Salad of raw and roasted cauliflower with lemon and capers",
      },
      {
        pl: "Sałatka z arbuzem, świeżym ogórkiem, fetą i świeżym koperkiem",
        en: "Watermelon salad with fresh cucumber, feta and dill",
      },
      {
        pl: "Pieczywo naszego wypieku (żytni chleb na zakwasie, focaccia z rozmarynem)",
        en: "Our own baked bread (rye sourdough, rosemary focaccia)",
      },
    ],
  },
  {
    icon: "🔥",
    pl: "Na gorąco w nocy",
    en: "Hot night buffet",
    notePl: "bufet po oczepinach",
    noteEn: "buffet after the midnight ceremony",
    items: [
      {
        pl: "Długo pieczone żeberka wieprzowe podane z sosem miodowo-musztardowym z cydrem",
        en: "Slow-roasted pork ribs with honey-mustard cider sauce",
      },
    ],
  },
  {
    icon: "☕",
    pl: "Bufet kawowy",
    en: "Coffee buffet",
    notePl: "sala cydrowa",
    noteEn: "cider room",
    items: [
      { pl: "Brownie z malinami", en: "Raspberry brownie" },
      {
        pl: "Ciasto z owocami sezonowymi i kruszonką",
        en: "Seasonal fruit crumble cake",
      },
      { pl: "Tiramisu", en: "Tiramisu" },
    ],
  },
  {
    icon: "🍓",
    pl: "Słodki stół",
    en: "Sweet table",
    notePl: "sala cydrowa",
    noteEn: "cider room",
    items: [
      { pl: "Tarta ze świeżymi owocami", en: "Fresh fruit tart" },
      { pl: "Szarlotka", en: "Apple pie" },
      {
        pl: "Muffiny z jagodami i płatkami migdałów",
        en: "Blueberry muffins with almond flakes",
      },
      { pl: "Patera owoców sezonowych", en: "Platter of seasonal fruit" },
      { pl: "Sangria z owocami", en: "Fruit sangria" },
      { pl: "Lemoniada", en: "Lemonade" },
    ],
  },
  {
    icon: "🧺",
    pl: "Wiejski stół",
    en: "Country table",
    items: [
      {
        pl: "Chłodnik litewski z jajkiem i świeżym koperkiem",
        en: "Lithuanian cold beetroot soup with egg and fresh dill",
      },
      {
        pl: "Śledź po kaszubsku w occie z cebulką",
        en: "Kashubian-style herring in vinegar with onion",
      },
      { pl: "Pstrąg z lokalnej wędzarni", en: "Trout from a local smokehouse" },
      {
        pl: "Podwędzane w naszej wędzarni polędwiczki wieprzowe",
        en: "Pork tenderloin smoked in our own smokehouse",
      },
      {
        pl: "Swojska kiełbasa wędzona z zaprzyjaźnionej wędzarni",
        en: "Farmhouse smoked sausage from a local smokehouse",
      },
      {
        pl: "Swojska szynka z zaprzyjaźnionej wędzarni",
        en: "Farmhouse ham from a local smokehouse",
      },
      { pl: "Domowa konfitura z żurawiny", en: "Homemade cranberry preserve" },
      { pl: "Wybór domowych marynat", en: "Selection of homemade pickles" },
      { pl: "Sos chrzanowy", en: "Horseradish sauce" },
      {
        pl: "Deska serów zagrodowych podana z orzechami, miodem i owocami",
        en: "Farmhouse cheese board with nuts, honey and fruit",
      },
      { pl: "Ogórki małosolne", en: "Lightly salted cucumbers" },
      { pl: "Smalec ze skwarkami", en: "Lard with crackling" },
      {
        pl: "Chleb na zakwasie lokalnego wypieku",
        en: "Locally baked sourdough bread",
      },
      { pl: "Kompot", en: "Fruit compote" },
      {
        pl: "Nalewki owocowe domowej roboty",
        en: "Homemade fruit liqueurs",
      },
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
                    key={item.pl}
                    className="font-sans text-sm leading-relaxed text-foreground/90 text-center"
                  >
                    {t(item.pl, item.en)}
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
