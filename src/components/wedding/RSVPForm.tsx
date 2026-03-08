import { useState, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { useReveal } from "@/hooks/useReveal";
import emailjs from "@emailjs/browser";

const RSVPForm = () => {
  const { lang, t } = useLang();
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const { ref, visible } = useReveal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
    setMessage(null);

    const fd = new FormData(formRef.current);
    const firstName = fd.get("firstName") as string;
    const lastName = fd.get("lastName") as string;
    const email = fd.get("email") as string;
    const attendance = fd.get("attendance") as string;
    const dietary = fd.get("dietary") as string;
    const msg = fd.get("message") as string;
    const plusFirst = fd.get("plusOneFirstName") as string;
    const plusLast = fd.get("plusOneLastName") as string;
    const plusOneName = [plusFirst, plusLast].filter(Boolean).join(" ") || (lang === "pl" ? "Brak" : "None");

    const formData = {
      guestname: `${firstName} ${lastName}`,
      email,
      attending: attendance === "yes" ? "TAK" : "NIE",
      attending1: plusOneName,
      dietary: dietary || (lang === "pl" ? "Brak" : "None"),
      message: msg || (lang === "pl" ? "Brak wiadomości" : "No message"),
      language: lang === "pl" ? "Polish" : "English",
    };

    try {
      emailjs.init({ publicKey: "MmXQul_uJJvS260l9" });
      await emailjs.send("080826", "template_nzzzhuy", formData);
      setMessage({
        text: t("Dziękujemy! Twoja odpowiedź RSVP została przyjęta.", "Thank you! Your RSVP has been received."),
        error: false,
      });
      formRef.current.reset();
    } catch {
      setMessage({
        text: t("Wystąpił błąd. Spróbuj ponownie później.", "An error occurred. Please try again later."),
        error: true,
      });
    } finally {
      setSending(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-background border border-border font-sans text-foreground text-sm focus:outline-none focus:border-wedding-gold focus:ring-1 focus:ring-wedding-gold/20 transition-all";

  return (
    <section id="rsvp" className="py-28 md:py-36 px-6 bg-accent/30">
      <div ref={ref} className={`max-w-xl mx-auto reveal ${visible ? "visible" : ""}`}>
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            {t("Potwierdź obecność", "Confirm attendance")}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-light text-foreground tracking-tight mb-3">
            RSVP
          </h2>
          <p className="font-sans text-sm text-muted-foreground">
            {t("Prosimy o odpowiedź do 30 maja 2026", "Please respond by May 30, 2026")}
          </p>
        </div>

        <div className="border border-border/60 bg-card/50 backdrop-blur-sm p-8 md:p-12">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
                  {t("Imię", "First Name")}
                </label>
                <input name="firstName" required className={inputClass} />
              </div>
              <div>
                <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
                  {t("Nazwisko", "Last Name")}
                </label>
                <input name="lastName" required className={inputClass} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">Email</label>
              <input name="email" type="email" required className={inputClass} />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
                {t("Czy będziesz uczestniczyć?", "Will you be attending?")}
              </label>
              <div className="flex gap-8 mt-3">
                <label className="flex items-center gap-3 font-sans text-sm cursor-pointer">
                  <input type="radio" name="attendance" value="yes" required className="accent-primary w-4 h-4" />
                  {t("Tak", "Yes")}
                </label>
                <label className="flex items-center gap-3 font-sans text-sm cursor-pointer">
                  <input type="radio" name="attendance" value="no" required className="accent-primary w-4 h-4" />
                  {t("Nie", "No")}
                </label>
              </div>
            </div>

            {/* Plus one */}
            <div className="divider-gold my-8" />
            <div className="mb-6">
              <h4 className="font-serif text-xl font-light text-foreground mb-1">
                {t("Osoba towarzysząca", "Plus One")}
              </h4>
              <p className="text-xs text-muted-foreground font-sans mb-5">
                {t(
                  "(wypełnij tylko jeśli otrzymałeś/aś zaproszenie dla dwóch osób)",
                  "(fill only if you received an invitation for two people)"
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
                    {t("Imię", "First Name")}
                  </label>
                  <input name="plusOneFirstName" className={inputClass} />
                </div>
                <div>
                  <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
                    {t("Nazwisko", "Last Name")}
                  </label>
                  <input name="plusOneLastName" className={inputClass} />
                </div>
              </div>
            </div>

            <div className="divider-gold my-8" />
            <div className="mb-6">
              <h4 className="font-serif text-xl font-light text-foreground mb-5">
                {t("Informacje dodatkowe", "Additional Details")}
              </h4>

              <div className="mb-5">
                <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
                  {t("Ograniczenia dietetyczne", "Dietary Restrictions")}
                </label>
                <textarea
                  name="dietary"
                  className={`${inputClass} min-h-[80px] resize-y`}
                  placeholder={t("np. wegetariańskie, bezglutenowe...", "e.g., vegetarian, gluten-free...")}
                />
              </div>

              <div className="mb-8">
                <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
                  {t("Wiadomość", "Message")}
                </label>
                <textarea
                  name="message"
                  className={`${inputClass} min-h-[80px] resize-y`}
                  placeholder={t("Podziel się swoimi życzeniami...", "Share your wishes...")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-primary text-primary-foreground py-4 font-sans font-medium text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {sending ? t("Wysyłanie...", "Sending...") : t("Wyślij RSVP", "Submit RSVP")}
            </button>
          </form>

          {message && (
            <div
              className={`mt-6 text-center font-sans text-sm ${
                message.error ? "text-destructive" : "text-wedding-gold"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RSVPForm;
