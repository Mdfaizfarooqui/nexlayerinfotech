import React, { useEffect, useRef } from 'react';

export default function NetworkMesh({ isOverclocked }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const overclockRef = useRef(isOverclocked);

  // Sync overclock state to ref to avoid running useEffect re-mounts
  useEffect(() => {
    overclockRef.current = isOverclocked;
  }, [isOverclocked]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let particles = [];
    let ripples = [];
    let codeParticles = [];
    
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      pixelX: 0,
      pixelY: 0,
      targetPixelX: 0,
      targetPixelY: 0,
      active: false
    };

    const CONFIG = {
      maxDistance: 125,
      particleCountRatio: 0.00015,
      minParticles: 40,
      maxParticles: 90,
      particleSpeed: 0.16,
      colors: [
        'rgba(0, 242, 254, 0.8)',  // Cyan
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(124, 109, 250, 0.8)'  // Purple
      ],
      glowColors: [
        'rgba(0, 242, 254, 0.15)',
        'rgba(59, 130, 246, 0.15)',
        'rgba(124, 109, 250, 0.15)'
      ]
    };

    const codeSnippets = [
      'const nex = new Nexlayer();',
      'await nex.deploy("core");',
      'sys.temp = 34.22;',
      'payload: { active: true }',
      'mesh.connect(node_id);',
      'uptime: 99.989%;',
      'db.query("SELECT *");',
      'import { speed } from "cores";',
      'overclock: active'
    ];

    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect() || { width: 600, height: 600 };
      width = rect.width;
      height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      initParticles();
      initCodeParticles();

      if (!mouse.active) {
        mouse.pixelX = width / 2;
        mouse.pixelY = height / 2;
        mouse.targetPixelX = width / 2;
        mouse.targetPixelY = height / 2;
      }
    };

    const initParticles = () => {
      const area = width * height;
      let count = Math.floor(area * CONFIG.particleCountRatio);
      count = Math.max(CONFIG.minParticles, Math.min(CONFIG.maxParticles, count));

      particles = [];
      for (let i = 0; i < count; i++) {
        const depth = 0.4 + Math.random() * 0.6;
        const colorIndex = Math.floor(Math.random() * CONFIG.colors.length);

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * CONFIG.particleSpeed * (1 / depth),
          vy: (Math.random() - 0.5) * CONFIG.particleSpeed * (1 / depth),
          radius: (1.2 + Math.random() * 2.2) * depth,
          depth,
          color: CONFIG.colors[colorIndex],
          glowColor: CONFIG.glowColors[colorIndex],
          pulseTime: Math.random() * Math.PI * 2,
          pulseSpeed: 0.01 + Math.random() * 0.02
        });
      }
    };

    const initCodeParticles = () => {
      codeParticles = [];
      for (let i = 0; i < 6; i++) {
        codeParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          vy: 0.12 + Math.random() * 0.18,
          opacity: 0.03 + Math.random() * 0.07
        });
      }
    };

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouse.targetX = (e.clientX - centerX) / (rect.width / 2);
      mouse.targetY = (e.clientY - centerY) / (rect.height / 2);
      
      mouse.targetPixelX = e.clientX - rect.left;
      mouse.targetPixelY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.targetPixelX = width / 2;
      mouse.targetPixelY = height / 2;
      mouse.active = false;
    };

    const handleCanvasClick = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      ripples.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: 280,
        speed: overclockRef.current ? 8 : 5,
        force: overclockRef.current ? 16 : 10
      });
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleCanvasClick);
    }

    resizeCanvas();

    const drawGrid = () => {
      ctx.strokeStyle = overclockRef.current ? 'rgba(255, 94, 94, 0.04)' : 'rgba(124, 109, 250, 0.035)'; 
      ctx.lineWidth = 0.5;
      const gridSize = 45;
      
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = overclockRef.current ? 'rgba(255, 94, 94, 0.15)' : 'rgba(0, 242, 254, 0.12)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 100, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = overclockRef.current ? 'rgba(255, 94, 94, 0.08)' : 'rgba(124, 109, 250, 0.06)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 200, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = overclockRef.current ? 'rgba(255, 94, 94, 0.35)' : 'rgba(0, 242, 254, 0.3)';
      ctx.beginPath();
      ctx.moveTo(width / 2 - 10, height / 2);
      ctx.lineTo(width / 2 + 10, height / 2);
      ctx.moveTo(width / 2, height / 2 - 10);
      ctx.lineTo(width / 2, height / 2 + 10);
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawGrid();

      const speedMultiplier = overclockRef.current ? 2.5 : 1.0;

      // Draw Drifting Cyber Code Particles
      ctx.font = '8px "Space Mono", monospace';
      codeParticles.forEach(cp => {
        cp.y += cp.vy * speedMultiplier;
        if (cp.y > height) {
          cp.y = -20;
          cp.x = Math.random() * width;
          cp.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        }
        ctx.fillStyle = overclockRef.current ? `rgba(255, 94, 94, ${cp.opacity})` : `rgba(0, 229, 160, ${cp.opacity})`;
        ctx.fillText(cp.text, cp.x, cp.y);
      });

      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;
      mouse.pixelX += (mouse.targetPixelX - mouse.pixelX) * 0.08;
      mouse.pixelY += (mouse.targetPixelY - mouse.pixelY) * 0.08;

      particles.forEach((p) => {
        const parallaxOffsetX = mouse.x * 25 * p.depth;
        const parallaxOffsetY = mouse.y * 25 * p.depth;

        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;

        if (mouse.active) {
          const dxMouse = mouse.pixelX - p.x;
          const dyMouse = mouse.pixelY - p.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
          if (distMouse < 200) {
            const force = (1 - distMouse / 200) * 0.15 * p.depth;
            p.x += (dxMouse / distMouse) * force * 1.6 * speedMultiplier;
            p.y += (dyMouse / distMouse) * force * 1.6 * speedMultiplier;
          }
        }

        const padding = 20;
        if (p.x < -padding) p.x = width + padding;
        if (p.x > width + padding) p.x = -padding;
        if (p.y < -padding) p.y = height + padding;
        if (p.y > height + padding) p.y = -padding;

        p.pulseTime += p.pulseSpeed;
        const pulseFactor = 0.85 + Math.sin(p.pulseTime) * 0.15;
        const currentRadius = p.radius * pulseFactor;

        const renderX = p.x + parallaxOffsetX;
        const renderY = p.y + parallaxOffsetY;

        ctx.beginPath();
        ctx.arc(renderX, renderY, currentRadius * 4.5, 0, Math.PI * 2);
        ctx.fillStyle = overclockRef.current ? 'rgba(255, 94, 94, 0.15)' : p.glowColor;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(renderX, renderY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = overclockRef.current ? 'rgba(255, 94, 94, 0.85)' : p.color;
        ctx.fill();
      });

      // Draw shockwave ripples
      ripples.forEach((ripple) => {
        ripple.radius += ripple.speed;
        
        particles.forEach(p => {
          const dx = p.x - ripple.x;
          const dy = p.y - ripple.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const distFromWave = Math.abs(dist - ripple.radius);
          if (distFromWave < 30 && dist > 10) {
            const pushForce = (1 - distFromWave / 30) * ripple.force * p.depth * 0.15;
            p.x += (dx / dist) * pushForce;
            p.y += (dy / dist) * pushForce;
          }
        });

        ctx.strokeStyle = overclockRef.current 
          ? `rgba(255, 94, 94, ${Math.max(0, 1 - ripple.radius / ripple.maxRadius) * 0.55})` 
          : `rgba(0, 242, 254, ${Math.max(0, 1 - ripple.radius / ripple.maxRadius) * 0.55})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      ripples = ripples.filter(r => r.radius < r.maxRadius);

      // Draw Connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const parallaxOffsetX1 = mouse.x * 25 * p1.depth;
        const parallaxOffsetY1 = mouse.y * 25 * p1.depth;
        const rX1 = p1.x + parallaxOffsetX1;
        const rY1 = p1.y + parallaxOffsetY1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const parallaxOffsetX2 = mouse.x * 25 * p2.depth;
          const parallaxOffsetY2 = mouse.y * 25 * p2.depth;
          const rX2 = p2.x + parallaxOffsetX2;
          const rY2 = p2.y + parallaxOffsetY2;

          const dx = rX1 - rX2;
          const dy = rY1 - rY2;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = CONFIG.maxDistance * CONFIG.maxDistance;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / CONFIG.maxDistance) * 0.22 * Math.min(p1.depth, p2.depth);

            const colorPrefix = overclockRef.current ? 'rgba(255, 94, 94,' : 'rgba(124, 109, 250,';
            ctx.strokeStyle = `${colorPrefix} ${alpha})`; 
            ctx.lineWidth = 0.75 * Math.min(p1.depth, p2.depth);
            
            ctx.beginPath();
            ctx.moveTo(rX1, rY1);
            ctx.lineTo(rX2, rY2);
            ctx.stroke();
          }
        }
      }

      if (mouse.active && mouse.pixelX > 0 && mouse.pixelX < width && mouse.pixelY > 0 && mouse.pixelY < height) {
        const sonarRadius = (Date.now() / 15) % 100;
        ctx.beginPath();
        ctx.arc(mouse.pixelX, mouse.pixelY, sonarRadius, 0, Math.PI * 2);
        ctx.strokeStyle = overclockRef.current 
          ? `rgba(255, 94, 94, ${Math.max(0, 1 - sonarRadius / 100) * 0.2})` 
          : `rgba(0, 242, 254, ${Math.max(0, 1 - sonarRadius / 100) * 0.2})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();

        ctx.font = '7.5px "Space Mono", monospace';
        ctx.fillStyle = overclockRef.current ? 'rgba(255, 94, 94, 0.75)' : 'rgba(0, 242, 254, 0.65)';
        const xText = `X: ${Math.round(mouse.pixelX)}`;
        const yText = `Y: ${Math.round(mouse.pixelY)}`;
        ctx.fillText(`${xText}  ${yText}`, mouse.pixelX + 15, mouse.pixelY - 10);
        
        ctx.strokeStyle = overclockRef.current ? 'rgba(255, 94, 94, 0.35)' : 'rgba(0, 242, 254, 0.25)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(mouse.pixelX - 8, mouse.pixelY);
        ctx.lineTo(mouse.pixelX + 8, mouse.pixelY);
        ctx.moveTo(mouse.pixelX, mouse.pixelY - 8);
        ctx.lineTo(mouse.pixelX, mouse.pixelY + 8);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (container) {
        container.removeEventListener('click', handleCanvasClick);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="network-mesh-container"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'block',
          cursor: 'crosshair'
        }} 
      />
    </div>
  );
}
