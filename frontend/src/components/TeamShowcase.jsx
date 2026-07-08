import React from 'react';
import { motion } from 'framer-motion';

const TEAM_MEMBERS = [
  { 
    id: 1, 
    name: 'Mohammed Faiz Farooqui', 
    role: 'Founder · Creative Director', 
    initials: 'MF', 
    color: 'var(--accent, #00e5a0)',
    bio: 'Passionate about engineering scalable SaaS architectures and pixel-perfect UIs that drive business growth.',
    socials: [
      { name: 'LinkedIn', url: 'https://linkedin.com' },
      { name: 'Twitter', url: 'https://twitter.com' },
      { name: 'GitHub', url: 'https://github.com' }
    ]
  }
];

export default function TeamShowcase() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', padding: '1rem 0' }}>
      {TEAM_MEMBERS.map((member) => (
        <motion.div
          key={member.id}
          initial="initial"
          whileHover="hover"
          style={{
            position: 'relative',
            width: '360px',
            height: '460px',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'var(--bg, #0a0a0a)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            cursor: 'pointer'
          }}
        >
          {/* Default State */}
          <motion.div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2rem',
              zIndex: 1
            }}
            variants={{
              initial: { opacity: 1, scale: 1 },
              hover: { opacity: 0, scale: 0.95 }
            }}
            transition={{ duration: 0.3 }}
          >
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: '150px',
              background: 'linear-gradient(to bottom, rgba(0, 229, 160, 0.15), transparent)'
            }}></div>
            <div className="team-avatar" style={{ marginBottom: '1.5rem', width: '130px', height: '130px', fontSize: '2.8rem' }}>
              <div className="avatar-glow" style={{ background: 'rgba(0, 229, 160, 0.5)', filter: 'blur(25px)' }}></div>
              <div className="team-avatar-initials">{member.initials}</div>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center', color: 'var(--text)' }}>
              {member.name}
            </h3>
            <p style={{ color: 'var(--accent)', fontSize: '0.9rem', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {member.role}
            </p>
          </motion.div>

          {/* Hover Reveal State */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--accent, #00e5a0)',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 2
            }}
            variants={{
              initial: { y: '100%', borderTopLeftRadius: '100%', borderTopRightRadius: '100%' },
              hover: { y: 0, borderTopLeftRadius: '0%', borderTopRightRadius: '0%' }
            }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          >
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem', color: '#000' }}>
              {member.name}
            </h3>
            <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              {member.role}
            </p>
            <p style={{ color: 'rgba(0,0,0,0.9)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', fontWeight: 500 }}>
              {member.bio}
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {member.socials.map(social => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '50px',
                    background: 'rgba(0,0,0,0.9)',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
