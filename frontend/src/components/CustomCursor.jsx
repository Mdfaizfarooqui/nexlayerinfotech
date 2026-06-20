import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const animCursor = () => {
      const { x: mx, y: my } = mouseRef.current;
      let rx = ringPosRef.current.x;
      let ry = ringPosRef.current.y;

      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;

      ringPosRef.current = { x: rx, y: ry };

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      }

      animationFrameId = requestAnimationFrame(animCursor);
    };

    animCursor();

    // Hover listeners
    const addHoverEffects = () => {
      const interactiveEls = document.querySelectorAll('a, button, select, input, textarea, .work-card, .service-item, .pricing-slider, .filter-btn');
      interactiveEls.forEach(el => {
        const handleMouseEnter = () => {
          if (cursorRef.current) cursorRef.current.style.transform += ' scale(1.8)';
          if (ringRef.current) {
            ringRef.current.style.width = '60px';
            ringRef.current.style.height = '60px';
            ringRef.current.style.borderColor = 'rgba(124, 109, 250, 0.6)';
            ringRef.current.style.transform = `translate(${ringPosRef.current.x - 30}px, ${ringPosRef.current.y - 30}px)`;
          }
        };

        const handleMouseLeave = () => {
          if (ringRef.current) {
            ringRef.current.style.width = '36px';
            ringRef.current.style.height = '36px';
            ringRef.current.style.borderColor = 'rgba(196, 186, 255, 0.4)';
          }
        };

        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };

    // Delay a bit to ensure elements are in the DOM
    const timer = setTimeout(addHoverEffects, 1000);

    // Re-bind hover listeners whenever the DOM shifts substantially (e.g., view toggles)
    const observer = new MutationObserver(addHoverEffects);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
    </>
  );
}
