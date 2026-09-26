import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export const CardSpread = ({
  cards = [],
  spreadDistance = 150,
  rotationAngle = 8,
  scaleOnHover = 1.05,
  className = '',
  cardClassName = '',
  onCardClick,
  activeSpread,
  renderCard
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  const shouldSpread = activeSpread !== undefined ? activeSpread : isHovered;
  const totalCards = cards.length;
  const middleIndex = (totalCards - 1) / 2;

  if (!cards || cards.length === 0) return null;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center min-h-[400px] w-full py-10 select-none perspective-[1200px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveCardIndex(null);
      }}
      role="region"
      aria-label="Interactive Card Spread Deck"
    >
      <div className="relative w-full max-w-sm sm:max-w-md h-[360px] flex items-center justify-center">
        {cards.map((card, index) => {
          const offset = index - middleIndex;
          
          // Calculate spread translation and rotation
          const translateX = shouldSpread ? offset * spreadDistance : offset * 18;
          const translateY = shouldSpread ? Math.abs(offset) * 10 - 12 : offset * -3;
          const rotateZ = shouldSpread ? offset * rotationAngle : offset * (rotationAngle * 0.35);
          const zIndex = activeCardIndex === index ? 50 : 10 + index;
          const isCardActive = activeCardIndex === index;

          return (
            <div
              key={card._id || card.id || index}
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
                "absolute top-0 w-72 sm:w-80 h-[360px] rounded-3xl p-5 sm:p-6",
                "bg-[#FFFDF8]",
                "border border-[#E5D7C5] shadow-warm-lg",
                "flex flex-col justify-between overflow-hidden cursor-pointer group",
                isCardActive
                  ? "border-[#16A085] ring-2 ring-[#16A085]/20 shadow-warm-xl -translate-y-2"
                  : "hover:border-[#D5C3AE]",
                cardClassName
              )}
            >
              {/* Background ambient glow inside card */}
              <div 
                className={cn(
                  "absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none",
                  card.glowColor || "bg-[#16A085]/10",
                  isCardActive ? "opacity-100" : "opacity-35"
                )}
              />

              {/* Custom render card if provided */}
              {renderCard ? (
                renderCard(card, isCardActive)
              ) : card.name ? (
                // Built-in Freelancer Card Template
                <>
                  {/* Top Row: Avatar, Name, Rating & Verified Badge */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={card.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${card.name || 'freelancer'}`}
                          alt={card.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-[#E5D7C5] bg-[#F4E8D5] shadow-inner"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#16A085] border-2 border-[#FFFDF8]" />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-[#3B3028] text-base font-display group-hover:text-[#16A085] transition-colors">
                            {card.name}
                          </h4>
                          <CheckCircle2 className="w-4 h-4 text-[#16A085] flex-shrink-0" />
                        </div>
                        <p className="text-xs text-[#75685C] font-semibold truncate max-w-[150px]">
                          {card.title || card.category || 'Specialist'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-[#D6A85F]/15 border border-[#D6A85F]/30 px-2.5 py-1 rounded-full text-xs font-bold text-[#936d31]">
                      <Star className="w-3.5 h-3.5 fill-[#D6A85F] text-[#D6A85F]" />
                      <span>{card.rating?.average ? Number(card.rating.average).toFixed(1) : '5.0'}</span>
                    </div>
                  </div>

                  {/* Body: Bio & Skills */}
                  <div className="relative z-10 my-auto space-y-3">
                    <p className="text-xs text-[#75685C] line-clamp-2 leading-relaxed font-normal">
                      {card.bio || `Specialized in ${card.category || 'modern technology'}. Delivers high-impact solutions with 100% escrow protection.`}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {(card.skills && card.skills.length > 0 ? card.skills.slice(0, 3) : ['Full-Stack', 'React', 'Node.js']).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-0.5 rounded-lg bg-[#F4E8D5] text-[#3B3028] text-[10px] font-medium border border-[#E5D7C5]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer: Rate & Action */}
                  <div className="relative z-10 pt-3.5 border-t border-[#E5D7C5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#75685C] block">Hourly Rate</span>
                      <span className="text-base font-extrabold text-[#16A085] font-display">
                        ₹{card.hourlyRate ? card.hourlyRate * 20 : '1,500'}/hr
                      </span>
                    </div>

                    <div className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all",
                      isCardActive 
                        ? "bg-[#16A085] text-white font-bold shadow-warm-md" 
                        : "bg-[#F4E8D5] text-[#3B3028] group-hover:bg-[#16A085] group-hover:text-white"
                    )}>
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </>
              ) : (
                // Generic Domain / Specialization Card
                <>
                  <div className="relative z-10 flex items-center justify-between">
                    {card.icon && (
                      <div className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105",
                        card.iconBg || "bg-[#16A085]/15 text-[#16A085] border border-[#16A085]/20"
                      )}>
                        {React.isValidElement(card.icon) ? card.icon : <card.icon className="w-5 h-5" />}
                      </div>
                    )}
                    {card.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F4E8D5] text-[#75685C] border border-[#E5D7C5]">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 my-auto space-y-2">
                    <h3 className="text-lg font-bold text-[#3B3028] font-display group-hover:text-[#16A085] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#75685C] leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-3 border-t border-[#E5D7C5] flex items-center justify-between text-xs">
                    <span className="text-[#16A085] font-semibold">{card.count || 'Active'}</span>
                    <span className="flex items-center gap-1 text-[#3B3028] font-medium group-hover:translate-x-1 transition-transform">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
