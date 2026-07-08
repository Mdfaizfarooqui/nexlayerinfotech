import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const SERVICES = [
  {
    num: '01',
    name: 'Web Development',
    tags: ['React', 'Next.js', 'Node.js'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop'
  },
  {
    num: '02',
    name: 'SaaS Platforms',
    tags: ['Cloud APIs', 'Scale', 'Integrations'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'
  },
  {
    num: '03',
    name: 'Mobile Application',
    tags: ['React Native', 'iOS & Android', 'Expo'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop'
  },
  {
    num: '04',
    name: 'UI / UX Design',
    tags: ['Figma', 'Prototypes', 'Research'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop'
  },
  {
    num: '05',
    name: 'IT Support',
    tags: ['Maintenance', 'Cloud / DevOps', 'Security'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop'
  }
];

export default function ServiceHoverReveal() {
  const containerRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Center the floating image around the cursor (width: 320px, height: 220px)
      mouseX.set(e.clientX - rect.left - 160); 
      mouseY.set(e.clientY - rect.top - 110);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', width: '100%', cursor: 'crosshair', padding: '2rem 0' }}
    >
      {SERVICES.map((service, index) => (
        <div
          key={service.num}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2.5rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            zIndex: 10,
            transition: 'background 0.3s'
          }}
        >
           <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
             <span style={{ 
               fontSize: '1.2rem', 
               fontWeight: 500, 
               color: hoveredIndex === index ? 'var(--accent, #00e5a0)' : 'var(--muted)', 
               transition: 'color 0.3s' 
             }}>
               {service.num}
             </span>
             <motion.span 
               style={{ 
                 fontSize: 'clamp(2rem, 5vw, 4rem)', 
                 fontWeight: 700, 
                 letterSpacing: '-1px',
                 color: hoveredIndex === index ? '#fff' : 'rgba(255,255,255,0.4)', 
                 transition: 'color 0.3s' 
               }}
               animate={{ x: hoveredIndex === index ? 30 : 0 }}
               transition={{ type: 'spring', stiffness: 300, damping: 20 }}
             >
               {service.name}
             </motion.span>
           </div>
           
           <div style={{ display: 'flex', gap: '12px' }} className="service-tags">
             {service.tags.map(tag => (
               <span 
                 key={tag} 
                 style={{ 
                   padding: '6px 16px',
                   borderRadius: '50px',
                   fontSize: '0.85rem',
                   fontWeight: 600,
                   background: hoveredIndex === index ? 'var(--accent, #00e5a0)' : 'transparent',
                   color: hoveredIndex === index ? '#000' : 'var(--accent, #00e5a0)',
                   border: `1px solid var(--accent, #00e5a0)`,
                   transition: 'all 0.3s',
                   whiteSpace: 'nowrap'
                 }}
               >
                 {tag}
               </span>
             ))}
           </div>
        </div>
      ))}

      {/* The Floating Hover Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: hoveredIndex !== null ? 1 : 0,
          scale: hoveredIndex !== null ? 1 : 0.5,
          rotate: hoveredIndex !== null ? 4 : -4
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          x,
          y,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 5,
          width: '320px',
          height: '220px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,229,160,0.3)',
        }}
      >
        <AnimatePresence mode="wait">
          {hoveredIndex !== null && (
            <motion.img 
              key={hoveredIndex}
              src={SERVICES[hoveredIndex].image}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              alt={`${SERVICES[hoveredIndex].name} preview`}
            />
          )}
        </AnimatePresence>
        {/* Cyberpunk green tint overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 229, 160, 0.2)', mixBlendMode: 'color' }}></div>
      </motion.div>
    </div>
  );
}
