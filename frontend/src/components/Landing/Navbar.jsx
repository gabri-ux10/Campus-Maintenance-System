import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import HoverGradientNavBar from "@/components/ui/hover-gradient-nav-bar";
import { CampusFixLogo } from "./CampusFixLogo";
import { scrollToLandingSection } from "./scrollToLandingSection";
import {
    ArrowRight,
    HelpCircle,
    Mail,
    Menu,
    PanelsTopLeft,
    ShieldCheck,
    Workflow,
    X,
} from "lucide-react";

const NAV_LINKS = [
    { label: "Product", href: "#product" },
    { label: "Roles", href: "#roles" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
];

const NAV_ICONS = [PanelsTopLeft, Workflow, HelpCircle, ShieldCheck, Mail];

export const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, homePath } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 18);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!mobileOpen) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileOpen(false);
            }
        };

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                setMobileOpen(false);
            }
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("resize", onResize);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [mobileOpen]);

    const goToSection = (href) => {
        setMobileOpen(false);
        scrollToLandingSection(href);
    };

    return (
        <nav
            className={`landing-nav-shell fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${scrolled
                    ? "border-b border-gray-200/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/85"
                    : "bg-transparent"
                }`}
        >
            <div className="landing-nav-inner mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
                <Link to="/" className="no-underline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <CampusFixLogo />
                </Link>

                <div className="hidden lg:block">
                    <HoverGradientNavBar
                        items={NAV_LINKS.map((link, index) => ({
                            label: link.label,
                            icon: NAV_ICONS[index % NAV_ICONS.length],
                            onClick: () => goToSection(link.href),
                        }))}
                    />
                </div>

                <div className="flex items-center gap-2.5">
                    <ThemeToggle
                        isDark={theme === "dark"}
                        onToggle={() => toggleTheme()}
                        className="shadow-sm"
                    />

                    <div className="hidden items-center gap-2.5 lg:flex">
                        {isAuthenticated ? (
                            <Link to={homePath} className="btn-primary no-underline">
                                Go to Dashboard <ArrowRight size={16} />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 no-underline transition hover:text-campus-600 dark:text-gray-200 dark:hover:text-campus-300"
                                >
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary no-underline">
                                    Get Started <ArrowRight size={16} />
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        className="landing-nav-toggle rounded-lg border border-gray-200 bg-white p-2 text-gray-600 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300"
                        aria-label="Toggle navigation"
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-navigation-menu"
                    >
                        {mobileOpen ? <X size={23} /> : <Menu size={23} />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div id="mobile-navigation-menu" className="landing-nav-mobile animate-slide-in-down border-t border-gray-200/80 bg-white/95 px-5 py-4 backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/95 lg:hidden">
                    {NAV_LINKS.map((link) => (
                        <button
                            key={link.label}
                            type="button"
                            onClick={() => goToSection(link.href)}
                            className="block w-full py-3 text-left text-base font-semibold text-gray-700 transition hover:text-campus-600 dark:text-gray-200 dark:hover:text-campus-300"
                        >
                            {link.label}
                        </button>
                    ))}

                    <div className="mt-4 flex flex-col gap-2 border-t border-gray-200 pt-4 dark:border-slate-700">
                        {isAuthenticated ? (
                            <Link to={homePath} className="btn-primary w-full justify-center no-underline" onClick={() => setMobileOpen(false)}>
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost w-full justify-center no-underline" onClick={() => setMobileOpen(false)}>
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn-primary w-full justify-center no-underline" onClick={() => setMobileOpen(false)}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
