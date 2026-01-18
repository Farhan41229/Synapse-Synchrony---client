export function stripMarkdown(md = '') {
  let text = String(md);

  // Normalize line endings
  text = text.replace(/\r\n?/g, '\n');

  // Remove fenced code blocks ```...```
  text = text.replace(/```[\s\S]*?```/g, '');

  // Remove inline code `...`
  text = text.replace(/`([^`]+)`/g, '$1');

  // Images: ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1');

  // Links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

  // Remove blockquotes markers: > ...
  text = text.replace(/^\s*>\s?/gm, '');

  // Remove headings markers: # ## ### ...
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '');

  // Remove horizontal rules
  text = text.replace(/^\s*(-{3,}|_{3,}|\*{3,})\s*$/gm, '');

  // Remove list markers:
  // - item, * item, + item
  text = text.replace(/^\s*([-*+])\s+/gm, '');
  // 1. item, 2) item
  text = text.replace(/^\s*\d+([.)])\s+/gm, '');

  // Remove emphasis markers **bold**, *italic*, __bold__, _italic_
  // (Do this after links/code removal)
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');

  // Remove strikethrough ~~text~~
  text = text.replace(/~~(.*?)~~/g, '$1');

  // Remove remaining backslashes used for escaping markdown
  text = text.replace(/\\([\\`*_[\]()>#+\-.!~])/g, '$1');

  // Cleanup: collapse extra blank lines
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}
