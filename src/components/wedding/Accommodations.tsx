import { useLang } from "@/contexts/LangContext";

const Accommodations = () => {
  const { t } = useLang();

  const hotels = [
    { name: "Hotel Otomin", address: "ul. Żurawia, Otomin" },
    { name: "Willa Aleksandria", address: "ul. Jagodowa 1, Otomin" },
  ];

  return (
    <section id="stay" className="py-24 px-5 max-w-6xl mx-auto">
      <h2 className="font-script text-5xl text-primary text-center mb-6">
        {t("Gdzie się zatrzymać", "Where to Stay")}
      </h2>
      <p className="text-center text-muted-foreground font-sans text-sm max-w-3xl mx-auto mb-12 leading-relaxed">
        {t(
          "Drodzy Goście! Z uwagi na ograniczoną liczbę miejsc noclegowych w naszej sali, nie wszystkie zaproszenia zawierają zapewnienie noclegu. Jeżeli Twoje zaproszenie nie obejmuje tej opcji, przygotowaliśmy listę polecanych hoteli zlokalizowanych w pobliżu miejsca wesela, które ułatwią Wam rezerwację indywidualną.",
          "Dear Guests! Due to limited accommodation capacity at our venue, not all invitations include a stay. If your invitation does not include this option, we have prepared a list of recommended hotels situated near the wedding venue to assist you with your individual booking."
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {hotels.map((hotel) => (
          <div
            key={hotel.name}
            className="bg-card p-8 rounded-lg shadow-md hover:-translate-y-1 transition-transform duration-300"
          >
            <h3 className="font-serif text-xl text-foreground mb-3">{hotel.name}</h3>
            <p className="font-sans text-sm text-muted-foreground">{hotel.address}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accommodations;
