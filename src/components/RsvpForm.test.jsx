import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RsvpForm from './RsvpForm';
import { submitRSVPToSheet } from '../services/sheetsApi';

// Mock dependencies
const mockShowToast = vi.fn();
vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast })
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

  it('renders form title', () => {
    render(<RsvpForm {...defaultProps} />);
    expect(screen.getByText('Konfirmasi Kehadiran')).toBeInTheDocument();
  });

  it('renders label texts', () => {
    render(<RsvpForm {...defaultProps} />);
    expect(screen.getByText('Nama Lengkap')).toBeInTheDocument();
    expect(screen.getByText('Jumlah Kehadiran')).toBeInTheDocument();
    expect(screen.getByText('Konfirmasi')).toBeInTheDocument();
  });

  it('updates form fields correctly on change', () => {
    render(<RsvpForm {...defaultProps} />);

    const nameInput = screen.getByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    expect(nameInput.value).toBe('New Name');

    const countSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(countSelect, { target: { value: '2' } });
    expect(countSelect.value).toBe('2');

    const statusSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(statusSelect, { target: { value: 'Tidak Hadir' } });
    expect(statusSelect.value).toBe('Tidak Hadir');
  });

  it('submits form successfully and calls onRSVPSuccess for attending guests', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ result: 'success', qrCodeId: 'MOCK-QR-123' });
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

  it('shows success toast for attending guests', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ result: 'success', qrCodeId: 'MOCK-QR-123' });
    render(<RsvpForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining('Berhasil'),
        expect.any(String)
      );
    });
  });

  it('submits form for non-attending guests without QR Code callback', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ result: 'success' });
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

  it('shows "Terima Kasih" toast for non-attending guests', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ result: 'success' });
    render(<RsvpForm {...defaultProps} />);

    const statusSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(statusSelect, { target: { value: 'Tidak Hadir' } });
    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining('Terima Kasih'),
        expect.any(String)
      );
    });
  });

  it('displays error banner when API returns error', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({
      result: 'error',
      message: 'Server sedang sibuk'
    });
    render(<RsvpForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Server sedang sibuk')).toBeInTheDocument();
      expect(screen.getByText('RSVP Gagal Dikirim')).toBeInTheDocument();
    });
  });

  it('shows error toast when API returns error', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({
      result: 'error',
      message: 'Network error'
    });
    render(<RsvpForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        'Gagal Mengirim RSVP',
        'Network error',
        'error'
      );
    });
  });

  it('uses fallback error message when API error has no message', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ result: 'error' });
    render(<RsvpForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    await waitFor(() => {
      expect(screen.getByText(/Terjadi kesalahan/)).toBeInTheDocument();
    });
  });

  it('shows "Coba Lagi" button text after error', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ result: 'error', message: 'Fail' });
    render(<RsvpForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Coba Lagi/i })).toBeInTheDocument();
    });
  });

  it('does not crash when onRSVPSuccess is not provided', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ result: 'success', qrCodeId: 'QR-123' });
    render(<RsvpForm guestName="Solo" />);

    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    await waitFor(() => {
      expect(submitRSVPToSheet).toHaveBeenCalled();
    });
  });

  it('does not call onRSVPSuccess when Hadir but no qrCodeId', async () => {
    submitRSVPToSheet.mockResolvedValueOnce({ result: 'success', qrCodeId: null });
    render(<RsvpForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    await waitFor(() => {
      expect(defaultProps.onRSVPSuccess).not.toHaveBeenCalled();
    });
  });

  it('disables all inputs during loading', async () => {
    // Keep the promise pending to test loading state
    let resolvePromise;
    submitRSVPToSheet.mockReturnValue(new Promise((r) => { resolvePromise = r; }));
    render(<RsvpForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /Kirim RSVP/i }));

    // All inputs should be disabled
    expect(screen.getByRole('textbox')).toBeDisabled();
    screen.getAllByRole('combobox').forEach((select) => {
      expect(select).toBeDisabled();
    });

    // Resolve to clean up
    await act(async () => {
      resolvePromise({ result: 'success' });
    });
  });
});
