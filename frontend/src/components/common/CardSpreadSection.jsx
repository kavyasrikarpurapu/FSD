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
      rate: '$85 – $150/hr',
      meta: '42+ Verified Pros',
      actionText: 'Browse AI Experts',
      icon: BrainCircuit,
      iconBg: 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30',
      glowColor: 'bg-emerald-500/20'
    },
    {
      id: 'fullstack',
      title: 'Full-Stack Architecture & Cloud',
      category: 'Web & Systems',
      description: 'Scalable React, Next.js, Node.js microservices, MongoDB Atlas clustering, and high-concurrency backends.',
      badge: 'Top Rated',
      rate: '$65 – $120/hr',
      meta: '98+ Verified Pros',
      actionText: 'Explore Engineers',
      icon: Code2,
      iconBg: 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30',
      glowColor: 'bg-indigo-500/20'
    },
    {
      id: 'uiux',
      title: 'Design Systems & Web3 Interfaces',
      category: 'Product Design',
      description: 'Interactive Figma design systems, motion prototyping, Tailwind design tokens, and user flow architectures.',
      badge: '99% Success',
      rate: '$55 – $110/hr',
      meta: '64+ Verified Pros',
      actionText: 'Find Designers',
      icon: Palette,
      iconBg: 'bg-purple-600/30 text-purple-400 border border-purple-500/30',
      glowColor: 'bg-purple-500/20'
    },
    {
      id: 'devops',
      title: 'DevOps & Kubernetes Infrastructure',
      category: 'Cloud Architecture',
      description: 'Automated CI/CD pipelines, Docker orchestration, AWS/GCP infrastructure as code, and zero-downtime clusters.',
      badge: 'Enterprise',
      rate: '$75 – $140/hr',
      meta: '38+ Verified Pros',
      actionText: 'Hire DevOps',
      icon: Cloud,
      iconBg: 'bg-amber-600/30 text-amber-400 border border-amber-500/30',
      glowColor: 'bg-amber-500/20'
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
      <div className="bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient backdrops */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2 shadow-glow">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>React Bits Pro &bull; Interactive Card Spread</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Specialization Decks
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Hover or tap the deck to fan out verified service categories, hourly market benchmarks, and talent rosters.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
