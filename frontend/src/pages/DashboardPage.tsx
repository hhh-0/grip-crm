import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/authSlice';
import '../styles/dark-theme.css';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="dark-page">
      {/* Navigation */}
      <nav className="dark-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>G</span>
                </div>
                <h1 className="nav-brand">Grip CRM</h1>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: '#d1d5db' }}>Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(45deg, #dc2626, #b91c1c)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="page-container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '24px',
            lineHeight: '1.2'
          }}>
            Your Customer Management
            <span style={{ 
              display: 'block',
              background: 'linear-gradient(45deg, #60a5fa, #a78bfa, #f472b6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Command Center
            </span>
          </h2>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#9ca3af', 
            maxWidth: '768px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Zero-config customer relationship management that gets you from sign-up to active customer service in under 15 minutes.
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '32px', 
          marginBottom: '64px' 
        }}>
          <Link
            to="/customers"
            className="dark-card"
            style={{
              padding: '32px',
              textDecoration: 'none',
              color: 'inherit',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              Customer Database
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '24px', lineHeight: '1.6' }}>
              Manage your customer relationships with intelligent CSV import and instant field mapping.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: '#60a5fa', fontWeight: '600' }}>
              Get Started
              <svg style={{ width: '20px', height: '20px', marginLeft: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          <Link
            to="/tickets"
            className="dark-card"
            style={{
              padding: '32px',
              textDecoration: 'none',
              color: 'inherit',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              Task Pipeline
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '24px', lineHeight: '1.6' }}>
              Track customer issues through pre-built stages: New, In Progress, Waiting, Completed.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: '#a78bfa', fontWeight: '600' }}>
              Get Started
              <svg style={{ width: '20px', height: '20px', marginLeft: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>

          <Link
            to="/command-center"
            className="dark-card"
            style={{
              padding: '32px',
              textDecoration: 'none',
              color: 'inherit',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(45deg, #ec4899, #db2777)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              Command Center
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '24px', lineHeight: '1.6' }}>
              Unified dashboard with real-time analytics, quick actions, and activity monitoring.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', color: '#f472b6', fontWeight: '600' }}>
              Get Started
              <svg style={{ width: '20px', height: '20px', marginLeft: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Quick Start Section */}
        <div className="dark-card" style={{ padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            Ready to Transform Your Customer Management?
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px', 
            marginTop: '32px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(45deg, #10b981, #059669)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>1</span>
              </div>
              <span style={{ color: '#9ca3af' }}>Import your customer data</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>2</span>
              </div>
              <span style={{ color: '#9ca3af' }}>Create and track tickets</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>3</span>
              </div>
              <span style={{ color: '#9ca3af' }}>Monitor from command center</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;