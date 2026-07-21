'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Detect if touch device (we don't want custom cursor on mobile)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      cursor.style.display = 'none';
      return;
    }

    // Set initial position out of view to avoid flash
    gsap.set(cursor, { x: -100, y: -100, xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15, // Smooth lag for organic feel
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Hide default cursor globally
    document.body.style.cursor = 'none';
    
    // Magnetic / Scale effect on interactable elements
    const interactiveSelectors = 'a, button, input, textarea, select, [role="button"]';
    const interactiveElements = document.querySelectorAll(interactiveSelectors);
    
    const onMouseEnter = () => {
      gsap.to(cursor, { 
        scale: 3, 
        backgroundColor: 'transparent', 
        border: '1px solid white', 
        duration: 0.3,
        ease: 'power3.out'
      });
    };
    
    const onMouseLeave = () => {
      gsap.to(cursor, { 
        scale: 1, 
        backgroundColor: 'white', 
        border: 'none', 
        duration: 0.3,
        ease: 'power3.out'
      });
    };

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
      // Ensure element doesn't show default cursor
      (el as HTMLElement).style.cursor = 'none';
    });

    // Handle dynamically added elements by using MutationObserver (optional, but good for Next.js routing)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const newInteractables = document.querySelectorAll(interactiveSelectors);
          newInteractables.forEach(el => {
            // Only add if not already added
            if (!(el as any)._hasMagneticCursor) {
              el.addEventListener('mouseenter', onMouseEnter);
              el.addEventListener('mouseleave', onMouseLeave);
              (el as HTMLElement).style.cursor = 'none';
              (el as any)._hasMagneticCursor = true;
            }
          });
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.style.cursor = 'auto';
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
        (el as HTMLElement).style.cursor = '';
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{ willChange: 'transform' }}
    />
  );
}
