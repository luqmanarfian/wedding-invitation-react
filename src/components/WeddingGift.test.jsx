import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WeddingGift from './WeddingGift';
import { copyToClipboard } from '../utils/clipboard';

const mockShowToast = vi.fn();
vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null }),
}));

vi.mock('../data/content', () => ({
  GIFT: {
    bankName: 'Bank BCA',
    accountNumber: '1234567890',
    accountHolder: 'Test Person',
  },
}));

vi.mock('../utils/clipboard', () => ({
  copyToClipboard: vi.fn(),
}));

describe('WeddingGift', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section title', () => {
    render(<WeddingGift />);
    expect(screen.getByText('Wedding Gift')).toBeInTheDocument();
  });

  it('renders bank info', () => {
    render(<WeddingGift />);
    expect(screen.getByText('Bank BCA')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('a.n Test Person')).toBeInTheDocument();
  });

  it('copies account number on button click (success)', async () => {
    copyToClipboard.mockResolvedValueOnce(true);
    render(<WeddingGift />);

    fireEvent.click(screen.getByText('Salin No. Rekening'));

    await vi.waitFor(() => {
      expect(copyToClipboard).toHaveBeenCalledWith('1234567890');
      expect(mockShowToast).toHaveBeenCalledWith('Tersalin!', expect.any(String));
    });
  });

  it('shows error toast when copy fails', async () => {
    copyToClipboard.mockResolvedValueOnce(false);
    render(<WeddingGift />);

    fireEvent.click(screen.getByText('Salin No. Rekening'));

    await vi.waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Gagal', expect.any(String));
    });
  });

  it('renders description text', () => {
    render(<WeddingGift />);
    expect(screen.getByText(/Doa restu Anda/)).toBeInTheDocument();
  });
});
