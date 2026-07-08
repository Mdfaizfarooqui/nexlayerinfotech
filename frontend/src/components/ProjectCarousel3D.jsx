import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProjectCarousel3D({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div 
       style={{ 
          position: 'relative', 
          width: '100%', 
          height: '600px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          perspective: '1200px', 
          overflow: 'hidden',
          padding: '2rem 0'
       }}
    >
      {projects.map((project, i) => {
        let offset = i - activeIndex;
        // Adjust for seamless looping based on array size
        const half = Math.floor(projects.length / 2);
        if (offset > half) offset -= projects.length;
        if (offset < -half) offset += projects.length;

        const isCenter = offset === 0;
        const sign = Math.sign(offset);
        const absOffset = Math.abs(offset);

        // 3D Math logic for snap carousel ratchet effect
        // X position: push them outwards
        const x = offset * 260;
        // Z position: push them backwards
        const z = absOffset * -120;
        // Rotation: turn them to face center (ratchet style)
        const rotateY = sign * -25;
        const scale = isCenter ? 1 : 0.85;
        const zIndex = projects.length - absOffset;
        const opacity = absOffset > 2 ? 0 : 1;

        return (
          <motion.div
            key={project.id}
            initial={false}
            animate={{
              x,
              z,
              rotateY,
              scale,
              zIndex,
              opacity
            }}
            transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 0.8 }}
            style={{
              position: 'absolute',
              width: '340px',
              height: '460px',
              transformOrigin: 'center center',
              cursor: isCenter ? 'grab' : 'pointer',
              userSelect: 'none'
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
               if (offset.x < -50 || velocity.x < -300) {
                  handleNext();
               } else if (offset.x > 50 || velocity.x > 300) {
                  handlePrev();
               }
            }}
            onClick={() => {
               if (!isCenter) setActiveIndex(i);
            }}
          >
            <div 
               className={`work-card-bg ${project.bgClass}`} 
               style={{ 
                  height: '100%', 
                  width: '100%', 
                  borderRadius: '24px', 
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isCenter ? '0 30px 60px -15px rgba(0, 0, 0, 0.6)' : 'none',
                  border: isCenter ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                  transition: 'border 0.3s, box-shadow 0.3s'
               }}
            >
              {project.shapes?.map((shape, idx) => (
                <div key={idx} className="card-shape" style={shape.style}></div>
              ))}
              
              <div 
                 className="work-card-inner" 
                 style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    left: '0',
                    width: '100%',
                    padding: '30px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
                    zIndex: 10 
                 }}
              >
                <div className="work-tag" style={{ marginBottom: '8px', opacity: 0.9 }}>{project.tag}</div>
                <div className="work-card-title" style={{ fontSize: '1.75rem', marginBottom: '4px' }}>{project.title}</div>
                <div className="work-card-year" style={{ opacity: 0.7 }}>{project.year}</div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Navigation Controls */}
      <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '16px', zIndex: 100 }}>
         <button 
           onClick={handlePrev} 
           className="cyber-btn-sec" 
           style={{ padding: '8px 24px', borderRadius: '50px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
           aria-label="Previous Project"
         >
           Prev
         </button>
         <button 
           onClick={handleNext} 
           className="cyber-btn-sec" 
           style={{ padding: '8px 24px', borderRadius: '50px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
           aria-label="Next Project"
         >
           Next
         </button>
      </div>
    </div>
  );
}
