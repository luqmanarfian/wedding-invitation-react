import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RSVPForm from './RSVPForm';
import { submitRSVPToSheet } from '../services/sheetsApi';

// Mock dependencies
vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() })
}));

vi.mock('../services/sheetsApi', () => ({
  submitRSVPToSheet: vi.fn()
}));

describe('RSVPForm Component', () => {
  const defaultProps = {
    guestName: 'Jane Doe',
    onRSVPSuccess: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly with prefilled guest name', () => {
    render(<RSVPForm {...defaultProps} />);
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kirim RSVP/i })).toBeInTheDocument();
  });

  it('submits form successfully and calls onRSVPSuccess for attending guests', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ qrCodeId: 'MOCK-QR-123' });
    render(<RSVPForm {...defaultProps} />);
    
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
    render(<RSVPForm {...defaultProps} />);
    
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
