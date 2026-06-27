"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";

const KEYS = ["audience", "why", "migration"] as const;

export function FaqAccordion() {
  const t = useTranslations("Faq.items");
  const [open, setOpen] = useState<string | null>(KEYS[0]);

  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border bg-card">
      {KEYS.map((key) => {
        const isOpen = open === key;
        return (
          <div key={key}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : key)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium transition-colors hover:bg-accent/40"
            >
              {t(`${key}.question`)}
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-180 text-primary",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-pretty text-muted-foreground">
                    {t(`${key}.answer`)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
