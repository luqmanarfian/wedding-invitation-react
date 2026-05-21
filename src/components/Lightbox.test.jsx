import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Lightbox from './Lightbox';

describe('Lightbox', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Lightbox src="/test.jpg" isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders image when isOpen is true', () => {
    render(<Lightbox src="/test.jpg" isOpen={true} onClose={vi.fn()} />);
    const img = screen.getByAltText('Gallery preview');
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/test.jpg');
  });

  it('renders close button (×)', () => {
    render(<Lightbox src="/test.jpg" isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('×')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<Lightbox src="/test.jpg" isOpen={true} onClose={onClose} />);

    // Click the overlay (the outermost div)
    fireEvent.click(screen.getByAltText('Gallery preview').parentElement);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when image itself is clicked', () => {
    const onClose = vi.fn();
    render(<Lightbox src="/test.jpg" isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByAltText('Gallery preview'));
    // onClose should NOT be called because stopPropagation is used
    expect(onClose).not.toHaveBeenCalled();
  });
});
