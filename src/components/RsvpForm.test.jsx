import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RsvpForm from './RsvpForm';
import { submitRSVPToSheet } from '../services/sheetsApi';

// Mock dependencies
vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() })
}));

vi.mock('../services/sheetsApi', () => ({
  submitRSVPToSheet: vi.fn()
}));

describe('RsvpForm Component', () => {
  const defaultProps = {
    guestName: 'Jane Doe',
    onRSVPSuccess: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly with prefilled guest name', () => {
    render(<RsvpForm {...defaultProps} />);
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kirim RSVP/i })).toBeInTheDocument();
  });

  it('updates form fields correctly on change', () => {
    render(<RsvpForm {...defaultProps} />);
    
    const nameInput = screen.getByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput.value).toBe('New Name');

    const countSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(countSelect, { target: { value: '2' } });
    expect(countSelect.value).toBe('2');
  });

  it('submits form successfully and calls onRSVPSuccess for attending guests', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ qrCodeId: 'MOCK-QR-123' });
    render(<RsvpForm {...defaultProps} />);
    
    const submitBtn = screen.getByRole('button', { name: /Kirim RSVP/i });
    fireEvent.click(submitBtn);

    // Should disable button while loading
    expect(submitBtn).toBeDisabled();
    
    await waitFor(() => {
      expect(submitRSVPToSheet).toHaveBeenCalledWith({
        name: 'Jane Doe',
        count: '1',
        status: 'Hadir'
      });
      expect(defaultProps.onRSVPSuccess).toHaveBeenCalledWith({
        qrCodeId: 'MOCK-QR-123',
        guestName: 'Jane Doe',
        guestCount: '1'
      });
    });
  });

  it('submits form for non-attending guests without invoking QR Code callback', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({});
    render(<RsvpForm {...defaultProps} />);
    
    // Select "Tidak Hadir"
    const statusSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(statusSelect, { target: { value: 'Tidak Hadir' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    await waitFor(() => {
      expect(submitRSVPToSheet).toHaveBeenCalledWith({
        name: 'Jane Doe',
        count: '1',
        status: 'Tidak Hadir'
      });
      // Modal trigger should not be called
      expect(defaultProps.onRSVPSuccess).not.toHaveBeenCalled();
    });
  });
});
