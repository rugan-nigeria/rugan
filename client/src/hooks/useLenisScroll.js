import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export function useLenisScroll() {
  useEffect(() => {
    // Respect users who ask the OS for less motion: keep native scrolling.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Store lenis instance on window for access by other components
    window.lenis = lenis;

    let frameId = 0;
    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);
}
