import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  Briefcase, 
  CheckCircle2, 
  Layers,
  Star,
  Tag
} from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * LenticularCarousel Component
 * A 3D perspective gallery whose cards turn over and refract warm ambient light.
 */
export const LenticularCarousel = ({
  items = [],
  autoPlay = false,
  autoPlayInterval = 5000,
  className = '',
  cardClassName = '',
  onItemClick,
  renderItem
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const totalItems = items.length;

  const nextSlide = useCallback(() => {
    if (totalItems <= 1) return;
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    if (totalItems <= 1) return;
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  // Autoplay handler
  useEffect(() => {
    if (!autoPlay || isHovered || totalItems <= 1) return;
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isHovered, nextSlide, totalItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isHovered) return;
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHovered, nextSlide, prevSlide]);

  // Mouse tilt tracking on active card
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 16, y: -y * 16 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full flex flex-col items-center justify-center py-12 select-none overflow-hidden",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="3D Featured Projects Carousel"
    >
      {/* 3D Perspective Stage */}
      <div 
        className="relative w-full max-w-4xl h-[420px] sm:h-[460px] flex items-center justify-center"
        style={{ perspective: '1400px' }}
      >
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const isCurrent = index === activeIndex;
          const isPrev = index === (activeIndex - 1 + totalItems) % totalItems;
          const isNext = index === (activeIndex + 1) % totalItems;

          // Compute 3D translations and rotations
          let transform = '';
          let opacity = 0;
          let zIndex = 0;
          let pointerEvents = 'none';

          if (isCurrent) {
            transform = `translateX(0px) translateZ(80px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.05)`;
            opacity = 1;
            zIndex = 30;
            pointerEvents = 'auto';
          } else if (isPrev || (offset === -1 || (activeIndex === 0 && index === totalItems - 1))) {
            transform = `translateX(-260px) translateZ(-80px) rotateY(26deg) scale(0.88)`;
            opacity = 0.65;
            zIndex = 20;
            pointerEvents = 'auto';
          } else if (isNext || (offset === 1 || (activeIndex === totalItems - 1 && index === 0))) {
            transform = `translateX(260px) translateZ(-80px) rotateY(-26deg) scale(0.88)`;
            opacity = 0.65;
            zIndex = 20;
            pointerEvents = 'auto';
          } else {
            transform = `translateX(${offset > 0 ? 400 : -400}px) translateZ(-200px) scale(0.7)`;
            opacity = 0;
            zIndex = 10;
          }

          return (
            <div
              key={item._id || item.id || index}
              onClick={() => {
                if (!isCurrent) {
                  setActiveIndex(index);
                } else if (onItemClick) {
                  onItemClick(item, index);
                }
              }}
              style={{
                transform,
                opacity,
                zIndex,
                pointerEvents,
                transition: isCurrent && isHovered
                  ? 'transform 0.1s ease-out, opacity 0.4s ease'
                  : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
              }}
              className={cn(
                "absolute w-[320px] sm:w-[460px] h-[400px] sm:h-[430px] rounded-3xl p-6 sm:p-7",
                "bg-[#FFFDF8] border border-[#E5D7C5] shadow-warm-xl",
                "flex flex-col justify-between overflow-hidden cursor-pointer",
                isCurrent 
                  ? "border-[#16A085] ring-2 ring-[#16A085]/20 shadow-warm-xl" 
                  : "hover:border-[#D5C3AE] hover:opacity-85",
                cardClassName
              )}
            >
              {/* Refractive Ambient Flare Header */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-[#16A085]/15 via-[#D6A85F]/15 to-transparent blur-3xl pointer-events-none" />

              {renderItem ? (
                renderItem(item, isCurrent)
              ) : (
                // Built-in Project Card
                <>
                  {/* Top Category & Status */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#16A085]/10 text-[#12806A] border border-[#16A085]/20">
                        {item.category || 'Featured Milestone'}
                      </span>
                      {item.featured && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D6A85F]/20 text-[#936d31] border border-[#D6A85F]/35">
                          <Sparkles className="w-3 h-3 text-[#D6A85F]" /> Verified
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-[#75685C] flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#9C8E80]" />
                      {item.timeline || '14 days'}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="relative z-10 my-auto space-y-3">
                    <h3 className="text-xl font-bold text-[#3B3028] font-display line-clamp-2 leading-snug group-hover:text-[#16A085] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#75685C] line-clamp-3 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(item.skillsRequired || item.tags || ['React', 'Node.js', 'AI']).slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-lg bg-[#F4E8D5] text-[#3B3028] text-[11px] font-medium border border-[#E5D7C5]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Escrow Budget & View Button */}
                  <div className="relative z-10 pt-4 border-t border-[#E5D7C5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#75685C] block">Escrow Budget</span>
                      <div className="text-xl font-extrabold text-[#16A085] font-display">
                        ₹{(item.budget || 25000).toLocaleString()}
                        <span className="text-xs font-normal text-[#75685C] ml-1">
                          {item.budgetType === 'hourly' ? '/hr' : ' fixed'}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={item._id ? `/jobs/${item._id}` : '/jobs'}
                      onClick={(e) => e.stopPropagation()}
                      className="btn-primary py-2 px-4 text-xs font-semibold shadow-warm-md"
                    >
                      <span>Explore Project</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Carousel Controls */}
      <div className="flex items-center gap-4 mt-8 z-30">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-3 rounded-2xl bg-[#FFFDF8] hover:bg-[#F4E8D5] border border-[#E5D7C5] text-[#3B3028] hover:text-[#16A085] shadow-warm-sm transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === activeIndex 
                  ? "w-8 bg-[#16A085]" 
                  : "w-2 bg-[#D5C3AE] hover:bg-[#9C8E80]"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-3 rounded-2xl bg-[#FFFDF8] hover:bg-[#F4E8D5] border border-[#E5D7C5] text-[#3B3028] hover:text-[#16A085] shadow-warm-sm transition-all active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
