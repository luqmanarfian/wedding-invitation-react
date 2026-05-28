import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeGuestNameForStorage,
  decodeStoredGuestName,
  renderGuestNameSafely,
} from './guestNameUtils';

describe('normalizeGuestNameForStorage', () => {
  it('trims whitespace from input', () => {
    expect(normalizeGuestNameForStorage('  Lancy & Ruby  ')).toBe('Lancy & Ruby');
  });

  it('preserves special characters (no HTML escaping)', () => {
    expect(normalizeGuestNameForStorage('Lancy & Ruby')).toBe('Lancy & Ruby');
    expect(normalizeGuestNameForStorage('R&D Team')).toBe('R&D Team');
    expect(normalizeGuestNameForStorage('Tom <Jerry>')).toBe('Tom <Jerry>');
    expect(normalizeGuestNameForStorage('"Lancy" & \'Ruby\'')).toBe('"Lancy" & \'Ruby\'');
  });

  it('enforces max length', () => {
    const longName = 'A'.repeat(150);
    expect(normalizeGuestNameForStorage(longName)).toHaveLength(100);
  });

  it('uses custom max length when provided', () => {
    const longName = 'A'.repeat(50);
    expect(normalizeGuestNameForStorage(longName, 20)).toHaveLength(20);
  });

  it('returns empty string for null/undefined', () => {
    expect(normalizeGuestNameForStorage(null)).toBe('');
    expect(normalizeGuestNameForStorage(undefined)).toBe('');
  });

  it('converts non-string input to string', () => {
    expect(normalizeGuestNameForStorage(12345)).toBe('12345');
  });

  it('returns empty string for empty input', () => {
    expect(normalizeGuestNameForStorage('')).toBe('');
    expect(normalizeGuestNameForStorage('   ')).toBe('');
  });

  it('does not escape ampersand', () => {
    const result = normalizeGuestNameForStorage('A & B');
    expect(result).toBe('A & B');
    expect(result).not.toContain('&amp;');
  });

  it('does not escape angle brackets', () => {
    const result = normalizeGuestNameForStorage('A <B> C');
    expect(result).toBe('A <B> C');
    expect(result).not.toContain('&lt;');
    expect(result).not.toContain('&gt;');
  });

  it('does not escape quotes', () => {
    const result = normalizeGuestNameForStorage('"Hello" & \'World\'');
    expect(result).toBe('"Hello" & \'World\'');
    expect(result).not.toContain('&quot;');
    expect(result).not.toContain('&#x27;');
  });
});

describe('decodeStoredGuestName', () => {
  it('decodes HTML entities from legacy data', () => {
    expect(decodeStoredGuestName('Lancy &amp; Ruby')).toBe('Lancy & Ruby');
    expect(decodeStoredGuestName('Tom &lt;Jerry&gt;')).toBe('Tom <Jerry>');
    expect(decodeStoredGuestName('&quot;Lancy&quot; &amp; &#x27;Ruby&#x27;')).toBe('"Lancy" & \'Ruby\'');
  });

  it('passes through plain text unchanged', () => {
    expect(decodeStoredGuestName('Lancy & Ruby')).toBe('Lancy & Ruby');
    expect(decodeStoredGuestName('Normal Name')).toBe('Normal Name');
  });

  it('handles empty/null/undefined input', () => {
    expect(decodeStoredGuestName('')).toBe('');
    expect(decodeStoredGuestName(null)).toBe('');
    expect(decodeStoredGuestName(undefined)).toBe('');
  });

  it('handles numeric entities', () => {
    expect(decodeStoredGuestName('A &#38; B')).toBe('A & B');
  });

  it('does not execute script tags during decode', () => {
    const malicious = '&lt;script&gt;alert("xss")&lt;/script&gt;';
    const result = decodeStoredGuestName(malicious);
    // DOMParser decodes the entities but textContent extracts only text
    expect(result).toBe('<script>alert("xss")</script>');
    // The string is just text — it would only be dangerous if inserted via innerHTML
  });

  it('handles non-string input gracefully', () => {
    expect(decodeStoredGuestName(12345)).toBe(12345);
  });
});

describe('renderGuestNameSafely', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('span');
  });

  it('sets textContent on the element', () => {
    renderGuestNameSafely(element, 'Lancy & Ruby');
    expect(element.textContent).toBe('Lancy & Ruby');
  });

  it('does not interpret HTML in the value', () => {
    renderGuestNameSafely(element, '<script>alert("xss")</script>');
    expect(element.textContent).toBe('<script>alert("xss")</script>');
    expect(element.innerHTML).not.toContain('<script>');
    // textContent escapes HTML automatically
    expect(element.innerHTML).toContain('&lt;script&gt;');
  });

  it('handles null element gracefully', () => {
    expect(() => renderGuestNameSafely(null, 'Test')).not.toThrow();
  });

  it('handles empty value', () => {
    renderGuestNameSafely(element, '');
    expect(element.textContent).toBe('');
  });

  it('handles null value', () => {
    renderGuestNameSafely(element, null);
    expect(element.textContent).toBe('');
  });

  it('renders special characters as visible text', () => {
    renderGuestNameSafely(element, '"Hello" & <World>');
    expect(element.textContent).toBe('"Hello" & <World>');
  });
});
