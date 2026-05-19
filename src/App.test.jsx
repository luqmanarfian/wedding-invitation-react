import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock contexts and hooks
vi.mock('./hooks/useGuestName', () => ({ useGuestName: () => 'Guest User' }));
vi.mock('./context/MusicContext', () => ({
  useMusic: () => ({ play: vi.fn() })
}));

// Mock section components
vi.mock('./components/CoverScreen', () => ({
  default: ({ onOpen }) => <button onClick={onOpen}>Buka Undangan</button>
}));
vi.mock('./components/Hero', () => ({ default: () => <div /> }));
vi.mock('./components/Quote', () => ({ default: () => <div /> }));
vi.mock('./components/Couple', () => ({ default: () => <div /> }));
vi.mock('./components/OurStory', () => ({ default: () => <div /> }));
vi.mock('./components/Event', () => ({ default: () => <div /> }));
vi.mock('./components/Gallery', () => ({ default: () => <div /> }));
vi.mock('./components/WeddingGift', () => ({ default: () => <div /> }));
vi.mock('./components/Footer', () => ({ default: () => <div /> }));
vi.mock('./components/MusicButton', () => ({ default: () => <div /> }));

vi.mock('./components/QRCodeModal', () => ({
  default: ({ isOpen, guestName }) => isOpen ? <div data-testid="mock-modal">{guestName}</div> : null
}));

vi.mock('./components/Rsvp', () => ({
  default: ({ onRSVPSuccess }) => (
    <button onClick={() => onRSVPSuccess({ qrCodeId: '123', guestName: 'Guest User', guestCount: '2' })}>
      Simulate RSVP Success
    </button>
  )
}));

describe('App Root Component', () => {
  it('handles cover screen open invitation workflow', () => {
    render(<App />);
    const openBtn = screen.getByText('Buka Undangan');
    fireEvent.click(openBtn);
    expect(document.body.classList.contains('overflow-hidden')).toBe(false);
  });

  it('displays the QR code modal correctly when an RSVP success event is triggered', () => {
    render(<App />);
    const successBtn = screen.getByText('Simulate RSVP Success');
    fireEvent.click(successBtn);
    
    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByText('Guest User')).toBeInTheDocument();
  });
});
