import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addCustomer, addTicket, Customer, Ticket } from '../store/dataSlice';
import '../styles/dark-theme.css';
import AddCustomerModal from '../components/modals/AddCustomerModal';
import CreateTicketModal from '../components/modals/CreateTicketModal';
import ImportCSVModal from '../components/modals/ImportCSVModal';

const CommandCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const customers = useSelector((state: RootState) => state.data.customers);
  const tickets = useSelector((state: RootState) => state.data.tickets);
  const [loading, setLoading] = useState(true);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showImportCSVModal, setShowImportCSVModal] = useState(false);

  const stats = {
    totalCustomers: customers.length,
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.stage !== 'COMPLETED').length,
    completedTickets: tickets.filter(t => t.stage === 'COMPLETED').length,
  };

  useEffect(() => {
    // Simulate loading
    setLoading(false);
  }, [customers, tickets]);

  const handleAddCustomer = (customerData: any) => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      ...customerData,
      createdAt: new Date().toISOString()
    };
    dispatch(addCustomer(newCustomer));
    console.log('Customer added from Command Center:', newCustomer);
  };

  const handleCreateTicket = (ticketData: any) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ...ticketData,
      assignedTo: ticketData.assignedTo || undefined,
      createdAt: new Date().toISOString()
    };
    dispatch(addTicket(newTicket));
    console.log('Ticket created from Command Center:', newTicket);
  };

  const handleImportCSV = (file: File) => {
    console.log('Importing CSV file from Command Center:', file.name);
    // TODO: Implement CSV parsing and import logic
    alert(`CSV file "${file.name}" uploaded successfully! (Import functionality will be implemented soon)`);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/customers" className="nav-link">Customers</Link>
              <Link to="/tickets" className="nav-link">Tickets</Link>
              <Link to="/command-center" className="nav-link active">Command Center</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="page-container">
        <div className="page-header">
          <h1 className="page-title">Command Center</h1>
          <p className="page-subtitle">Unified view of all activities and quick actions</p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px', 
          marginBottom: '48px' 
        }}>
          <div 
            className="dark-card" 
            style={{ 
              padding: '24px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              borderColor: 'rgba(75, 85, 99, 0.5)'
            }}
            onClick={() => navigate('/customers')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.8)';
              e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(59, 130, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '4px' }}>
                  Total Customers
                </p>
                <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {loading ? (
                    <div style={{ width: '32px', height: '24px', background: 'rgba(107, 114, 128, 0.3)', borderRadius: '4px' }}></div>
                  ) : (
                    stats.totalCustomers
                  )}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="dark-card" 
            style={{ 
              padding: '24px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              borderColor: 'rgba(75, 85, 99, 0.5)'
            }}
            onClick={() => navigate('/tickets')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.8)';
              e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(16, 185, 129, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(45deg, #10b981, #059669)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '4px' }}>
                  Total Tickets
                </p>
                <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {loading ? (
                    <div style={{ width: '32px', height: '24px', background: 'rgba(107, 114, 128, 0.3)', borderRadius: '4px' }}></div>
                  ) : (
                    stats.totalTickets
                  )}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="dark-card" 
            style={{ 
              padding: '24px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              borderColor: 'rgba(75, 85, 99, 0.5)'
            }}
            onClick={() => navigate('/tickets')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.8)';
              e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(245, 158, 11, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '4px' }}>
                  Open Tickets
                </p>
                <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {loading ? (
                    <div style={{ width: '32px', height: '24px', background: 'rgba(107, 114, 128, 0.3)', borderRadius: '4px' }}></div>
                  ) : (
                    stats.openTickets
                  )}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="dark-card" 
            style={{ 
              padding: '24px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              borderColor: 'rgba(75, 85, 99, 0.5)'
            }}
            onClick={() => navigate('/tickets')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.8)';
              e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(139, 92, 246, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '4px' }}>
                  Completed
                </p>
                <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {loading ? (
                    <div style={{ width: '32px', height: '24px', background: 'rgba(107, 114, 128, 0.3)', borderRadius: '4px' }}></div>
                  ) : (
                    stats.completedTickets
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dark-card" style={{ marginBottom: '48px' }}>
          <div className="card-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>Quick Actions</h2>
          </div>
          <div className="card-content">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '24px' 
            }}>
              <button
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '24px',
                  background: 'rgba(55, 65, 81, 0.3)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setShowAddCustomerModal(true)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(55, 65, 81, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>+</span>
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>Add Customer</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Create a new customer record</p>
                  </div>
                </div>
              </button>

              <button
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '24px',
                  background: 'rgba(55, 65, 81, 0.3)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setShowCreateTicketModal(true)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(55, 65, 81, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>Create Ticket</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Start tracking a new issue</p>
                  </div>
                </div>
              </button>

              <button
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '24px',
                  background: 'rgba(55, 65, 81, 0.3)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setShowImportCSVModal(true)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(55, 65, 81, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>Import CSV</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Bulk import customer data</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dark-card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>Recent Activity</h2>
          </div>
          <div className="card-content">
            {customers.length === 0 && tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(45deg, #374151, #4b5563)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <svg style={{ width: '32px', height: '32px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                  No recent activity
                </h3>
                <p style={{ color: '#9ca3af' }}>
                  Activity will appear here as you use the system
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Recent Customers */}
                {customers.slice(-3).reverse().map((customer) => (
                  <div key={customer.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px 16px', 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px'
                    }}>
                      <svg style={{ width: '16px', height: '16px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>
                        New customer: {customer.name}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        {new Date(customer.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Recent Tickets */}
                {tickets.slice(-3).reverse().map((ticket) => (
                  <div key={ticket.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '12px 16px', 
                    background: 'rgba(139, 92, 246, 0.1)', 
                    borderRadius: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px'
                    }}>
                      <svg style={{ width: '16px', height: '16px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>
                        New ticket: {ticket.title}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                        {ticket.customerName} • {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <AddCustomerModal
          isOpen={showAddCustomerModal}
          onClose={() => setShowAddCustomerModal(false)}
          onSubmit={handleAddCustomer}
        />
        <CreateTicketModal
          isOpen={showCreateTicketModal}
          onClose={() => setShowCreateTicketModal(false)}
          onSubmit={handleCreateTicket}
        />
        <ImportCSVModal
          isOpen={showImportCSVModal}
          onClose={() => setShowImportCSVModal(false)}
          onSubmit={handleImportCSV}
        />
      </main>
    </div>
  );
};

export default CommandCenterPage;