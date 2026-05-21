import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateQRCodeId,
  submitRSVPToSheet,
  submitWishToSheet,
  fetchWishesFromSheet,
} from './sheetsApi';

// Mock content.js config — start with enabled config
vi.mock('../data/content', () => ({
  GOOGLE_SHEETS_CONFIG: {
    enabled: true,
    webAppUrl: 'https://script.google.com/test',
  },
}));

// Re-import so we can mutate the mock per test
import { GOOGLE_SHEETS_CONFIG } from '../data/content';

describe('generateQRCodeId', () => {
  it('returns a string matching WEDDING-<timestamp>-<4digit> format', () => {
    const id = generateQRCodeId();
    expect(id).toMatch(/^WEDDING-\d+-\d{4}$/);
  });

  it('generates unique IDs on consecutive calls', () => {
    const id1 = generateQRCodeId();
    const id2 = generateQRCodeId();
    expect(id1).not.toBe(id2);
  });
});

describe('submitRSVPToSheet', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    GOOGLE_SHEETS_CONFIG.enabled = true;
    GOOGLE_SHEETS_CONFIG.webAppUrl = 'https://script.google.com/test';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns error when name is empty string', async () => {
    const result = await submitRSVPToSheet({ name: '', count: '1', status: 'Hadir' });
    expect(result.result).toBe('error');
    expect(result.message).toContain('Nama');
  });

  it('returns error when name is whitespace only', async () => {
    const result = await submitRSVPToSheet({ name: '   ', count: '1', status: 'Hadir' });
    expect(result.result).toBe('error');
  });

  it('returns error when name is null (optional chaining)', async () => {
    const result = await submitRSVPToSheet({ name: null, count: '1', status: 'Hadir' });
    expect(result.result).toBe('error');
  });

  it('returns error when name is undefined (optional chaining)', async () => {
    const result = await submitRSVPToSheet({ name: undefined, count: '1', status: 'Hadir' });
    expect(result.result).toBe('error');
  });

  it('returns local result when config is disabled', async () => {
    GOOGLE_SHEETS_CONFIG.enabled = false;
    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Hadir' });
    expect(result.result).toBe('local');
    expect(result.qrCodeId).toMatch(/^WEDDING-/);
  });

  it('returns local result when webAppUrl is empty', async () => {
    GOOGLE_SHEETS_CONFIG.webAppUrl = '';
    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Hadir' });
    expect(result.result).toBe('local');
  });

  it('returns local result with null qrCodeId for non-attending guest', async () => {
    GOOGLE_SHEETS_CONFIG.enabled = false;
    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Tidak Hadir' });
    expect(result.result).toBe('local');
    expect(result.qrCodeId).toBeNull();
  });

  it('returns error when HTTP response is not ok', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Hadir' });
    expect(result.result).toBe('error');
    expect(result.message).toContain('500');
    expect(result.qrCodeId).toBeNull();
  });

  it('returns error when Apps Script result is not success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'error', message: 'Sheet full' }),
    });

    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Hadir' });
    expect(result.result).toBe('error');
    expect(result.message).toBe('Sheet full');
    expect(result.qrCodeId).toBeNull();
  });

  it('returns fallback error message when Apps Script error has no message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'failed', error: 'some error' }),
    });

    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Hadir' });
    expect(result.result).toBe('error');
    expect(result.message).toContain('gagal tersimpan');
  });

  it('returns success with server qrCodeId when present', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'success', qrCodeId: 'SERVER-QR-999' }),
    });

    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Hadir' });
    expect(result.result).toBe('success');
    expect(result.qrCodeId).toBe('SERVER-QR-999');
  });

  it('returns success with frontend-generated qrCodeId as fallback', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'success' }),
    });

    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Hadir' });
    expect(result.result).toBe('success');
    expect(result.qrCodeId).toMatch(/^WEDDING-/);
  });

  it('returns error on AbortError (timeout)', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    globalThis.fetch = vi.fn().mockRejectedValue(abortError);

    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Hadir' });
    expect(result.result).toBe('error');
    expect(result.message).toContain('timeout');
    expect(result.qrCodeId).toBeNull();
  });

  it('returns error on network failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    const result = await submitRSVPToSheet({ name: 'Test', count: '1', status: 'Hadir' });
    expect(result.result).toBe('error');
    expect(result.message).toContain('Gagal terhubung');
    expect(result.qrCodeId).toBeNull();
  });
});

describe('submitWishToSheet', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    GOOGLE_SHEETS_CONFIG.enabled = true;
    GOOGLE_SHEETS_CONFIG.webAppUrl = 'https://script.google.com/test';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns local result when config is disabled', async () => {
    GOOGLE_SHEETS_CONFIG.enabled = false;
    const result = await submitWishToSheet({ name: 'Test', text: 'Hello' });
    expect(result.result).toBe('local');
  });

  it('returns success on valid response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'success' }),
    });

    const result = await submitWishToSheet({ name: 'Test', text: 'Hello' });
    expect(result.result).toBe('success');
  });

  it('returns error on HTTP error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    const result = await submitWishToSheet({ name: 'Test', text: 'Hello' });
    expect(result.result).toBe('error');
    expect(result.message).toContain('503');
  });

  it('returns error when Apps Script result is not success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'error', message: 'Custom error' }),
    });

    const result = await submitWishToSheet({ name: 'Test', text: 'Hello' });
    expect(result.result).toBe('error');
    expect(result.message).toBe('Custom error');
  });

  it('returns fallback error message when no message in response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'failed' }),
    });

    const result = await submitWishToSheet({ name: 'Test', text: 'Hello' });
    expect(result.result).toBe('error');
    expect(result.message).toContain('Gagal menyimpan');
  });

  it('returns error on AbortError (timeout)', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    globalThis.fetch = vi.fn().mockRejectedValue(abortError);

    const result = await submitWishToSheet({ name: 'Test', text: 'Hello' });
    expect(result.result).toBe('error');
    expect(result.message).toContain('timeout');
  });

  it('returns error on network failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Network error'));

    const result = await submitWishToSheet({ name: 'Test', text: 'Hello' });
    expect(result.result).toBe('error');
    expect(result.message).toContain('Gagal mengirim');
  });
});

describe('fetchWishesFromSheet', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    GOOGLE_SHEETS_CONFIG.enabled = true;
    GOOGLE_SHEETS_CONFIG.webAppUrl = 'https://script.google.com/test';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns disabled result when config is disabled', async () => {
    GOOGLE_SHEETS_CONFIG.enabled = false;
    const result = await fetchWishesFromSheet();
    expect(result.result).toBe('disabled');
    expect(result.wishes).toEqual([]);
  });

  it('returns disabled result when webAppUrl is empty', async () => {
    GOOGLE_SHEETS_CONFIG.webAppUrl = '';
    const result = await fetchWishesFromSheet();
    expect(result.result).toBe('disabled');
  });

  it('returns success with wishes array', async () => {
    const mockWishes = [{ name: 'A', text: 'Hello' }];
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'success', wishes: mockWishes }),
    });

    const result = await fetchWishesFromSheet();
    expect(result.result).toBe('success');
    expect(result.wishes).toEqual(mockWishes);
  });

  it('returns error on HTTP error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await fetchWishesFromSheet();
    expect(result.result).toBe('error');
    expect(result.wishes).toEqual([]);
  });

  it('returns error when result is not success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'error' }),
    });

    const result = await fetchWishesFromSheet();
    expect(result.result).toBe('error');
    expect(result.wishes).toEqual([]);
  });

  it('returns error when wishes is not an array', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 'success', wishes: 'not-array' }),
    });

    const result = await fetchWishesFromSheet();
    expect(result.result).toBe('error');
    expect(result.wishes).toEqual([]);
  });

  it('returns error on network failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Network error'));

    const result = await fetchWishesFromSheet();
    expect(result.result).toBe('error');
    expect(result.wishes).toEqual([]);
  });
});
