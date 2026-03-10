import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionPreference } from "../../hooks/useReducedMotionPreference.js";

void motion;

const DEFAULT_TRANSITION = {
  duration: 0.26,
  ease: [0.22, 1, 0.36, 1],
};

export const Modal = ({
  open,
  title,
  onClose,
  children,
  width = "max-w-3xl",
  motionId,
  panelClassName = "",
  bodyClassName = "",
  headerAction = null,
  transition = DEFAULT_TRANSITION,
}) => {
  const reduceMotion = useReducedMotionPreference();

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="dashboard-modal-overlay fixed inset-0 z-[90] overflow-y-auto bg-slate-950/62 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose?.();
          }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={transition}
        >
          <div className="flex min-h-full items-center justify-center">
            <motion.div
              layoutId={!reduceMotion ? motionId : undefined}
              className={`dashboard-modal-panel w-full ${width} max-h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] border border-white/45 bg-white shadow-panel dark:border-slate-700 dark:bg-slate-900 ${panelClassName}`.trim()}
              onMouseDown={(event) => event.stopPropagation()}
              initial={reduceMotion || motionId ? false : { opacity: 0, y: 16, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion || motionId ? undefined : { opacity: 0, y: 12, scale: 0.985 }}
              transition={transition}
            >
              <motion.div
                className="dashboard-modal-panel-inner"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                transition={transition}
              >
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-slate-800">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-ink dark:text-slate-100">{title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {headerAction}
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-label="Close modal"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className={`max-h-[calc(100vh-8.5rem)] overflow-y-auto px-5 py-5 ${bodyClassName}`.trim()}>
                  {children}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
