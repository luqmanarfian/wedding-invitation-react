import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WishForm from './WishForm';
import { submitWishToSheet } from '../services/sheetsApi';

const mockShowToast = vi.fn();
vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

vi.mock('../services/sheetsApi', () => ({
  submitWishToSheet: vi.fn(),
}));

describe('WishForm', () => {
  const defaultProps = {
    guestName: 'Alice',
    onNewWish: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    submitWishToSheet.mockResolvedValue({ result: 'success' });
  });

  it('renders name input prefilled with guest name', () => {
    render(<WishForm {...defaultProps} />);
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
  });

  it('renders textarea placeholder', () => {
    render(<WishForm {...defaultProps} />);
    expect(screen.getByPlaceholderText('Tuliskan doa & ucapan...')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<WishForm {...defaultProps} />);
    expect(screen.getByText('Kirim')).toBeInTheDocument();
  });

  it('updates name input on change', () => {
    render(<WishForm {...defaultProps} />);
    const input = screen.getByDisplayValue('Alice');
    fireEvent.change(input, { target: { value: 'Bob' } });
    expect(input.value).toBe('Bob');
  });

  it('updates textarea on change', () => {
    render(<WishForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText('Tuliskan doa & ucapan...');
    fireEvent.change(textarea, { target: { value: 'Selamat!' } });
    expect(textarea.value).toBe('Selamat!');
  });

  it('submits wish and calls onNewWish', async () => {
    render(<WishForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText('Tuliskan doa & ucapan...');
    fireEvent.change(textarea, { target: { value: 'Congrats!' } });

    fireEvent.click(screen.getByText('Kirim'));

    await waitFor(() => {
      expect(submitWishToSheet).toHaveBeenCalledWith({ name: 'Alice', text: 'Congrats!' });
      expect(defaultProps.onNewWish).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Alice', text: 'Congrats!' })
      );
      expect(mockShowToast).toHaveBeenCalledWith('Berhasil', expect.any(String));
    });
  });

  it('clears textarea after successful submit', async () => {
    render(<WishForm {...defaultProps} />);

    const textarea = screen.getByPlaceholderText('Tuliskan doa & ucapan...');
    fireEvent.change(textarea, { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByText('Kirim'));

    await waitFor(() => {
      expect(textarea.value).toBe('');
    });
  });

  it('does not submit when text is empty', async () => {
    render(<WishForm {...defaultProps} />);
    fireEvent.click(screen.getByText('Kirim'));

    // submitWishToSheet should NOT have been called
    expect(submitWishToSheet).not.toHaveBeenCalled();
  });

  it('does not submit when text is whitespace only', async () => {
    render(<WishForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText('Tuliskan doa & ucapan...');
    fireEvent.change(textarea, { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Kirim'));

    expect(submitWishToSheet).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    let resolvePromise;
    submitWishToSheet.mockReturnValue(new Promise((r) => { resolvePromise = r; }));

    render(<WishForm {...defaultProps} />);
    const textarea = screen.getByPlaceholderText('Tuliskan doa & ucapan...');
    fireEvent.change(textarea, { target: { value: 'Test' } });

    fireEvent.click(screen.getByText('Kirim'));

    expect(screen.getByText('Mengirim...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mengirim/i })).toBeDisabled();

    resolvePromise({ result: 'success' });
  });
});
