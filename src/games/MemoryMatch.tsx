import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, Clock, MousePointerClick } from "lucide-react";

const ICONS = ["💍", "💐", "🥂", "🎂", "💒", "👰", "🤵", "💕"];

interface Card {
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
}

const createDeck = (): Card[] => {
  const pairs = [...ICONS, ...ICONS];
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((icon, i) => ({ id: i, icon, flipped: false, matched: false }));
};

const MemoryMatch = () => {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [started, gameOver]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      setGameOver(true);
    }
  }, [cards]);

  const handleClick = useCallback(
    (id: number) => {
      if (selected.length >= 2) return;
      const card = cards[id];
      if (card.flipped || card.matched) return;

      if (!started) setStarted(true);

      const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
      setCards(next);
      const newSelected = [...selected, id];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = newSelected;
        if (next[a].icon === next[b].icon) {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === a || c.id === b ? { ...c, matched: true } : c
              )
            );
            setSelected([]);
          }, 400);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === a || c.id === b ? { ...c, flipped: false } : c
              )
            );
            setSelected([]);
          }, 800);
        }
      }
    },
    [cards, selected, started]
  );

  const reset = () => {
    setCards(createDeck());
    setSelected([]);
    setMoves(0);
    setSeconds(0);
    setGameOver(false);
    setStarted(false);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const getStars = () => {
    if (moves <= 10) return "⭐⭐⭐";
    if (moves <= 16) return "⭐⭐";
    return "⭐";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      <h1 className="font-script text-4xl md:text-5xl text-primary mb-2">
        Memory Match
      </h1>
      <p className="text-muted-foreground font-sans text-sm mb-6">
        Znajdź wszystkie pary! / Find all pairs!
      </p>

      {/* Stats bar */}
      <div className="flex gap-6 mb-6 font-sans text-sm">
        <div className="flex items-center gap-1.5 text-foreground">
          <MousePointerClick className="w-4 h-4 text-primary" />
          <span>{moves} ruchów</span>
        </div>
        <div className="flex items-center gap-1.5 text-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>{formatTime(seconds)}</span>
        </div>
      </div>

      {/* Game grid */}
      <div className="grid grid-cols-4 gap-3 max-w-sm w-full mb-8" style={{ perspective: "1000px" }}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`aspect-square rounded-lg text-3xl md:text-4xl flex items-center justify-center transition-all duration-300 shadow-md
              ${card.matched
                ? "bg-primary/20 border-2 border-primary scale-95 cursor-default"
                : card.flipped
                ? "bg-card border-2 border-primary rotate-y-0"
                : "bg-gradient-to-br from-primary to-secondary hover:shadow-lg hover:scale-105 cursor-pointer border-2 border-primary/30"
              }`}
            disabled={card.matched}
          >
            {card.flipped || card.matched ? (
              <span className="animate-pop-in">{card.icon}</span>
            ) : (
              <span className="text-primary-foreground text-2xl font-script">M&J</span>
            )}
          </button>
        ))}
      </div>

      {/* Game over */}
      {gameOver && (
        <div className="bg-card rounded-xl p-8 shadow-xl text-center animate-bounce-in max-w-sm w-full mb-6">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
          <h2 className="font-script text-3xl text-primary mb-2">Brawo!</h2>
          <p className="font-sans text-foreground mb-1">
            {moves} ruchów • {formatTime(seconds)}
          </p>
          <p className="text-2xl mb-4">{getStars()}</p>
        </div>
      )}

      <Button
        onClick={reset}
        variant="outline"
        className="font-sans border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Nowa gra / New Game
      </Button>
    </div>
  );
};

export default MemoryMatch;
