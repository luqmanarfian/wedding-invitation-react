import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Countdown from './Countdown';

vi.mock('../hooks/useCountdown', () => ({
  useCountdown: () => ({ days: '02', hours: '11', minutes: '30', seconds: '05' }),
}));

vi.mock('../data/content', () => ({
  WEDDING_DATE: '2026-06-12T11:30:00',
}));

describe('Countdown', () => {
  it('renders all time units', () => {
    render(<Countdown />);
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('renders unit labels', () => {
    render(<Countdown />);
    expect(screen.getByText('Hari')).toBeInTheDocument();
    expect(screen.getByText('Jam')).toBeInTheDocument();
    expect(screen.getByText('Menit')).toBeInTheDocument();
    expect(screen.getByText('Detik')).toBeInTheDocument();
  });

  it('accepts custom targetDate prop', () => {
    render(<Countdown targetDate="2027-01-01T00:00:00" />);
    // Still renders because hook is mocked
    expect(screen.getByText('Hari')).toBeInTheDocument();
  });
});
