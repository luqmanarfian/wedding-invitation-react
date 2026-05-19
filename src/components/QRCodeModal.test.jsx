import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import QRCodeModal from './QRCodeModal';

describe('QRCodeModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    qrCodeId: 'WEDDING-TEST-1234',
    guestName: 'John Doe',
    guestCount: 2,
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<QRCodeModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when qrCodeId is missing', () => {
    const { container } = render(<QRCodeModal {...defaultProps} qrCodeId={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correctly when open with valid props', () => {
    render(<QRCodeModal {...defaultProps} />);
    expect(screen.getByText('RSVP Berhasil!')).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/WEDDING-TEST-1234/i)).toBeInTheDocument();
  });

  it('calls onClose callback when the X button is clicked', () => {
    render(<QRCodeModal {...defaultProps} />);
    const closeIconBtn = screen.getByRole('button', { name: /tutup/i });
    fireEvent.click(closeIconBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose callback when the Tutup button is clicked', () => {
    render(<QRCodeModal {...defaultProps} />);
    const tutupBtn = screen.getByText('Tutup');
    fireEvent.click(tutupBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
