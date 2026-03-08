import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, Zap } from "lucide-react";

// Card suits with wedding emoji flair
const SUITS = ["💍", "💐", "🥂", "💒"] as const;
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;

interface Card {
  id: number;
  rank: number; // 0-12
  suit: string;
  faceUp: boolean;
  removed: boolean;
}

// TriPeaks layout: 3 peaks, 4 rows
// Row 0: 3 cards (peaks)
// Row 1: 6 cards
// Row 2: 9 cards  
// Row 3: 10 cards (all face up)
// Total tableau: 28 cards, remaining 24 in draw pile

const LAYOUT: { row: number; col: number; parents: number[] }[] = [];

// Build the TriPeaks layout positions
// Peak positions (which cards block which)
// Row 0 (top): indices 0, 1, 2
// Row 1: indices 3, 4, 5, 6, 7, 8
// Row 2: indices 9, 10, 11, 12, 13, 14, 15, 16, 17
// Row 3 (bottom): indices 18-27

function buildLayout() {
  // Row 0: 3 cards at positions
  const positions: { row: number; col: number; coveredBy: number[] }[] = [];
  
  // Row 0: peaks (3 cards)
  positions.push({ row: 0, col: 0, coveredBy: [] }); // 0
  positions.push({ row: 0, col: 3, coveredBy: [] }); // 1
  positions.push({ row: 0, col: 6, coveredBy: [] }); // 2

  // Row 1: 6 cards
  positions.push({ row: 1, col: -0.5, coveredBy: [0] }); // 3
  positions.push({ row: 1, col: 0.5, coveredBy: [0] });  // 4
  positions.push({ row: 1, col: 2.5, coveredBy: [1] });  // 5
  positions.push({ row: 1, col: 3.5, coveredBy: [1] });  // 6
  positions.push({ row: 1, col: 5.5, coveredBy: [2] });  // 7
  positions.push({ row: 1, col: 6.5, coveredBy: [2] });  // 8

  // Row 2: 9 cards
  positions.push({ row: 2, col: -1, coveredBy: [3] });    // 9
  positions.push({ row: 2, col: 0, coveredBy: [3, 4] });  // 10
  positions.push({ row: 2, col: 1, coveredBy: [4] });     // 11
  positions.push({ row: 2, col: 2, coveredBy: [5] });     // 12
  positions.push({ row: 2, col: 3, coveredBy: [5, 6] });  // 13
  positions.push({ row: 2, col: 4, coveredBy: [6] });     // 14
  positions.push({ row: 2, col: 5, coveredBy: [7] });     // 15
  positions.push({ row: 2, col: 6, coveredBy: [7, 8] });  // 16
  positions.push({ row: 2, col: 7, coveredBy: [8] });     // 17

  // Row 3: 10 cards (all face up, bottom row)
  positions.push({ row: 3, col: -1.5, coveredBy: [9] });     // 18
  positions.push({ row: 3, col: -0.5, coveredBy: [9, 10] }); // 19
  positions.push({ row: 3, col: 0.5, coveredBy: [10, 11] }); // 20
  positions.push({ row: 3, col: 1.5, coveredBy: [11, 12] }); // 21
  positions.push({ row: 3, col: 2.5, coveredBy: [12, 13] }); // 22
  positions.push({ row: 3, col: 3.5, coveredBy: [13, 14] }); // 23
  positions.push({ row: 3, col: 4.5, coveredBy: [14, 15] }); // 24
  positions.push({ row: 3, col: 5.5, coveredBy: [15, 16] }); // 25
  positions.push({ row: 3, col: 6.5, coveredBy: [16, 17] }); // 26
  positions.push({ row: 3, col: 7.5, coveredBy: [17] });     // 27

  return positions;
}

const POSITIONS = buildLayout();

function createDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;
  for (const suit of SUITS) {
    for (let rank = 0; rank < 13; rank++) {
      deck.push({ id: id++, rank, suit, faceUp: false, removed: false });
    }
  }
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function canPlay(cardRank: number, wasteRank: number): boolean {
  const diff = Math.abs(cardRank - wasteRank);
  return diff === 1 || diff === 12; // wrapping K-A
}

function isUncovered(index: number, tableau: Card[]): boolean {
  // A card is uncovered if all cards that cover it are removed
  const pos = POSITIONS[index];
  // Find cards in next row that depend on this card
  // Actually, coveredBy tells us which cards ABOVE cover this card
  // We need: which cards BELOW does this card cover?
  // Reverse: a card is playable if no card below references it as a parent
  // Let me rethink: coveredBy = parent cards that must be removed for this to be face-up
  // But for TriPeaks: a card is playable if it's face-up and uncovered
  // A card is uncovered if no card in a lower row references it in coveredBy and is not removed
  
  for (let i = 0; i < POSITIONS.length; i++) {
    if (i === index) continue;
    if (tableau[i].removed) continue;
    if (POSITIONS[i].coveredBy.includes(index)) {
      return false; // card i is sitting on top of our card
    }
  }
  return true;
}

function updateFaceUp(tableau: Card[]): Card[] {
  return tableau.map((card, index) => {
    if (card.removed) return card;
    // Bottom row always face up
    if (POSITIONS[index].row === 3) return { ...card, faceUp: true };
    // Face up if all covering children are removed
    const childrenRemoved = POSITIONS.every((pos, i) => {
      if (!pos.coveredBy.includes(index)) return true;
      // This is wrong direction - we need to check if cards that sit ON this card are removed
      return true;
    });
    
    // A card is face up if all cards that overlap it from below are removed
    // Cards below that reference this card in their coveredBy
    const coveringCards = POSITIONS.reduce((acc, pos, i) => {
      if (pos.coveredBy.includes(index) && !tableau[i].removed) {
        acc.push(i);
      }
      return acc;
    }, [] as number[]);
    
    // Wait, coveredBy means "I am covered by these parents"
    // So if card X has coveredBy: [A], X sits below A
    // Card A is uncovered when card X (and any other card referencing A) is removed
    // NO - coveredBy means this card is covered by parent cards above
    
    // Let me redefine: a card is face-up when all cards in the row BELOW that overlap it are removed
    // In our layout, a higher-row card is uncovered when lower-row cards that list it in coveredBy are all removed
    
    const isBlocked = POSITIONS.some((pos, i) => 
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

  const initGame = useCallback(() => {
    const deck = createDeck();
    const tab = deck.slice(0, 28);
    const remaining = deck.slice(28);
    const waste = [remaining.pop()!];
    waste[0].faceUp = true;
    
    const updatedTab = updateFaceUp(tab);
    setTableau(updatedTab);
    setDrawPile(remaining);
    setWastePile(waste);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setWon(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleTableauClick = (index: number) => {
    if (gameOver) return;
    const card = tableau[index];
    if (card.removed || !card.faceUp) return;
    if (!isUncovered(index, tableau)) return;
    
    const wasteTop = wastePile[wastePile.length - 1];
    if (!canPlay(card.rank, wasteTop.rank)) return;

    const newTableau = [...tableau];
    newTableau[index] = { ...card, removed: true };
    const updated = updateFaceUp(newTableau);
    
    const newStreak = streak + 1;
    const points = newStreak * 100;
    
    setTableau(updated);
    setWastePile([...wastePile, { ...card, faceUp: true }]);
    setStreak(newStreak);
    setScore(s => s + points);

    // Check win
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

    // Check if game over (no more moves)
    if (newDraw.length === 0) {
      const wasteTop = card;
      const hasMove = tableau.some((c, i) => 
        !c.removed && c.faceUp && isUncovered(i, tableau) && canPlay(c.rank, wasteTop.rank)
      );
      if (!hasMove) {
        setGameOver(true);
      }
    }
  };

  // Check for no moves after each state change
  useEffect(() => {
    if (gameOver || tableau.length === 0 || wastePile.length === 0) return;
    if (drawPile.length > 0) return; // can still draw
    
    const wasteTop = wastePile[wastePile.length - 1];
    const hasMove = tableau.some((c, i) =>
      !c.removed && c.faceUp && isUncovered(i, tableau) && canPlay(c.rank, wasteTop.rank)
    );
    if (!hasMove && !won) {
      setGameOver(true);
    }
  }, [tableau, wastePile, drawPile, gameOver, won]);

  const renderCard = (card: Card, onClick?: () => void, playable?: boolean) => {
    if (card.removed) return null;
    
    if (!card.faceUp) {
      return (
        <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-lg bg-primary/80 border-2 border-primary shadow-md flex items-center justify-center text-primary-foreground text-lg select-none">
          💒
        </div>
      );
    }

    return (
      <button
        onClick={onClick}
        disabled={!playable}
        className={`w-12 h-16 sm:w-14 sm:h-20 rounded-lg bg-card border-2 shadow-md flex flex-col items-center justify-center text-xs sm:text-sm font-bold select-none transition-all duration-200
          ${playable 
            ? "border-primary hover:border-primary hover:shadow-lg hover:-translate-y-1 cursor-pointer ring-2 ring-primary/30" 
            : "border-border cursor-default opacity-80"
          }`}
      >
        <span className="text-foreground leading-none">{RANKS[card.rank]}</span>
        <span className="text-base leading-none">{card.suit}</span>
      </button>
    );
  };

  const wasteTop = wastePile[wastePile.length - 1];

  // Group tableau by row
  const rows = [0, 1, 2, 3].map(row =>
    POSITIONS.map((pos, i) => ({ ...pos, index: i })).filter(p => p.row === row)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-2 py-8">
      <h1 className="font-script text-4xl sm:text-5xl text-primary mb-2">
        Wedding TriPeaks
      </h1>
      <p className="text-muted-foreground text-xs sm:text-sm font-sans mb-6">
        Usuń karty o ±1 od karty na stosie / Remove cards ±1 from the waste pile
      </p>

      {/* Stats */}
      <div className="flex gap-6 mb-6 font-sans text-sm">
        <div className="flex items-center gap-1 text-foreground">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-1 text-foreground">
          <Zap className="w-4 h-4 text-primary" />
          <span className="font-bold">x{streak}</span>
        </div>
      </div>

      {/* Tableau - TriPeaks layout */}
      <div className="relative mb-8 w-full max-w-lg mx-auto" style={{ minHeight: 280 }}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-0.5 sm:gap-1 mb-[-8px] sm:mb-[-6px]"
            style={{ position: "relative", zIndex: rowIndex }}
          >
            {row.map((pos) => {
              const card = tableau[pos.index];
              if (!card) return null;
              const uncovered = isUncovered(pos.index, tableau);
              const playable = card.faceUp && uncovered && wasteTop && canPlay(card.rank, wasteTop.rank);
              
              return (
                <div key={pos.index} className="flex-shrink-0">
                  {card.removed ? (
                    <div className="w-12 h-16 sm:w-14 sm:h-20" />
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
        {/* Draw pile */}
        <button
          onClick={handleDraw}
          disabled={drawPile.length === 0 || gameOver}
          className={`w-14 h-20 sm:w-16 sm:h-24 rounded-lg border-2 flex flex-col items-center justify-center transition-all select-none
            ${drawPile.length > 0 && !gameOver
              ? "bg-primary/80 border-primary text-primary-foreground hover:bg-primary cursor-pointer shadow-lg hover:shadow-xl"
              : "bg-muted border-border text-muted-foreground cursor-default"
            }`}
        >
          <span className="text-lg">🃏</span>
          <span className="text-xs font-sans font-bold">{drawPile.length}</span>
        </button>

        {/* Waste pile */}
        <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-lg bg-card border-2 border-primary shadow-lg flex flex-col items-center justify-center">
          {wasteTop && (
            <>
              <span className="text-sm sm:text-base font-bold text-foreground">{RANKS[wasteTop.rank]}</span>
              <span className="text-xl">{wasteTop.suit}</span>
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
