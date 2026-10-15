/**
 * Utility functions for exporting NovaMind AI research chats to Markdown and PDF.
 */

export const generateChatMarkdown = (sessionTitle, messages, user) => {
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let md = `# ${sessionTitle || "NovaMind AI Research Synthesis"}\n`;
  md += `*Generated on: ${dateStr}*\n`;
  if (user?.full_name || user?.email) {
    md += `*Researcher: ${user.full_name || user.email}*\n`;
  }
  md += `*Platform: NovaMind AI Grounded Research Assistant*\n\n`;
  md += `---\n\n`;

  messages.forEach((msg, idx) => {
    const isUser = msg.role === "user";
    const speaker = isUser ? "👤 Researcher" : "🧠 NovaMind AI";
    const timestamp = msg.created_at
      ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";

    md += `### ${speaker} ${timestamp ? `(${timestamp})` : ""}\n\n`;
    md += `${msg.content}\n\n`;

    // Append citations if assistant message has them
    if (!isUser && msg.citations && msg.citations.length > 0) {
      md += `#### 📚 Verified Research Citations:\n`;
      msg.citations.forEach((c, cIdx) => {
        const page = c.page_number ? ` (Page ${c.page_number})` : "";
        const score = c.score ? ` — Match: ${Math.round(c.score * 100)}%` : "";
        md += `${cIdx + 1}. **${c.filename}${page}**${score}\n`;
        if (c.snippet) {
          md += `   > "${c.snippet.trim().replace(/\n/g, " ")}"\n`;
        }
      });
      md += `\n`;
    }

    md += `---\n\n`;
  });

  md += `\n*End of Transcript — NovaMind AI Grounded Knowledge Base*\n`;
  return md;
};

export const downloadMarkdownFile = (sessionTitle, messages, user) => {
  const mdContent = generateChatMarkdown(sessionTitle, messages, user);
  const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const filename = `${(sessionTitle || "research-chat")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 40)}-${Date.now()}.md`;

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportChatToPDF = (sessionTitle, messages, user) => {
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export chat as PDF.");
    return;
  }

  const messagesHtml = messages
    .map((msg) => {
      const isUser = msg.role === "user";
      const timeStr = msg.created_at
        ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";

      let citationsHtml = "";
      if (!isUser && msg.citations && msg.citations.length > 0) {
        citationsHtml = `
          <div class="citations-box">
            <div class="citations-title">📚 Verified Research Citations (${msg.citations.length})</div>
            ${msg.citations
              .map(
                (c, idx) => `
              <div class="citation-item">
                <div class="citation-header">
                  <strong>#${idx + 1} ${escapeHtml(c.filename || "Document")}</strong>
                  ${c.page_number ? `<span class="badge">Page ${c.page_number}</span>` : ""}
                  ${c.score ? `<span class="badge badge-purple">${Math.round(c.score * 100)}% match</span>` : ""}
                </div>
                ${c.snippet ? `<div class="citation-snippet">"${escapeHtml(c.snippet)}"</div>` : ""}
              </div>
            `
              )
              .join("")}
          </div>
        `;
      }

      return `
        <div class="message ${isUser ? "user-message" : "assistant-message"}">
          <div class="message-meta">
            <span class="role-tag ${isUser ? "role-user" : "role-assistant"}">
              ${isUser ? "👤 Researcher" : "🧠 NovaMind AI"}
            </span>
            <span class="timestamp">${timeStr}</span>
          </div>
          <div class="message-body">${formatContentToHtml(msg.content)}</div>
          ${citationsHtml}
        </div>
      `;
    })
    .join("");

  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(sessionTitle || "NovaMind AI Research Chat")}</title>
        <style>
          @page {
            margin: 20mm 15mm 20mm 15mm;
            size: A4;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1a1a24;
            background: #ffffff;
            margin: 0;
            padding: 24px;
            line-height: 1.6;
          }
          .header {
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .header h1 {
            margin: 0 0 6px 0;
            font-size: 22px;
            color: #1e1b4b;
          }
          .header-meta {
            font-size: 12px;
            color: #6b7280;
          }
          .brand-badge {
            background: #7c3aed;
            color: #ffffff;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .message {
            margin-bottom: 24px;
            padding: 16px;
            border-radius: 8px;
            page-break-inside: avoid;
          }
          .user-message {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #3b82f6;
          }
          .assistant-message {
            background: #faf5ff;
            border: 1px solid #f3e8ff;
            border-left: 4px solid #8b5cf6;
          }
          .message-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          .role-tag {
            font-weight: 700;
            font-size: 13px;
          }
          .role-user { color: #1d4ed8; }
          .role-assistant { color: #6d28d9; }
          .timestamp { font-size: 11px; color: #94a3b8; }
          .message-body {
            font-size: 14px;
            white-space: pre-wrap;
            color: #334155;
          }
          .citations-box {
            margin-top: 14px;
            padding-top: 12px;
            border-top: 1px dashed #d8b4fe;
          }
          .citations-title {
            font-size: 12px;
            font-weight: 700;
            color: #6b21a8;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .citation-item {
            margin-bottom: 8px;
            padding: 8px 12px;
            background: #ffffff;
            border: 1px solid #e9d5ff;
            border-radius: 6px;
            font-size: 12px;
          }
          .citation-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
          }
          .badge {
            background: #f1f5f9;
            color: #475569;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
          }
          .badge-purple {
            background: #ede9fe;
            color: #6d28d9;
          }
          .citation-snippet {
            font-style: italic;
            color: #64748b;
            font-size: 11.5px;
          }
          .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${escapeHtml(sessionTitle || "NovaMind AI Research Synthesis")}</h1>
            <div class="header-meta">
              Researcher: <strong>${escapeHtml(user?.full_name || user?.email || "NovaMind User")}</strong> | Date: ${dateStr}
            </div>
          </div>
          <div class="brand-badge">NovaMind AI • RAG</div>
        </div>

        <div class="chat-container">
          ${messagesHtml}
        </div>

        <div class="footer">
          Synthesized by NovaMind AI — Grounded Retrieval-Augmented Generation Platform
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(fullHtml);
  printWindow.document.close();
};

const escapeHtml = (text) => {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatContentToHtml = (content) => {
  if (!content) return "";
  let formatted = escapeHtml(content);
  // Bold headings
  formatted = formatted.replace(/^### (.*$)/gim, '<h4 style="margin: 8px 0 4px; color:#1e1b4b;">$1</h4>');
  formatted = formatted.replace(/^## (.*$)/gim, '<h3 style="margin: 12px 0 6px; color:#1e1b4b;">$1</h3>');
  formatted = formatted.replace(/^# (.*$)/gim, '<h2 style="margin: 16px 0 8px; color:#1e1b4b;">$1</h2>');
  // Bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  return formatted;
};
