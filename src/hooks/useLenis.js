import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance = null;

export const useLenis = () => {
  useEffect(() => {
    // Create single Lenis instance
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      prevent: (node) => {
        // Allow native scroll on elements with data-lenis-prevent or inside .box-grid
        return node.hasAttribute('data-lenis-prevent') || 
               node.closest('[data-lenis-prevent]') ||
               node.closest('.box-grid');
      },
    });

    // Animation frame loop
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenisInstance.destroy();
      lenisInstance = null;
    };
  }, []);

  return lenisInstance;
};

export const getLenis = () => lenisInstance;
