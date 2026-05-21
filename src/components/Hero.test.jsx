import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from './Hero';

vi.mock('../data/content', () => ({
  HERO: {
    backgroundImage: '/images/hero-bg.jpg',
    subtitle: 'KAMI AKAN MENIKAH',
    title: 'Test & Couple',
    date: '12 . 06 . 2026',
  },
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null }),
}));

describe('Hero', () => {
  it('renders subtitle text', () => {
    render(<Hero />);
    expect(screen.getByText('KAMI AKAN MENIKAH')).toBeInTheDocument();
  });

  it('renders couple title', () => {
    render(<Hero />);
    expect(screen.getByText('Test & Couple')).toBeInTheDocument();
  });

  it('renders wedding date', () => {
    render(<Hero />);
    expect(screen.getByText('12 . 06 . 2026')).toBeInTheDocument();
  });

  it('renders scroll indicator', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('.animate-bounce')).toBeInTheDocument();
  });
});
