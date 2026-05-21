import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders couple names', () => {
    render(<Footer />);
    expect(screen.getByText('Lancy & Kiyora')).toBeInTheDocument();
  });

  it('renders thank you message', () => {
    render(<Footer />);
    expect(screen.getByText(/Terima kasih/)).toBeInTheDocument();
  });

  it('renders copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/2026 Digital Wedding Invitation/)).toBeInTheDocument();
  });

  it('renders created with love text', () => {
    render(<Footer />);
    expect(screen.getByText(/Created with/)).toBeInTheDocument();
  });
});
