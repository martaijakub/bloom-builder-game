import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, Zap } from "lucide-react";

const SUITS = ["💍", "💐", "🥂", "💒"] as const;
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

// Red-ish suits for color coding
const RED_SUITS = new Set(["💍", "💐"]);

interface Card {
  id: number;
  rank: number;
  suit: string;
  faceUp: boolean;
  removed: boolean;
}

interface LayoutPos {
  row: number;
  col: number;
  coveredBy: number[];
}

// ---- 5 different TriPeaks layouts ----

function buildClassicLayout(): LayoutPos[] {
  // Classic 3-peak: 3 + 6 + 9 + 10 = 28 cards
  return [
    // Row 0: 3 peaks
    { row: 0, col: 0, coveredBy: [] },
    { row: 0, col: 3, coveredBy: [] },
    { row: 0, col: 6, coveredBy: [] },
    // Row 1: 6
    { row: 1, col: -0.5, coveredBy: [0] },
    { row: 1, col: 0.5, coveredBy: [0] },
    { row: 1, col: 2.5, coveredBy: [1] },
    { row: 1, col: 3.5, coveredBy: [1] },
    { row: 1, col: 5.5, coveredBy: [2] },
    { row: 1, col: 6.5, coveredBy: [2] },
    // Row 2: 9
    { row: 2, col: -1, coveredBy: [3] },
    { row: 2, col: 0, coveredBy: [3, 4] },
    { row: 2, col: 1, coveredBy: [4] },
    { row: 2, col: 2, coveredBy: [5] },
    { row: 2, col: 3, coveredBy: [5, 6] },
    { row: 2, col: 4, coveredBy: [6] },
    { row: 2, col: 5, coveredBy: [7] },
    { row: 2, col: 6, coveredBy: [7, 8] },
    { row: 2, col: 7, coveredBy: [8] },
    // Row 3: 10
    { row: 3, col: -1.5, coveredBy: [9] },
    { row: 3, col: -0.5, coveredBy: [9, 10] },
    { row: 3, col: 0.5, coveredBy: [10, 11] },
    { row: 3, col: 1.5, coveredBy: [11, 12] },
    { row: 3, col: 2.5, coveredBy: [12, 13] },
    { row: 3, col: 3.5, coveredBy: [13, 14] },
    { row: 3, col: 4.5, coveredBy: [14, 15] },
    { row: 3, col: 5.5, coveredBy: [15, 16] },
    { row: 3, col: 6.5, coveredBy: [16, 17] },
    { row: 3, col: 7.5, coveredBy: [17] },
  ];
}

function buildTallPeaksLayout(): LayoutPos[] {
  // Taller peaks: 3 + 3 + 6 + 6 + 10 = 28
  return [
    // Row 0: 3 peaks (very top)
    { row: 0, col: 0, coveredBy: [] },
    { row: 0, col: 3.5, coveredBy: [] },
    { row: 0, col: 7, coveredBy: [] },
    // Row 1: 3 cards (one under each peak)
    { row: 1, col: -0.5, coveredBy: [0] },
    { row: 1, col: 3, coveredBy: [1] },
    { row: 1, col: 6.5, coveredBy: [2] },
    // Row 2: 6 cards
    { row: 2, col: -1, coveredBy: [3] },
    { row: 2, col: 0, coveredBy: [0, 3] },
    { row: 2, col: 2.5, coveredBy: [4] },
    { row: 2, col: 3.5, coveredBy: [1, 4] },
    { row: 2, col: 6, coveredBy: [5] },
    { row: 2, col: 7, coveredBy: [2, 5] },
    // Row 3: 6 cards
    { row: 3, col: -1.5, coveredBy: [6] },
    { row: 3, col: -0.5, coveredBy: [6, 7] },
    { row: 3, col: 2, coveredBy: [8] },
    { row: 3, col: 3, coveredBy: [8, 9] },
    { row: 3, col: 5.5, coveredBy: [10] },
    { row: 3, col: 6.5, coveredBy: [10, 11] },
    // Row 4: 10 cards (bottom, all face up)
    { row: 4, col: -2, coveredBy: [12] },
    { row: 4, col: -1, coveredBy: [12, 13] },
    { row: 4, col: 0, coveredBy: [13] },
    { row: 4, col: 1.5, coveredBy: [14] },
    { row: 4, col: 2.5, coveredBy: [14, 15] },
    { row: 4, col: 3.5, coveredBy: [15] },
    { row: 4, col: 5, coveredBy: [16] },
    { row: 4, col: 6, coveredBy: [16, 17] },
    { row: 4, col: 7, coveredBy: [17] },
    { row: 4, col: 8, coveredBy: [] },
  ];
}

function buildWidePeaksLayout(): LayoutPos[] {
  // Wide shallow: 4 + 8 + 8 + 8 = 28
  return [
    // Row 0: 4 peaks
    { row: 0, col: 0, coveredBy: [] },
    { row: 0, col: 2.5, coveredBy: [] },
    { row: 0, col: 5, coveredBy: [] },
    { row: 0, col: 7.5, coveredBy: [] },
    // Row 1: 8
    { row: 1, col: -0.5, coveredBy: [0] },
    { row: 1, col: 0.5, coveredBy: [0] },
    { row: 1, col: 2, coveredBy: [1] },
    { row: 1, col: 3, coveredBy: [1] },
    { row: 1, col: 4.5, coveredBy: [2] },
    { row: 1, col: 5.5, coveredBy: [2] },
    { row: 1, col: 7, coveredBy: [3] },
    { row: 1, col: 8, coveredBy: [3] },
    // Row 2: 8
    { row: 2, col: -1, coveredBy: [4] },
    { row: 2, col: 0, coveredBy: [4, 5] },
    { row: 2, col: 1.5, coveredBy: [6] },
    { row: 2, col: 2.5, coveredBy: [6, 7] },
    { row: 2, col: 4, coveredBy: [8] },
    { row: 2, col: 5, coveredBy: [8, 9] },
    { row: 2, col: 6.5, coveredBy: [10] },
    { row: 2, col: 7.5, coveredBy: [10, 11] },
    // Row 3: 8 (bottom)
    { row: 3, col: -1.5, coveredBy: [12] },
    { row: 3, col: -0.5, coveredBy: [12, 13] },
    { row: 3, col: 1, coveredBy: [14] },
    { row: 3, col: 2, coveredBy: [14, 15] },
    { row: 3, col: 3.5, coveredBy: [16] },
    { row: 3, col: 4.5, coveredBy: [16, 17] },
    { row: 3, col: 6, coveredBy: [18] },
    { row: 3, col: 7, coveredBy: [18, 19] },
  ];
}

function buildDiamondLayout(): LayoutPos[] {
  // Diamond-ish: 1 + 3 + 5 + 7 + 7 + 5 = 28
  return [
    // Row 0: 1 peak
    { row: 0, col: 3.5, coveredBy: [] },
    // Row 1: 3
    { row: 1, col: 2.5, coveredBy: [0] },
    { row: 1, col: 3.5, coveredBy: [] },
    { row: 1, col: 4.5, coveredBy: [0] },
    // Row 2: 5
    { row: 2, col: 1.5, coveredBy: [1] },
    { row: 2, col: 2.5, coveredBy: [1, 2] },
    { row: 2, col: 3.5, coveredBy: [2] },
    { row: 2, col: 4.5, coveredBy: [2, 3] },
    { row: 2, col: 5.5, coveredBy: [3] },
    // Row 3: 7
    { row: 3, col: 0.5, coveredBy: [4] },
    { row: 3, col: 1.5, coveredBy: [4, 5] },
    { row: 3, col: 2.5, coveredBy: [5, 6] },
    { row: 3, col: 3.5, coveredBy: [6] },
    { row: 3, col: 4.5, coveredBy: [6, 7] },
    { row: 3, col: 5.5, coveredBy: [7, 8] },
    { row: 3, col: 6.5, coveredBy: [8] },
    // Row 4: 7 (bottom)
    { row: 4, col: 0, coveredBy: [9] },
    { row: 4, col: 1, coveredBy: [9, 10] },
    { row: 4, col: 2, coveredBy: [10, 11] },
    { row: 4, col: 3, coveredBy: [11, 12] },
    { row: 4, col: 4, coveredBy: [12, 13] },
    { row: 4, col: 5, coveredBy: [13, 14] },
    { row: 4, col: 6, coveredBy: [14, 15] },
    // Extra 2 to reach 28 — add row 5
    { row: 5, col: 0.5, coveredBy: [16, 17] },
    { row: 5, col: 2.5, coveredBy: [18, 19] },
    { row: 5, col: 4.5, coveredBy: [20, 21] },
    { row: 5, col: 6.5, coveredBy: [22] },
    { row: 5, col: 3.5, coveredBy: [19, 20] },
  ];
}

function buildPyramidLayout(): LayoutPos[] {
  // Single large pyramid: 1 + 2 + 3 + 4 + 5 + 6 + 7 = 28
  return [
    // Row 0: 1
    { row: 0, col: 3.5, coveredBy: [] },
    // Row 1: 2
    { row: 1, col: 3, coveredBy: [0] },
    { row: 1, col: 4, coveredBy: [0] },
    // Row 2: 3
    { row: 2, col: 2.5, coveredBy: [1] },
    { row: 2, col: 3.5, coveredBy: [1, 2] },
    { row: 2, col: 4.5, coveredBy: [2] },
    // Row 3: 4
    { row: 3, col: 2, coveredBy: [3] },
    { row: 3, col: 3, coveredBy: [3, 4] },
    { row: 3, col: 4, coveredBy: [4, 5] },
    { row: 3, col: 5, coveredBy: [5] },
    // Row 4: 5
    { row: 4, col: 1.5, coveredBy: [6] },
    { row: 4, col: 2.5, coveredBy: [6, 7] },
    { row: 4, col: 3.5, coveredBy: [7, 8] },
    { row: 4, col: 4.5, coveredBy: [8, 9] },
    { row: 4, col: 5.5, coveredBy: [9] },
    // Row 5: 6
    { row: 5, col: 1, coveredBy: [10] },
    { row: 5, col: 2, coveredBy: [10, 11] },
    { row: 5, col: 3, coveredBy: [11, 12] },
    { row: 5, col: 4, coveredBy: [12, 13] },
    { row: 5, col: 5, coveredBy: [13, 14] },
    { row: 5, col: 6, coveredBy: [14] },
    // Row 6: 7 (bottom)
    { row: 6, col: 0.5, coveredBy: [15] },
    { row: 6, col: 1.5, coveredBy: [15, 16] },
    { row: 6, col: 2.5, coveredBy: [16, 17] },
    { row: 6, col: 3.5, coveredBy: [17, 18] },
    { row: 6, col: 4.5, coveredBy: [18, 19] },
    { row: 6, col: 5.5, coveredBy: [19, 20] },
    { row: 6, col: 6.5, coveredBy: [20] },
  ];
}

const ALL_LAYOUTS = [
  { name: "Classic TriPeaks", builder: buildClassicLayout },
  { name: "Tall Peaks", builder: buildTallPeaksLayout },
  { name: "Wide Peaks", builder: buildWidePeaksLayout },
  { name: "Diamond", builder: buildDiamondLayout },
  { name: "Pyramid", builder: buildPyramidLayout },
];

function createDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;
  for (const suit of SUITS) {
    for (let rank = 0; rank < 13; rank++) {
      deck.push({ id: id++, rank, suit, faceUp: false, removed: false });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function canPlay(cardRank: number, wasteRank: number): boolean {
  const diff = Math.abs(cardRank - wasteRank);
  return diff === 1 || diff === 12;
}

function isUncovered(index: number, tableau: Card[], positions: LayoutPos[]): boolean {
  for (let i = 0; i < positions.length; i++) {
    if (i === index) continue;
    if (tableau[i].removed) continue;
    if (positions[i].coveredBy.includes(index)) return false;
  }
  return true;
}

function getMaxRow(positions: LayoutPos[]): number {
  return Math.max(...positions.map(p => p.row));
}

function updateFaceUp(tableau: Card[], positions: LayoutPos[]): Card[] {
  const maxRow = getMaxRow(positions);
  return tableau.map((card, index) => {
    if (card.removed) return card;
    if (positions[index].row === maxRow) return { ...card, faceUp: true };
    const isBlocked = positions.some((pos, i) =>
      pos.coveredBy.includes(index) && !tableau[i].removed
    );
    return { ...card, faceUp: !isBlocked };
  });
}

const TriPeaksSolitaire = () => {
  const [tableau, setTableau] = useState<Card[]>([]);
  const [drawPile, setDrawPile] = useState<Card[]>([]);
  const [wastePile, setWastePile] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [layoutIndex, setLayoutIndex] = useState(0);
  const positionsRef = useRef<LayoutPos[]>(buildClassicLayout());

  const initGame = useCallback(() => {
    const idx = Math.floor(Math.random() * ALL_LAYOUTS.length);
    const positions = ALL_LAYOUTS[idx].builder();
    positionsRef.current = positions;
    setLayoutIndex(idx);

    const deck = createDeck();
    const tabSize = positions.length;
    const tab = deck.slice(0, tabSize);
    const remaining = deck.slice(tabSize);
    const waste = [remaining.pop()!];
    waste[0].faceUp = true;

    const updatedTab = updateFaceUp(tab, positions);
    setTableau(updatedTab);
    setDrawPile(remaining);
    setWastePile(waste);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const positions = positionsRef.current;

  const handleTableauClick = (index: number) => {
    if (gameOver) return;
    const card = tableau[index];
    if (card.removed || !card.faceUp) return;
    if (!isUncovered(index, tableau, positions)) return;

    const wasteTop = wastePile[wastePile.length - 1];
    if (!canPlay(card.rank, wasteTop.rank)) return;

    const newTableau = [...tableau];
    newTableau[index] = { ...card, removed: true };
    const updated = updateFaceUp(newTableau, positions);

    const newStreak = streak + 1;
    const points = newStreak * 100;

    setTableau(updated);
    setWastePile([...wastePile, { ...card, faceUp: true }]);
    setStreak(newStreak);
    setScore(s => s + points);

    if (updated.every(c => c.removed)) {
      setWon(true);
      setGameOver(true);
    }
  };

  const handleDraw = () => {
    if (gameOver || drawPile.length === 0) return;
    const newDraw = [...drawPile];
    const card = newDraw.pop()!;
    card.faceUp = true;
    setDrawPile(newDraw);
    setWastePile([...wastePile, card]);
    setStreak(0);

    if (newDraw.length === 0) {
      const hasMove = tableau.some((c, i) =>
        !c.removed && c.faceUp && isUncovered(i, tableau, positions) && canPlay(c.rank, card.rank)
      );
      if (!hasMove) setGameOver(true);
    }
  };

  useEffect(() => {
    if (gameOver || tableau.length === 0 || wastePile.length === 0) return;
    if (drawPile.length > 0) return;

    const wasteTop = wastePile[wastePile.length - 1];
    const hasMove = tableau.some((c, i) =>
      !c.removed && c.faceUp && isUncovered(i, tableau, positions) && canPlay(c.rank, wasteTop.rank)
    );
    if (!hasMove && !won) setGameOver(true);
  }, [tableau, wastePile, drawPile, gameOver, won, positions]);

  const wasteTop = wastePile[wastePile.length - 1];

  // Group by row
  const maxRow = positions.length > 0 ? getMaxRow(positions) : 0;
  const rows = Array.from({ length: maxRow + 1 }, (_, row) =>
    positions.map((pos, i) => ({ ...pos, index: i })).filter(p => p.row === row)
  );

  const getRankColor = (suit: string) =>
    RED_SUITS.has(suit) ? "text-destructive" : "text-foreground";

  const renderCard = (card: Card, onClick?: () => void, playable?: boolean) => {
    if (card.removed) return null;

    if (!card.faceUp) {
      return (
        <div className="w-14 h-20 sm:w-16 sm:h-[5.5rem] rounded-lg bg-primary/80 border-2 border-primary shadow-md flex items-center justify-center text-primary-foreground text-xl select-none">
          💒
        </div>
      );
    }

    return (
      <button
        onClick={onClick}
        disabled={!playable}
        className={`w-14 h-20 sm:w-16 sm:h-[5.5rem] rounded-lg bg-card border-2 shadow-md flex flex-col items-center justify-center select-none transition-all duration-200
          ${playable
            ? "border-primary hover:shadow-lg hover:-translate-y-1 cursor-pointer ring-2 ring-primary/30"
            : "border-border cursor-default opacity-80"
          }`}
      >
        <span className={`text-base sm:text-lg font-extrabold leading-none ${getRankColor(card.suit)}`}>
          {RANKS[card.rank]}
        </span>
        <span className="text-xl sm:text-2xl leading-none mt-0.5">{card.suit}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-2 py-8">
      <h1 className="font-script text-4xl sm:text-5xl text-primary mb-1">
        Wedding TriPeaks
      </h1>
      <p className="text-muted-foreground text-xs sm:text-sm font-sans mb-1">
        Usuń karty o ±1 od karty na stosie / Remove cards ±1 from the waste pile
      </p>
      <p className="text-xs font-sans text-primary/70 mb-5">
        Layout: {ALL_LAYOUTS[layoutIndex].name}
      </p>

      {/* Stats */}
      <div className="flex gap-6 mb-6 font-sans text-base">
        <div className="flex items-center gap-1.5 text-foreground">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">{score}</span>
        </div>
        <div className="flex items-center gap-1.5 text-foreground">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">x{streak}</span>
        </div>
      </div>

      {/* Tableau */}
      <div className="relative mb-8 w-full max-w-xl mx-auto" style={{ minHeight: rows.length * 60 }}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-0.5 sm:gap-1 mb-[-10px] sm:mb-[-8px]"
            style={{ position: "relative", zIndex: rowIndex }}
          >
            {row.map((pos) => {
              const card = tableau[pos.index];
              if (!card) return null;
              const uncovered = isUncovered(pos.index, tableau, positions);
              const playable = card.faceUp && uncovered && !!wasteTop && canPlay(card.rank, wasteTop.rank);

              return (
                <div key={pos.index} className="flex-shrink-0">
                  {card.removed ? (
                    <div className="w-14 h-20 sm:w-16 sm:h-[5.5rem]" />
                  ) : (
                    renderCard(card, () => handleTableauClick(pos.index), playable)
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Draw and Waste piles */}
      <div className="flex items-center gap-8 mb-8">
        <button
          onClick={handleDraw}
          disabled={drawPile.length === 0 || gameOver}
          className={`w-16 h-[5.5rem] sm:w-18 sm:h-24 rounded-lg border-2 flex flex-col items-center justify-center transition-all select-none
            ${drawPile.length > 0 && !gameOver
              ? "bg-primary/80 border-primary text-primary-foreground hover:bg-primary cursor-pointer shadow-lg hover:shadow-xl"
              : "bg-muted border-border text-muted-foreground cursor-default"
            }`}
        >
          <span className="text-xl">🃏</span>
          <span className="text-sm font-sans font-bold">{drawPile.length}</span>
        </button>

        <div className="w-16 h-[5.5rem] sm:w-18 sm:h-24 rounded-lg bg-card border-2 border-primary shadow-lg flex flex-col items-center justify-center">
          {wasteTop && (
            <>
              <span className={`text-lg sm:text-xl font-extrabold ${getRankColor(wasteTop.suit)}`}>
                {RANKS[wasteTop.rank]}
              </span>
              <span className="text-2xl">{wasteTop.suit}</span>
            </>
          )}
        </div>
      </div>

      {/* Game Over / Win */}
      {gameOver && (
        <div className="text-center mb-6 animate-in fade-in duration-500">
          {won ? (
            <>
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="font-script text-3xl text-primary mb-1">Gratulacje!</h2>
              <p className="text-muted-foreground font-sans text-sm">
                Wynik: {score} punktów!
              </p>
            </>
          ) : (
            <>
              <div className="text-5xl mb-3">😅</div>
              <h2 className="font-serif text-2xl text-foreground mb-1">Koniec gry!</h2>
              <p className="text-muted-foreground font-sans text-sm">
                Wynik: {score} punktów. Spróbuj ponownie!
              </p>
            </>
          )}
        </div>
      )}

      <Button
        onClick={initGame}
        variant="outline"
        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-sans"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Nowa gra / New Game
      </Button>
    </div>
  );
};

export default TriPeaksSolitaire;
