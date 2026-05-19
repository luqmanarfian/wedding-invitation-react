import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RSVP from './RSVP';

// Mock internal components to isolate structural render testing
vi.mock('./RSVPForm', () => ({
  default: ({ guestName }) => <div data-testid="mock-rsvp-form">{guestName}</div>
}));

vi.mock('./WishForm', () => ({
  default: () => <div data-testid="mock-wish-form" />
}));

vi.mock('./WishCard', () => ({
  default: () => <div data-testid="mock-wish-card" />
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null })
}));

describe('RSVP Wrapper Component', () => {
  it('renders RSVP title, subtext, and correctly propagates props', () => {
    const onRSVPSuccess = vi.fn();
    render(<RSVP guestName="Alice" onRSVPSuccess={onRSVPSuccess} />);
    
    expect(screen.getByText('RSVP & Ucapan')).toBeInTheDocument();
    expect(screen.getByTestId('mock-rsvp-form')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByTestId('mock-wish-form')).toBeInTheDocument();
  });
});
