import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CoupleCard from './CoupleCard';

const defaultProps = {
  name: 'Test Person',
  photo: '/images/test.jpg',
  role: 'Putra dari',
  parents: 'Bapak Test & Ibu Test',
  socials: [
    { platform: 'instagram', url: 'https://instagram.com/test', icon: 'fab fa-instagram' },
    { platform: 'twitter', url: 'https://twitter.com/test', icon: 'fab fa-twitter' },
  ],
};

describe('CoupleCard', () => {
  it('renders name', () => {
    render(<CoupleCard {...defaultProps} />);
    expect(screen.getByText('Test Person')).toBeInTheDocument();
  });

  it('renders photo with alt text', () => {
    render(<CoupleCard {...defaultProps} />);
    const img = screen.getByAltText('Test Person');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/images/test.jpg');
  });

  it('renders role and parents', () => {
    render(<CoupleCard {...defaultProps} />);
    expect(screen.getByText(/Putra dari/)).toBeInTheDocument();
    expect(screen.getByText(/Bapak Test & Ibu Test/)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<CoupleCard {...defaultProps} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://instagram.com/test');
    expect(links[0]).toHaveAttribute('target', '_blank');
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
