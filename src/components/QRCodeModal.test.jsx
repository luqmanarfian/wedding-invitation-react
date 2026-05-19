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
    expect(screen.getAllByText(/John Doe/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/WEDDING-TEST-1234/i)).toBeInTheDocument();
  });

  it('calls onClose callback when the X button is clicked', () => {
    render(<QRCodeModal {...defaultProps} />);
    const closeIconBtn = screen.getAllByRole('button', { name: /tutup/i })[0];
    fireEvent.click(closeIconBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose callback when the Tutup button is clicked', () => {
    render(<QRCodeModal {...defaultProps} />);
    const tutupBtn = screen.getAllByRole('button', { name: /tutup/i })[1];
    fireEvent.click(tutupBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls handleDownload when Simpan QR is clicked', async () => {
    const originalSerialize = XMLSerializer.prototype.serializeToString;
    XMLSerializer.prototype.serializeToString = vi.fn().mockReturnValue('<svg></svg>');

    class MockImage {
      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 10);
      }
    }
    const originalImage = window.Image;
    window.Image = MockImage;

    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillRect: vi.fn(),
      drawImage: vi.fn(),
    });

    const clickMock = vi.fn();
    const origCreateElement = document.createElement;
    document.createElement = vi.fn((tagName) => {
      const el = origCreateElement.call(document, tagName);
      if (tagName === 'a') {
        el.click = clickMock;
      }
      return el;
    });

    render(<QRCodeModal {...defaultProps} />);
    const downloadBtn = screen.getByText('Simpan QR');
    fireEvent.click(downloadBtn);

    // Wait for the asynchronous onload of MockImage to fire
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(clickMock).toHaveBeenCalled();

    XMLSerializer.prototype.serializeToString = originalSerialize;
    window.Image = originalImage;
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    document.createElement = origCreateElement;
  });
});
