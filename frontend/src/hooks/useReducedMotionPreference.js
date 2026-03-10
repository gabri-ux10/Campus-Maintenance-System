import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const hasReduceMotionClass = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("reduce-motion");

export const useReducedMotionPreference = () => {
  const prefersReducedMotion = useReducedMotion();
  const [classReducedMotion, setClassReducedMotion] = useState(hasReduceMotionClass);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const root = document.documentElement;
    const updatePreference = () => setClassReducedMotion(root.classList.contains("reduce-motion"));
    const observer = new MutationObserver(updatePreference);

    updatePreference();
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return Boolean(prefersReducedMotion || classReducedMotion);
};
