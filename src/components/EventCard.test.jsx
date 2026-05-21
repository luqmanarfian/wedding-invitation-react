import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EventCard from './EventCard';

const defaultProps = {
  title: 'Akad Nikah',
  icon: 'fas fa-ring',
  date: 'Jumat, 12 Juni 2026',
  time: 'Pukul 11:30 WIB',
  venue: 'Bogor Valley Hotel',
  address: 'Jl. Test Address',
};

describe('EventCard', () => {
  it('renders title', () => {
    render(<EventCard {...defaultProps} />);
    expect(screen.getByText('Akad Nikah')).toBeInTheDocument();
  });

  it('renders date and time', () => {
    render(<EventCard {...defaultProps} />);
    expect(screen.getByText('Jumat, 12 Juni 2026')).toBeInTheDocument();
    expect(screen.getByText('Pukul 11:30 WIB')).toBeInTheDocument();
  });

  it('renders venue and address', () => {
    render(<EventCard {...defaultProps} />);
    expect(screen.getByText('Bogor Valley Hotel')).toBeInTheDocument();
    expect(screen.getByText('Jl. Test Address')).toBeInTheDocument();
  });

  it('renders with right-side corner when isFirst is true (default)', () => {
    const { container } = render(<EventCard {...defaultProps} />);
    const corner = container.querySelector('.rounded-bl-full');
    expect(corner).toBeInTheDocument();
  });

  it('renders with left-side corner when isFirst is false', () => {
    const { container } = render(<EventCard {...defaultProps} isFirst={false} />);
    const corner = container.querySelector('.rounded-br-full');
    expect(corner).toBeInTheDocument();
  });

  it('renders icon', () => {
    const { container } = render(<EventCard {...defaultProps} />);
    expect(container.querySelector('.fa-ring')).toBeInTheDocument();
  });
});
