import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, Globe } from "lucide-react";

type Lang = "pl" | "it" | "sr";

const WORDS: Record<Lang, { words: string[]; label: string; flag: string; trial?: boolean }> = {
  pl: {
    label: "Polski",
    flag: "🇵🇱",
    words: [
      "WESLE", "SLUBV", "TANEC", "TOAST", "BUKIL",
      // 5-letter wedding words (adjusted for Polish)
      "WALCE", "TORTY", "GOSCI", "OBRZE", "SUKNI",
      "KWIAY", "MILOS", "WELON", "ORKIE", "PIERS",
    ].map(() => ""),
    // Actually let's use real 5-letter Polish wedding words
  },
  it: {
    label: "Italiano",
    flag: "🇮🇹",
    trial: true,
    words: [],
  },
  sr: {
    label: "Srpski",
    flag: "🇷🇸",
    trial: true,
    words: [],
  },
};

// Better word lists
const WORD_LISTS: Record<Lang, string[]> = {
  pl: ["WALCE", "TORTY", "SUKNI", "WELON", "TANEC", "OBRZE", "KWIAY", "TOAST", "BUKIL", "GOSCI", "MILOS", "PANNA", "SLUBV", "WESLE"],
  it: ["AMORE", "SPOSA"],
  sr: ["SVDBA", "MLADA"],
};

// Let me use actual valid words
const REAL_WORDS: Record<Lang, string[]> = {
  pl: ["TOAST", "TANEC", "WALCE", "WELON", "TORTY", "PANNA", "BUKLE", "WESOL"],
  it: ["AMORE", "SPOSA"],
  sr: ["VENAC", "MLADA"],
};

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

const KEYBOARDS: Record<Lang, string[][]> = {
  pl: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ],
  it: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ],
  sr: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ],
};

type TileState = "correct" | "present" | "absent" | "empty" | "tbd";

const getRandomWord = (lang: Lang): string => {
  const list = REAL_WORDS[lang];
  return list[Math.floor(Math.random() * list.length)];
};

const WeddingWordle = () => {
  const [lang, setLang] = useState<Lang>("pl");
  const [target, setTarget] = useState(() => getRandomWord("pl"));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [trialUsed, setTrialUsed] = useState<Record<string, number>>({ it: 0, sr: 0 });

  const switchLang = (newLang: Lang) => {
    if (newLang !== "pl") {
      const used = trialUsed[newLang] || 0;
      if (used >= 2) return; // trial exhausted
    }
    setLang(newLang);
    setTarget(getRandomWord(newLang));
    setGuesses([]);
    setCurrent("");
    setGameOver(false);
    setWon(false);
  };

  const getTileState = (guess: string, i: number): TileState => {
    if (guess[i] === target[i]) return "correct";
    if (target.includes(guess[i])) return "present";
    return "absent";
  };

  const getKeyState = (letter: string): TileState => {
    let best: TileState = "empty";
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === letter) {
          const s = getTileState(guess, i);
          if (s === "correct") return "correct";
          if (s === "present") best = "present";
          if (s === "absent" && best === "empty") best = "absent";
        }
      }
    }
    return best;
  };

  const submit = useCallback(() => {
    if (current.length !== WORD_LENGTH || gameOver) return;

    const newGuesses = [...guesses, current];
    setGuesses(newGuesses);
    setCurrent("");

    if (current === target) {
      setWon(true);
      setGameOver(true);
      if (lang !== "pl") {
        setTrialUsed((p) => ({ ...p, [lang]: (p[lang] || 0) + 1 }));
      }
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
      if (lang !== "pl") {
        setTrialUsed((p) => ({ ...p, [lang]: (p[lang] || 0) + 1 }));
      }
    }
  }, [current, guesses, target, gameOver, lang]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver) return;
      if (key === "ENTER") return submit();
      if (key === "BACKSPACE" || key === "DELETE") {
        setCurrent((c) => c.slice(0, -1));
        return;
      }
      if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) {
        setCurrent((c) => c + key);
      }
    },
    [current, gameOver, submit]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const reset = () => {
    setTarget(getRandomWord(lang));
    setGuesses([]);
    setCurrent("");
    setGameOver(false);
    setWon(false);
  };

  const tileColor = (state: TileState) => {
    switch (state) {
      case "correct": return "bg-green-600 text-white border-green-600";
      case "present": return "bg-yellow-500 text-white border-yellow-500";
      case "absent": return "bg-muted-foreground/60 text-white border-muted-foreground/60";
      default: return "bg-card border-border";
    }
  };

  const keyColor = (state: TileState) => {
    switch (state) {
      case "correct": return "bg-green-600 text-white";
      case "present": return "bg-yellow-500 text-white";
      case "absent": return "bg-muted-foreground/40 text-white";
      default: return "bg-muted text-foreground";
    }
  };

  const langInfo = WORDS[lang];
  const rows = Array.from({ length: MAX_GUESSES }, (_, i) => {
    if (i < guesses.length) return guesses[i];
    if (i === guesses.length) return current.padEnd(WORD_LENGTH, " ");
    return "     ";
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      <h1 className="font-script text-4xl md:text-5xl text-primary mb-1">
        Wedding Wordle
      </h1>
      <p className="text-muted-foreground font-sans text-sm mb-4">
        Odgadnij ślubne słowo w 6 próbach!
      </p>

      {/* Language selector */}
      <div className="flex gap-2 mb-6">
        {(["pl", "it", "sr"] as Lang[]).map((l) => {
          const info = WORDS[l];
          const used = trialUsed[l] || 0;
          const exhausted = info.trial && used >= 2;
          return (
            <button
              key={l}
              onClick={() => !exhausted && switchLang(l)}
              className={`font-sans text-sm px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-1.5
                ${lang === l
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : exhausted
                  ? "border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  : "border-border hover:border-primary/50 text-foreground"
                }`}
              disabled={!!exhausted}
            >
              <span>{info.flag}</span>
              <span>{info.label}</span>
              {info.trial && (
                <span className="text-xs text-muted-foreground ml-1">
                  ({2 - used} left)
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid gap-1.5 mb-6">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className={`flex gap-1.5 ${ri === guesses.length && shake ? "animate-shake" : ""}`}
          >
            {Array.from(row).map((letter, ci) => {
              const isGuessed = ri < guesses.length;
              const state: TileState = isGuessed ? getTileState(guesses[ri], ci) : "empty";
              const isCurrent = ri === guesses.length && ci < current.length;
              return (
                <div
                  key={ci}
                  className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-xl md:text-2xl font-bold font-sans rounded border-2 transition-all duration-300
                    ${isGuessed ? tileColor(state) : isCurrent ? "border-primary bg-card" : "border-border bg-card"}
                    ${isCurrent ? "animate-pop-in" : ""}
                  `}
                >
                  {letter.trim() ? letter : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Game over message */}
      {gameOver && (
        <div className="bg-card rounded-xl p-6 shadow-xl text-center animate-bounce-in max-w-sm w-full mb-6">
          {won ? (
            <>
              <Trophy className="w-10 h-10 text-primary mx-auto mb-2" />
              <h2 className="font-script text-2xl text-primary mb-1">Brawo! 🎉</h2>
              <p className="font-sans text-sm text-foreground">
                Odgadłeś w {guesses.length} {guesses.length === 1 ? "próbie" : "próbach"}!
              </p>
            </>
          ) : (
            <>
              <h2 className="font-script text-2xl text-primary mb-1">Następnym razem!</h2>
              <p className="font-sans text-sm text-foreground">
                Słowo to: <strong className="text-primary">{target}</strong>
              </p>
            </>
          )}
        </div>
      )}

      {/* Keyboard */}
      <div className="flex flex-col gap-1.5 mb-6">
        {KEYBOARDS[lang].map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1">
            {ri === 2 && (
              <button
                onClick={() => handleKey("ENTER")}
                className="px-3 py-3 rounded font-sans text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                ENTER
              </button>
            )}
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className={`w-8 h-10 md:w-10 md:h-12 rounded font-sans text-sm font-bold transition-all ${keyColor(getKeyState(key))}`}
              >
                {key}
              </button>
            ))}
            {ri === 2 && (
              <button
                onClick={() => handleKey("BACKSPACE")}
                className="px-3 py-3 rounded font-sans text-xs font-bold bg-muted text-foreground hover:bg-muted-foreground/20 transition-colors"
              >
                ⌫
              </button>
            )}
          </div>
        ))}
      </div>

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

export default WeddingWordle;
