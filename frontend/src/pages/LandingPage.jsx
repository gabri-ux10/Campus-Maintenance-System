import { useEffect, useState } from "react";
import { publicAnalyticsService } from "../services/publicAnalyticsService";

import { ContactSection } from "../components/Landing/ContactSection";
import { FAQSection } from "../components/Landing/FAQSection";
import { FeaturesSection } from "../components/Landing/FeaturesSection";
import { BottomSocialSection, Footer, QuickLinksSection } from "../components/Landing/Footer";
import { HeroSection } from "../components/Landing/HeroSection";
import { HowItWorksSection } from "../components/Landing/HowItWorksSection";
import { LandingProofStrip } from "../components/Landing/LandingProofStrip";
import { Navbar } from "../components/Landing/Navbar";
import { PoliciesSection } from "../components/Landing/PoliciesSection";
import { ScrollTopButton } from "../components/Landing/ScrollTopButton";

const INITIAL_STATS = {
  totalTickets: null,
  resolvedTickets: null,
  openTickets: null,
  resolvedToday: null,
  averageResolutionHours: null,
  resolvedLast7Days: [],
  lastUpdatedAt: null,
};

const INITIAL_PUBLIC_CONFIG = {
  supportHours: "--",
  supportPhone: "--",
  supportTimezone: "Local campus time",
  urgentSlaHours: null,
  standardSlaHours: null,
};

const usePublicAnalytics = () => {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    let active = true;
    let timer = null;

    const load = async (force = false) => {
      if (!force && document.visibilityState === "hidden") return;
      try {
        const data = await publicAnalyticsService.getSummary();
        if (!active) return;
        setStats({ ...INITIAL_STATS, ...data });
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Live analytics is currently unavailable.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const startPolling = () => {
      if (timer !== null) return;
      timer = window.setInterval(() => {
        load();
      }, 20000);
    };

    const stopPolling = () => {
      if (timer === null) return;
      clearInterval(timer);
      timer = null;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopPolling();
        return;
      }
      load(true);
      startPolling();
    };

    load(true);
    if (document.visibilityState !== "hidden") {
      startPolling();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      active = false;
      stopPolling();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return { stats, loading, error };
};

const usePublicLandingConfig = () => {
  const [config, setConfig] = useState(INITIAL_PUBLIC_CONFIG);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await publicAnalyticsService.getConfig();
        if (!active) return;
        setConfig({ ...INITIAL_PUBLIC_CONFIG, ...data });
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.message || "Support configuration is currently unavailable.");
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return { config, error };
};

export const LandingPage = () => {
  const { stats, loading, error } = usePublicAnalytics();
  const { config } = usePublicLandingConfig();

  return (
    <div className="landing-canvas min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <HeroSection stats={stats} loading={loading} error={error} />
      <LandingProofStrip stats={stats} loading={loading} error={error} />
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <ContactSection config={config} />
      <PoliciesSection />
      <QuickLinksSection config={config} />
      <BottomSocialSection />
      <Footer />
      <ScrollTopButton />
    </div>
  );
};

export default LandingPage;
