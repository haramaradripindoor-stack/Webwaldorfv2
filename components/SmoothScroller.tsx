'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { useEffect } from 'react';

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  // Lenis configuration for ultra-smooth scrolling
  const lenisOptions = {
    lerp: 0.05,          // Lower = smoother (friction)
    duration: 1.5,       // Base duration for smooth scroll
    smoothWheel: true,   // Enable for mouse wheel
    syncTouch: true,     // Makes touch devices feel slightly more organic too
  };

  // We want to force scroll to top on refresh so animations don't bug out
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}
