/**
 * Skeleton loader variants: card, row, chart, stat
 *
 * @param {{ variant?: "card"|"row"|"chart"|"stat", count?: number, className?: string }} props
 */
export const SkeletonLoader = ({ variant = "card", count = 1, className = "" }) => {
    const items = Array.from({ length: count }, (_, i) => i);

    if (variant === "stat") {
        return (
            <div className={`dashboard-stat-grid ${className}`}>
                {items.map((i) => (
                    <div key={i} className="saas-card flex items-center gap-4 p-5">
                        <div className="skeleton-pulse h-12 w-12 rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <div className="skeleton-pulse h-3 w-20 rounded-full" />
                            <div className="skeleton-pulse h-7 w-16 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (variant === "chart") {
        return (
            <div className={`saas-card ${className}`}>
                <div className="skeleton-pulse mb-4 h-4 w-36 rounded-full" />
                <div className="skeleton-pulse h-64 rounded-xl" />
            </div>
        );
    }

    if (variant === "row") {
        const widthVariants = ["w-2/3", "w-1/2", "w-3/5", "w-5/6", "w-3/4"];
        return (
            <div className={`space-y-3 ${className}`}>
                {items.map((i) => (
                    <div key={i} className="saas-card flex items-center gap-3 px-4 py-3">
                        <div className="skeleton-pulse h-4 w-8 rounded-full" />
                        <div className={`skeleton-pulse h-4 ${widthVariants[i % widthVariants.length]} rounded-full`} />
                        <div className="skeleton-pulse ml-auto h-4 w-20 rounded-full" />
                    </div>
                ))}
            </div>
        );
    }

    // Default: card variant
    return (
        <div className={`grid gap-4 ${className}`}>
            {items.map((i) => (
                <div key={i} className="saas-card space-y-3 p-5">
                    <div className="skeleton-pulse h-4 w-1/3 rounded-full" />
                    <div className="skeleton-pulse h-3 w-2/3 rounded-full" />
                    <div className="skeleton-pulse h-3 w-1/2 rounded-full" />
                </div>
            ))}
        </div>
    );
};
