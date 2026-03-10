import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const ScrollTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 520);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
            className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-campus-500 to-campus-600 text-white shadow-xl shadow-campus-500/30 transition hover:translate-y-[-2px] hover:shadow-campus-500/50"
        >
            <ArrowUp size={18} />
        </button>
    );
};
