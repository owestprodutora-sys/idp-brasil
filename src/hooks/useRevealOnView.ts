import { useEffect, useRef, useState } from "react";

/**
 * Retorna um ref pra colocar no elemento e um boolean que vira `true`
 * na primeira vez que o elemento entra na viewport. Usado pra dar um
 * fade-up sutil nas seções da Landing, sem re-disparar a cada scroll.
 */
export function useRevealOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}
