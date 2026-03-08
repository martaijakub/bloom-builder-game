import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";

const Accommodations = () => {
  const { t } = useLang();
  const { ref, visible } = useReveal();

  const hotels = [
    { name: "Hotel Otomin", address: "ul. Żurawia, Otomin" },
    { name: "Willa Aleksandria", address: "ul. Jagodowa 1, Otomin" },
  ];

  return (
    <section id="stay" className="py-28 md:py-36 px-6">
      <div ref={ref} className={`max-w-5xl mx-auto reveal-stagger ${visible ? "visible" : ""}`}>
        <div className="reveal-child text-center mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            {t("Noclegi", "Accommodation")}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground tracking-tight mb-6">
            {t("Gdzie się zatrzymać", "Where to Stay")}
          </h2>
          <p className="font-sans text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t(
              "Drodzy Goście! Z uwagi na ograniczoną liczbę miejsc noclegowych w naszej sali, nie wszystkie zaproszenia zawierają zapewnienie noclegu. Jeżeli Twoje zaproszenie nie obejmuje tej opcji, przygotowaliśmy listę polecanych hoteli w pobliżu.",
              "Dear Guests! Due to limited accommodation at our venue, not all invitations include a stay. If yours doesn't, here are recommended nearby hotels."
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {hotels.map((hotel) => (
            <div
              key={hotel.name}
              className="reveal-child border border-border/60 bg-card/50 backdrop-blur-sm p-8 md:p-10 transition-all duration-500 hover:border-wedding-gold/40"
            >
              <h3 className="font-serif text-2xl font-light text-foreground mb-2 tracking-tight">
                {hotel.name}
              </h3>
              <p className="font-sans text-sm text-muted-foreground">{hotel.address}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Accommodations;
