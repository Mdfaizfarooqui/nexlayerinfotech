import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');

  // Motion values track raw mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for outer ring
  const springConfig = { damping: 25, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Snappy springs for inner dot
  const dotConfig = { damping: 30, stiffness: 700, mass: 0.2 };
  const dotX = useSpring(mouseX, dotConfig);
  const dotY = useSpring(mouseY, dotConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Global event delegation for hovering interactive elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, select, .interactive, .work-card, .service-row-hover, [role="button"], .pricing-slider, .filter-btn');
      
      if (target) {
        setIsHovering(true);
        
        // Dynamically inject text inside the cursor for specific elements
        if (target.closest('.work-card')) {
          setCursorText('VIEW');
        } else if (target.closest('.service-row-hover')) {
          setCursorText('SEE');
        } else {
          setCursorText('');
        }
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    // Hide native cursor site-wide
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Outer SVG Ring */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          position: 'fixed',
          top: -24, // Offset to center a 48x48 box
          left: -24,
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mixBlendMode: 'difference' // Gives it a premium inverted look on light/dark backgrounds
        }}
      >
        <motion.svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{
            scale: isHovering ? (cursorText ? 2.2 : 1.5) : 1,
            rotate: isHovering ? 90 : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Reticle shape */}
          <motion.circle 
            cx="24" cy="24" r="22" 
            stroke="#fff" 
            strokeWidth="1.5"
            strokeDasharray={isHovering ? "none" : "4 4"}
            animate={{ opacity: isHovering ? 0.3 : 0.8 }}
          />
          {/* Inner crosshair ticks */}
          <motion.path 
            d="M 24 0 L 24 6 M 24 42 L 24 48 M 0 24 L 6 24 M 42 24 L 48 24" 
            stroke="#fff" 
            strokeWidth="2"
            animate={{ opacity: isHovering ? 0 : 0.6 }}
          />
        </motion.svg>
        
        {/* Hover Text injected in center */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: cursorText && isHovering ? 1 : 0, scale: cursorText && isHovering ? 1 : 0.5 }}
           style={{
             position: 'absolute',
             fontSize: '7px',
             fontWeight: 800,
             color: '#fff',
             letterSpacing: '1px'
           }}
        >
          {cursorText}
        </motion.div>
      </motion.div>

      {/* Inner Snappy Dot */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          position: 'fixed',
          top: -4,
          left: -4,
          pointerEvents: 'none',
          zIndex: 10000,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#00e5a0',
        }}
        animate={{
          scale: isHovering ? 0 : 1 // Hide dot when ring expands
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
