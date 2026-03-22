"use client";

import { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-violet-600 text-white rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-bl-md"
        }`}
      >
        <div
          className={`text-sm leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none ${
            isUser
              ? "prose-invert"
              : "prose-headings:text-gray-900 prose-strong:text-gray-900"
          }`}
          dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
        />
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/### (.+)/g, '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>')
    .replace(/## (.+)/g, '<h2 class="text-base font-bold mt-3 mb-1">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n\n/g, "<br/><br/>");
}
