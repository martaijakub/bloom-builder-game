import { LangProvider } from "@/contexts/LangContext";
import { useUnlock } from "@/hooks/useUnlock";
import Navbar from "@/components/wedding/Navbar";
import Hero from "@/components/wedding/Hero";
import Schedule from "@/components/wedding/Schedule";
import Accommodations from "@/components/wedding/Accommodations";
import Activities from "@/components/wedding/Activities";
import LockedSections from "@/components/wedding/LockedSections";
import UnlockModal from "@/components/wedding/UnlockModal";
import Footer from "@/components/wedding/Footer";
import AdminPanel from "@/components/wedding/AdminPanel";

const IndexContent = () => {
  const {
    unlocked,
    isAdmin,
    adminUnlocked,
    previewAsGuest,
    showModal,
    setShowModal,
    tryUnlock,
    checkPassword,
    adminUnlock,
    adminLogout,
    openLoginModal,
    togglePreviewAsGuest,
  } = useUnlock();

  return (
    <div className="min-h-screen bg-background">
      <Navbar unlocked={unlocked} onTryUnlock={tryUnlock} />
      <Hero />
      <Schedule />
      <Accommodations />
      <Activities />
      <LockedSections unlocked={unlocked} isAdmin={isAdmin} />
      <UnlockModal open={showModal} onClose={() => setShowModal(false)} onSubmit={checkPassword} />
      <Footer onAdminUnlock={adminUnlock} />
      <AdminPanel
        adminUnlocked={adminUnlocked}
        isAdmin={isAdmin}
        previewAsGuest={previewAsGuest}
        onLogin={openLoginModal}
        onLogout={adminLogout}
        onTogglePreview={togglePreviewAsGuest}
      />
    </div>
  );
};

const Index = () => (
  <LangProvider>
    <IndexContent />
  </LangProvider>
);

export default Index;
