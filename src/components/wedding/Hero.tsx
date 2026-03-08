import { useLang } from "@/contexts/LangContext";

const Hero = () => {
  const { t } = useLang();

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center text-center px-5 py-16 relative bg-gradient-to-br from-accent to-secondary/40"
    >
      {/* Decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <h1 className="font-script text-6xl md:text-8xl text-primary mb-6 drop-shadow-sm animate-pop-in">
        {t("ŚLUBIMY SIĘ", "WE'RE GETTING MARRIED")}
      </h1>

      <div className="font-script text-4xl md:text-5xl text-primary/80 mb-8 tracking-wide">
        Marta <span className="inline-block mx-3 text-3xl animate-pulse">♥</span> Jakub
      </div>

      <p className="font-serif text-lg text-foreground tracking-wider mb-2">
        {t("08 sierpnia 2026", "August 08, 2026")}
      </p>
      <p className="font-sans text-muted-foreground">
        {t("Gdańsk, Pomorskie", "Gdańsk, Pomeranian")}
      </p>

      <div className="mt-10">
        <p className="font-sans text-foreground">
          {t("Dołącz do nas w tym wyjątkowym dniu!", "Join us on this special day!")}
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce text-2xl">
        ↓
      </div>
    </section>
  );
};

export default Hero;
