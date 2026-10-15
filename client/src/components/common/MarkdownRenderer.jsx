import React from "react";

/**
 * Rich Markdown Renderer for NovaMind AI
 * Transforms raw markdown (headers, bold, lists, quotes, tables, code)
 * into rich, styled glassmorphic UI elements.
 */

export const parseInlineFormatting = (text) => {
  if (!text) return "";

  // Split by inline code, bold, italic
  const parts = [];
  let remaining = text;

  // Regex to match **bold**, `code`, *italic*, and standard text
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let match;
  let lastIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    // Push preceding normal text
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="text-white font-bold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-[#222232] text-purple-300 font-mono text-xs border border-purple-500/20"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="text-gray-300 italic">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Horizontal Rule: --- or ***
    if (trimmed === "---" || trimmed === "***") {
      elements.push(
        <hr key={`hr-${i}`} className="my-5 border-t border-[#2D2D38]" />
      );
      i++;
      continue;
    }

    // 2. Headings (#, ##, ###, ####)
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={`h1-${i}`}
          className="text-2xl font-extrabold text-white tracking-tight mt-6 mb-3 pb-2 border-b border-purple-500/30 flex items-center gap-2"
        >
          {parseInlineFormatting(line.replace("# ", ""))}
        </h1>
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-lg font-bold text-purple-300 tracking-tight mt-6 mb-2.5 flex items-center gap-2"
        >
          {parseInlineFormatting(line.replace("## ", ""))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${i}`}
          className="text-base font-semibold text-white mt-4 mb-2"
        >
          {parseInlineFormatting(line.replace("### ", ""))}
        </h3>
      );
      i++;
      continue;
    }

    // 3. Markdown Tables: starts with | and contains |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        // Parse header
        const headerCells = tableLines[0]
          .split("|")
          .map((c) => c.trim())
          .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);

        // Rows start after separator line (| --- | --- |)
        const rowLines = tableLines.slice(2);

        elements.push(
          <div key={`table-${i}`} className="my-5 overflow-x-auto rounded-2xl border border-[#2D2D38] shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#181826] border-b border-[#2D2D38]">
                  {headerCells.map((header, hIdx) => (
                    <th
                      key={hIdx}
                      className="px-4 py-3 font-bold text-purple-300 uppercase tracking-wider"
                    >
                      {parseInlineFormatting(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232332] bg-[#101018]/60">
                {rowLines.map((rowStr, rIdx) => {
                  const cells = rowStr
                    .split("|")
                    .map((c) => c.trim())
                    .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);

                  return (
                    <tr
                      key={rIdx}
                      className="hover:bg-purple-900/10 transition-colors"
                    >
                      {cells.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-4 py-3 text-gray-300 leading-relaxed"
                        >
                          {parseInlineFormatting(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    // 4. Blockquotes: > quote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-purple-500 pl-4 py-2 my-3 rounded-r-xl bg-[#171724]/70 italic text-gray-300 text-xs sm:text-sm"
        >
          {parseInlineFormatting(line.replace("> ", ""))}
        </blockquote>
      );
      i++;
      continue;
    }

    // 5. Unordered list: * or -
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const bulletText = trimmed.substring(2);
      elements.push(
        <li
          key={`li-${i}`}
          className="text-gray-300 text-xs sm:text-sm my-1.5 ml-5 list-disc leading-relaxed"
        >
          {parseInlineFormatting(bulletText)}
        </li>
      );
      i++;
      continue;
    }

    // 6. Numbered list: 1. 2. etc.
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <div
          key={`num-${i}`}
          className="flex items-start gap-2.5 my-2 text-xs sm:text-sm text-gray-300 leading-relaxed"
        >
          <span className="w-5 h-5 rounded-full bg-purple-600/20 text-purple-400 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/30">
            {numMatch[1]}
          </span>
          <div className="flex-1">{parseInlineFormatting(numMatch[2])}</div>
        </div>
      );
      i++;
      continue;
    }

    // 7. Empty line spacer
    if (trimmed === "") {
      elements.push(<div key={`space-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // 8. Standard paragraph
    elements.push(
      <p
        key={`p-${i}`}
        className="text-xs sm:text-sm text-gray-300 leading-relaxed my-1.5"
      >
        {parseInlineFormatting(line)}
      </p>
    );
    i++;
  }

  return <div className={`space-y-1 font-sans ${className}`}>{elements}</div>;
}
