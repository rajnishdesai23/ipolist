/**
 * Smart Blog Content Parser and Formatter
 * Converts Markdown, plain formatted text, and rich HTML into production-grade HTML
 * with beautiful typography, callouts, lists, and step badges.
 */

export function formatBlogContent(content: string = ""): string {
  if (!content || !content.trim()) {
    return "<p class='text-slate-400 italic'>No content available.</p>";
  }

  let text = content.trim();

  // If text already has full HTML wrapper tags (like <article>, <div> with classes, or structured HTML)
  // check if it's primarily HTML
  const isHtml = /<\s*(p|h1|h2|h3|h4|div|table|ul|ol|blockquote)\b[^>]*>/i.test(text);

  if (isHtml) {
    // If it's HTML, clean up any plain newline text that was pasted inside or around tags
    return text;
  }

  // Otherwise, treat as Markdown / Plain Formatted Text:
  // Step 1: Normalize line breaks
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Step 2: Markdown headers (use h2/h3/h4 in content body to preserve single semantic h1 for article title)
  text = text.replace(/^###\s+(.*?)$/gm, "<h3>$1</h3>");
  text = text.replace(/^##\s+(.*?)$/gm, "<h2>$1</h2>");
  text = text.replace(/^#\s+(.*?)$/gm, "<h2>$1</h2>");

  // Step 3: Bold & Italic
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  text = text.replace(/\*([^\*]+)\*/g, "<em>$1</em>");
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Step 4: Markdown Links [label](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Step 5: Detect numbered steps like "01 Login", "06 Approve the UPI Mandate"
  text = text.replace(
    /^(\d{2})\s+([A-Z].*?)$/gm,
    '<div class="step-card"><div class="flex items-center gap-2.5 mb-2"><span class="step-badge">$1</span><h3 class="!m-0 text-base font-normal sm:font-medium text-slate-900 dark:text-white">$2</h3></div>'
  );

  // Step 6: Detect Checkmarks / Status like "✓ Shares Allotted" or "↹ No Allotment"
  text = text.replace(
    /^✓\s+(.*?)$/gm,
    '<div class="my-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-semibold text-sm flex items-center gap-2"><span>✓</span><span>$1</span></div>'
  );
  text = text.replace(
    /^[↹✕×]\s+(.*?)$/gm,
    '<div class="my-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 font-semibold text-sm flex items-center gap-2"><span>✕</span><span>$1</span></div>'
  );

  // Step 7: Blockquotes
  text = text.replace(/^\>\s+(.*?)$/gm, "<blockquote>$1</blockquote>");

  // Step 8: Markdown lists (- item or * item)
  const lines = text.split("\n");
  let inList = false;
  let inOrderedList = false;
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Unordered list item
    if (/^[-*•]\s+(.*)$/.test(line)) {
      if (!inList) {
        if (inOrderedList) {
          processedLines.push("</ol>");
          inOrderedList = false;
        }
        processedLines.push("<ul>");
        inList = true;
      }
      processedLines.push(line.replace(/^[-*•]\s+(.*)$/, "<li>$1</li>"));
      continue;
    }

    // Numbered list item like "1. Something" (excluding 2-digit step cards already handled)
    if (/^\d+\.\s+(.*)$/.test(line)) {
      if (!inOrderedList) {
        if (inList) {
          processedLines.push("</ul>");
          inList = false;
        }
        processedLines.push("<ol>");
        inOrderedList = true;
      }
      processedLines.push(line.replace(/^\d+\.\s+(.*)$/, "<li>$1</li>"));
      continue;
    }

    // Not a list item
    if (inList) {
      processedLines.push("</ul>");
      inList = false;
    }
    if (inOrderedList) {
      processedLines.push("</ol>");
      inOrderedList = false;
    }

    processedLines.push(lines[i]);
  }

  if (inList) processedLines.push("</ul>");
  if (inOrderedList) processedLines.push("</ol>");

  text = processedLines.join("\n");

  // Step 9: Paragraph blocks (split on double newlines)
  const blocks = text.split(/\n\s*\n/);
  const formattedBlocks = blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    // If it's already an HTML block element (h1, h2, h3, ul, ol, blockquote, div, table), return as is
    if (/^<(h[1-6]|ul|ol|blockquote|div|table|p)\b/i.test(trimmed)) {
      return trimmed;
    }
    // Otherwise wrap in <p>, converting single newlines into <br/>
    const inner = trimmed.replace(/\n/g, "<br/>");
    return `<p>${inner}</p>`;
  });

  return formattedBlocks.filter(Boolean).join("\n\n");
}
