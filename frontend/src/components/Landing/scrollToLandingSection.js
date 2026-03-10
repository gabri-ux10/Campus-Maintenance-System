const LANDING_SCROLL_GUTTER = 18;

const getLandingScrollOffset = () => {
  const navHeight =
    document.querySelector(".landing-nav-shell")?.getBoundingClientRect().height ?? 0;
  return navHeight + LANDING_SCROLL_GUTTER;
};

export const scrollToLandingSection = (target, behavior = "smooth") => {
  if (typeof window === "undefined" || typeof document === "undefined" || !target) return false;

  const selector = target.startsWith("#") ? target : `#${target}`;
  const element = document.querySelector(selector);
  if (!element) return false;

  const top = Math.max(
    0,
    window.scrollY + element.getBoundingClientRect().top - getLandingScrollOffset()
  );

  window.scrollTo({ top, behavior });
  return true;
};
