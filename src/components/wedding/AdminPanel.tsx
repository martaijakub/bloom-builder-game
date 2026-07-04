import { useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { Shield, ShieldCheck, LogOut, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";

interface AdminPanelProps {
  adminUnlocked: boolean;
  isAdmin: boolean;
  previewAsGuest: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onTogglePreview: () => void;
}

const AdminPanel = ({
  adminUnlocked,
  isAdmin,
  previewAsGuest,
  onLogin,
  onLogout,
  onTogglePreview,
}: AdminPanelProps) => {
  const { t } = useLang();
  const [collapsed, setCollapsed] = useState(false);

  // Not logged in — small unobtrusive button
  if (!adminUnlocked) {
    return (
      <button
        onClick={onLogin}
        className="fixed bottom-4 right-4 z-[2500] flex items-center gap-1.5 bg-card/90 backdrop-blur-sm border border-border/60 text-muted-foreground hover:text-foreground hover:border-wedding-gold/60 px-3 py-2 font-sans text-[11px] uppercase tracking-widest shadow-sm transition-all"
        title={t("Zaloguj jako admin", "Login as admin")}
      >
        <Shield className="w-3.5 h-3.5" />
        Admin
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[2500] bg-card/95 backdrop-blur-md border border-wedding-gold/40 shadow-lg font-sans text-xs">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border/40"
      >
        <span className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${previewAsGuest ? "text-muted-foreground" : "text-wedding-gold"}`} />
          <span className="uppercase tracking-wider text-foreground">
            {previewAsGuest ? t("Podgląd gościa", "Guest preview") : t("Tryb admina", "Admin mode")}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${previewAsGuest ? "bg-muted-foreground" : "bg-wedding-sage"}`} />
        </span>
        {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {!collapsed && (
        <div className="p-3 space-y-2 min-w-[220px]">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {isAdmin
              ? t(
                  "Widzisz wszystko: Stoły, Foto oraz narzędzia edycji.",
                  "You see everything: Tables, Photos and editing tools."
                )
              : t(
                  "Widzisz stronę tak, jak zwykły gość przed 3.08.2026.",
                  "You see the site as a regular guest before Aug 3, 2026."
                )}
          </p>

          <button
            onClick={onTogglePreview}
            className="w-full flex items-center justify-center gap-2 border border-border hover:border-wedding-gold/60 py-2 uppercase tracking-wider text-[10px] text-foreground transition-colors"
          >
            {previewAsGuest ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                {t("Wróć do admina", "Back to admin")}
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                {t("Podgląd jako gość", "Preview as guest")}
              </>
            )}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 border border-destructive/40 text-destructive hover:bg-destructive/10 py-2 uppercase tracking-wider text-[10px] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t("Wyloguj admina", "Logout admin")}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
