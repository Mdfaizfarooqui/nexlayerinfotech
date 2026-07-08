import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const OPTIONS = {
  projectType: [
    { id: 'landing', label: 'Basic Website', basePrice: 5000, desc: 'Single page highly converting' },
    { id: 'corporate', label: 'Corporate Website', basePrice: 15000, desc: 'Multi-page business site' },
    { id: 'saas', label: 'Web App / SaaS', basePrice: 50000, desc: 'Complex web application' },
    { id: 'mobile', label: 'Mobile App', basePrice: 80000, desc: 'iOS & Android natively compiled' },
  ],
  design: [
    { id: 'minimal', label: 'Minimal / Standard', multiplier: 1, desc: 'Clean and highly functional' },
    { id: 'custom', label: 'Custom Brand UI', multiplier: 1.3, desc: 'Tailored perfectly to your brand' },
    { id: 'premium', label: 'Premium & Animated', multiplier: 1.8, desc: 'Award-winning Awwwards level' },
  ],
  features: [
    { id: 'static', label: 'No Extra Features', addPrice: 0, desc: 'Just the beautifully coded frontend' },
    { id: 'cms', label: 'CMS & Blog', addPrice: 20000, desc: 'Manage your own dynamic content' },
    { id: 'ecommerce', label: 'E-commerce', addPrice: 40000, desc: 'Sell products online directly' },
    { id: 'custom_backend', label: 'Custom Backend API', addPrice: 80000, desc: 'Complex logic & custom databases' },
  ],
  timeline: [
    { id: 'flexible', label: 'Flexible', multiplier: 0.9, desc: 'No strict deadline (1-2 months)' },
    { id: 'standard', label: 'Standard', multiplier: 1, desc: 'Normal development cycle' },
    { id: 'rush', label: 'Rush (ASAP)', multiplier: 1.5, desc: 'Prioritized fast delivery' },
  ]
};

export default function EstimateEngine() {
  const [selections, setSelections] = useState({
    projectType: 'corporate',
    design: 'custom',
    features: 'cms',
    timeline: 'standard'
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const type = OPTIONS.projectType.find(o => o.id === selections.projectType);
    const design = OPTIONS.design.find(o => o.id === selections.design);
    const feature = OPTIONS.features.find(o => o.id === selections.features);
    const time = OPTIONS.timeline.find(o => o.id === selections.timeline);

    if (type && design && feature && time) {
      const calcTotal = ((type.basePrice + feature.addPrice) * design.multiplier) * time.multiplier;
      setTotal(Math.round(calcTotal));
    }
  }, [selections]);

  const handleSelect = (category, id) => {
    setSelections(prev => ({ ...prev, [category]: id }));
  };

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const OptionCard = ({ category, option }) => {
    const isSelected = selections[category] === option.id;
    return (
      <div 
        onClick={() => handleSelect(category, option.id)}
        style={{
          padding: '1.2rem',
          borderRadius: '16px',
          background: isSelected ? 'rgba(0, 229, 160, 0.1)' : 'var(--bg)',
          border: isSelected ? '2px solid var(--accent, #00e5a0)' : '2px solid rgba(255,255,255,0.05)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          flex: '1 1 220px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: isSelected ? 'var(--accent, #00e5a0)' : '#fff' }}>
            {option.label}
          </h4>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: isSelected ? 'none' : '2px solid rgba(255,255,255,0.2)', background: isSelected ? 'var(--accent, #00e5a0)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {isSelected && (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#000' }} />
             )}
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: '1.4' }}>{option.desc}</p>
      </div>
    );
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      display: 'flex', 
      flexWrap: 'wrap',
      gap: '4rem',
      alignItems: 'flex-start'
    }}>
      
      {/* Left Column: Form Settings */}
      <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent)', fontSize: '1rem' }}>01 /</span> What are we building?
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {OPTIONS.projectType.map(opt => <OptionCard key={opt.id} category="projectType" option={opt} />)}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent)', fontSize: '1rem' }}>02 /</span> Design & Polish
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {OPTIONS.design.map(opt => <OptionCard key={opt.id} category="design" option={opt} />)}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent)', fontSize: '1rem' }}>03 /</span> Core Functionality
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {OPTIONS.features.map(opt => <OptionCard key={opt.id} category="features" option={opt} />)}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: 'var(--accent)', fontSize: '1rem' }}>04 /</span> Timeline Expectations
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {OPTIONS.timeline.map(opt => <OptionCard key={opt.id} category="timeline" option={opt} />)}
          </div>
        </div>

      </div>

      {/* Right Column: Sticky Quote Panel */}
      <div style={{
        flex: '1 1 350px',
        position: 'sticky',
        top: '120px',
        padding: '2.5rem',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Estimated Investment</h3>
        
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2.5rem' }}>
          <motion.span 
            key={total}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: 'var(--accent, #00e5a0)', letterSpacing: '-1px' }}
          >
            {formatINR(total)}
          </motion.span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem' }}>
            <span style={{ color: 'var(--muted)' }}>Type</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{OPTIONS.projectType.find(o => o.id === selections.projectType)?.label}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem' }}>
            <span style={{ color: 'var(--muted)' }}>Design</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{OPTIONS.design.find(o => o.id === selections.design)?.label}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem' }}>
            <span style={{ color: 'var(--muted)' }}>Features</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{OPTIONS.features.find(o => o.id === selections.features)?.label}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem' }}>
            <span style={{ color: 'var(--muted)' }}>Timeline</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>{OPTIONS.timeline.find(o => o.id === selections.timeline)?.label}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', lineHeight: '1.6' }}>
          * This is an automated preliminary estimate. Final costs may vary slightly based on exact project scope, APIs needed, and specific technical requirements.
        </p>

        <a href="#contact" className="cyber-btn" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
          <span>Book Discovery Call</span>
        </a>
      </div>

    </div>
  );
}
