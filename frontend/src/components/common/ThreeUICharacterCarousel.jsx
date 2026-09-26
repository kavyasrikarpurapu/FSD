import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2, ArrowRight, Sparkles, Layers, Sliders, ShieldCheck } from 'lucide-react';
import { CharacterCarousel } from '@designcodeio/threeui';

/**
 * ThreeUICharacterCarousel Component
 * Embeds official ThreeUI Character Carousel (Filmstrip / Wave) alongside
 * dimensional profile cards with talent statistics, live rates in INR, and quick hire actions.
 */
const ThreeUICharacterCarousel = ({ freelancers = [] }) => {
  const [variant, setVariant] = useState('filmstrip'); // 'filmstrip' (warm editorial) | 'wave'
  const [speed, setSpeed] = useState(1.0);
  const [scale, setScale] = useState(1.0);
  const [activeTab, setActiveTab] = useState('3d'); // '3d' | 'cards'

  const demoTalent = [
    {
      _id: '1',
      name: 'Alex Rivera',
      title: 'Senior AI & Full-Stack Architect',
      avatar: '/freelancer-alex.jpg',
      rating: { average: 4.98, count: 42 },
      hourlyRate: 1800,
      skills: ['React 19', 'Next.js', 'Python', 'LangChain', 'MongoDB Atlas'],
      bio: 'Ex-Stripe engineer building enterprise RAG pipelines, scalable APIs, and micro-frontend architectures with high test coverage.',
      badge: 'Top Rated Plus',
      availability: 'Available Now'
    },
    {
      _id: '2',
      name: 'Ananya Rao',
      title: 'Lead UI/UX & Design Systems Architect',
      avatar: '/freelancer-ananya.jpg',
      rating: { average: 4.99, count: 68 },
      hourlyRate: 1500,
      skills: ['Figma Pro', 'Design Systems', 'Tailwind CSS', 'Micro-interactions', 'Three.js'],
      bio: 'Crafting pixel-perfect, accessible, and high-conversion brand experiences for global tech innovators.',
      badge: 'Elite Talent',
      availability: 'Available Now'
    },
    {
      _id: '3',
      name: 'Marcus Chen',
      title: 'DevOps & Cloud Infrastructure Lead',
      avatar: '/freelancer-marcus.jpg',
      rating: { average: 4.95, count: 35 },
      hourlyRate: 2100,
      skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Docker'],
      bio: 'Zero-downtime cloud architect specializing in automated Kubernetes clusters and enterprise security escrow.',
      badge: 'Verified Master',
      availability: 'Part-Time'
    },
    {
      _id: '4',
      name: 'Elena Rostova',
      title: 'Data Scientist & Machine Learning Engineer',
      avatar: '/freelancer-elena.jpg',
      rating: { average: 4.97, count: 51 },
      hourlyRate: 1950,
      skills: ['PyTorch', 'Computer Vision', 'FastAPI', 'MLOps', 'Vector DBs'],
      bio: 'Specialized in computer vision, fine-tuning open-source LLMs, and real-time streaming analytics.',
      badge: 'AI Fellow',
      availability: 'Available Now'
    }
  ];

  const talentList = freelancers.length > 0 ? freelancers : demoTalent;

  return (
    <div className="w-full space-y-8">
      {/* ThreeUI Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFFDF8] border border-[#E5D7C5] shadow-warm-sm">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#16A085]/10 text-[#12806A] border border-[#16A085]/20 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#16A085]" /> ThreeUI Engine Active
          </span>
          <span className="text-xs text-[#75685C] hidden sm:inline">
            Interactive WebGL & 3D Perspective Shader
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Variant Selector */}
          <div className="flex items-center bg-[#F4E8D5] p-1 rounded-xl border border-[#E5D7C5]">
            <button
              type="button"
              onClick={() => setVariant('filmstrip')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                variant === 'filmstrip'
                  ? 'bg-[#16A085] text-white shadow-sm'
                  : 'text-[#75685C] hover:text-[#3B3028]'
              }`}
            >
              Filmstrip (Warm)
            </button>
            <button
              type="button"
              onClick={() => setVariant('wave')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                variant === 'wave'
                  ? 'bg-[#16A085] text-white shadow-sm'
                  : 'text-[#75685C] hover:text-[#3B3028]'
              }`}
            >
              3D Wave
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F4E8D5] p-1 rounded-xl border border-[#E5D7C5]">
            <button
              type="button"
              onClick={() => setActiveTab('3d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === '3d'
                  ? 'bg-[#D97757] text-white shadow-sm'
                  : 'text-[#75685C] hover:text-[#3B3028]'
              }`}
            >
              3D Stage
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cards'
                  ? 'bg-[#D97757] text-white shadow-sm'
                  : 'text-[#75685C] hover:text-[#3B3028]'
              }`}
            >
              Talent Roster
            </button>
          </div>
        </div>
      </div>

      {/* Main Display: 3D Stage or Talent Roster */}
      {activeTab === '3d' ? (
        <div className="relative rounded-3xl overflow-hidden border border-[#E5D7C5] shadow-warm-xl bg-[#d8c9ad]/20 backdrop-blur-sm min-h-[480px] sm:min-h-[520px]">
          {/* ThreeUI Official Character Carousel Component */}
          <div className="w-full h-[480px] sm:h-[520px]">
            <CharacterCarousel
              variant={variant}
              speed={speed}
              scale={scale}
              opacity={1}
              className="w-full h-full"
            />
          </div>

          {/* Overlay Quick Info Bar on bottom */}
          <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFFDF8]/90 backdrop-blur-md border border-[#E5D7C5] shadow-warm-md">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#16A085] animate-pulse" />
              <span className="text-xs font-bold text-[#3B3028]">
                Hover / Drag stage to rotate 3D character profiles in real-time
              </span>
            </div>

            <Link
              to="/freelancers"
              className="pointer-events-auto btn-primary py-1.5 px-4 text-xs font-semibold shadow-warm-sm"
            >
              <span>Explore All Verified Talent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        /* Dimensional Freelancer Profile Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {talentList.map((freelancer) => (
            <div
              key={freelancer._id}
              className="bg-[#FFFDF8] border border-[#E5D7C5] hover:border-[#16A085] rounded-3xl p-6 transition-all duration-300 hover:shadow-warm-lg hover:-translate-y-1.5 flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${freelancer.name}`}
                    alt={freelancer.name}
                    className="w-13 h-13 rounded-2xl object-cover border-2 border-[#E5D7C5] bg-[#F4E8D5]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-[#3B3028] text-sm truncate font-display group-hover:text-[#16A085] transition-colors">
                        {freelancer.name}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A085] flex-shrink-0" />
                    </div>
                    <p className="text-xs text-[#75685C] font-medium truncate mt-0.5">
                      {freelancer.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#D6A85F] font-bold mt-1">
                      <Star className="w-3 h-3 fill-[#D6A85F]" />
                      <span>{freelancer.rating?.average?.toFixed(2) || '4.98'}</span>
                      <span className="text-[#9C8E80] font-normal">({freelancer.rating?.count || 18})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#12806A] bg-[#16A085]/10 px-2.5 py-0.5 rounded-full w-fit border border-[#16A085]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A085]" />
                  <span>{freelancer.availability || 'Available'}</span>
                </div>

                <p className="text-xs text-[#75685C] mt-3 line-clamp-2 leading-relaxed">
                  {freelancer.bio}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {freelancer.skills?.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-[#F4E8D5] text-[#3B3028] text-[10px] font-medium border border-[#E5D7C5]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#E5D7C5] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#75685C] font-semibold block">Rate</span>
                  <span className="text-sm font-extrabold text-[#16A085] font-display">
                    ₹{freelancer.hourlyRate ? (freelancer.hourlyRate > 200 ? freelancer.hourlyRate : freelancer.hourlyRate * 20) : '1,500'}/hr
                  </span>
                </div>
                <Link
                  to={freelancer._id ? `/freelancers/${freelancer._id}` : '/freelancers'}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#16A085] hover:bg-[#12806A] text-white transition-all shadow-sm"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreeUICharacterCarousel;
