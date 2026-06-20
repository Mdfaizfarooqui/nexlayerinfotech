import React, { useEffect, useRef } from 'react';

export default function StarField() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear any existing stars (e.g. from hot-reloads)
    containerRef.current.innerHTML = '';
    
    const count = 120;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const size = Math.random() * 2 + 0.5;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const op = Math.random() * 0.7 + 0.1;
      const dur = Math.random() * 4 + 2;
      const del = Math.random() * 4;

      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${left}%`;
      star.style.top = `${top}%`;
      star.style.opacity = op;
      
      star.style.setProperty('--op', op);
      star.style.setProperty('--dur', `${dur}s`);
      star.style.setProperty('--del', `${del}s`);

      fragment.appendChild(star);
    }

    containerRef.current.appendChild(fragment);
  }, []);

  return <div className="stars" id="stars" ref={containerRef} />;
}
