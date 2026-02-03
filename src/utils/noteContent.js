/**
 * Convert plain text (e.g. from AI or OCR) to HTML for Tiptap editor.
 * Paragraphs are split by double newlines; single newlines become <br/>.
 * @param {string} text - Plain text
 * @returns {string} - HTML string
 */
export const plainTextToHtml = (text) => {
  if (!text || !text.trim()) return '<p></p>';
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  if (paragraphs.length === 0) return '<p></p>';
  const html = paragraphs
    .map((p) => '<p>' + p.replace(/\n/g, '<br/>') + '</p>')
    .join('');
  return html;
};
