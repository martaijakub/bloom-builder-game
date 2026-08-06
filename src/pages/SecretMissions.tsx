import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowLeft, Fingerprint, ShieldAlert } from "lucide-react";
import { secretMissions, SecretMission } from "@/data/secretMissions";

const normalize = (v: string) => v.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

const MissionDossier = ({ mission }: { mission: SecretMission }) => (
  <article className="relative overflow-hidden border border-wedding-gold/40 bg-card shadow-[0_20px_60px_-30px_hsl(var(--foreground)/0.6)]">
    {/* decorative paper grain + stripes */}
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, hsl(var(--foreground)) 0 1px, transparent 1px 9px)",
      }}
    />
    <div className="h-1.5 w-full bg-[repeating-linear-gradient(90deg,hsl(var(--wedding-gold))_0_14px,transparent_14px_28px)]" />

    <div className="relative p-7 md:p-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
            Ściśle tajne · {mission.clearance}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground tracking-tight mt-2">
            {mission.codename}
          </h1>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-wedding-gold mt-3">
            Tylko dla oczu: {mission.agent}
          </p>
        </div>
        <div className="shrink-0 text-4xl md:text-5xl select-none">{mission.emblem}</div>
      </div>

      {/* stamp */}
      <div className="absolute right-5 top-28 hidden md:block rotate-[-14deg] border-[3px] border-destructive/50 px-4 py-1.5">
        <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-destructive/70">
          Classified
        </span>
      </div>

      <p className="font-serif text-lg md:text-xl italic text-foreground/90 leading-relaxed border-l-2 border-wedding-gold/50 pl-5 mb-8">
        {mission.intro}
      </p>

      <div className="space-y-6">
        {mission.briefing.map((b, i) => (
          <div key={i} className="relative pl-10">
            <span className="absolute left-0 top-0 w-7 h-7 flex items-center justify-center border border-wedding-gold/50 font-sans text-[10px] text-wedding-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5">
              {b.label}
            </p>
            <p className="font-sans text-sm text-foreground/90 leading-relaxed">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-9 border border-dashed border-wedding-gold/50 bg-accent/40 p-5">
        <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-wedding-gold mb-2">
          Warunek zaliczenia misji
        </p>
        <p className="font-sans text-sm text-foreground/90 leading-relaxed">{mission.proof}</p>
      </div>

      <p className="mt-8 text-center font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground/70">
        Ta wiadomość samozniszczy się po weselu · #MartaJakub2026
      </p>
    </div>
  </article>
);

const SecretMissions = () => {
  const [input, setInput] = useState("");
  const [mission, setMission] = useState<SecretMission | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = secretMissions.find((m) => normalize(m.code) === normalize(input));
    if (found) {
      setMission(found);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* dark ops header */}
      <header className="relative overflow-hidden bg-foreground text-background py-16 px-6">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--background)) 1px, transparent 0)",
            backgroundSize: "14px 14px",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <Fingerprint className="w-9 h-9 mx-auto mb-5 opacity-70" />
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase opacity-70">
            Centrala operacyjna · 08.08.2026
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mt-3">
            Misje Specjalne
          </h1>
          <p className="font-sans text-sm opacity-70 mt-4 max-w-md mx-auto leading-relaxed">
            Dostęp wyłącznie dla wtajemniczonych. Podaj swój kryptonim, aby odsłonić instrukcje.
          </p>
        </div>
      </header>

      <section className="px-6 py-14">
        <div className="max-w-2xl mx-auto">
          {!mission && (
            <form onSubmit={handleSubmit} className="border border-border/70 bg-card/70 p-8 text-center">
              <Lock className="w-5 h-5 mx-auto text-wedding-gold mb-4" />
              <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Tajne hasło
              </label>
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(false);
                }}
                autoFocus
                placeholder="• • • • • •"
                className="w-full bg-transparent border-b border-wedding-gold/50 text-center font-sans tracking-[0.4em] uppercase text-lg text-foreground py-3 outline-none focus:border-wedding-gold"
              />
              {error && (
                <p className="flex items-center justify-center gap-2 font-sans text-xs text-destructive mt-4">
                  <ShieldAlert className="w-4 h-4" />
                  Nieautoryzowany dostęp. Spróbuj ponownie, agencie.
                </p>
              )}
              <button
                type="submit"
                className="mt-7 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-sans text-xs uppercase tracking-[0.25em] transition-colors hover:bg-primary/90"
              >
                Odszyfruj
              </button>
            </form>
          )}

          {mission && (
            <>
              <MissionDossier mission={mission} />
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    setMission(null);
                    setInput("");
                  }}
                  className="font-sans text-xs uppercase tracking-[0.25em] text-wedding-gold hover:underline"
                >
                  Zamknij teczkę
                </button>
              </div>
            </>
          )}

          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Powrót na stronę wesela
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SecretMissions;
