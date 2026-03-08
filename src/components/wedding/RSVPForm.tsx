import { useState, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import emailjs from "@emailjs/browser";

const RSVPForm = () => {
  const { lang, t } = useLang();
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

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
    "w-full px-4 py-3 border border-border rounded-md font-sans text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";

  return (
    <section id="rsvp" className="py-24 px-5">
      <h2 className="font-script text-5xl text-primary text-center mb-4">RSVP</h2>
      <h3 className="font-script text-2xl text-primary text-center mb-12">
        {t("Prosimy o odpowiedź do 30 maja 2026.", "Please respond by May 30th, 2026")}
      </h3>

      <div className="max-w-xl mx-auto bg-card p-8 md:p-12 rounded-lg shadow-md">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-1 font-sans text-sm font-medium text-foreground">
                {t("Imię", "First Name")}
              </label>
              <input name="firstName" required className={inputClass} />
            </div>
            <div>
              <label className="block mb-1 font-sans text-sm font-medium text-foreground">
                {t("Nazwisko", "Last Name")}
              </label>
              <input name="lastName" required className={inputClass} />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-1 font-sans text-sm font-medium text-foreground">Email</label>
            <input name="email" type="email" required className={inputClass} />
          </div>

          <div className="mb-5">
            <label className="block mb-1 font-sans text-sm font-medium text-foreground">
              {t("Czy będziesz uczestniczyć?", "Will you be attending?")}
            </label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 font-sans">
                <input type="radio" name="attendance" value="yes" required className="accent-primary" />
                {t("Tak", "Yes")}
              </label>
              <label className="flex items-center gap-2 font-sans">
                <input type="radio" name="attendance" value="no" required className="accent-primary" />
                {t("Nie", "No")}
              </label>
            </div>
          </div>

          {/* Plus one */}
          <div className="border-t border-border pt-6 mt-6 mb-5">
            <h4 className="font-serif text-lg text-foreground mb-1">
              {t("Osoba towarzysząca", "Plus One")}
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              {t(
                "(wypełnij tylko jeśli otrzymałeś/aś zaproszenie dla dwóch osób)",
                "(fill only if you received an invitation for two people)"
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 font-sans text-sm font-medium text-foreground">
                  {t("Imię", "First Name")}
                </label>
                <input name="plusOneFirstName" className={inputClass} />
              </div>
              <div>
                <label className="block mb-1 font-sans text-sm font-medium text-foreground">
                  {t("Nazwisko", "Last Name")}
                </label>
                <input name="plusOneLastName" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-6 mb-5">
            <h4 className="font-serif text-lg text-foreground mb-4">
              {t("Informacje dodatkowe", "Additional information")}
            </h4>

            <div className="mb-5">
              <label className="block mb-1 font-sans text-sm font-medium text-foreground">
                {t("Ograniczenia dietetyczne (opcjonalnie)", "Dietary Restrictions (optional)")}
              </label>
              <textarea
                name="dietary"
                className={`${inputClass} min-h-[80px] resize-y`}
                placeholder={t("np. wegetariańskie, alergiczne na...", "e.g., vegetarian, allergic to...")}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-sans text-sm font-medium text-foreground">
                {t("Wiadomość dla Pary Młodej", "Message for the Couple")}
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
            className="w-full bg-primary text-primary-foreground py-4 rounded-md font-sans font-semibold text-base uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {sending ? t("Wysyłanie...", "Sending...") : t("Wyślij RSVP", "Submit RSVP")}
          </button>
        </form>

        {message && (
          <div
            className={`mt-5 text-center font-sans text-sm ${
              message.error ? "text-destructive" : "text-primary"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </section>
  );
};

export default RSVPForm;
