import { LangProvider } from "@/contexts/LangContext";
import { useUnlock } from "@/hooks/useUnlock";
import Navbar from "@/components/wedding/Navbar";
import Hero from "@/components/wedding/Hero";
import Schedule from "@/components/wedding/Schedule";
import RSVPForm from "@/components/wedding/RSVPForm";
import Accommodations from "@/components/wedding/Accommodations";
import Activities from "@/components/wedding/Activities";
import GamesSection from "@/components/wedding/GamesSection";
import LockedSections from "@/components/wedding/LockedSections";
import UnlockModal from "@/components/wedding/UnlockModal";
import Footer from "@/components/wedding/Footer";

const IndexContent = () => {
  const { unlocked, isAdmin, showModal, setShowModal, tryUnlock, checkPassword, adminUnlock } = useUnlock();

  return (
    <div className="min-h-screen bg-background">
      <Navbar unlocked={unlocked} onTryUnlock={tryUnlock} />
      <Hero />
      <Schedule />
      <RSVPForm />
      <Accommodations />
      <Activities />
      <GamesSection />
      <LockedSections unlocked={unlocked} isAdmin={isAdmin} />
      <UnlockModal open={showModal} onClose={() => setShowModal(false)} onSubmit={checkPassword} />
      <Footer onAdminUnlock={adminUnlock} />
    </div>
  );
};

const Index = () => (
  <LangProvider>
    <IndexContent />
  </LangProvider>
);

export default Index;
