import { useLang } from "@/contexts/LangContext";
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";

const GamesSection = () => {
  const { t } = useLang();

  return (
    <section id="games" className="py-24 px-5 bg-accent/20">
      <h2 className="font-script text-5xl text-primary text-center mb-4">
        {t("Gry Weselne", "Wedding Games")}
      </h2>
      <p className="text-center font-sans text-sm text-muted-foreground mb-12 max-w-md mx-auto">
        {t(
          "Baw się dobrze czekając na wielki dzień!",
          "Have fun while waiting for the big day!"
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link
          to="/games?game=memory"
          className="group bg-card rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary text-left block"
        >
          <div className="text-5xl mb-4">🃏</div>
          <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
            Memory Match
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            {t(
              "Odwracaj karty i znajdź wszystkie ślubne pary!",
              "Flip cards and find all wedding pairs!"
            )}
          </p>
        </Link>

        <Link
          to="/games?game=wordle"
          className="group bg-card rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary text-left block"
        >
          <div className="text-5xl mb-4">🔤</div>
          <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
            Wedding Wordle
          </h3>
          <p className="font-sans text-sm text-muted-foreground">
            {t(
              "Odgadnij ślubne słowo w 6 próbach! 🇵🇱 🇮🇹 🇷🇸",
              "Guess the wedding word in 6 tries! 🇵🇱 🇮🇹 🇷🇸"
            )}
          </p>
        </Link>
      </div>
    </section>
  );
};

export default GamesSection;
