import { useState } from "react";
import { useLang } from "@/contexts/LangContext";

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
}

const LockedSections = ({ unlocked }: LockedSectionsProps) => {
  const { t } = useLang();

  if (!unlocked) return null;

  return (
    <>
      {/* Seating Plan */}
      <section id="tables-section" className="py-24 px-5 bg-accent/30 border-t-4 border-wedding-sage">
        <h2 className="font-script text-5xl text-primary text-center mb-4">
          {t("Układ Stołów", "Seating Plan")}
        </h2>
        <p className="text-center font-sans text-muted-foreground mb-8">
          {t("Znajdź swoje miejsce!", "Find your seat!")}
        </p>

        <div className="max-w-3xl mx-auto bg-card p-10 rounded-lg shadow-md text-center">
          <div className="border-2 border-dashed border-border p-12 rounded-lg text-muted-foreground">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="font-sans">{t("Tutaj grafika z układem stołów.", "Seating plan graphic here.")}</p>
          </div>

          <div className="mt-8 text-left">
            <h4 className="text-primary font-sans font-semibold mb-3">
              {t("Legenda:", "Legend:")}
            </h4>
            <ul className="font-sans text-sm text-foreground space-y-1.5">
              <li><strong>{t("Stół 1:", "Table 1:")}</strong> {t("Rodzice i Świadkowie", "Parents & Best Men")}</li>
              <li><strong>{t("Stół 2:", "Table 2:")}</strong> {t("Kuzynostwo", "Cousins")}</li>
              <li><strong>{t("Stół 3:", "Table 3:")}</strong> {t("Znajomi z pracy", "Work colleagues")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Photo Challenge */}
      <section id="photo-section" className="py-24 px-5 bg-card border-t-4 border-primary">
        <h2 className="font-script text-5xl text-primary text-center mb-4">
          {t("Foto-Wyzwania 📸", "Photo Challenge 📸")}
        </h2>
        <p className="text-center font-sans text-muted-foreground mb-12">
          {t("Zostań naszym weselnym paparazzi!", "Be our wedding paparazzi!")}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {challenges.map((c, i) => (
            <div
              key={i}
              className="bg-background p-5 rounded-lg border border-border text-center hover:-translate-y-1 hover:border-primary transition-all duration-300 shadow-sm"
            >
              <div className="text-4xl mb-2">{c.icon}</div>
              <p className="font-sans text-sm text-foreground">{t(c.pl, c.en)}</p>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mt-12 bg-muted p-6 rounded-lg text-center">
          <p className="font-sans font-bold text-foreground mb-2">
            {t("Gdzie wysyłać zdjęcia?", "Where to send photos?")}
          </p>
          <p className="font-sans text-sm text-muted-foreground">
            {t(
              'Wrzuć na Instagram z hashtagiem #MartaJakub2026, wyślij nam na WhatsApp lub skorzystaj z naszej chmury',
              'Post on Instagram with #MartaJakub2026, send via WhatsApp or use our cloud'
            )}
          </p>
        </div>
      </section>
    </>
  );
};

export default LockedSections;
