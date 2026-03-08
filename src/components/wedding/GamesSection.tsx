import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";
import { Link } from "react-router-dom";

const GamesSection = () => {
  const { t } = useLang();
  const { ref, visible } = useReveal();

  const games = [
    {
      to: "/games?game=memory",
      emoji: "🃏",
      title: "Memory Match",
      descPl: "Odwracaj karty i znajdź wszystkie ślubne pary!",
      descEn: "Flip cards and find all wedding pairs!",
    },
    {
      to: "/games?game=wordle",
      emoji: "🔤",
      title: "Wedding Wordle",
      descPl: "Odgadnij ślubne słowo w 6 próbach!",
      descEn: "Guess the wedding word in 6 tries!",
    },
    {
      to: "/games?game=tripeaks",
      emoji: "🏔️",
      title: "TriPeaks Solitaire",
      descPl: "Klasyczny pasjans TriPeaks w ślubnym stylu!",
      descEn: "Classic TriPeaks solitaire, wedding style!",
    },
  ];

  return (
    <section id="games" className="py-28 md:py-36 px-6">
      <div ref={ref} className={`max-w-4xl mx-auto reveal-stagger ${visible ? "visible" : ""}`}>
        <div className="reveal-child text-center mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            {t("Rozrywka", "Entertainment")}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground tracking-tight mb-6">
            {t("Gry Weselne", "Wedding Games")}
          </h2>
          <p className="font-sans text-sm text-muted-foreground max-w-md mx-auto">
            {t(
              "Baw się dobrze czekając na wielki dzień!",
              "Have fun while waiting for the big day!"
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {games.map((game) => (
            <Link
              key={game.to}
              to={game.to}
              className="reveal-child group border border-border/60 bg-card/50 backdrop-blur-sm p-8 text-left block transition-all duration-500 hover:border-wedding-gold/40 hover:bg-card"
            >
              <div className="text-4xl mb-5">{game.emoji}</div>
              <h3 className="font-serif text-xl font-light text-foreground mb-2 group-hover:text-wedding-gold transition-colors tracking-tight">
                {game.title}
              </h3>
              <p className="font-sans text-sm text-muted-foreground">
                {t(game.descPl, game.descEn)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
