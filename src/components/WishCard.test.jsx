import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WishCard from './WishCard';

describe('WishCard', () => {
  it('renders sender name', () => {
    render(<WishCard name="Alice" text="Hello!" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('renders message text', () => {
    render(<WishCard name="Bob" text="Congratulations!" />);
    expect(screen.getByText('Congratulations!')).toBeInTheDocument();
  });

  it('preserves whitespace in message', () => {
    render(<WishCard name="Test" text={'Line 1\nLine 2'} />);
    const message = screen.getByText(/Line 1/);
    expect(message.className).toContain('whitespace-pre-line');
    expect(message.textContent).toBe('Line 1\nLine 2');
  });
});
