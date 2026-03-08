import { useState } from "react";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemoryMatch from "@/games/MemoryMatch";
import WeddingWordle from "@/games/WeddingWordle";

type GameView = "menu" | "memory" | "wordle";

const Games = () => {
  const [view, setView] = useState<GameView>("menu");

  if (view !== "menu") {
    return (
      <div>
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("menu")}
            className="font-sans border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Powrót
          </Button>
        </div>
        {view === "memory" ? <MemoryMatch /> : <WeddingWordle />}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        {/* Memory Match card */}
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
          <p className="font-sans text-xs text-muted-foreground mt-2 italic">
            Flip cards & find all wedding pairs!
          </p>
        </button>

        {/* Wordle card */}
        <button
          onClick={() => setView("wordle")}
          className="group bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary text-left"
        >
          <div className="text-5xl mb-4">🔤</div>
          <h2 className="font-serif text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
            Wedding Wordle
          </h2>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            Odgadnij ślubne słowo w 6 próbach! Dostępne w 🇵🇱 🇮🇹 🇷🇸
          </p>
          <p className="font-sans text-xs text-muted-foreground mt-2 italic">
            Guess the wedding word in 6 tries! PL + IT & SR trial modes
          </p>
        </button>
      </div>

      <a
        href="/"
        className="mt-10 font-sans text-sm text-primary hover:underline"
      >
        ← Wróć na stronę główną / Back to main page
      </a>
    </div>
  );
};

export default Games;
