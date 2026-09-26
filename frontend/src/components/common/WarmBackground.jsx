import React, { useEffect, useRef } from 'react';

/**
 * WarmBackground Component
 * Warm Ivory & Cream luxury ambient canvas with interactive golden & terracotta particles,
 * soft organic harmonic waves, and subtle editorial grid lines.
 */
const WarmBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 160,
      isHovered: false
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    let particles = [];

    const colors = [
      'rgba(214, 168, 95, ',  // Soft Gold
      'rgba(217, 119, 87, ',  // Terracotta
      'rgba(22, 160, 133, ',  // Emerald Green
      'rgba(232, 137, 115, '  // Coral
    ];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.6 + 0.8;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
        this.pulseSpeed = Math.random() * 0.02 + 0.008;
        this.pulseVal = Math.random() * Math.PI * 2;
      }

      update() {
        this.pulseVal += this.pulseSpeed;
        const currentAlpha = this.baseAlpha + Math.sin(this.pulseVal) * 0.12;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.2;
          this.y -= Math.sin(angle) * force * 1.2;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;

        return currentAlpha;
      }

      draw(alpha) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${Math.max(0.05, alpha * 0.75)})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    let waveTick = 0;
    const drawWarmWaves = () => {
      waveTick += 0.004;
      
      const waveConfigs = [
        { amp: 25, freq: 0.0014, speed: waveTick, yOffset: height * 0.22, color: 'rgba(214, 168, 95, 0.06)' },
        { amp: 35, freq: 0.0010, speed: waveTick * 0.8 + 1, yOffset: height * 0.52, color: 'rgba(217, 119, 87, 0.04)' },
        { amp: 40, freq: 0.0012, speed: waveTick * 1.1 + 2, yOffset: height * 0.78, color: 'rgba(22, 160, 133, 0.04)' }
      ];

      waveConfigs.forEach(cfg => {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = cfg.color;
        
        for (let x = 0; x <= width; x += 20) {
          const y = cfg.yOffset + Math.sin(x * cfg.freq + cfg.speed) * cfg.amp + Math.cos(x * 0.0006 + cfg.speed * 0.4) * 15;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });
    };

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);
      drawWarmWaves();

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const alpha1 = p1.update();
        p1.draw(alpha1);

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(214, 168, 95, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120) {
          const mAlpha = (1 - mdist / 120) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(22, 160, 133, ${mAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Warm Ambient Radial Glow Orbs */}
      <div 
        className="absolute top-[-8%] left-[10%] w-[550px] h-[550px] rounded-full bg-[#D6A85F]/12 blur-[120px] pointer-events-none"
      />
      <div 
        className="absolute top-[35%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#D97757]/08 blur-[140px] pointer-events-none"
      />
      <div 
        className="absolute bottom-[-10%] left-[25%] w-[650px] h-[650px] rounded-full bg-[#16A085]/08 blur-[130px] pointer-events-none"
      />

      {/* 2. Soft Warm Geometric Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            radial-gradient(rgba(117, 104, 92, 0.2) 1px, transparent 1px),
            linear-gradient(to right, rgba(229, 215, 197, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229, 215, 197, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 80px 80px, 80px 80px',
          backgroundPosition: '0 0, 0 0, 0 0'
        }}
      />

      {/* 3. Interactive Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default WarmBackground;
