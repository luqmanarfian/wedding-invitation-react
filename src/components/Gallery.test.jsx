import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Gallery from './Gallery';

vi.mock('../data/content', () => ({
  GALLERY_IMAGES: [
    { src: '/images/g1.jpg', alt: 'Photo 1' },
    { src: '/images/g2.jpg', alt: 'Photo 2', wide: true },
  ],
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null }),
}));

vi.mock('./Lightbox', () => ({
  default: ({ isOpen, src, onClose }) => isOpen
    ? <div data-testid="mock-lightbox"><span>{src}</span><button onClick={onClose}>Close</button></div>
    : null,
}));

describe('Gallery', () => {
  it('renders section title', () => {
    render(<Gallery />);
    expect(screen.getByText('Galeri Momen')).toBeInTheDocument();
  });

  it('renders gallery images', () => {
    render(<Gallery />);
    expect(screen.getByAltText('Photo 1')).toBeInTheDocument();
    expect(screen.getByAltText('Photo 2')).toBeInTheDocument();
  });

  it('applies wide class to wide images', () => {
    render(<Gallery />);
    const wideImg = screen.getByAltText('Photo 2').closest('div');
    expect(wideImg.className).toContain('md:col-span-2');
  });

  it('opens lightbox when image is clicked', () => {
    render(<Gallery />);
    fireEvent.click(screen.getByAltText('Photo 1'));
    expect(screen.getByTestId('mock-lightbox')).toBeInTheDocument();
    expect(screen.getByText('/images/g1.jpg')).toBeInTheDocument();
  });

  it('closes lightbox when close is triggered', () => {
    render(<Gallery />);
    fireEvent.click(screen.getByAltText('Photo 1'));
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('mock-lightbox')).not.toBeInTheDocument();
  });
});
