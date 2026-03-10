import { cn } from "@/lib/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-shadow placeholder:text-gray-400 focus-visible:border-campus-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-campus-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-100 dark:placeholder:text-slate-500",
          type === "search" &&
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          type === "file" &&
            "p-0 pr-3 italic text-gray-500 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-gray-900 dark:text-slate-400 dark:file:border-slate-700 dark:file:text-gray-100",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
