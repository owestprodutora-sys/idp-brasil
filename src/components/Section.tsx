import type { ReactNode } from "react";

import { useRevealOnView } from "@/hooks/useRevealOnView";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

export function Section({ id, className, containerClassName, children }: SectionProps) {
  const { ref, isVisible } = useRevealOnView<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={cn("py-16 md:py-24", className)}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-6 transition-all duration-700",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
