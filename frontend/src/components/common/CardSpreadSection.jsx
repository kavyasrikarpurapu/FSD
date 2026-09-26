import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardSpread } from '../ui/card-spread';
import { 
  Sparkles, 
  Code2, 
  BrainCircuit, 
  Palette, 
  Cloud, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const CardSpreadSection = () => {
  const navigate = useNavigate();

  const talentSpecializations = [
    {
      id: 'ai-agents',
      title: 'Autonomous AI & LLM Systems',
      category: 'AI Engineering',
      description: 'Production RAG pipelines, fine-tuned agentic models, LangChain, and enterprise neural integrations.',
      badge: 'High Demand',
      rate: '₹1,800 – ₹3,500/hr',
      meta: '42+ Verified Pros',
      actionText: 'Browse AI Experts',
      icon: BrainCircuit,
      iconBg: 'bg-[#16A085]/15 text-[#16A085] border border-[#16A085]/20',
      glowColor: 'bg-[#16A085]/10'
    },
    {
      id: 'fullstack',
      title: 'Full-Stack Architecture & Cloud',
      category: 'Web & Systems',
      description: 'Scalable React, Next.js, Node.js microservices, MongoDB Atlas clustering, and high-concurrency backends.',
      badge: 'Top Rated',
      rate: '₹1,500 – ₹2,800/hr',
      meta: '98+ Verified Pros',
      actionText: 'Explore Engineers',
      icon: Code2,
      iconBg: 'bg-[#16A085]/15 text-[#16A085] border border-[#16A085]/20',
      glowColor: 'bg-[#16A085]/10'
    },
    {
      id: 'uiux',
      title: 'Design Systems & Modern Interfaces',
      category: 'Product Design',
      description: 'Interactive Figma design systems, motion prototyping, Tailwind design tokens, and user flow architectures.',
      badge: '99% Success',
      rate: '₹1,200 – ₹2,400/hr',
      meta: '64+ Verified Pros',
      actionText: 'Find Designers',
      icon: Palette,
      iconBg: 'bg-[#D97757]/15 text-[#D97757] border border-[#D97757]/20',
      glowColor: 'bg-[#D97757]/10'
    },
    {
      id: 'devops',
      title: 'DevOps & Kubernetes Infrastructure',
      category: 'Cloud Architecture',
      description: 'Automated CI/CD pipelines, Docker orchestration, AWS/GCP infrastructure as code, and zero-downtime clusters.',
      badge: 'Enterprise',
      rate: '₹1,600 – ₹3,200/hr',
      meta: '38+ Verified Pros',
      actionText: 'Hire DevOps',
      icon: Cloud,
      iconBg: 'bg-[#D6A85F]/15 text-[#936d31] border border-[#D6A85F]/30',
      glowColor: 'bg-[#D6A85F]/10'
    }
  ];

  const handleCardClick = (card) => {
    if (card.category === 'AI Engineering') {
      navigate('/jobs?category=AI%20%26%20Machine%20Learning');
    } else if (card.category === 'Web & Systems') {
      navigate('/jobs?category=Web%20Development');
    } else if (card.category === 'Product Design') {
      navigate('/jobs?category=UI%2FUX%20Design');
    } else {
      navigate('/jobs');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-warm-xl relative overflow-hidden">
        
        {/* Glow ambient backdrops in warm gold and emerald */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D6A85F]/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#16A085]/08 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16A085]/10 border border-[#16A085]/20 text-[#12806A] text-xs font-bold mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
              <span>Interactive Specialization Deck</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#3B3028] tracking-tight font-display">
              Featured Specialization Decks
            </h2>
            <p className="text-sm text-[#75685C] mt-2 max-w-2xl leading-relaxed">
              Hover or tap the deck to fan out verified service categories, hourly market benchmarks in INR, and talent rosters.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#12806A] bg-[#F4E8D5] px-4 py-2 rounded-2xl border border-[#E5D7C5] flex-shrink-0 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#16A085] animate-pulse" />
            <span>Hover / Click to spread cards</span>
          </div>
        </div>

        {/* Interactive Card Spread Component */}
        <div className="relative z-10 w-full overflow-hidden flex items-center justify-center">
          <CardSpread 
            cards={talentSpecializations}
            spreadDistance={150}
            rotationAngle={9}
            onCardClick={handleCardClick}
          />
        </div>

      </div>
    </section>
  );
};

export default CardSpreadSection;
