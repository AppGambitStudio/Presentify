"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  onSendMessage: (message: string) => Promise<string>;
  isLoading: boolean;
  slideNumber: number;
}

export function ChatPanel({ onSendMessage, isLoading, slideNumber }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    try {
      const response = await onSendMessage(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ borderLeft: "1px solid var(--slide-card-border)", backgroundColor: "var(--slide-bg)" }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--slide-card-border)" }}>
        <span className="text-sm font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>
          Edit Slide {slideNumber}
        </span>
        <span className="text-xs" style={{ color: "var(--slide-text-muted)" }}>
          Chat to refine
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8" style={{ color: "var(--slide-text-muted)" }}>
            <p className="text-sm mb-3">Tell me how to change this slide</p>
            <div className="space-y-2 text-xs" style={{ color: "var(--slide-text-muted)" }}>
              <p>&quot;Make the title shorter&quot;</p>
              <p>&quot;Add a bullet about serverless&quot;</p>
              <p>&quot;Change this to a comparison&quot;</p>
              <p>&quot;Make it more humorous&quot;</p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm"
              style={{
                backgroundColor: msg.role === "user" ? "var(--slide-primary)" : "var(--slide-card-bg)",
                color: msg.role === "user" ? "var(--slide-bg)" : "var(--slide-text)",
                borderBottomRightRadius: msg.role === "user" ? "4px" : undefined,
                borderBottomLeftRadius: msg.role === "assistant" ? "4px" : undefined,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl text-sm flex items-center gap-2" style={{ backgroundColor: "var(--slide-card-bg)" }}>
              <Loader2 size={14} className="animate-spin" style={{ color: "var(--slide-primary)" }} />
              <span style={{ color: "var(--slide-text-muted)" }}>Updating slide...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: "var(--slide-card-border)" }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Describe the change..."
            disabled={isLoading}
            className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl transition-all disabled:opacity-30"
            style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
