import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";
import { Calendar } from "lucide-react";
import SeatingPlan from "./SeatingPlan";

const challenges = [
  { icon: "🥂", pl: "Najciekawszy toast", en: "Most interesting toast" },
  { icon: "💃", pl: "Król/Królowa parkietu", en: "Dancing Queen/King" },
  { icon: "🍰", pl: "Ktoś jedzący tort (z ukrycia)", en: "Eating cake (candid shot)" },
  { icon: "💏", pl: "Pocałunek Pary Młodej", en: "Newlyweds kissing" },
  { icon: "🤪", pl: "Grupowe selfie ze stołu", en: "Table group selfie" },
  { icon: "🥲", pl: "Łzy wzruszenia (ktoś z gości)", en: "Tears of joy (a guest)" },
  { icon: "👠", pl: "Taniec bez butów", en: "Dancing without shoes" },
  { icon: "✨", pl: "Ulubiona dekoracja sali", en: "Favorite decor detail" },
  { icon: "🤳", pl: "Selfie ze Świadkiem/Świadkową", en: "Selfie with Best Man/Maid of Honor" },
];

interface LockedSectionsProps {
  unlocked: boolean;
  isAdmin?: boolean;
}

const LockedSections = ({ unlocked, isAdmin }: LockedSectionsProps) => {
  const { t } = useLang();
  const { ref: tablesRef, visible: tablesVisible } = useReveal();
  const { ref: photoRef, visible: photoVisible } = useReveal();

  if (!unlocked) {
    return (
      <section className="py-20 px-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-5">
            <Calendar className="w-6 h-6 text-wedding-gold" />
          </div>
          <h2 className="font-serif text-3xl font-light text-foreground mb-3">
            {t("Wkrótce dostępne", "Coming Soon")}
          </h2>
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            {t(
              "Układ stołów i foto-wyzwania będą dostępne od 3 do 15 sierpnia 2026.",
              "Seating plan and photo challenges will be available from August 3 to 15, 2026."
            )}
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Seating Plan */}
      <section id="tables-section" className="py-28 md:py-36 px-6 bg-accent/30">
        <div ref={tablesRef} className={`max-w-5xl mx-auto reveal ${tablesVisible ? "visible" : ""}`}>
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              {t("Układ sali", "Floor Plan")}
            </p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground tracking-tight mb-4">
              {t("Układ Stołów", "Seating Plan")}
            </h2>
            <p className="font-sans text-sm text-muted-foreground">
              {t("Znajdź swoje miejsce!", "Find your seat!")}
            </p>
          </div>

          <SeatingPlan isAdmin={isAdmin} />
        </div>
      </section>

      {/* Photo Challenge */}
      <section id="photo-section" className="py-28 md:py-36 px-6">
        <div ref={photoRef} className={`max-w-4xl mx-auto reveal-stagger ${photoVisible ? "visible" : ""}`}>
          <div className="reveal-child text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              {t("Zabawa", "Fun")}
            </p>
            <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground tracking-tight mb-4">
              {t("Foto-Wyzwania", "Photo Challenge")} 📸
            </h2>
            <p className="font-sans text-sm text-muted-foreground">
              {t("Zostań naszym weselnym paparazzi!", "Be our wedding paparazzi!")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {challenges.map((c, i) => (
              <div
                key={i}
                className="reveal-child border border-border/60 bg-card/50 backdrop-blur-sm p-6 text-center transition-all duration-500 hover:border-wedding-gold/40"
              >
                <div className="text-3xl mb-3">{c.icon}</div>
                <p className="font-sans text-xs text-foreground leading-relaxed">{t(c.pl, c.en)}</p>
              </div>
            ))}
          </div>

          <div className="reveal-child mt-10 border border-border/60 bg-card/50 p-6 text-center">
            <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {t("Gdzie wysyłać zdjęcia?", "Where to send photos?")}
            </p>
            <p className="font-sans text-sm text-foreground">
              {t(
                "Instagram #MartaJakub2026 · WhatsApp · nasza chmura",
                "Instagram #MartaJakub2026 · WhatsApp · our cloud"
              )}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LockedSections;
