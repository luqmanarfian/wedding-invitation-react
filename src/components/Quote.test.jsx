import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Quote from './Quote';

vi.mock('../data/content', () => ({
  QUOTE: {
    text: 'Test quote text',
    source: '(QS. Test: 1)',
  },
}));

vi.mock('../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ current: null }),
}));

describe('Quote', () => {
  it('renders quote text', () => {
    render(<Quote />);
    expect(screen.getByText('Test quote text')).toBeInTheDocument();
  });

  it('renders quote source', () => {
    render(<Quote />);
    expect(screen.getByText('(QS. Test: 1)')).toBeInTheDocument();
  });

  it('renders quote icon', () => {
    const { container } = render(<Quote />);
    expect(container.querySelector('.fa-quote-left')).toBeInTheDocument();
  });
});
