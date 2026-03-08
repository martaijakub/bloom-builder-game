import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-[2000] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-card p-10 rounded-xl text-center relative max-w-sm w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="font-script text-3xl text-primary mb-2">
          {t("Strefa Gości", "Guest Zone")}
        </h3>
        <p className="font-sans text-sm text-muted-foreground mb-6">
          {t("Ta sekcja jest dostępna tylko dla wtajemniczonych.", "This section is for insiders only.")}
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder={t("Hasło", "Password")}
          className="w-full px-4 py-3 border border-border rounded-md font-sans mb-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        />

        {error && (
          <p className="font-sans text-sm text-destructive mb-3">
            {t("Błędne hasło!", "Wrong password!")}
          </p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-sans font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          {t("Odblokuj", "Unlock")}
        </button>
      </div>
    </div>
  );
};

export default UnlockModal;
