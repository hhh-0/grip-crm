import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addTicket, updateTicket, Ticket } from '../store/dataSlice';
import '../styles/dark-theme.css';
import CreateTicketModal from '../components/modals/CreateTicketModal';
import ViewTicketModal from '../components/modals/ViewTicketModal';
import EditTicketModal from '../components/modals/EditTicketModal';

const TicketsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tickets = useSelector((state: RootState) => state.data.tickets);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    // Simulate loading
    setLoading(false);
  }, []);

  const handleCreateTicket = (ticketData: any) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ...ticketData,
      assignedTo: ticketData.assignedTo || undefined,
      createdAt: new Date().toISOString()
    };
    dispatch(addTicket(newTicket));
    console.log('Ticket created:', newTicket);
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowViewModal(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowEditModal(true);
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    dispatch(updateTicket(updatedTicket));
    console.log('Ticket updated:', updatedTicket);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'NEW': return { background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'IN_PROGRESS': return { background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'WAITING': return { background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.3)' };
      case 'COMPLETED': return { background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)' };
      default: return { background: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af', border: '1px solid rgba(107, 114, 128, 0.3)' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return { background: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af', border: '1px solid rgba(107, 114, 128, 0.3)' };
      case 'MEDIUM': return { background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'HIGH': return { background: 'rgba(249, 115, 22, 0.2)', color: '#fb923c', border: '1px solid rgba(249, 115, 22, 0.3)' };
      case 'URGENT': return { background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' };
      default: return { background: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af', border: '1px solid rgba(107, 114, 128, 0.3)' };
    }
  };

  return (
    <div className="dark-page">
      <nav className="dark-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <Link to="/dashboard" className="nav-brand">Grip CRM</Link>
              <div style={{ display: 'flex', gap: '24px' }}>
                <Link to="/customers" className="nav-link">Customers</Link>
                <Link to="/tickets" className="nav-link active">Tickets</Link>
                <Link to="/command-center" className="nav-link">Command Center</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="page-container">
        <div className="page-header">
          <h1 className="page-title">Tickets</h1>
          <p className="page-subtitle">Track customer issues and tasks</p>
        </div>

        <div className="dark-card">
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '500', color: 'white', margin: 0 }}>Ticket List</h2>
              <button 
                className="gradient-button"
                onClick={() => setShowCreateModal(true)}
              >
                Create Ticket
              </button>
            </div>
          </div>
          
          <div className="card-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <div className="spinner"></div>
                </div>
                <div style={{ color: '#9ca3af' }}>Loading tickets...</div>
              </div>
            ) : tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <span style={{ fontSize: '2rem' }}>🎫</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: 'white', marginBottom: '8px' }}>
                  No tickets found
                </h3>
                <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
                  Start by creating your first customer ticket
                </p>
                <button 
                  className="gradient-button"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Your First Ticket
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(75, 85, 99, 0.5)' }}>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Title
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Customer
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Assigned To
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Stage
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Priority
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Resolved By
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} style={{ borderBottom: '1px solid rgba(75, 85, 99, 0.3)' }}>
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white' }}>{ticket.title}</div>
                          <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{ticket.description.substring(0, 50)}...</div>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#d1d5db' }}>
                          {ticket.customerName}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#d1d5db' }}>
                          {ticket.assignedTo ? (
                            <span style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#93c5fd',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              borderRadius: '6px'
                            }}>
                              {ticket.assignedTo}
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unassigned</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            ...getStageColor(ticket.stage),
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            borderRadius: '9999px'
                          }}>
                            {ticket.stage.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            ...getPriorityColor(ticket.priority),
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            borderRadius: '9999px'
                          }}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '0.875rem', color: '#d1d5db' }}>
                          {ticket.resolvedBy ? (
                            <span style={{
                              background: 'rgba(34, 197, 94, 0.2)',
                              color: '#4ade80',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              borderRadius: '6px'
                            }}>
                              {ticket.resolvedBy}
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not resolved</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: '500' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button 
                              style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
                              onClick={() => handleViewTicket(ticket)}
                            >
                              View
                            </button>
                            <button 
                              style={{ color: '#34d399', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
                              onClick={() => handleEditTicket(ticket)}
                            >
                              Edit
                            </button>
                            {!ticket.assignedTo && (
                              <button 
                                style={{ 
                                  color: '#8b5cf6', 
                                  background: 'none', 
                                  border: 'none', 
                                  cursor: 'pointer', 
                                  fontSize: '0.875rem',
                                  fontWeight: '500'
                                }}
                                onClick={() => {
                                  const updatedTicket = { 
                                    ...ticket, 
                                    assignedTo: 'Me',
                                    updatedAt: new Date().toISOString()
                                  };
                                  dispatch(updateTicket(updatedTicket));
                                }}
                              >
                                Assign to Me
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <CreateTicketModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTicket}
        />
        <ViewTicketModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          ticket={selectedTicket}
        />
        <EditTicketModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateTicket}
          ticket={selectedTicket}
        />
      </main>
    </div>
  );
};

export default TicketsPage;