import React, { useState } from 'react';
import { 
  Briefcase, 
  Lock, 
  UploadCloud, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Award,
  ChevronRight
} from 'lucide-react';

/**
 * MarketplaceWorkflow3D Component
 * Perspective-driven interactive 3D demonstration of the Freelance Marketplace lifecycle:
 * Project -> Milestones -> Deliverables -> Client Review -> Escrow Release
 */
const MarketplaceWorkflow3D = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Project & Milestones Scope',
      subtitle: 'Smart Contract Initiation',
      description: 'Client posts requirements or hires directly. Freelancer defines modular milestones with clear deliverables and timelines.',
      icon: Briefcase,
      badge: 'Step 1: Agreement',
      highlightColor: '#16A085',
      metrics: '100% Scope Clarity',
      status: 'Active'
    },
    {
      step: '02',
      title: 'Escrow Vault Secured',
      subtitle: 'Guaranteed Funds Protection',
      description: 'Client funds the milestone into the verified escrow vault. Freelancer begins work knowing compensation is fully secured.',
      icon: Lock,
      badge: 'Step 2: Escrow Lock',
      highlightColor: '#D6A85F',
      metrics: '₹0 Upfront Risk',
      status: 'Funded'
    },
    {
      step: '03',
      title: 'Deliverables Submitted',
      subtitle: 'Code & Documentation',
      description: 'Freelancer submits repository links, test suites, or design assets directly through the platform milestone portal.',
      icon: UploadCloud,
      badge: 'Step 3: Submission',
      highlightColor: '#D97757',
      metrics: 'Git & Live Links',
      status: 'In Review'
    },
    {
      step: '04',
      title: 'Client Review & Approval',
      subtitle: 'Seamless Verification',
      description: 'Client inspects the deliverables, requests revisions if needed, or grants one-click milestone approval.',
      icon: CheckCircle2,
      badge: 'Step 4: Verification',
      highlightColor: '#16A085',
      metrics: '1-Click Approve',
      status: 'Approved'
    },
    {
      step: '05',
      title: 'Instant Escrow Release',
      subtitle: 'Settlement & Mutual Reviews',
      description: 'Escrow funds disburse immediately to freelancer balance. Both parties submit mutual star ratings stored in database.',
      icon: ShieldCheck,
      badge: 'Step 5: Completion',
      highlightColor: '#16A085',
      metrics: 'Instant Payout',
      status: 'Released'
    }
  ];

  return (
    <div className="w-full space-y-8" id="how-it-works">
      {/* Header Info */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16A085]/10 border border-[#16A085]/20 text-[#12806A] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
          <span>Perspective Workflow</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#3B3028] tracking-tight font-display">
          How FreelanceHub Works
        </h2>
        <p className="text-sm sm:text-base text-[#75685C] leading-relaxed">
          A seamless 5-stage workflow designed for trust, verified deliverables, and friction-free escrow settlement.
        </p>
      </div>

      {/* Step Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#16A085] text-white shadow-warm-md scale-105'
                  : 'bg-[#FFFDF8] text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5] border border-[#E5D7C5]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.step}. {s.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Perspective Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4">
        {steps.map((stepItem, index) => {
          const StepIcon = stepItem.icon;
          const isActive = activeStep === index;
          return (
            <div
              key={index}
              onClick={() => setActiveStep(index)}
              className={`relative rounded-3xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'bg-[#FFFDF8] border-2 border-[#16A085] shadow-warm-xl -translate-y-2'
                  : 'bg-[#FFFDF8]/80 border border-[#E5D7C5] hover:border-[#D5C3AE] hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#9C8E80] font-display">
                    {stepItem.step}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${stepItem.highlightColor}15`,
                      color: stepItem.highlightColor,
                      border: `1px solid ${stepItem.highlightColor}30`
                    }}
                  >
                    {stepItem.status}
                  </span>
                </div>

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform"
                  style={{
                    backgroundColor: `${stepItem.highlightColor}15`,
                    color: stepItem.highlightColor
                  }}
                >
                  <StepIcon className="w-5 h-5" />
                </div>

                <h3 className="text-sm font-bold text-[#3B3028] font-display mb-1">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-[#75685C] leading-relaxed line-clamp-3">
                  {stepItem.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5D7C5] flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#16A085]">{stepItem.metrics}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9C8E80]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketplaceWorkflow3D;
