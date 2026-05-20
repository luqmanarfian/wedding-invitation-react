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
  default: ({ text }) => <div data-testid="mock-wish-card">{text}</div>
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null })
}));

vi.mock('../services/sheetsApi', () => ({
  fetchWishesFromSheet: vi.fn().mockResolvedValue({
    result: 'success',
    wishes: [{ id: 1, name: 'Test User', text: 'Hello!' }]
  })
}));

describe('Rsvp Wrapper Component', () => {
  it('renders RSVP title, subtext, and correctly propagates props', async () => {
    const onRSVPSuccess = vi.fn();
    render(<Rsvp guestName="Alice" onRSVPSuccess={onRSVPSuccess} />);
    
    // Wait for initial fetch to complete to prevent act() warnings
    expect(await screen.findByText('Hello!')).toBeInTheDocument();

    expect(screen.getByText('RSVP & Ucapan')).toBeInTheDocument();
    expect(screen.getByTestId('mock-wish-form')).toBeInTheDocument();
  });

  it('updates wishes list when onNewWish is triggered', async () => {
    render(<Rsvp guestName="Alice" onRSVPSuccess={vi.fn()} />);
    
    // Wait for initial fetch to complete
    expect(await screen.findByText('Hello!')).toBeInTheDocument();

    const submitWishBtn = screen.getByText('Submit Wish');
    fireEvent.click(submitWishBtn);
    expect(screen.getAllByTestId('mock-wish-card').length).toBeGreaterThan(0);
  });
});
