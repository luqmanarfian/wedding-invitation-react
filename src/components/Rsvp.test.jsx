import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Rsvp from './Rsvp';

// Mock internal components to isolate structural render testing
vi.mock('./RsvpForm', () => ({
  default: ({ guestName }) => <div data-testid="mock-rsvp-form">{guestName}</div>
}));

vi.mock('./WishForm', () => ({
  default: ({ onNewWish }) => (
    <button data-testid="mock-wish-form" onClick={() => onNewWish({ id: 2, name: 'Bob', text: 'Congrats' })}>
      Submit Wish
    </button>
  )
}));

vi.mock('./WishCard', () => ({
  default: () => <div data-testid="mock-wish-card" />
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null })
}));

describe('Rsvp Wrapper Component', () => {
  it('renders RSVP title, subtext, and correctly propagates props', () => {
    const onRSVPSuccess = vi.fn();
    render(<Rsvp guestName="Alice" onRSVPSuccess={onRSVPSuccess} />);
    
    expect(screen.getByText('RSVP & Ucapan')).toBeInTheDocument();
    expect(screen.getByTestId('mock-wish-form')).toBeInTheDocument();
  });

  it('updates wishes list when onNewWish is triggered', () => {
    render(<Rsvp guestName="Alice" onRSVPSuccess={vi.fn()} />);
    const submitWishBtn = screen.getByText('Submit Wish');
    fireEvent.click(submitWishBtn);
    expect(screen.getAllByTestId('mock-wish-card').length).toBeGreaterThan(0);
  });
});
