import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemoryMatch from "@/games/MemoryMatch";
import WeddingWordle from "@/games/WeddingWordle";
import TriPeaksSolitaire from "@/games/TriPeaksSolitaire";

type GameView = "menu" | "memory" | "wordle" | "tripeaks";

const isWeddingDay = (): boolean => {
  const now = new Date();
  const weddingDay = new Date("2026-08-08T00:00:00");
  return (
    now.getFullYear() === weddingDay.getFullYear() &&
    now.getMonth() === weddingDay.getMonth() &&
    now.getDate() === weddingDay.getDate()
  );
};

const Games = () => {
  const [searchParams] = useSearchParams();
  const gameParam = searchParams.get("game");
  const [view, setView] = useState<GameView>("menu");
  const disabledOnWeddingDay = isWeddingDay();

  useEffect(() => {
    if (gameParam === "memory") setView("memory");
    else if (gameParam === "wordle") setView("wordle");
    else if (gameParam === "tripeaks") setView("tripeaks");
  }, [gameParam]);

  if (view !== "menu") {
    return (
      <div>
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("menu")}
            className="font-sans border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Menu
          </Button>
          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className="font-sans border-border text-foreground hover:bg-muted shadow-md"
            >
              ← Strona główna
            </Button>
          </Link>
        </div>
        {view === "memory" ? <MemoryMatch /> : view === "wordle" ? <WeddingWordle /> : <TriPeaksSolitaire />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <Gamepad2 className="w-12 h-12 text-primary mb-4" />
      <h1 className="font-script text-5xl md:text-6xl text-primary mb-2">
        Gry Weselne
      </h1>
      <p className="text-muted-foreground font-sans text-sm mb-10 text-center max-w-md">
        Baw się dobrze czekając na wielki dzień! / Have fun while waiting for the big day!
      </p>

      {disabledOnWeddingDay ? (
        <div className="border border-wedding-gold/40 bg-wedding-gold/5 p-10 text-center rounded-lg max-w-md">
          <p className="font-sans text-lg text-foreground mb-2">
            🎉 Dziś jest wielki dzień! 🎉
          </p>
          <p className="font-sans text-sm text-muted-foreground mb-6">
            Gry są wyłączone podczas przyjęcia. Baw się z nami!
          </p>
          <Link
            to="/"
            className="inline-block font-sans text-sm text-primary hover:underline"
          >
            ← Wróć na stronę główną
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <button
            onClick={() => setView("memory")}
            className="group bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary text-left"
          >
            <div className="text-5xl mb-4">🃏</div>
            <h2 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
              Memory Match
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Odwracaj karty i znajdź wszystkie ślubne pary! Ile ruchów potrzebujesz?
            </p>
          </button>

          <button
            onClick={() => setView("wordle")}
            className="group bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary text-left"
          >
            <div className="text-5xl mb-4">🔤</div>
            <h2 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
              Wedding Wordle
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Odgadnij ślubne słowo w 6 próbach! 🇵🇱 🇮🇹 🇷🇸
            </p>
          </button>

          <button
            onClick={() => setView("tripeaks")}
            className="group bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary text-left"
          >
            <div className="text-5xl mb-4">🏔️</div>
            <h2 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
              TriPeaks Solitaire
            </h2>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              Klasyczny pasjans TriPeaks w ślubnym stylu! Buduj serie i zdobywaj punkty!
            </p>
          </button>
        </div>
      )}

      <Link
        to="/"
        className={`font-sans text-sm text-primary hover:underline ${disabledOnWeddingDay ? "hidden" : "mt-10"}`}
      >
        ← Wróć na stronę główną / Back to main page
      </Link>
    </div>
  );
};

export default Games;
