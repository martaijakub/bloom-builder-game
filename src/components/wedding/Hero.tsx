import { useLang } from "@/contexts/LangContext";

const Hero = () => {
  const { t } = useLang();

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-accent/20 to-background" />
      
      {/* Decorative thin lines */}
      <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-wedding-gold/40 to-transparent hidden md:block" />
      <div className="absolute top-1/3 right-8 w-px h-24 bg-gradient-to-b from-transparent via-wedding-blush/50 to-transparent hidden md:block" />

      <div className="relative z-10 max-w-3xl">
        {/* Small overline */}
        <p className="font-sans text-xs tracking-[0.35em] uppercase text-muted-foreground mb-8">
          {t("Zapraszamy na nasz ślub", "We invite you to our wedding")}
        </p>

        {/* Names — editorial oversized */}
        <h1 className="font-serif text-7xl md:text-9xl font-light text-foreground leading-[0.9] mb-4 tracking-tight">
          Marta
        </h1>
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="divider-gold flex-1 max-w-[80px]" />
          <span className="font-script text-3xl text-wedding-gold">&</span>
          <div className="divider-gold flex-1 max-w-[80px]" />
        </div>
        <h1 className="font-serif text-7xl md:text-9xl font-light text-foreground leading-[0.9] mb-10 tracking-tight">
          Jakub
        </h1>

        {/* Date & Location */}
        <div className="space-y-2">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-foreground/70">
            {t("08 · sierpnia · 2026", "08 · August · 2026")}
          </p>
          <p className="font-sans text-xs tracking-[0.15em] text-muted-foreground">
            Gdańsk, {t("Pomorskie", "Poland")}
          </p>
        </div>

        {/* CTA hint */}
        <div className="mt-16">
          <a
            href="#schedule"
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors group"
          >
            {t("Dowiedz się więcej", "Discover more")}
            <span className="inline-block transition-transform group-hover:translate-y-1">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
