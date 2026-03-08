import { useState, useEffect, useCallback, useRef } from "react";
import { useLang } from "@/contexts/LangContext";

const VALID_PASSWORDS = ["JAKUB", "MARTA", "MJ26", "WESELE"];
const UNLOCK_KEY = "wedding_unlocked";

export const useUnlock = () => {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(UNLOCK_KEY) === "true");
  const [showModal, setShowModal] = useState(false);
  const [targetSection, setTargetSection] = useState("");
  const { t } = useLang();

  const tryUnlock = useCallback((sectionName: string) => {
    if (unlocked) {
      scrollTo(sectionName);
      return;
    }
    setTargetSection(sectionName);
    setShowModal(true);
  }, [unlocked]);

  const checkPassword = useCallback((input: string) => {
    if (VALID_PASSWORDS.includes(input.trim().toUpperCase())) {
      localStorage.setItem(UNLOCK_KEY, "true");
      setUnlocked(true);
      setShowModal(false);
      scrollTo(targetSection);
      return true;
    }
    return false;
  }, [targetSection]);

  const adminUnlock = useCallback(() => {
    localStorage.setItem(UNLOCK_KEY, "true");
    setUnlocked(true);
    setShowModal(false);
  }, []);

  const scrollTo = (name: string) => {
    setTimeout(() => {
      const el = document.getElementById(name);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return { unlocked, showModal, setShowModal, tryUnlock, checkPassword, adminUnlock };
};
