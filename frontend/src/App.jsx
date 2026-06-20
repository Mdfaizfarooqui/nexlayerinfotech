import React, { useState, useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import StarField from './components/StarField';
import AdminDashboard from './components/AdminDashboard';
import NetworkMesh from './components/NetworkMesh';

const API_BASE = 'http://localhost:5000/api';

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
        <>
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
                  <a href="#contact" className="hero-btn-primary cyber-btn">
                    <span>Get Started</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                  <a href="#work" className="hero-btn-secondary cyber-btn-sec">
                    <span>View Projects</span>
                  </a>
                </div>
              </div>
              
              <div className="hero-right">
                <NetworkMesh isOverclocked={isOverclocked} />

                {/* Cyber HUD Widget 1: System Status */}
                <div className={`hud-card system-hud ${isOverclocked ? 'overclocked' : ''}`}>
                  <div className="hud-header">
                    <span className={`hud-dot pulsing ${isOverclocked ? 'alert' : ''}`}></span>
                    <span className="hud-title">SYSTEM CORE {isOverclocked ? 'OVERCLOCKED' : 'v1.0.4'}</span>
                  </div>
                  <div className="hud-body">
                    <div className="hud-stat-row">
                      <span>CORE TEMP</span>
                      <span className={`hud-value ${isOverclocked ? 'accent-red' : 'accent-cyan'}`}>{isOverclocked ? '84°C' : '34°C'}</span>
                    </div>
                    <div className="hud-stat-row">
                      <span>LOAD</span>
                      <span className={`hud-value ${isOverclocked ? 'accent-orange' : 'accent-purple'}`}>{isOverclocked ? '94.2%' : '12.4%'}</span>
                    </div>
                    <div className="hud-progress-bg">
                      <div className={`hud-progress-bar ${isOverclocked ? 'overclocked-bar' : 'animate-progress'}`} style={{ width: isOverclocked ? '94.2%' : '12.4%' }}></div>
                    </div>
                    <button 
                      className="hud-action-btn"
                      onClick={() => setIsOverclocked(prev => !prev)}
                    >
                      {isOverclocked ? 'RESET_SYS' : 'OVERCLOCK'}
                    </button>
                  </div>
                </div>

                {/* Cyber HUD Widget 2: Agency Metrics */}
                <div className="hud-card metrics-hud">
                  <div className="hud-header">
                    <span className="hud-dot"></span>
                    <span className="hud-title">AGENCY METRICS</span>
                  </div>
                  <div className="hud-body">
                    <div className="hud-metric">
                      <span className="hud-metric-val">200+</span>
                      <span className="hud-metric-lbl">SHIPPED CODEBASES</span>
                    </div>
                    <div className="hud-metric">
                      <span className="hud-metric-val">99.9%</span>
                      <span className="hud-metric-lbl">API UPTIME</span>
                    </div>
                  </div>
                </div>

                {/* Cyber HUD Widget 3: Tech Stack Matrix */}
                <div className="hud-card tech-hud">
                  <div className="hud-header">
                    <span className="hud-title">ACTIVE RUNTIME</span>
                  </div>
                  <div className="hud-body">
                    <div className="hud-tech-list">
                      <span className="hud-tech-tag">React 18</span>
                      <span className="hud-tech-tag">Node.js</span>
                      <span className="hud-tech-tag">SQLite</span>
                      <span className="hud-tech-tag">Express</span>
                      <span className="hud-tech-tag">Vite</span>
                    </div>
                  </div>
                </div>
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
            <div className="services-list reveal">
              <div className="service-item">
                <span className="service-num">01</span>
                <span className="service-name">Web Development</span>
                <div className="service-tags">
                  <span className="tag">React</span>
                  <span className="tag">Next.js</span>
                  <span className="tag">Node.js</span>
                </div>
              </div>
              <div className="service-item">
                <span className="service-num">02</span>
                <span className="service-name">SaaS Platforms</span>
                <div className="service-tags">
                  <span className="tag">Cloud APIs</span>
                  <span className="tag">Scale</span>
                  <span className="tag">Integrations</span>
                </div>
              </div>
              <div className="service-item">
                <span className="service-num">03</span>
                <span className="service-name">Mobile Application</span>
                <div className="service-tags">
                  <span className="tag">React Native</span>
                  <span className="tag">iOS & Android</span>
                  <span className="tag">Expo</span>
                </div>
              </div>
              <div className="service-item">
                <span className="service-num">04</span>
                <span className="service-name">UI / UX Design</span>
                <div className="service-tags">
                  <span className="tag">Figma</span>
                  <span className="tag">Prototypes</span>
                  <span className="tag">Research</span>
                </div>
              </div>
              <div className="service-item">
                <span className="service-num">05</span>
                <span className="service-name">IT Support</span>
                <div className="service-tags">
                  <span className="tag">Maintenance</span>
                  <span className="tag">Cloud / DevOps</span>
                  <span className="tag">Security</span>
                </div>
              </div>
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

            <div className="work-grid reveal">
              {filteredProjects.map((project) => (
                <div key={project.id} className={`work-card ${project.featured ? 'featured-card' : ''}`}>
                  <div className={`work-card-bg ${project.bgClass}`}>
                    {project.shapes.map((shape, idx) => (
                      <div key={idx} className="card-shape" style={shape.style}></div>
                    ))}
                  </div>
                  <div className="work-card-inner">
                    <div className="work-tag">{project.tag}</div>
                    <div className="work-card-title">{project.title}</div>
                    <div className="work-card-year">{project.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PROCESS */}
          <section className="process-section">
            <div className="reveal">
              <div className="section-label">How we work</div>
              <h2 className="process-headline">Our Process</h2>
            </div>
            <div className="process-steps reveal">
              <div className="process-step">
                <div className="process-step-num">01 / DISCOVER</div>
                <div className="process-step-title">Deep Dive</div>
                <div className="process-step-desc">We start by understanding your users, competitors, and business goals inside-out before touching any design tool.</div>
                <div className="process-connector"></div>
              </div>
              <div className="process-step">
                <div className="process-step-num">02 / DEFINE</div>
                <div className="process-step-title">Strategy</div>
                <div className="process-step-desc">We translate research into a clear design strategy, information architecture, and a visual direction you approve.</div>
                <div className="process-connector"></div>
              </div>
              <div className="process-step">
                <div className="process-step-num">03 / DESIGN</div>
                <div className="process-step-title">Craft</div>
                <div className="process-step-desc">High-fidelity screens, prototypes, and motion — refined in tight feedback loops with weekly check-ins.</div>
                <div className="process-connector"></div>
              </div>
              <div className="process-step">
                <div className="process-step-num">04 / DELIVER</div>
                <div className="process-step-title">Launch</div>
                <div className="process-step-desc">Production-ready files, developer handoff, and post-launch support to make sure everything ships right.</div>
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing">
            <div className="reveal pricing-header-row">
              <div>
                <div className="section-label">Investment</div>
                <h2 style={{ fontSize: 'clamp(2rem,4vw,4rem)', fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Transparent Pricing</h2>
              </div>
              
              {/* Billing Cycle Toggle */}
              <div className="pricing-switch-container">
                <span className={`pricing-switch-label ${billingCycle === 'monthly' ? 'active' : ''}`}>Monthly</span>
                <label className="pricing-switch">
                  <input 
                    type="checkbox" 
                    checked={billingCycle === 'annual'} 
                    onChange={(e) => setBillingCycle(e.target.checked ? 'annual' : 'monthly')} 
                  />
                  <span className="pricing-slider"></span>
                </label>
                <span className={`pricing-switch-label ${billingCycle === 'annual' ? 'active' : ''}`}>Annual (Save 20%)</span>
              </div>
            </div>
            
            <div className="pricing-grid reveal">
              <div className="price-card">
                <div className="price-type">Hourly</div>
                <div className="price-amount">{getPrice(60, true)}</div>
                <div className="price-unit">PER HOUR</div>
                <ul className="price-features">
                  <li>Flexible scope</li>
                  <li>Weekly reporting</li>
                  <li>Design + feedback</li>
                  <li>Source files</li>
                </ul>
                <a href="#contact" className="price-btn">Get started</a>
              </div>
              <div className="price-card">
                <div className="price-type">One-page</div>
                <div className="price-amount">{getPrice(4)}</div>
                <div className="price-unit">{billingCycle === 'annual' ? 'ANNUAL PRICE' : 'FIXED PRICE'}</div>
                <ul className="price-features">
                  <li>2 week delivery</li>
                  <li>3 revision rounds</li>
                  <li>Webflow build</li>
                  <li>Source files</li>
                </ul>
                <a href="#contact" className="price-btn">Get started</a>
              </div>
              <div className="price-card featured">
                <div className="price-type">Full Website</div>
                <div className="price-amount">{getPrice(9)}</div>
                <div className="price-unit">FROM</div>
                <ul className="price-features">
                  <li>4–6 week delivery</li>
                  <li>Unlimited revisions</li>
                  <li>CMS setup</li>
                  <li>SEO foundation</li>
                </ul>
                <a href="#contact" className="price-btn">Get started</a>
              </div>
              <div className="price-card">
                <div className="price-type">Product Design</div>
                <div className="price-amount">{getPrice(12)}</div>
                <div className="price-unit">FROM</div>
                <ul className="price-features">
                  <li>Full UX flow</li>
                  <li>Design system</li>
                  <li>Dev handoff</li>
                  <li>6 months support</li>
                </ul>
                <a href="#contact" className="price-btn">Get started</a>
              </div>
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
              * All prices are subject to 18% GST. Custom corporate contracts and flexible billing schedules are available.
            </p>
          </section>

          {/* TEAM */}
          <section id="team" style={{ background: 'var(--bg2)' }}>
            <div className="reveal">
              <div className="section-label">The people</div>
              <h2 className="team-headline">Our Team</h2>
              <p className="team-sub">Small enough to care. Experienced enough to deliver. Every project gets our full attention, not a junior team.</p>
            </div>
            <div className="team-grid reveal">
              <div className="team-card">
                <div className="team-avatar">
                  <div className="avatar-glow"></div>
                  <div className="team-avatar-initials">MF</div>
                </div>
                <div className="team-name">Mohammed Faiz Farooqui</div>
                <div className="team-role">Founder · Creative Director</div>
              </div>
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
        </>
      )}

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">nexlayerinfotech © 2025</div>
        <ul className="footer-links">
          <li><a href="#">Instagram</a></li>
          <li><a href="#">Behance</a></li>
          <li><a href="#">Dribbble</a></li>
          <li><a href="#">LinkedIn</a></li>
        </ul>
        <div className="footer-copy">Designed & built with intention.</div>
      </footer>
    </>
  );
}
