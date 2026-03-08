import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useLang } from "@/contexts/LangContext";
import { RefreshCw, X, ChevronLeft, ChevronRight, Image, Filter } from "lucide-react";

const CLOUD_NAME = "dyz8kvmfn";
const FOLDER = "wedding_guests_uploads";

const TAG_FILTERS = [
  { tag: "general", pl: "Ogólne", en: "General", icon: "📷" },
  { tag: "most_interesting_toast", pl: "Toast", en: "Toast", icon: "🥂" },
  { tag: "dancing_queen_king", pl: "Taniec", en: "Dancing", icon: "💃" },
  { tag: "eating_cake__candid_shot_", pl: "Tort", en: "Cake", icon: "🍰" },
  { tag: "newlyweds_kissing", pl: "Pocałunek", en: "Kiss", icon: "💏" },
  { tag: "table_group_selfie", pl: "Selfie", en: "Selfie", icon: "🤪" },
  { tag: "tears_of_joy__a_guest_", pl: "Wzruszenie", en: "Tears", icon: "🥲" },
  { tag: "dancing_without_shoes", pl: "Bez butów", en: "No shoes", icon: "👠" },
  { tag: "favorite_decor_detail", pl: "Dekoracje", en: "Decor", icon: "✨" },
  { tag: "selfie_with_best_man_maid_of_honor", pl: "Ze świadkiem", en: "Best man", icon: "🤳" },
];

interface CloudinaryResource {
  public_id: string;
  version: number;
  format: string;
  width: number;
  height: number;
  created_at: string;
  tags?: string[];
}

function getImageUrl(publicId: string, transform = "c_fill,w_400,h_400,q_auto,f_auto") {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}

function getFullUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${publicId}`;
}

const SWIPE_THRESHOLD = 50;

const LightboxOverlay = ({
  photos,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  photos: CloudinaryResource[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef(0);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDelta.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    touchDelta.current = dx;
    setSwipeOffset(dx);
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > SWIPE_THRESHOLD) {
      if (touchDelta.current < 0) onNext();
      else onPrev();
    }
    touchStart.current = null;
    touchDelta.current = 0;
    setSwipeOffset(0);
  };

  return (
    <div
      className="fixed inset-0 z-[5000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 text-white/70 hover:text-white z-10 hidden md:block"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 text-white/70 hover:text-white z-10 hidden md:block"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <img
        src={getFullUrl(photos[index].public_id)}
        alt={`Photo ${index + 1}`}
        className="max-w-full max-h-[85vh] object-contain transition-transform duration-150"
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      <div className="absolute bottom-4 text-white/60 font-sans text-xs">
        {index + 1} / {photos.length}
      </div>
    </div>
  );
};

const PhotoGallery = () => {
  const { t } = useLang();
  const [photos, setPhotos] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Cloudinary list by tag endpoint (requires "Resource list" enabled in Cloudinary settings)
      const res = await fetch(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/list/v1/wedding_guests_uploads.json`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPhotos(data.resources || []);
    } catch {
      // Fallback: try fetching by common tags used in challenges
      try {
        const tags = ["general", "most_interesting_toast", "dancing_queen_king", "eating_cake__candid_shot_", "newlyweds_kissing", "table_group_selfie"];
        const allPhotos: CloudinaryResource[] = [];
        
        for (const tag of tags) {
          try {
            const res = await fetch(
              `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.resources) allPhotos.push(...data.resources);
            }
          } catch {}
        }
        
        // Deduplicate by public_id
        const unique = Array.from(
          new Map(allPhotos.map((p) => [p.public_id, p])).values()
        );
        setPhotos(unique);
        if (unique.length === 0) setError(true);
      } catch {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };

  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, photos.length]);

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl font-light text-foreground flex items-center gap-2">
          <Image className="w-5 h-5 text-wedding-gold" />
          {t("Galeria gości", "Guest Gallery")}
        </h3>
        <button
          onClick={fetchPhotos}
          disabled={loading}
          className="flex items-center gap-1.5 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {t("Odśwież", "Refresh")}
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground mx-auto mb-2" />
          <p className="font-sans text-xs text-muted-foreground">
            {t("Ładowanie zdjęć…", "Loading photos…")}
          </p>
        </div>
      )}

      {!loading && error && photos.length === 0 && (
        <div className="text-center py-12 border border-border/40 bg-card/30">
          <p className="font-sans text-sm text-muted-foreground mb-1">
            {t("Brak zdjęć w galerii", "No photos in gallery yet")}
          </p>
          <p className="font-sans text-xs text-muted-foreground">
            {t(
              "Bądź pierwszy! Kliknij wyzwanie powyżej i wyślij zdjęcie 📸",
              "Be the first! Click a challenge above and upload a photo 📸"
            )}
          </p>
        </div>
      )}

      {!loading && photos.length > 0 && (
        <>
          <p className="font-sans text-xs text-muted-foreground mb-4">
            {photos.length} {t("zdjęć", "photos")}
          </p>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {photos.map((photo, i) => (
              <button
                key={photo.public_id}
                onClick={() => openLightbox(i)}
                className="aspect-square overflow-hidden border border-border/40 hover:border-wedding-gold/60 transition-all duration-300 hover:scale-[1.02] group"
              >
                <img
                  src={getImageUrl(photo.public_id)}
                  alt={`Guest photo ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <LightboxOverlay
          photos={photos}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </div>
  );
};

export default PhotoGallery;
