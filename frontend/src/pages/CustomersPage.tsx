import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addCustomer, deleteCustomer, Customer } from '../store/dataSlice';
import '../styles/dark-theme.css';
import AddCustomerModal from '../components/modals/AddCustomerModal';
import ImportCSVModal from '../components/modals/ImportCSVModal';

const CustomersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const customers = useSelector((state: RootState) => state.data.customers);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    // Simulate loading
    setLoading(false);
  }, []);

  const handleAddCustomer = (customerData: any) => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      ...customerData,
      createdAt: new Date().toISOString()
    };
    dispatch(addCustomer(newCustomer));
    console.log('Customer added:', newCustomer);
  };

  const handleImportCSV = (file: File) => {
    console.log('Importing CSV file:', file.name);
    // TODO: Implement CSV parsing and import logic
    alert(`CSV file "${file.name}" uploaded successfully! (Import functionality will be implemented soon)`);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(customerId));
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
                <Link to="/customers" className="nav-link active">Customers</Link>
                <Link to="/tickets" className="nav-link">Tickets</Link>
                <Link to="/command-center" className="nav-link">Command Center</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="page-container">
        <div className="page-header">
          <h1 className="page-title">Customer Database</h1>
          <p className="page-subtitle">Manage your customer relationships with intelligent tools</p>
        </div>

        <div className="dark-card">
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Customer List</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="gradient-button"
                  style={{
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 24px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  onClick={() => setShowImportModal(true)}
                >
                  Import CSV
                </button>
                <button 
                  className="gradient-button"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Customer
                </button>
              </div>
            </div>
          </div>
          
          <div className="card-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <div className="spinner"></div>
                </div>
                <div style={{ color: '#9ca3af', fontSize: '1.125rem' }}>Loading customers...</div>
              </div>
            ) : customers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{
                  width: '96px',
                  height: '96px',
                  background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <svg style={{ width: '48px', height: '48px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
                  No customers yet
                </h3>
                <p style={{ color: '#9ca3af', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                  Start building your customer database by adding your first customer or importing from CSV
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                  <button 
                    className="gradient-button" 
                    style={{ padding: '12px 32px' }}
                    onClick={() => setShowAddModal(true)}
                  >
                    Add Customer
                  </button>
                  <button 
                    className="gradient-button"
                    style={{
                      background: 'linear-gradient(45deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 32px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={() => setShowImportModal(true)}
                  >
                    Import CSV
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(75, 85, 99, 0.5)' }}>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Name
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Email
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Company
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#d1d5db', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} style={{ borderBottom: '1px solid rgba(75, 85, 99, 0.3)' }}>
                        <td style={{ padding: '16px 24px', color: 'white', fontWeight: '500' }}>
                          {customer.name}
                        </td>
                        <td style={{ padding: '16px 24px', color: '#d1d5db' }}>
                          {customer.email || '-'}
                        </td>
                        <td style={{ padding: '16px 24px', color: '#d1d5db' }}>
                          {customer.company || '-'}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '0.875rem', fontWeight: '500' }}>
                          <button 
                            style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px' }}
                            onClick={() => console.log('Edit customer:', customer.id)}
                          >
                            Edit
                          </button>
                          <button 
                            style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            Delete
                          </button>
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
        <AddCustomerModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddCustomer}
        />
        <ImportCSVModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onSubmit={handleImportCSV}
        />
      </main>
    </div>
  );
};

export default CustomersPage;