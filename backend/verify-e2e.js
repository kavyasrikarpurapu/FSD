const API = 'http://localhost:5001/api';

async function req(url, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

async function verifyEndToEnd() {
  console.log('🧪 Starting End-to-End Verification of FreelanceHub on MongoDB Atlas...');

  try {
    // 1. Health check
    const health = await req(API);
    console.log('✅ API Health Check:', health.message);

    // 2. Fetch platform stats
    const stats = await req(`${API}/analytics/platform-stats`);
    console.log('✅ Platform Stats from Atlas:', stats.stats);

    // 3. Client Login
    const clientLogin = await req(`${API}/auth/login`, 'POST', {
      email: 'client@example.com',
      password: 'password123'
    });
    console.log('✅ Client Login Successful:', clientLogin.user.name, `(${clientLogin.user.role})`);
    const clientToken = clientLogin.token;

    // 4. Freelancer Login
    const freelancerLogin = await req(`${API}/auth/login`, 'POST', {
      email: 'freelancer@example.com',
      password: 'password123'
    });
    console.log('✅ Freelancer Login Successful:', freelancerLogin.user.name, `(${freelancerLogin.user.role})`);
    const freelancerToken = freelancerLogin.token;

    // 5. Post a new Job as Client
    const newJob = await req(
      `${API}/jobs`,
      'POST',
      {
        title: 'Full-Stack Next.js 15 & AI Search App',
        category: 'Web Development',
        description: 'Need a talented full-stack engineer to build an AI search engine powered by React and MongoDB Atlas Vector Search.',
        skillsRequired: ['React', 'Next.js', 'MongoDB', 'AI'],
        budgetType: 'fixed',
        budget: 4200,
        experienceLevel: 'Expert',
        projectDuration: '1 to 3 months',
        featured: true
      },
      clientToken
    );
    console.log('✅ Job Successfully Created in Atlas:', newJob.job.title, `ID: ${newJob.job._id}`);
    const createdJobId = newJob.job._id;

    // 6. Submit a Proposal as Freelancer
    const proposal = await req(
      `${API}/proposals`,
      'POST',
      {
        jobId: createdJobId,
        bidAmount: 4000,
        estimatedDays: 20,
        coverLetter: 'I have extensive experience with Next.js 15 and MongoDB Atlas integrations. Ready to start immediately!',
        milestones: [
          { title: 'Setup & Frontend UI', amount: 2000, durationDays: 10 },
          { title: 'AI Integration & Delivery', amount: 2000, durationDays: 10 }
        ]
      },
      freelancerToken
    );
    console.log('✅ Proposal Successfully Stored in Atlas:', proposal.proposal._id, `Bid: $${proposal.proposal.bidAmount}`);
    const proposalId = proposal.proposal._id;

    // 7. Accept Proposal as Client (Creates Contract)
    const acceptRes = await req(
      `${API}/proposals/${proposalId}/accept`,
      'PUT',
      {},
      clientToken
    );
    console.log('✅ Proposal Accepted & Contract Created:', acceptRes.contractId);
    const contractId = acceptRes.contractId;

    // 8. Freelancer Submits Deliverable
    const submitWorkRes = await req(
      `${API}/contracts/${contractId}/submit`,
      'PUT',
      {
        submissionNotes: 'All project milestones implemented and verified with unit tests.',
        submissionLink: 'https://github.com/example/ai-search-app'
      },
      freelancerToken
    );
    console.log('✅ Deliverable Submitted by Freelancer:', submitWorkRes.contract.status);

    // 9. Client Approves Work & Releases Escrow Payment
    const approveRes = await req(
      `${API}/contracts/${contractId}/approve`,
      'PUT',
      {},
      clientToken
    );
    console.log('✅ Payment Released & Contract Completed:', approveRes.contract.status);

    // 10. Client Leaves Review
    const reviewRes = await req(
      `${API}/reviews`,
      'POST',
      {
        contractId: contractId,
        rating: 5,
        comment: 'Outstanding delivery! Super fast, clean code, and great communication.'
      },
      clientToken
    );
    console.log('✅ Review Recorded in Atlas:', reviewRes.review.comment);

    // 11. Send a Direct Message
    const msgRes = await req(
      `${API}/messages`,
      'POST',
      {
        receiverId: freelancerLogin.user._id,
        text: 'Thanks for the brilliant work on this project!'
      },
      clientToken
    );
    console.log('✅ Direct Message Sent & Persisted in Atlas:', msgRes.message.text);

    console.log('\n🎉 ALL E2E TESTS PASSED! FULL FREELANCE MARKET HUB IS WORKING FLAWLESSLY ON MONGODB ATLAS!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification Error:', err.message);
    process.exit(1);
  }
}

verifyEndToEnd();
