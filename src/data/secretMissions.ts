export interface SecretMission {
  code: string;            // secret password
  agent: string;           // who it is for
  codename: string;        // mission title
  emblem: string;          // decorative glyph
  clearance: string;       // fake clearance level
  intro: string;
  briefing: { label: string; text: string }[];
  proof: string;
}

export const secretMissions: SecretMission[] = [
  {
    code: "KLAMERKA05",
    agent: "Magda Lenart",
    codename: 'Operacja „Klamerka”',
    emblem: "🧷",
    clearance: "POZIOM 05 · SIATKA AGENTÓW",
    intro:
      "Zostałaś mianowana głównodowodzącą najbardziej skrytej operacji na tym weselu. Czas zbudować własną siatkę agentów!",
    briefing: [
      {
        label: "Cel",
        text: "Na sali, w okolicach stołu prezydialnego, ukryliśmy Twoją „amunicję” — 5 opakowań po 20 mini klamerek. Potajemnie zwerbuj 5 zaufanych osób i wręcz każdej jedną paczkę (PS: spróbuj zwerbować nasze mamy).",
      },
      {
        label: "Zadanie oddziału",
        text: "Niepostrzeżenie przypinajcie klamerki do ubrań niczego nieświadomych gości (rąbki marynarek, sukienki). Wygrywa ten, kto pozbędzie się wszystkich klamerek bez wpadki!",
      },
      {
        label: "Zasada główna",
        text: "Działajcie jak duchy. Im więcej klamerek na jednym gościu, tym lepiej! Nakryta? Z kamienną twarzą strzepuj „niewidzialny pyłek”, mówiąc: „Następnym razem powiedz wyraźnie Na Pokątną, a nie Przekątną” albo „O proszę, dzwoneczek znowu uciekł Piotrusiowi i zostawił tu swój pyłek”.",
      },
    ],
    proof:
      "Aby zameldować wykonanie misji, musisz dać się złapać fotografowi na gorącym uczynku — obiektyw musi uchwycić moment przypinania klamerki lub werbowania agenta!",
  },
  {
    code: "TRADITION07",
    agent: "Sava Mazibrada",
    codename: "The Fake Tradition",
    emblem: "🥂",
    clearance: "LEVEL 07 · CULTURAL OPS",
    intro:
      "Welcome to a traditional Polish wedding! However, it is time to introduce some international flavor… whether it's real or not.",
    briefing: [
      {
        label: "Objective",
        text: "Convince at least 3 different Polish guests that there is a very specific, absurd wedding tradition in your home country — e.g. clinking elbows instead of glasses, or howling like a wolf before a shot of vodka.",
      },
      {
        label: "Golden rule",
        text: "You must get them to actually perform this „tradition” with you. Keep a totally straight face. If they ask whether you are joking, act deeply offended that they question your ancient cultural heritage!",
      },
    ],
    proof: "Condition for success: get caught red-handed by the photographer!",
  },
  {
    code: "ARTEFAKT13",
    agent: "Piotr Wiesner",
    codename: "Zaginiony artefakt",
    emblem: "🏺",
    clearance: "POZIOM 13 · ARCHIWUM DZIEJÓW",
    intro:
      "Jako wybitny znawca dziejów zostałeś wezwany do zbadania niezwykłego znaleziska na tym weselu.",
    briefing: [
      {
        label: "Cel",
        text: "Wybierz całkowicie zwyczajny przedmiot ze swojego stołu (solniczkę, serwetnik, wazę). Przekonaj co najmniej trzy osoby, że to bezcenny, zaginiony artefakt z dynastii Jagiellonów lub starożytnego Rzymu.",
      },
      {
        label: "Zasada główna",
        text: "Wymyśl szczegółową, fascynującą historię pochodzenia („Widzisz ten wzór na solniczce? To wyraźny wpływ wczesnego renesansu…”). Bądź śmiertelnie poważny. Niedowiarka oskarż o ignorancję opłaconą przez konkurencyjne muzeum!",
      },
    ],
    proof: "Musisz dać się złapać fotografowi na gorącym uczynku!",
  },
  {
    code: "MICHELIN21",
    agent: "Marta Osak",
    codename: "Inspektor Michelin",
    emblem: "🍽️",
    clearance: "POZIOM 21 · WYDZIAŁ SMAKU",
    intro:
      "Na tym weselu jedzenie jest doskonałe, ale Ty musisz upewnić się, że reszta gości to odpowiednio docenia.",
    briefing: [
      {
        label: "Cel",
        text: "Przez co najmniej 15 minut zachowuj się przy stole z przekąskami jak światowej klasy, snobistyczny krytyk kulinarny. Komentuj na głos: „wybitna tekstura tego kabanosa”, „intrygujący balans kwasowości w tym serniku”, „rześki finisz tej galarety”.",
      },
      {
        label: "Zasada główna",
        text: "Zaraź entuzjazmem przynajmniej dwie obce Ci osoby i przekonaj je, by spróbowały Twoich „odkryć”. Ani słowa o misji! Jesteś po prostu pasjonatką gastronomii na tropie smaku.",
      },
    ],
    proof: "Musisz dać się złapać fotografowi na gorącym uczynku!",
  },
  {
    code: "IMBUS33",
    agent: "Małgorzata Osak",
    codename: "Infiltracja Lingwistyczna",
    emblem: "🗝️",
    clearance: "POZIOM 33 · KRYPTOLINGWISTYKA",
    intro: "Wkraczasz do akcji jako mistrzyni słownego kamuflażu.",
    briefing: [
      {
        label: "Cel",
        text: "Wpleć bardzo dziwne, niepasujące do wesela słowo w poważne rozmowy z co najmniej 5 różnymi gośćmi. Twoje tajne hasła na dziś: ORNITOLOG, IMBUS, KOMBAJN.",
      },
      {
        label: "Zasada główna",
        text: "Kontekst musi brzmieć naturalnie, np. „Ten kawałek tortu to prawdziwy imbus emocji”. Jeśli ktoś zapyta o dziwny dobór słów — z kamienną twarzą zmyślaj historię ze swojego dzieciństwa.",
      },
    ],
    proof: "Musisz dać się złapać fotografowi na gorącym uczynku!",
  },
  {
    code: "PARKIET44",
    agent: "Karolina Chrzan",
    codename: 'Kryptonim „Władczyni Parkietu”',
    emblem: "💃",
    clearance: "POZIOM 44 · OPERACJE TANECZNE",
    intro:
      "Twoim zadaniem jest zorganizowanie epickiego, pozornie „spontanicznego” flashmoba, który przejdzie do historii tego wesela.",
    briefing: [
      {
        label: "Cel",
        text: "Podejdź w tajemnicy do DJ-a i ustal konkretną godzinę odtworzenia „Jerusalemy”. Wcześniej zbierz na boku małą grupę zaufanych osób i naucz ich podstawowych kroków. Gdy zabrzmią pierwsze takty — wkraczasz na środek parkietu jako główna instruktorka i porywasz resztę gości!",
      },
      {
        label: "Zasada główna",
        text: "To ma wyglądać na totalny, nieplanowany zryw. Nikomu poza swoimi „uczniami” nie zdradzaj, że to zaplanowana akcja Pary Młodej!",
      },
    ],
    proof: "Musisz dać się złapać fotografowi na gorącym uczynku!",
  },
  {
    code: "MATCHA55",
    agent: "Bartek",
    codename: 'Zaginiony „Miejski Stół"',
    emblem: "🍵",
    clearance: "POZIOM 55 · WIELKOMIEJSKA KONTRABANDA",
    intro:
      "Tradycyjny „wiejski stół\" to przeżytek. Czas na odrobinę wielkomiejskiego, alternatywnego luksusu na tym weselu.",
    briefing: [
      {
        label: "Cel",
        text: "W okolicach stołu prezydialnego ukryliśmy tajny ładunek z zaopatrzeniem dla prawdziwych miastowych. Odzyskaj go i zorganizuj na swoim stole pokazowy „Miejski Stół\".",
      },
      {
        label: "Zadanie główne",
        text: "Wkręć się w rolę totalnego freaka zdrowego odżywiania i z pełnym przekonaniem udowodnij co najmniej trzem osobom, że matcha jest absolutnie zajebista.",
      },
      {
        label: "Zasada główna",
        text: "Twój stół ma się stać oazą alternatywnego życia. Udawaj, że to Twoja własna „kontrabanda\", bo nie ufasz weselnemu menu. (PS. Obsługa sali wie o rekwizytach, ale rodzina nie może się dowiedzieć, że to nasza sprawka!)",
      },
    ],
    proof:
      "Każdemu ze zwerbowanych „wyznawców\" uroczyście wręcz mini bandę lub porcję matchy — najlepiej wykonajcie wspólnie krótki trening z użyciem mini bandy. I daj się złapać fotografowi!",
  },
  {
    code: "WYTRZYMAJ66",
    agent: "Magda (Siostra Panny Młodej)",
    codename: 'Operacja „Wytrzymaj do jutra"',
    emblem: "🤍",
    clearance: "POZIOM 66 · JEDNOSTKA EMOCYJNA",
    intro:
      "Wiemy, że nie możesz wytrzymać do jutra. Twoja misja jest wyjątkowa — nie wymaga podstępów, tylko szczerej siostrzanej miłości.",
    briefing: [
      {
        label: "Cel",
        text: "Przetrwać do 08.08.2026 i być obecną przy najważniejszym momencie życia Twojej siostry.",
      },
      {
        label: "Zadanie główne",
        text: "Bawić się najlepiej, jak tylko siostra potrafi — tańczyć, śmiać się, śpiewać i czerpać z tego dnia absolutne maksimum.",
      },
      {
        label: "Zasada główna",
        text: "Podczas ceremonii ślubnej puścić wodze emocjom. Łzy wzruszenia są obowiązkowym elementem wyposażenia agentki.",
      },
    ],
    proof:
      "Dowodem wykonania misji jest szczery uśmiech przez całe wesele oraz łzy uruchomione podczas ślubu. Fotograf musi to uchwycić!",
  },
];
