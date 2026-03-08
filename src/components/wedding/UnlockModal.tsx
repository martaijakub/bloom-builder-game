import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { X, Lock, Calendar } from "lucide-react";

interface UnlockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => boolean;
}

const UnlockModal = ({ open, onClose, onSubmit }: UnlockModalProps) => {
  const { t } = useLang();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    if (onSubmit(password)) {
      setPassword("");
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border/60 p-10 text-center relative max-w-sm w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <Lock className="w-5 h-5 text-wedding-gold" />
          </div>
        </div>

        <h3 className="font-serif text-2xl font-light text-foreground mb-2">
          {t("Strefa Gości", "Guest Zone")}
        </h3>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="font-sans text-xs text-muted-foreground">
            {t("Dostępne 3–15 sierpnia 2026", "Available August 3–15, 2026")}
          </p>
        </div>

        <p className="font-sans text-xs text-muted-foreground mb-5">
          {t("Lub wpisz hasło administratora:", "Or enter admin password:")}
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={t("Hasło admina", "Admin password")}
          className="w-full px-4 py-3 bg-background border border-border font-sans text-sm mb-4 focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold/20 transition-all"
        />

        {error && (
          <p className="font-sans text-xs text-destructive mb-3">
            {t("Błędne hasło!", "Wrong password!")}
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-foreground py-3 font-sans font-medium text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all"
        >
          {t("Odblokuj", "Unlock")}
        </button>
      </div>
    </div>
  );
};

export default UnlockModal;
