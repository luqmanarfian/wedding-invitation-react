import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Couple from './Couple';

vi.mock('../data/content', () => ({
  COUPLE: {
    groom: {
      name: 'Groom Name',
      photo: '/images/groom.jpg',
      parents: 'Bapak A & Ibu B',
      role: 'Putra dari',
      socials: [{ platform: 'instagram', url: '#', icon: 'fab fa-instagram' }],
    },
    bride: {
      name: 'Bride Name',
      photo: '/images/bride.jpg',
      parents: 'Bapak C & Ibu D',
      role: 'Putri dari',
      socials: [{ platform: 'instagram', url: '#', icon: 'fab fa-instagram' }],
    },
  },
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null }),
}));

vi.mock('./CoupleCard', () => ({
  default: ({ name }) => <div data-testid="couple-card">{name}</div>,
}));

describe('Couple', () => {
  it('renders section title', () => {
    render(<Couple />);
    expect(screen.getByText('Mempelai')).toBeInTheDocument();
  });

  it('renders both couple cards', () => {
    render(<Couple />);
    expect(screen.getByText('Groom Name')).toBeInTheDocument();
    expect(screen.getByText('Bride Name')).toBeInTheDocument();
  });

  it('renders ampersand divider', () => {
    render(<Couple />);
    expect(screen.getByText('&')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Couple />);
    expect(screen.getByText(/Dengan memohon rahmat/)).toBeInTheDocument();
  });
});
