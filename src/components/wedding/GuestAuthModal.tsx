import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { X, Mail, Lock, ShieldCheck } from "lucide-react";

interface GuestAuthModalProps {
  open: boolean;
  onClose: () => void;
}

const GuestAuthModal = ({ open, onClose }: GuestAuthModalProps) => {
  const { t } = useLang();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleEmail = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage(
            t(
              "Sprawdź skrzynkę e-mail i kliknij link potwierdzający, aby dokończyć rejestrację.",
              "Check your inbox and click the confirmation link to finish signing up."
            )
          );
        } else {
          onClose();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        onClose();
      }
    } catch (e: any) {
      setError(e?.message || t("Coś poszło nie tak.", "Something went wrong."));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      onClose();
    } catch (e: any) {
      setError(e?.message || t("Logowanie Google nie powiodło się.", "Google sign-in failed."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[4000] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border/60 p-8 md:p-10 relative max-w-sm w-full shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-wedding-gold" />
          </div>
        </div>

        <h3 className="font-serif text-2xl font-light text-foreground mb-2 text-center">
          {t("Zaloguj się, aby wysłać zdjęcia", "Sign in to upload photos")}
        </h3>
        <p className="font-sans text-xs text-muted-foreground mb-6 text-center leading-relaxed">
          {t(
            "Logowanie pomaga nam chronić galerię przed spamem i niestosownymi treściami.",
            "Signing in helps us protect the gallery from spam and inappropriate content."
          )}
        </p>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="w-full mb-5 flex items-center justify-center gap-2 border border-border bg-background py-3 font-sans text-xs uppercase tracking-[0.15em] hover:border-wedding-gold transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8H1.4v3.1A12 12 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.4 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8z" />
          </svg>
          {t("Kontynuuj z Google", "Continue with Google")}
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-border" />
          <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("lub", "or")}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Twój e-mail", "Your email")}
              className="w-full pl-9 pr-4 py-3 bg-background border border-border font-sans text-sm focus:outline-none focus:border-wedding-gold transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEmail()}
              placeholder={t("Hasło", "Password")}
              className="w-full pl-9 pr-4 py-3 bg-background border border-border font-sans text-sm focus:outline-none focus:border-wedding-gold transition-all"
            />
          </div>
        </div>

        {error && (
          <p className="font-sans text-xs text-destructive mt-3">{error}</p>
        )}
        {message && (
          <p className="font-sans text-xs text-wedding-gold mt-3">{message}</p>
        )}

        <button
          onClick={handleEmail}
          disabled={busy || !email || !password}
          className="w-full mt-5 bg-primary text-primary-foreground py-3 font-sans font-medium text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {mode === "signin" ? t("Zaloguj się", "Sign in") : t("Załóż konto", "Create account")}
        </button>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setMessage(null); }}
          className="w-full mt-3 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {mode === "signin"
            ? t("Nie masz konta? Zarejestruj się", "No account? Sign up")
            : t("Masz już konto? Zaloguj się", "Already have an account? Sign in")}
        </button>
      </div>
    </div>
  );
};

export default GuestAuthModal;
