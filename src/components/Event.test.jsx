import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Event from './Event';

vi.mock('../data/content', () => ({
  EVENTS: [
    { id: 'akad', title: 'Akad Nikah', icon: 'fas fa-ring', date: 'Jumat, 12 Juni', time: '11:30', venue: 'Hotel', address: 'Jl. Test' },
    { id: 'resepsi', title: 'Resepsi', icon: 'fas fa-glass-cheers', date: 'Jumat, 12 Juni', time: '12:00', venue: 'Hotel', address: 'Jl. Test' },
  ],
  MAPS: {
    embedUrl: 'https://maps.google.com/embed',
    directionsUrl: 'https://maps.app.goo.gl/test',
  },
  HERO: { backgroundImage: '/images/hero-bg.jpg' },
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null }),
}));

vi.mock('./Countdown', () => ({
  default: () => <div data-testid="mock-countdown">Countdown</div>,
}));

vi.mock('./EventCard', () => ({
  default: ({ title, isFirst }) => <div data-testid="mock-event-card">{title} {isFirst ? '(first)' : ''}</div>,
}));

describe('Event', () => {
  it('renders section title', () => {
    render(<Event />);
    expect(screen.getByText('Jadwal Acara')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Event />);
    expect(screen.getByText(/Dengan hormat/)).toBeInTheDocument();
  });

  it('renders countdown component', () => {
    render(<Event />);
    expect(screen.getByTestId('mock-countdown')).toBeInTheDocument();
  });

  it('renders event cards for each event', () => {
    render(<Event />);
    const cards = screen.getAllByTestId('mock-event-card');
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent('Akad Nikah');
    expect(cards[0]).toHaveTextContent('(first)');
  });

  it('renders Google Maps embed', () => {
    render(<Event />);
    const iframe = screen.getByTitle('Lokasi Pernikahan');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', 'https://maps.google.com/embed');
  });

  it('renders Google Maps link', () => {
    render(<Event />);
    const link = screen.getByText('Buka Google Maps');
    expect(link).toHaveAttribute('href', 'https://maps.app.goo.gl/test');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
