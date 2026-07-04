import { useState, useCallback } from "react";

const ADMIN_PASSWORD = "ADMIN2026";
const UNLOCK_KEY = "wedding_admin_unlocked";

// Date gate: accessible Aug 3-15, 2026
const OPEN_DATE = new Date("2026-08-03T00:00:00");
const CLOSE_DATE = new Date("2026-08-15T23:59:59");

function isDateUnlocked(): boolean {
  const now = new Date();
  return now >= OPEN_DATE && now <= CLOSE_DATE;
}

export const useUnlock = () => {
  const [adminUnlocked, setAdminUnlocked] = useState(
    () => localStorage.getItem(UNLOCK_KEY) === "true"
  );
  const [showModal, setShowModal] = useState(false);
  const [targetSection, setTargetSection] = useState("");
  const [previewAsGuest, setPreviewAsGuest] = useState(false);

  const dateUnlocked = isDateUnlocked();
  const isAdmin = adminUnlocked && !previewAsGuest;
  const unlocked = previewAsGuest ? dateUnlocked : (dateUnlocked || adminUnlocked);

  const tryUnlock = useCallback((sectionName: string) => {
    if (unlocked) {
      scrollTo(sectionName);
      return;
    }
    setTargetSection(sectionName);
    setShowModal(true);
  }, [unlocked]);

  const checkPassword = useCallback((input: string) => {
    if (input.trim().toUpperCase() === ADMIN_PASSWORD) {
      localStorage.setItem(UNLOCK_KEY, "true");
      setAdminUnlocked(true);
      setShowModal(false);
      scrollTo(targetSection);
      return true;
    }
    return false;
  }, [targetSection]);

  const adminUnlock = useCallback(() => {
    localStorage.setItem(UNLOCK_KEY, "true");
    setAdminUnlocked(true);
    setShowModal(false);
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem(UNLOCK_KEY);
    setAdminUnlocked(false);
    setPreviewAsGuest(false);
  }, []);

  const openLoginModal = useCallback(() => setShowModal(true), []);
  const togglePreviewAsGuest = useCallback(() => setPreviewAsGuest((v) => !v), []);

  const scrollTo = (name: string) => {
    setTimeout(() => {
      const el = document.getElementById(name);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return {
    unlocked,
    isAdmin,
    adminUnlocked,
    previewAsGuest,
    dateUnlocked,
    showModal,
    setShowModal,
    tryUnlock,
    checkPassword,
    adminUnlock,
    adminLogout,
    openLoginModal,
    togglePreviewAsGuest,
  };
};
