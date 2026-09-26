import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WarmBackground from './components/common/WarmBackground';

import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import FreelancersPage from './pages/FreelancersPage';
import FreelancerProfilePage from './pages/FreelancerProfilePage';
import PostJobPage from './pages/PostJobPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import FreelancerDashboardPage from './pages/FreelancerDashboardPage';
import ContractsPage from './pages/ContractsPage';
import ContractDetailsPage from './pages/ContractDetailsPage';
import MessagesPage from './pages/MessagesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

function App() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#FFF9F0] text-[#3B3028] selection:bg-[#16A085] selection:text-white overflow-x-hidden">
      <WarmBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPage />} />
            <Route path="/freelancers" element={<FreelancersPage />} />
            <Route path="/freelancers/:id" element={<FreelancerProfilePage />} />
            <Route path="/post-job" element={<PostJobPage />} />
            <Route path="/client/dashboard" element={<ClientDashboardPage />} />
            <Route path="/freelancer/dashboard" element={<FreelancerDashboardPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/contracts/:id" element={<ContractDetailsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfileSettingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
