import React, { useState, useEffect } from 'react';
import { Ticket } from '../../store/dataSlice';
import '../../styles/dark-theme.css';

interface EditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: Ticket) => void;
  ticket: Ticket | null;
}

const EditTicketModal: React.FC<EditTicketModalProps> = ({ isOpen, onClose, onSubmit, ticket }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerName: '',
    priority: 'MEDIUM' as Ticket['priority'],
    stage: 'NEW' as Ticket['stage'],
    assignedTo: '',
    resolvedBy: '',
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        customerName: ticket.customerName,
        priority: ticket.priority,
        stage: ticket.stage,
        assignedTo: ticket.assignedTo || '',
        resolvedBy: ticket.resolvedBy || '',
      });
    }
  }, [ticket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;

    if (formData.title.trim() && formData.customerName.trim()) {
      const updatedTicket: Ticket = {
        ...ticket,
        title: formData.title,
        description: formData.description,
        customerName: formData.customerName,
        priority: formData.priority,
        stage: formData.stage,
        assignedTo: formData.assignedTo || undefined,
        resolvedBy: formData.resolvedBy || undefined,
        resolvedAt: formData.stage === 'COMPLETED' && !ticket.resolvedAt ? new Date().toISOString() : ticket.resolvedAt,
        updatedAt: new Date().toISOString(),
      };

      // If stage changed to COMPLETED and resolvedBy is set, mark as resolved
      if (formData.stage === 'COMPLETED' && formData.resolvedBy && !ticket.resolvedAt) {
        updatedTicket.resolvedAt = new Date().toISOString();
      }

      // If stage changed from COMPLETED to something else, clear resolution
      if (formData.stage !== 'COMPLETED' && ticket.stage === 'COMPLETED') {
        updatedTicket.resolvedBy = undefined;
        updatedTicket.resolvedAt = undefined;
      }

      onSubmit(updatedTicket);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAssignToMe = () => {
    setFormData({
      ...formData,
      assignedTo: 'Me' // In a real app, this would be the current user's name
    });
  };

  const handleResolveAsMe = () => {
    setFormData({
      ...formData,
      resolvedBy: 'Me', // In a real app, this would be the current user's name
      stage: 'COMPLETED'
    });
  };

  if (!isOpen || !ticket) return null;

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
            Edit Ticket #{ticket.id.slice(-6)}
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

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-field">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter ticket title"
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-field">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Stage</label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="form-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="WAITING">Waiting</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
              <div className="form-field">
                <label className="form-label">Assigned To</label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter assignee name"
                />
              </div>
              <button
                type="button"
                onClick={handleAssignToMe}
                style={{
                  background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Assign to Me
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
              <div className="form-field">
                <label className="form-label">Resolved By</label>
                <input
                  type="text"
                  name="resolvedBy"
                  value={formData.resolvedBy}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter resolver name"
                />
              </div>
              <button
                type="button"
                onClick={handleResolveAsMe}
                style={{
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap'
                }}
              >
                Resolve as Me
              </button>
            </div>

            <div className="form-field">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="Describe the issue or task"
                rows={4}
                style={{ resize: 'vertical', minHeight: '100px' }}
              />
            </div>

            {/* Timestamps info */}
            <div style={{ 
              background: 'rgba(17, 24, 39, 0.5)', 
              border: '1px solid rgba(107, 114, 128, 0.3)', 
              borderRadius: '8px', 
              padding: '16px' 
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                Ticket Information
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.875rem', color: '#9ca3af' }}>
                <div>Created: {new Date(ticket.createdAt).toLocaleString()}</div>
                <div>Updated: {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'Never'}</div>
                {ticket.resolvedAt && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    Resolved: {new Date(ticket.resolvedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(107, 114, 128, 0.5)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gradient-button"
                style={{ padding: '12px 24px' }}
              >
                Update Ticket
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTicketModal;