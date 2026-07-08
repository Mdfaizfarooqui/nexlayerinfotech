import React, { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import StarField from './components/StarField';
import AdminDashboard from './components/AdminDashboard';

import ProjectCarousel3D from './components/ProjectCarousel3D';
import TeamShowcase from './components/TeamShowcase';
import ServiceHoverReveal from './components/ServiceHoverReveal';
import EstimateEngine from './components/EstimateEngine';
import ScrollStackCards from './components/ScrollStackCards';
import ThemeAware3DModel from './components/ThemeAware3DModel';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PROJECT_CARDS = [
  {
    id: 1,
    title: 'Orion Analytics',
    category: 'SaaS',
    tag: 'SaaS Platform · UI/UX',
    year: '2024',
    bgClass: 'bg-1',
    shapes: [
      { style: { width: '300px', height: '300px', top: '-50px', left: '50px', background: 'rgba(124,109,250,0.2)' } },
      { style: { width: '200px', height: '200px', bottom: '50px', right: '-50px', background: 'rgba(0,229,160,0.1)' } }
    ],
    featured: true
  },
  {
    id: 2,
    title: 'Helix Labs',
    category: 'Branding',
    tag: 'Brand Identity',
    year: '2024',
    bgClass: 'bg-2',
    shapes: [
      { style: { width: '200px', height: '200px', top: '20px', right: '20px', background: 'rgba(196,186,255,0.15)' } }
    ]
  },
  {
    id: 3,
    title: 'Pulse Finance',
    category: 'Mobile',
    tag: 'Mobile App · Motion',
    year: '2023',
    bgClass: 'bg-3',
    shapes: [
      { style: { width: '250px', height: '250px', bottom: '-50px', left: '30px', background: 'rgba(0,229,160,0.15)' } }
    ]
  },
  {
    id: 4,
    title: 'Nova Agency',
    category: 'Web',
    tag: 'WOW Website',
    year: '2023',
    bgClass: 'bg-4',
    shapes: [
      { style: { width: '180px', height: '180px', top: '30px', left: '30px', background: 'rgba(124,109,250,0.2)' } }
    ]
  },
  {
    id: 5,
    title: 'Arc Platform',
    category: 'SaaS',
    tag: 'Product Design',
    year: '2023',
    bgClass: 'bg-5',
    shapes: [
      { style: { width: '220px', height: '220px', bottom: '0', right: '0', background: 'rgba(0,229,160,0.12)' } }
    ]
  }
];

export default function App() {
  const [view, setView] = useState('main'); // 'main' | 'admin'
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Contact Form States
  const [formData, setFormData] = useState({ name: '', email: '', projectType: 'Select project type', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  // Overclock system state
  const [isOverclocked, setIsOverclocked] = useState(false);

  // Rotating Typewriter Words for Hero Section
  const ROTATING_WORDS = ["Digital Solutions", "SaaS Platforms", "Mobile Apps", "UI/UX Designs", "Next-Gen Software"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timer;
    const fullWord = ROTATING_WORDS[currentWordIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(prev => prev.slice(0, -1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullWord.slice(0, currentText.length + 1));
      }, 75);
    }
    
    if (!isDeleting && currentText === fullWord) {
      timer = setTimeout(() => setIsDeleting(true), 2500); // Wait 2.5s before deleting
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex(prev => (prev + 1) % ROTATING_WORDS.length);
    }
    
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  // Scroll reveal setup
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [view, activeFilter]); // re-observe on view or filter change

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const submission = {
      name: formData.name,
      email: formData.email,
      projectType: formData.projectType === 'Select project type' ? 'Other' : formData.projectType,
      message: formData.message
    };

    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', projectType: 'Select project type', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  const filteredProjects = activeFilter === 'All' 
    ? PROJECT_CARDS 
    : PROJECT_CARDS.filter(p => p.category === activeFilter);

  // Price calculations with 20% discount on Annual billing localized for the Indian Market (INR in Lakhs)
  const getPrice = (value, isHourly = false) => {
    if (isHourly) {
      return "₹2,499";
    }
    
    // Map base pricing values to localized Lakh INR values:
    // 4 ($4k) -> 1.5 Lakh, 9 ($9k) -> 3.5 Lakh, 12 ($12k) -> 4.9 Lakh
    let baseInrLakhs = 1.5;
    if (value === 9) baseInrLakhs = 3.5;
    else if (value === 12) baseInrLakhs = 4.9;
    
    let currentVal = baseInrLakhs;
    if (billingCycle === 'annual') {
      currentVal = baseInrLakhs * 0.8;
    }
    
    const formattedVal = currentVal % 1 === 0 ? `${currentVal}` : currentVal.toFixed(1);
    return `₹${formattedVal} Lakh`;
  };

  return (
    <>
      <CustomCursor />
      
      {/* NAV */}
      <nav>
        <a href="#home" onClick={() => setView('main')} className="nav-logo">
          <span></span> NEXLAYER INFOTECH
        </a>
        {view === 'main' ? (
          <ul className="nav-links">
            <li><a href="#work">Work</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
            <li>
              <a 
                href="#admin" 
                onClick={(e) => { e.preventDefault(); setView('admin'); }}
                style={{ color: 'var(--accent2)', fontWeight: 600 }}
              >
                Admin
              </a>
            </li>
          </ul>
        ) : (
          <ul className="nav-links">
            <li>
              <a href="#main" onClick={(e) => { e.preventDefault(); setView('main'); }}>
                Back to Site
              </a>
            </li>
          </ul>
        )}
        <a href="#contact" onClick={() => setView('main')} className="nav-cta">Start a project</a>
      </nav>

      {view === 'admin' ? (
        <AdminDashboard onClose={() => setView('main')} />
      ) : (
        <main>
          {/* HERO */}
          <section className="hero" id="home">
            <div className="hero-bg"></div>
            <StarField />

            <div className="hero-container">
              <div className="hero-left">
                <div className="hero-counter">
                  <span className="hud-pulse-dot"></span>
                  [ STATUS: ACTIVE ] // SYS_LOC: 20.3858° N, 72.9114° E // 000 / NEXLAYER
                </div>
                <h1 className="hero-title">
                  Building Scalable<br />
                  <span className="typewriter-text">{currentText}<span className="typewriter-cursor">|</span></span>
                </h1>
                <p className="hero-subtitle">
                  We are a next-gen digital agency engineering fast, reliable, and beautifully functional software systems tailored for dynamic scale.
                </p>
                <div className="hero-actions">
                  <a href="#contact" className="hero-btn-primary cyber-btn" title="Get Started with Nexlayer Infotech" aria-label="Get Started">
                    <span>Get Started</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                  <a href="#work" className="hero-btn-secondary cyber-btn-sec" title="View our portfolio of projects" aria-label="View Projects">
                    <span>View Projects</span>
                  </a>
                </div>
              </div>
              
              <div className="hero-right">
                <ThemeAware3DModel />
              </div>
            </div>

            {/* SCROLL INDICATOR */}
            <div className="hero-scroll-indicator">
              <a href="#about" className="scroll-link">
                <span className="scroll-mouse">
                  <span className="scroll-wheel"></span>
                </span>
                <span className="scroll-text">DISCOVER LAYER</span>
              </a>
            </div>
          </section>

          {/* MARQUEE */}
          <div className="marquee-section">
            <div className="marquee-track" id="marquee">
              <div className="marquee-item"><span className="marquee-dot"></span>Web Development</div>
              <div className="marquee-item"><span className="marquee-dot"></span>SaaS Platforms</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Mobile Applications</div>
              <div className="marquee-item"><span className="marquee-dot"></span>UI/UX Design</div>
              <div className="marquee-item"><span className="marquee-dot"></span>IT Support</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Web Development</div>
              <div className="marquee-item"><span className="marquee-dot"></span>SaaS Platforms</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Mobile Applications</div>
              <div className="marquee-item"><span className="marquee-dot"></span>UI/UX Design</div>
              <div className="marquee-item"><span className="marquee-dot"></span>IT Support</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Web Development</div>
              <div className="marquee-item"><span className="marquee-dot"></span>SaaS Platforms</div>
              <div className="marquee-item"><span className="marquee-dot"></span>Mobile Applications</div>
              <div className="marquee-item"><span className="marquee-dot"></span>UI/UX Design</div>
              <div className="marquee-item"><span className="marquee-dot"></span>IT Support</div>
            </div>
          </div>

          {/* ABOUT */}
          <section id="about">
            <div className="about-grid">
              <div className="reveal">
                <div className="section-label">About us</div>
                <h2 className="about-headline">We design<br />things that<br /><em>actually work.</em></h2>
              </div>
              <div className="reveal reveal-delay-1">
                <p className="about-text">
                  Nexlayer Infotech is a boutique digital agency obsessed with crafting products that feel <strong>alive</strong>. We blend sharp strategy with pixel-perfect execution — turning complex problems into elegant, intuitive experiences.
                </p>
                <p className="about-text" style={{ marginBottom: 0 }}>
                  From early-stage startups to established brands, we partner with companies who believe <strong>great design is a competitive advantage</strong>.
                </p>
                <div className="stats-row" style={{ marginTop: '2.5rem' }}>
                  <div className="stat-item">
                    <div className="stat-num">200<span className="accent">+</span></div>
                    <div className="stat-label">Projects</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num">5<span className="accent">+</span></div>
                    <div className="stat-label">Years</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-num">98<span className="accent">%</span></div>
                    <div className="stat-label">Satisfied</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICES */}
          <section id="services" style={{ background: 'var(--bg2)' }}>
            <div className="services-header">
              <div className="reveal">
                <div className="section-label">What we do</div>
                <h2 className="services-headline">Our<br />Services</h2>
              </div>
              <p className="services-intro reveal reveal-delay-1">
                Every service we offer is built around one idea: your product deserves to be as remarkable as the problem it solves.
              </p>
            </div>
            <div className="reveal">
              <ServiceHoverReveal />
            </div>
          </section>

          {/* WORK */}
          <section id="work">
            <div className="work-header reveal">
              <div>
                <div className="section-label">Portfolio</div>
                <h2 className="work-headline">Selected<br />Work</h2>
              </div>
              
              {/* Category Filter Tabs */}
              <div className="work-filters">
                {['All', 'SaaS', 'Branding', 'Mobile', 'Web'].map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)} 
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="reveal" style={{ width: '100%', overflow: 'hidden' }}>
              <ProjectCarousel3D projects={filteredProjects} />
            </div>
          </section>

          {/* PROCESS */}
          <section className="process-section" style={{ paddingBottom: 0 }}>
            <div className="reveal" style={{ marginBottom: '4rem' }}>
              <div className="section-label">How we work</div>
              <h2 className="process-headline">Our Process</h2>
            </div>
            <ScrollStackCards />
          </section>

          {/* PRICING */}
          <section id="pricing">
            <div className="reveal" style={{ marginBottom: '4rem' }}>
              <div className="section-label">Investment</div>
              <h2 style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 800, letterSpacing: '-1px', textTransform: 'uppercase', color: 'var(--text)' }}>Project Calculator</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '600px', marginTop: '1rem' }}>
                Use our interactive quote builder to get an instant, transparent estimate for your next project based on current Indian market rates.
              </p>
            </div>
            
            <div className="reveal" style={{ width: '100%' }}>
              <EstimateEngine />
            </div>
          </section>

          {/* TEAM */}
          <section id="team" style={{ background: 'var(--bg2)' }}>
            <div className="reveal">
              <div className="section-label">The people</div>
              <h2 className="team-headline">Our Team</h2>
              <p className="team-sub">Small enough to care. Experienced enough to deliver. Every project gets our full attention, not a junior team.</p>
            </div>
            <div className="reveal" style={{ width: '100%', overflow: 'hidden' }}>
              <TeamShowcase />
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="contact-section">
            <div className="contact-grid">
              <div className="reveal">
                <div className="section-label">Get in touch</div>
                <h2 className="contact-headline">Let's build<br /><em>something</em><br />great.</h2>
                <div className="contact-meta">
                  <div className="contact-meta-item">
                    <span className="meta-dot"></span>
                    <span>Email: <a href="mailto:nexlayerinfotech@gmail.com">nexlayerinfotech@gmail.com</a></span>
                  </div>
                  <div className="contact-meta-item">
                    <span className="meta-dot"></span>
                    <span>Phone / WhatsApp: <a href="https://wa.me/919664991223" target="_blank" rel="noopener noreferrer">+91 9664991223</a></span>
                  </div>
                  <div className="contact-meta-item">
                    <span className="meta-dot"></span>
                    <span>Based in Vapi, India</span>
                  </div>
                  <div className="contact-meta-item">
                    <span className="meta-dot"></span>
                    <span>Working worldwide</span>
                  </div>
                </div>
              </div>
              
              <form className="contact-form reveal reveal-delay-1" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label className="form-label">Your name</label>
                  <input 
                     className="form-input" 
                     type="text" 
                     placeholder="nexlayerinfotech" 
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input 
                     className="form-input" 
                     type="email" 
                     placeholder="nexlayerinfotech@gmail.com" 
                     value={formData.email}
                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Project type</label>
                  <select 
                    className="form-select"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  >
                    <option disabled value="Select project type">Select project type</option>
                    <option value="Web">Web Development</option>
                    <option value="SaaS">SaaS Platform</option>
                    <option value="Mobile">Mobile Application</option>
                    <option value="UI/UX">UI / UX Design</option>
                    <option value="IT Support">IT Support</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tell us about your project</label>
                  <textarea 
                    className="form-textarea" 
                    placeholder="What are you building? What's the goal?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={formStatus === 'submitting'}
                  style={formStatus === 'success' ? { background: '#00c87d' } : {}}
                >
                  {formStatus === 'submitting' && <span className="spinner"></span>}
                  {formStatus === 'success' && 'Message sent ✓'}
                  {formStatus === 'error' && 'Failed to send! Retry'}
                  {formStatus === 'idle' && 'Send message'}
                </button>
              </form>
            </div>
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">nexlayerinfotech © 2025</div>
        <ul className="footer-links">
          <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Nexlayer on Instagram">Instagram</a></li>
          <li><a href="https://behance.net" target="_blank" rel="noopener noreferrer" aria-label="View Nexlayer portfolio on Behance">Behance</a></li>
          <li><a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" aria-label="View Nexlayer designs on Dribbble">Dribbble</a></li>
          <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Connect with Nexlayer on LinkedIn">LinkedIn</a></li>
        </ul>
        <div className="footer-copy">Designed & built with intention.</div>
      </footer>
    </>
  );
}
