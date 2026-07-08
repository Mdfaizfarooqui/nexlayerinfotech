import React from 'react';
import { motion } from 'framer-motion';

const PROCESS_STEPS = [
  {
    num: '01',
    phase: 'DISCOVER',
    title: 'Deep Dive',
    desc: 'We start by understanding your users, competitors, and business goals inside-out before touching any design tool. We align our vision with yours to ensure a strong foundation.',
    color: '#00e5a0' // accent cyan/green
  },
  {
    num: '02',
    phase: 'DEFINE',
    title: 'Strategy',
    desc: 'We translate research into a clear design strategy, information architecture, and a visual direction you approve. No guesswork, just calculated steps to success.',
    color: '#7c6dfa' // purple
  },
  {
    num: '03',
    phase: 'DESIGN',
    title: 'Craft',
    desc: 'High-fidelity screens, prototypes, and motion — refined in tight feedback loops with weekly check-ins until every pixel feels perfect and alive.',
    color: '#ff6b6b' // red/coral
  },
  {
    num: '04',
    phase: 'DELIVER',
    title: 'Launch',
    desc: 'Production-ready files, developer handoff, and post-launch support to make sure everything ships flawlessly and scales gracefully into the future.',
    color: '#4a90e2' // blue
  }
];

export default function ScrollStackCards() {
  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '10vh', paddingTop: '2rem' }}>
      {PROCESS_STEPS.map((step, index) => {
        // Sticky offset increases slightly for each card to create the stacked deck effect
        const topOffset = `calc(15vh + ${index * 40}px)`;
        const isLast = index === PROCESS_STEPS.length - 1;
        
        return (
          <div 
            key={step.num}
            style={{
              position: 'sticky',
              top: topOffset,
              height: 'auto',
              minHeight: '400px',
              width: '100%',
              maxWidth: '900px',
              margin: '0 auto',
              marginBottom: isLast ? '0' : '50vh', // Huge margin creates scrolling distance to pull up next card
              display: 'flex',
              alignItems: 'stretch'
            }}
          >
            <motion.div 
              style={{
                width: '100%',
                background: 'var(--bg, #0a0a0a)',
                borderRadius: '32px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 -20px 50px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '4rem',
                position: 'relative',
                overflow: 'hidden',
                // Using scale trick: as cards stack, they look like they go deeper
                transformOrigin: 'top center'
              }}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Top color bar */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, height: '6px',
                background: step.color
              }}></div>

              {/* Glowing background hint */}
              <div style={{
                position: 'absolute',
                top: '-50px', right: '-50px',
                width: '300px', height: '300px',
                background: step.color,
                filter: 'blur(150px)',
                opacity: 0.1,
                borderRadius: '50%',
                pointerEvents: 'none'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: step.color }}>{step.num}</span>
                  <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}>/ {step.phase}</span>
                </div>
                
                <h3 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
                  {step.title}
                </h3>
                
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', maxWidth: '650px', fontWeight: 400 }}>
                  {step.desc}
                </p>
              </div>
              
              <div style={{ position: 'absolute', bottom: '-20px', right: '20px', opacity: 0.05, pointerEvents: 'none', userSelect: 'none' }}>
                 <span style={{ fontSize: '12rem', fontWeight: 900, color: step.color, lineHeight: 0.8 }}>{step.num}</span>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
