import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export const CardSpread = ({
  cards = [],
  spreadDistance = 140,
  rotationAngle = 8,
  scaleOnHover = 1.05,
  className = '',
  cardClassName = '',
  onCardClick,
  activeSpread,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  const shouldSpread = activeSpread !== undefined ? activeSpread : isHovered;

  const totalCards = cards.length;
  const middleIndex = (totalCards - 1) / 2;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center min-h-[380px] w-full py-12 select-none perspective-[1200px] cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveCardIndex(null);
      }}
      onClick={() => setIsHovered(!isHovered)}
      role="region"
      aria-label="Interactive Card Spread Deck"
    >
      <div className="relative w-full max-w-sm sm:max-w-md h-[340px] flex items-center justify-center">
        {cards.map((card, index) => {
          const offset = index - middleIndex;
          
          // Calculate spread translation and rotation
          const translateX = shouldSpread ? offset * spreadDistance : offset * 14;
          const translateY = shouldSpread ? Math.abs(offset) * 12 - 16 : offset * -4;
          const rotateZ = shouldSpread ? offset * rotationAngle : offset * (rotationAngle * 0.4);
          const zIndex = activeCardIndex === index ? 50 : 10 + index;
          const isCardActive = activeCardIndex === index;

          return (
            <div
              key={card.id || index}
              onMouseEnter={(e) => {
                e.stopPropagation();
                setActiveCardIndex(index);
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
                if (activeCardIndex === index) setActiveCardIndex(null);
              }}
              onClick={(e) => {
                if (onCardClick) {
                  e.stopPropagation();
                  onCardClick(card, index);
                }
              }}
              style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotateZ}deg) ${
                  isCardActive ? `scale(${scaleOnHover + 0.03})` : isHovered ? 'scale(1.02)' : 'scale(1)'
                }`,
                zIndex,
                transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              }}
              className={cn(
                "absolute top-0 w-64 sm:w-72 h-[340px] rounded-2xl p-5",
                "bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95",
                "border border-slate-700/70 shadow-2xl backdrop-blur-xl",
                "flex flex-col justify-between overflow-hidden group",
                isCardActive
                  ? "border-indigo-500/80 ring-2 ring-indigo-500/30 shadow-indigo-500/20 shadow-2xl"
                  : "hover:border-slate-500/60 shadow-black/60",
                cardClassName
              )}
            >
              {/* Background ambient glow inside card */}
              <div 
                className={cn(
                  "absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none",
                  card.glowColor || "bg-indigo-500/20",
                  isCardActive ? "opacity-100" : "opacity-40"
                )}
              />

              {/* Card Header: Icon/Badge + Metric */}
              <div className="relative z-10 flex items-center justify-between">
                {card.icon ? (
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105",
                    card.iconBg || "bg-indigo-600/30 text-indigo-400 border border-indigo-500/30"
                  )}>
                    {React.isValidElement(card.icon) ? card.icon : <card.icon className="w-5 h-5" />}
                  </div>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {card.category || 'Featured'}
                  </span>
                )}

                {card.badge && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {card.badge}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="relative z-10 my-auto space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                  {card.category || 'Specialization'}
                </span>
                <h4 className="text-lg font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Card Footer: Metadata & Action */}
              <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  {card.rate && (
                    <span className="text-sm font-extrabold text-white">
                      {card.rate}
                    </span>
                  )}
                  {card.meta && (
                    <span className="text-[11px] text-slate-400 block">
                      {card.meta}
                    </span>
                  )}
                </div>

                <div className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all",
                  isCardActive 
                    ? "bg-indigo-600 text-white shadow-glow" 
                    : "bg-slate-800/90 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white"
                )}>
                  <span>{card.actionText || 'View Details'}</span>
                  <span className="text-xs">&rarr;</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardSpread;
