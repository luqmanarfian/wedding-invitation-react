import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OurStory from './OurStory';

vi.mock('../data/content', () => ({
  OUR_STORY: {
    paragraphs: ['First paragraph', 'Second paragraph'],
    quote: 'Test quote',
    closing: 'Closing text',
  },
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null }),
}));

describe('OurStory', () => {
  it('renders section title', () => {
    render(<OurStory />);
    expect(screen.getByText('Cerita Kami')).toBeInTheDocument();
  });

  it('renders all paragraphs', () => {
    render(<OurStory />);
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('renders quote', () => {
    render(<OurStory />);
    expect(screen.getByText('Test quote')).toBeInTheDocument();
  });

  it('renders closing text', () => {
    render(<OurStory />);
    expect(screen.getByText('Closing text')).toBeInTheDocument();
  });

  it('renders wave dividers', () => {
    const { container } = render(<OurStory />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(2); // top + bottom wave
  });
});
