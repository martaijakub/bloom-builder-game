import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LangContext";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  unlocked: boolean;
  onTryUnlock: (section: string) => void;
}

const Navbar = ({ unlocked, onTryUnlock }: NavbarProps) => {
  const { lang, setLang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: t("Strona główna", "Home") },
    { href: "#schedule", label: t("O wydarzeniu", "About") },
    { href: "#rsvp", label: "RSVP" },
    { href: "#stay", label: t("Noclegi", "Stay") },
    { href: "#activities", label: t("Okolica", "Explore") },
    { href: "#games", label: t("Gry", "Games") },
  ];

  const lockedLinks = [
    { section: "tables-section", label: t("Stoły", "Tables") },
    { section: "photo-section", label: t("Foto", "Photos") },
  ];

  const handleNavClick = () => setMenuOpen(false);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-wedding-blush/60 backdrop-blur-lg shadow-sm"
          : "bg-wedding-blush/30"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Hamburger */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Links */}
        <ul
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-background/95 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none gap-0 md:gap-8 shadow-lg md:shadow-none z-40`}
        >
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleNavClick}
                className="block px-6 py-3 md:py-0 text-sm font-sans font-medium tracking-wide text-foreground/80 hover:text-foreground transition-colors"
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
                className={`block w-full text-left px-6 py-3 md:py-0 text-sm font-sans font-medium tracking-wide transition-colors ${
                  unlocked
                    ? "text-wedding-gold"
                    : "text-muted-foreground"
                }`}
              >
                <span className="mr-1 text-xs">{unlocked ? "◆" : "◇"}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Lang toggle */}
        <div className="hidden md:flex items-center gap-0.5 font-sans text-xs tracking-widest">
          <button
            onClick={() => setLang("pl")}
            className={`px-2 py-1 rounded-full transition-all ${
              lang === "pl"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            PL
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-1 rounded-full transition-all ${
              lang === "en"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
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
