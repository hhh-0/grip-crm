import React, { useState, useRef } from 'react';
import '../../styles/dark-theme.css';

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}

const ImportCSVModal: React.FC<ImportCSVModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setSelectedFile(file);
    } else {
      alert('Please select a CSV file');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

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
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
            Import CSV File
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
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: '#d1d5db', marginBottom: '16px', fontSize: '0.875rem' }}>
              Upload a CSV file with customer data. Expected columns: name, email, phone, company, address
            </p>
            
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? '#60a5fa' : 'rgba(75, 85, 99, 0.5)'}`,
                borderRadius: '12px',
                padding: '48px 24px',
                textAlign: 'center',
                background: dragActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(17, 24, 39, 0.5)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
              
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(45deg, #10b981, #059669)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              
              {selectedFile ? (
                <div>
                  <p style={{ color: '#10b981', fontWeight: '600', marginBottom: '4px' }}>
                    {selectedFile.name}
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>
                    Drop your CSV file here, or click to browse
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    Supports CSV files up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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
              disabled={!selectedFile}
              style={{
                background: selectedFile ? 'linear-gradient(45deg, #10b981, #059669)' : 'rgba(107, 114, 128, 0.5)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: selectedFile ? 'pointer' : 'not-allowed',
                fontWeight: '500',
                opacity: selectedFile ? 1 : 0.5
              }}
            >
              Import CSV
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportCSVModal;