import { useState, useRef, useCallback } from "react";
import { useLang } from "@/contexts/LangContext";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  unlocked: boolean;
  onTryUnlock: (section: string) => void;
}

const Navbar = ({ unlocked, onTryUnlock }: NavbarProps) => {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#home", label: t("Strona główna", "Home") },
    { href: "#schedule", label: t("O wydarzeniu", "About") },
    { href: "#rsvp", label: "RSVP" },
    { href: "#stay", label: t("Noclegi", "Where to Stay") },
    { href: "#activities", label: t("Ciekawe miejsca", "Things to Do") },
    { href: "#games", label: t("Gry", "Games") },
  ];

  const lockedLinks = [
    { section: "tables-section", label: t("Układ Stołów", "Seating Plan") },
    { section: "photo-section", label: t("Foto-Wyzwania", "Photo Challenge") },
  ];

  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Hamburger */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Links */}
        <ul
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent gap-0 md:gap-6 shadow-md md:shadow-none z-40`}
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleNavClick}
                className="block px-5 py-3 md:py-0 text-sm font-sans font-medium uppercase tracking-wider text-foreground hover:text-primary transition-colors border-b md:border-b-0 border-border/30"
              >
                {link.label}
              </a>
            </li>
          ))}
          {lockedLinks.map((item) => (
            <li key={item.section}>
              <button
                onClick={() => {
                  handleNavClick();
                  onTryUnlock(item.section);
                }}
                className={`block w-full text-left px-5 py-3 md:py-0 text-sm font-sans font-medium uppercase tracking-wider transition-colors border-b md:border-b-0 border-border/30 ${
                  unlocked
                    ? "text-primary font-bold"
                    : "text-muted-foreground"
                }`}
              >
                <span className="mr-1">{unlocked ? "🔓" : "🔒"}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Lang toggle */}
        <div className="flex items-center gap-1 font-sans text-sm">
          <button
            onClick={() => setLang("pl")}
            className={`px-2 py-1 rounded transition-all ${
              lang === "pl" ? "text-primary font-bold" : "text-foreground hover:text-primary"
            }`}
          >
            PL
          </button>
          <span className="text-muted-foreground/50">|</span>
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-1 rounded transition-all ${
              lang === "en" ? "text-primary font-bold" : "text-foreground hover:text-primary"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
