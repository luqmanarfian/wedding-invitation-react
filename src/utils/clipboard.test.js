import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard } from './clipboard';

describe('copyToClipboard', () => {
  let originalClipboard;
  let originalIsSecureContext;

  beforeEach(() => {
    originalClipboard = navigator.clipboard;
    originalIsSecureContext = window.isSecureContext;
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: originalIsSecureContext,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it('copies text using modern Clipboard API when available', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard('test text');
    expect(writeTextMock).toHaveBeenCalledWith('test text');
    expect(result).toBe(true);
  });

  it('falls back to execCommand when Clipboard API fails', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Not allowed'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true,
      configurable: true,
    });

    // Mock execCommand
    document.execCommand = vi.fn().mockReturnValue(true);

    const result = await copyToClipboard('fallback text');
    expect(result).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('uses legacy fallback when clipboard is not available', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    document.execCommand = vi.fn().mockReturnValue(true);

    const result = await copyToClipboard('legacy text');
    expect(result).toBe(true);
  });

  it('uses legacy fallback when context is not secure', async () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      writable: true,
      configurable: true,
    });

    document.execCommand = vi.fn().mockReturnValue(true);

    const result = await copyToClipboard('insecure text');
    expect(result).toBe(true);
  });

  it('returns false when legacy fallback also fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    document.execCommand = vi.fn().mockImplementation(() => {
      throw new Error('execCommand failed');
    });

    const result = await copyToClipboard('fail text');
    expect(result).toBe(false);
  });
});
