require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Job = require('./models/Job');
const Proposal = require('./models/Proposal');
const Contract = require('./models/Contract');
const Review = require('./models/Review');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for Seeding...');

    // Clear existing collections for a clean, rich initial state
    await User.deleteMany({});
    await Job.deleteMany({});
    await Proposal.deleteMany({});
    await Contract.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Create Demo Users
    const passwordHash = await bcrypt.hash('password123', 10);

    const client1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'client@example.com',
      password: 'password123', // Model pre-save will hash if not hashed, or we provide raw password
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
      title: 'Founder & VP of Product at NexaTech',
      bio: 'Scaling high-growth SaaS applications. Looking for world-class React, Node.js, and AI engineers to build next-generation web products.',
      companyName: 'NexaTech Innovations',
      location: 'San Francisco, CA',
      spent: 18450,
      rating: { average: 4.9, count: 14 }
    });

    const client2 = await User.create({
      name: 'David Chen',
      email: 'david@finflow.io',
      password: 'password123',
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
      title: 'Head of Engineering at FinFlow',
      bio: 'Fintech builder looking for top-tier UI/UX and fullstack engineers to craft robust financial dashboards.',
      companyName: 'FinFlow Global',
      location: 'New York, NY',
      spent: 32900,
      rating: { average: 5.0, count: 21 }
    });

    const freelancer1 = await User.create({
      name: 'Alex Rivera',
      email: 'freelancer@example.com',
      password: 'password123',
      role: 'freelancer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
      title: 'Senior Full-Stack MERN & Cloud Architect',
      bio: 'Over 8 years of experience building scalable web applications with React, Node.js, MongoDB, TypeScript, and AWS. Passionate about clean code, slick UI interactions, and sub-second performance.',
      hourlyRate: 85,
      category: 'Web Development',
      skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL'],
      location: 'Austin, TX',
      rating: { average: 4.95, count: 38 },
      earnings: 64200,
      completedProjectsCount: 42,
      badge: 'Top Rated',
      portfolio: [
        {
          title: 'SaaS Analytics Dashboard',
          description: 'High performance real-time dashboard tracking 1M+ data points daily.',
          link: 'https://github.com',
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
          tags: ['React', 'Tailwind CSS', 'Chart.js', 'Node.js']
        },
        {
          title: 'Decentralized Marketplace UI',
          description: 'Web3 and crypto checkout interface with smooth micro-animations.',
          link: 'https://github.com',
          imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
          tags: ['Next.js', 'Web3', 'Tailwind CSS']
        }
      ],
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://linkedin.com'
    });

    const freelancer2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@designcraft.io',
      password: 'password123',
      role: 'freelancer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
      title: 'Lead UI/UX Designer & Design Systems Pro',
      bio: 'Award-winning Product & UI/UX Designer. Specializing in conversion-focused interfaces, Figma design systems, interactive prototypes, and modern branding.',
      hourlyRate: 75,
      category: 'UI/UX Design',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Wireframing', 'Prototyping', 'User Research', 'Tailwind CSS'],
      location: 'Berlin, Germany',
      rating: { average: 5.0, count: 29 },
      earnings: 48900,
      completedProjectsCount: 31,
      badge: 'Expert Pro',
      portfolio: [
        {
          title: 'Fintech Mobile App UI/UX',
          description: 'End-to-end design for an iOS/Android banking application with 100k+ downloads.',
          link: 'https://figma.com',
          imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
          tags: ['Figma', 'Mobile UI', 'Prototyping']
        }
      ]
    });

    const freelancer3 = await User.create({
      name: 'Marcus Thorne',
      email: 'marcus@cloudops.dev',
      password: 'password123',
      role: 'freelancer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
      title: 'DevOps, Docker & Kubernetes Engineer',
      bio: 'CI/CD pipeline automation expert, AWS Certified Solutions Architect, Kubernetes cluster management and serverless backend orchestration.',
      hourlyRate: 95,
      category: 'DevOps & Cloud',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux', 'Node.js'],
      location: 'Seattle, WA',
      rating: { average: 4.88, count: 19 },
      earnings: 38700,
      completedProjectsCount: 22,
      badge: 'Top Rated'
    });

    const freelancer4 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@ai-lab.io',
      password: 'password123',
      role: 'freelancer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
      title: 'AI/ML Engineer & LLM Fine-Tuning Specialist',
      bio: 'MSc in Computer Science. Building intelligent agents, LangChain/LlamaIndex pipelines, OpenAI API integrations, and predictive data pipelines.',
      hourlyRate: 110,
      category: 'AI & Machine Learning',
      skills: ['Python', 'LangChain', 'OpenAI', 'PyTorch', 'FastAPI', 'Vector Databases', 'Prompt Engineering'],
      location: 'Toronto, Canada',
      rating: { average: 4.98, count: 24 },
      earnings: 52400,
      completedProjectsCount: 26,
      badge: 'Expert Pro'
    });

    console.log('Created Demo Users (Clients & Freelancers).');

    // 2. Create Jobs
    const job1 = await Job.create({
      client: client1._id,
      title: 'Build a Full-Stack SaaS Analytics Platform in React & Node.js',
      description: 'We are seeking an experienced fullstack developer to build a modern analytics dashboard. The platform needs to support user authentication, interactive SVG charts, data export to CSV/PDF, and real-time MongoDB aggregation feeds. Looking for clean code, responsive layout with Tailwind CSS, and robust REST APIs.',
      category: 'Web Development',
      skillsRequired: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'REST API', 'Chart.js'],
      budgetType: 'fixed',
      budget: 3500,
      experienceLevel: 'Expert',
      projectDuration: '1 to 3 months',
      status: 'open',
      proposalsCount: 2,
      featured: true,
      views: 142
    });

    const job2 = await Job.create({
      client: client1._id,
      title: 'Redesign Modern Landing Page & Mobile App UI in Figma',
      description: 'Need an outstanding UI/UX designer to revamp our marketing website and mobile application experience. Deliverables include a comprehensive Figma component library, responsive design tokens, high-fidelity mockups for desktop and mobile, and interactive clickable prototypes.',
      category: 'UI/UX Design',
      skillsRequired: ['Figma', 'UI/UX Design', 'Design Systems', 'Mobile UI', 'Prototyping'],
      budgetType: 'fixed',
      budget: 1800,
      experienceLevel: 'Intermediate',
      projectDuration: '1 to 4 weeks',
      status: 'open',
      proposalsCount: 1,
      featured: true,
      views: 98
    });

    const job3 = await Job.create({
      client: client2._id,
      title: 'Develop Custom AI Chatbot Assistant with RAG & LangChain',
      description: 'We want to integrate an AI knowledge assistant into our customer support flow. Needs to ingest our markdown & PDF documentation into a vector database (Pinecone or MongoDB Atlas Vector Search) and generate accurate, streaming answers with source citations.',
      category: 'AI & Machine Learning',
      skillsRequired: ['Python', 'OpenAI', 'LangChain', 'Vector Databases', 'FastAPI'],
      budgetType: 'fixed',
      budget: 2800,
      experienceLevel: 'Expert',
      projectDuration: '1 to 4 weeks',
      status: 'open',
      proposalsCount: 1,
      featured: false,
      views: 67
    });

    const job4 = await Job.create({
      client: client2._id,
      title: 'Setup Kubernetes Cluster & CI/CD Pipeline on AWS',
      description: 'Looking for a DevOps specialist to containerize our microservices with Docker, configure an automated GitHub Actions CI/CD deployment pipeline, and configure auto-scaling on AWS EKS.',
      category: 'DevOps & Cloud',
      skillsRequired: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      budgetType: 'fixed',
      budget: 2200,
      experienceLevel: 'Expert',
      projectDuration: '1 to 4 weeks',
      status: 'open',
      proposalsCount: 1,
      featured: false,
      views: 53
    });

    // 3. Create Sample Proposals
    const prop1 = await Proposal.create({
      job: job1._id,
      freelancer: freelancer1._id,
      client: client1._id,
      bidAmount: 3200,
      estimatedDays: 21,
      coverLetter: 'Hi Sarah, I reviewed your SaaS platform requirements in detail. Over the past 4 years I have built several high-throughput data visualization apps using React, Tailwind CSS, and MongoDB. I can deliver a modular frontend with Chart.js, JWT security, and optimized aggregation queries. Check my portfolio for live demos!',
      milestones: [
        { title: 'Database schema & Backend API setup', amount: 1000, durationDays: 7 },
        { title: 'Frontend UI Dashboard & Charts integration', amount: 1200, durationDays: 8 },
        { title: 'Export features, Polish & Testing', amount: 1000, durationDays: 6 }
      ],
      status: 'pending'
    });

    const prop2 = await Proposal.create({
      job: job2._id,
      freelancer: freelancer2._id,
      client: client1._id,
      bidAmount: 1750,
      estimatedDays: 14,
      coverLetter: 'Hello! I am a Lead UI/UX designer with 6+ years of specialized experience in Figma design systems and SaaS landing pages. I will provide you with a clean, pixel-perfect design system with autolayout, dark mode support, and interactive click-through prototypes.',
      milestones: [
        { title: 'Wireframes & Information Architecture', amount: 500, durationDays: 4 },
        { title: 'High Fidelity UI Mockups in Figma', amount: 800, durationDays: 6 },
        { title: 'Design System & Interactive Prototype', amount: 450, durationDays: 4 }
      ],
      status: 'pending'
    });

    // 4. Create a Sample Completed Contract & Review for history
    const completedJob = await Job.create({
      client: client1._id,
      title: 'E-Commerce Marketplace React Frontend & Checkout',
      description: 'Complete redesign and responsive build of our multi-vendor store checkout flow.',
      category: 'Web Development',
      skillsRequired: ['React', 'Tailwind CSS', 'Stripe API'],
      budgetType: 'fixed',
      budget: 2500,
      experienceLevel: 'Intermediate',
      status: 'completed',
      hiredFreelancer: freelancer1._id,
      proposalsCount: 3
    });

    const completedProposal = await Proposal.create({
      job: completedJob._id,
      freelancer: freelancer1._id,
      client: client1._id,
      bidAmount: 2500,
      estimatedDays: 14,
      coverLetter: 'I will build your checkout flow with silky smooth animations and high conversion UX.',
      status: 'accepted'
    });

    const contract = await Contract.create({
      job: completedJob._id,
      proposal: completedProposal._id,
      client: client1._id,
      freelancer: freelancer1._id,
      amount: 2500,
      status: 'completed',
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      submissionNotes: 'All components delivered, unit tested and deployed to production staging.',
      submissionLink: 'https://github.com/example/ecommerce-checkout',
      clientReviewed: true,
      freelancerReviewed: true
    });

    completedJob.contract = contract._id;
    await completedJob.save();

    await Review.create({
      contract: contract._id,
      job: completedJob._id,
      reviewer: client1._id,
      reviewee: freelancer1._id,
      rating: 5,
      comment: 'Alex is phenomenal! Delivered ahead of schedule with immaculate code quality and superb communication. Highly recommend for any serious web project!',
      role: 'client_to_freelancer'
    });

    await Review.create({
      contract: contract._id,
      job: completedJob._id,
      reviewer: freelancer1._id,
      reviewee: client1._id,
      rating: 5,
      comment: 'Working with Sarah was a breeze. Clear requirements, prompt feedback, and instant milestone releases. Would love to work together again!',
      role: 'freelancer_to_client'
    });

    // 5. Sample Messages
    await Message.create({
      sender: client1._id,
      receiver: freelancer1._id,
      job: job1._id,
      text: 'Hey Alex! Loved your proposal for our SaaS Analytics Platform. Are you available for a quick sync this week?'
    });

    await Message.create({
      sender: freelancer1._id,
      receiver: client1._id,
      job: job1._id,
      text: 'Hi Sarah! Thanks for reaching out. Yes, absolutely. I am available anytime tomorrow afternoon.'
    });

    // 6. Sample Notifications
    await Notification.create({
      user: client1._id,
      title: 'New Proposal Received',
      message: 'Alex Rivera submitted a proposal of $3,200 on "Build a Full-Stack SaaS Analytics Platform in React & Node.js"',
      link: `/jobs/${job1._id}`,
      type: 'proposal'
    });

    await Notification.create({
      user: freelancer1._id,
      title: 'New Message from Sarah Jenkins',
      message: 'Hey Alex! Loved your proposal for our SaaS Analytics Platform...',
      link: `/messages/${client1._id}`,
      type: 'message'
    });

    console.log('✅ Seed completed successfully! Database is primed and populated.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedData();
