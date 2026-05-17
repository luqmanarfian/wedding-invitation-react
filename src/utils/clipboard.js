/**
 * Copies text to clipboard using the modern Clipboard API with
 * a fallback to the legacy execCommand method for older browsers.
 *
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - True if copy succeeded
 */
export async function copyToClipboard(text) {
  // Modern Clipboard API (requires HTTPS or localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy method
    }
  }

  // Legacy fallback: create a temporary textarea element
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch {
    return false;
  }
}
