import * as React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DockProps {
  className?: string;
  items: {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
  }[];
}

interface DockIconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, label, onClick, className }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className={cn(
          "group relative rounded-lg p-3 transition-colors hover:bg-campus-50 dark:hover:bg-slate-800",
          className,
        )}
      >
        <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        <span
          className={cn(
            "pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-2 py-1 text-xs text-gray-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:bg-slate-900 dark:text-gray-200",
          )}
        >
          {label}
        </span>
      </motion.button>
    );
  },
);
DockIconButton.displayName = "DockIconButton";

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ items, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex w-full items-center justify-center p-2", className)}
      >
        <motion.div
          initial="initial"
          animate="animate"
          variants={floatingAnimation}
          className={cn(
            "relative flex items-center gap-1 rounded-2xl border border-gray-200 bg-white/90 p-2 shadow-lg shadow-campus-600/10 backdrop-blur-lg transition-shadow duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/90",
          )}
        >
          {items.map((item) => (
            <DockIconButton key={item.label} {...item} />
          ))}
        </motion.div>
      </div>
    );
  },
);
Dock.displayName = "Dock";

export { Dock };
