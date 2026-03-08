import { useState, useCallback } from "react";
import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";
import { Calendar, Upload, Share2, X } from "lucide-react";
import SeatingPlan from "./SeatingPlan";
import PhotoGallery from "./PhotoGallery";

declare global {
  interface Window {
    cloudinary: any;
  }
}

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

const CLOUDINARY_CLOUD_NAME = "dyz8kvmfn";
const CLOUDINARY_UPLOAD_PRESET = "wedding_photos";

function openCloudinaryWidget(challengeTag: string, onDone?: () => void) {
  if (!window.cloudinary) {
    alert("Cloudinary widget not loaded yet. Please try again.");
    return;
  }

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      sources: ["local", "camera", "instagram"],
      multiple: true,
      maxFiles: 50,
      folder: "wedding_guests_uploads",
      tags: [challengeTag],
      clientAllowedFormats: ["image"],
      styles: {
        palette: {
          window: "#FFFFFF",
          windowBorder: "#90A0B3",
          tabIcon: "#D4A5A5",
          menuIcons: "#5A616A",
          textDark: "#000000",
          textLight: "#FFFFFF",
          link: "#D4A5A5",
          action: "#8B9D83",
          inactiveTabIcon: "#0E2F5A",
          error: "#F44235",
          inProgress: "#0078FF",
          complete: "#20B832",
          sourceBg: "#E4EBF1",
        },
      },
    },
    (error: any, result: any) => {
      if (!error && result?.event === "queues-end") {
        onDone?.();
      }
    }
  );
  widget.open();
}

function shareViaWhatsApp(challengeName: string) {
  const text = encodeURIComponent(
    `🎉 Foto-Wyzwanie: ${challengeName}\n#MartaJakub2026`
  );
  window.open(`https://wa.me/?text=${text}`, "_blank");
}

function shareViaInstagram(challengeName: string) {
  // Instagram doesn't have a direct share URL with text, 
  // but we can open Instagram and user can share from there
  const text = encodeURIComponent(
    `🎉 Foto-Wyzwanie: ${challengeName} #MartaJakub2026`
  );
  // Copy hashtag to clipboard and open Instagram
  navigator.clipboard?.writeText(`#MartaJakub2026 ${challengeName}`);
  window.open("https://www.instagram.com/", "_blank");
}

// Challenge card with action popup
const ChallengeCard = ({
  challenge,
  index,
}: {
  challenge: (typeof challenges)[0];
  index: number;
}) => {
  const { t } = useLang();
  const [showActions, setShowActions] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const challengeName = t(challenge.pl, challenge.en);
  const tag = challenge.en.toLowerCase().replace(/[^a-z0-9]/g, "_");

  const handleUpload = useCallback(() => {
    openCloudinaryWidget(tag, () => setUploaded(true));
    setShowActions(false);
  }, [tag]);

  return (
    <div className="reveal-child relative">
      <button
        onClick={() => setShowActions(!showActions)}
        className={`w-full border bg-card/50 backdrop-blur-sm p-6 text-center transition-all duration-500 hover:border-wedding-gold/40 hover:bg-card cursor-pointer ${
          uploaded
            ? "border-green-500/60 bg-green-50/30"
            : "border-border/60"
        }`}
      >
        <div className="text-3xl mb-3">{challenge.icon}</div>
        <p className="font-sans text-xs text-foreground leading-relaxed">{challengeName}</p>
        {uploaded && (
          <p className="font-sans text-[10px] text-green-600 mt-1">
            ✓ {t("Wysłano!", "Uploaded!")}
          </p>
        )}
      </button>

      {/* Action popup */}
      {showActions && (
        <div className="absolute inset-0 z-10 bg-card border border-wedding-gold/40 flex flex-col items-center justify-center gap-2 p-3 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setShowActions(false)}
            className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleUpload}
            className="w-full flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground font-sans text-[11px] uppercase tracking-wider transition-colors hover:bg-primary/90"
          >
            <Upload className="w-3.5 h-3.5" />
            {t("Wyślij zdjęcie", "Upload photo")}
          </button>

          <button
            onClick={() => {
              shareViaWhatsApp(challengeName);
              setShowActions(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-[#25D366] text-white font-sans text-[11px] uppercase tracking-wider transition-colors hover:bg-[#25D366]/90"
          >
            <Share2 className="w-3.5 h-3.5" />
            WhatsApp
          </button>

          <button
            onClick={() => {
              shareViaInstagram(challengeName);
              setShowActions(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-sans text-[11px] uppercase tracking-wider transition-colors hover:opacity-90"
          >
            <Share2 className="w-3.5 h-3.5" />
            Instagram
          </button>
        </div>
      )}
    </div>
  );
};

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
              {t(
                "Kliknij kafelek, aby wysłać zdjęcie lub udostępnić!",
                "Click a tile to upload a photo or share!"
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {challenges.map((c, i) => (
              <ChallengeCard key={i} challenge={c} index={i} />
            ))}
          </div>

          {/* Global upload button */}
          <div className="reveal-child mt-10 text-center">
            <button
              onClick={() => openCloudinaryWidget("general")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 font-sans text-xs uppercase tracking-[0.2em] transition-colors hover:bg-primary/90"
            >
              <Upload className="w-4 h-4" />
              {t("Wyślij zdjęcia tutaj", "Upload photos here")}
            </button>
            <p className="font-sans text-[10px] text-muted-foreground mt-2">
              {t("Bez logowania i instalowania aplikacji", "No login or app required")}
            </p>
          </div>

          <div className="reveal-child mt-8 border border-border/60 bg-card/50 p-6 text-center">
            <p className="font-sans text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {t("Inne sposoby wysłania", "Other ways to share")}
            </p>
            <p className="font-sans text-sm text-foreground">
              Instagram #MartaJakub2026 · WhatsApp · {t("nasza chmura (przycisk powyżej)", "our cloud (button above)")}
            </p>
          </div>

          {/* Photo Gallery */}
          <PhotoGallery />
        </div>
      </section>
    </>
  );
};

export default LockedSections;
