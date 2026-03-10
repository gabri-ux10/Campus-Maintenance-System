export const turnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || "").trim();
export const turnstileTestToken = (import.meta.env.VITE_TURNSTILE_TEST_TOKEN || "").trim();
export const turnstileEnabled = Boolean(turnstileSiteKey || turnstileTestToken);
