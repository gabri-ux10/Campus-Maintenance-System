"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HoverGradientMenuItem {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
  gradient?: string;
  iconColor?: string;
}

interface HoverGradientNavBarProps {
  items: HoverGradientMenuItem[];
  className?: string;
}

const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

const defaultGradients = [
  "radial-gradient(circle, rgba(59,130,246,0.16) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
  "radial-gradient(circle, rgba(249,115,22,0.16) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
  "radial-gradient(circle, rgba(147,51,234,0.16) 0%, rgba(126,34,206,0.06) 50%, rgba(88,28,135,0) 100%)",
  "radial-gradient(circle, rgba(34,197,94,0.16) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
  "radial-gradient(circle, rgba(20,184,166,0.16) 0%, rgba(13,148,136,0.06) 50%, rgba(15,118,110,0) 100%)",
];

export default function HoverGradientNavBar({
  items,
  className,
}: HoverGradientNavBarProps): React.JSX.Element {
  return (
    <motion.nav
      className={cn(
        "mx-auto w-fit rounded-2xl border border-gray-200/80 bg-white/90 px-1.5 py-1.5 shadow-lg backdrop-blur-lg dark:border-gray-800/80 dark:bg-black/70",
        className,
      )}
      initial="initial"
      whileHover="hover"
    >
      <ul className="relative z-10 flex items-center justify-center gap-1.5">
        {items.map((item, index) => {
          const Icon = item.icon;
          const gradient = item.gradient || defaultGradients[index % defaultGradients.length];
          const iconColor =
            item.iconColor ||
            "group-hover:text-campus-600 dark:group-hover:text-campus-400";

          return (
            <motion.li key={item.label} className="relative">
              <motion.div
                className="group relative block overflow-visible rounded-2xl"
                style={{ perspective: "600px" }}
                whileHover="hover"
                initial="initial"
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
                  variants={glowVariants}
                  style={{
                    background: gradient,
                    opacity: 0,
                  }}
                />
                <motion.a
                  href={item.href || "#"}
                  onClick={(event) => {
                    if (!item.href) {
                      event.preventDefault();
                    }
                    item.onClick?.();
                  }}
                  className="relative z-10 flex items-center gap-1.5 rounded-xl bg-transparent px-2.5 py-1.5 text-[13px] leading-none text-gray-600 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
                  variants={itemVariants}
                  transition={sharedTransition}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center bottom",
                  }}
                >
                  <span className={cn("transition-colors duration-300", iconColor)}>
                    <Icon className="h-[15px] w-[15px]" />
                  </span>
                  <span className="whitespace-nowrap font-medium">{item.label}</span>
                </motion.a>
                <motion.a
                  href={item.href || "#"}
                  onClick={(event) => {
                    if (!item.href) {
                      event.preventDefault();
                    }
                    item.onClick?.();
                  }}
                  className="absolute inset-0 z-10 flex items-center gap-1.5 rounded-xl bg-transparent px-2.5 py-1.5 text-[13px] leading-none text-gray-600 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white"
                  variants={backVariants}
                  transition={sharedTransition}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center top",
                    transform: "rotateX(90deg)",
                  }}
                >
                  <span className={cn("transition-colors duration-300", iconColor)}>
                    <Icon className="h-[15px] w-[15px]" />
                  </span>
                  <span className="whitespace-nowrap font-medium">{item.label}</span>
                </motion.a>
              </motion.div>
            </motion.li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
