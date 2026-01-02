import React from 'react';
import { Ticket } from '../../store/dataSlice';
import '../../styles/dark-theme.css';

interface ViewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

const ViewTicketModal: React.FC<ViewTicketModalProps> = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        background: 'rgba(55, 65, 81, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(75, 85, 99, 0.5)',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
            Ticket Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
              Title
            </label>
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(17, 24, 39, 0.5)', 
              border: '1px solid rgba(107, 114, 128, 0.5)', 
              borderRadius: '12px', 
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              {ticket.title}
            </div>
          </div>

          {/* Status and Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
                Stage
              </label>
              <span style={{
                ...getStageColor(ticket.stage),
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: '12px',
                display: 'inline-block'
              }}>
                {ticket.stage.replace('_', ' ')}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
                Priority
              </label>
              <span style={{
                ...getPriorityColor(ticket.priority),
                padding: '8px 16px',
                fontSize: '0.875rem',
                fontWeight: '500',
                borderRadius: '12px',
                display: 'inline-block'
              }}>
                {ticket.priority}
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
                ID
              </label>
              <div style={{ 
                padding: '8px 16px', 
                background: 'rgba(17, 24, 39, 0.5)', 
                border: '1px solid rgba(107, 114, 128, 0.5)', 
                borderRadius: '12px', 
                color: '#9ca3af',
                fontSize: '0.875rem',
                fontFamily: 'monospace'
              }}>
                #{ticket.id.slice(-6)}
              </div>
            </div>
          </div>

          {/* Customer */}
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
              Customer
            </label>
            <div style={{ 
              padding: '12px 16px', 
              background: 'rgba(17, 24, 39, 0.5)', 
              border: '1px solid rgba(107, 114, 128, 0.5)', 
              borderRadius: '12px', 
              color: 'white'
            }}>
              {ticket.customerName}
            </div>
          </div>

          {/* Assignment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
                Assigned To
              </label>
              <div style={{ 
                padding: '12px 16px', 
                background: 'rgba(17, 24, 39, 0.5)', 
                border: '1px solid rgba(107, 114, 128, 0.5)', 
                borderRadius: '12px', 
                color: ticket.assignedTo ? 'white' : '#9ca3af'
              }}>
                {ticket.assignedTo || 'Unassigned'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
                Resolved By
              </label>
              <div style={{ 
                padding: '12px 16px', 
                background: 'rgba(17, 24, 39, 0.5)', 
                border: '1px solid rgba(107, 114, 128, 0.5)', 
                borderRadius: '12px', 
                color: ticket.resolvedBy ? 'white' : '#9ca3af'
              }}>
                {ticket.resolvedBy || 'Not resolved'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
              Description
            </label>
            <div style={{ 
              padding: '16px', 
              background: 'rgba(17, 24, 39, 0.5)', 
              border: '1px solid rgba(107, 114, 128, 0.5)', 
              borderRadius: '12px', 
              color: 'white',
              minHeight: '100px',
              whiteSpace: 'pre-wrap'
            }}>
              {ticket.description || 'No description provided'}
            </div>
          </div>

          {/* Timestamps */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
                Created
              </label>
              <div style={{ 
                padding: '8px 12px', 
                background: 'rgba(17, 24, 39, 0.5)', 
                border: '1px solid rgba(107, 114, 128, 0.5)', 
                borderRadius: '8px', 
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>
                {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
                Updated
              </label>
              <div style={{ 
                padding: '8px 12px', 
                background: 'rgba(17, 24, 39, 0.5)', 
                border: '1px solid rgba(107, 114, 128, 0.5)', 
                borderRadius: '8px', 
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>
                {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'Never'}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px', display: 'block' }}>
                Resolved
              </label>
              <div style={{ 
                padding: '8px 12px', 
                background: 'rgba(17, 24, 39, 0.5)', 
                border: '1px solid rgba(107, 114, 128, 0.5)', 
                borderRadius: '8px', 
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>
                {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleString() : 'Not resolved'}
              </div>
            </div>
          </div>

          {/* Close button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={onClose}
              className="gradient-button"
              style={{ padding: '12px 24px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicketModal;