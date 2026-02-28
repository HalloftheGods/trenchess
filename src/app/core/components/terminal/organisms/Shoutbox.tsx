import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare } from "lucide-react";

import type { MultiplayerState, ChatMessage } from "@tc.types";

interface ShoutboxProps {
  multiplayer: MultiplayerState | null | undefined;
  darkMode: boolean;
}

export const Shoutbox: React.FC<ShoutboxProps> = ({
  multiplayer,
  darkMode,
}) => {
  const [text, setText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [multiplayer?.chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && multiplayer?.sendMessage) {
      multiplayer.sendMessage(text.trim());
      setText("");
    }
  };

  const messages = multiplayer?.chatMessages || [];

  return (
    <div
      className={`flex flex-col h-full w-full max-w-md rounded-2xl overflow-hidden border-2 ${
        darkMode
          ? "bg-slate-900/50 border-slate-800 backdrop-blur-md"
          : "bg-white/80 border-slate-200 backdrop-blur-md shadow-xl"
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 flex items-center gap-2 border-b ${
          darkMode
            ? "border-slate-800 bg-slate-800/50"
            : "border-slate-100 bg-slate-50/50"
        }`}
      >
        <MessageSquare size={18} className="text-brand-blue" />
        <h3
          className={`font-black uppercase tracking-tighter text-sm ${
            darkMode ? "text-slate-300" : "text-slate-600"
          }`}
        >
          Shoutbox
        </h3>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-8">
            <MessageSquare size={48} className="mb-2" />
            <p className="text-sm font-medium italic">
              "No communications yet. The void is silent."
            </p>
          </div>
        ) : (
          messages.map((msg: ChatMessage) => {
            const isMe = msg.senderId === multiplayer?.socketId;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!isMe && (
                    <span
                      className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        msg.playerIndex === 0
                          ? "bg-white text-slate-900 border border-slate-400"
                          : msg.playerIndex === 1
                            ? "bg-slate-900 text-white"
                            : "bg-slate-500 text-white"
                      }`}
                    >
                      P{msg.playerIndex + 1}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-bold">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMe && (
                    <span
                      className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        msg.playerIndex === 0
                          ? "bg-white text-slate-900 border border-slate-400"
                          : msg.playerIndex === 1
                            ? "bg-slate-900 text-white"
                            : "bg-slate-500 text-white"
                      }`}
                    >
                      Me
                    </span>
                  )}
                </div>
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm font-medium ${
                    isMe
                      ? "bg-brand-blue text-white rounded-tr-none"
                      : darkMode
                        ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                        : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className={`p-3 border-t ${
          darkMode
            ? "border-slate-800 bg-slate-950/30"
            : "border-slate-100 bg-white"
        }`}
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Send a message..."
            className={`w-full py-2.5 pl-4 pr-12 rounded-xl text-sm outline-none transition-all ${
              darkMode
                ? "bg-slate-800 border-2 border-transparent focus:border-brand-blue/50 text-slate-200"
                : "bg-slate-50 border-2 border-transparent focus:border-brand-blue/30 text-slate-800 shadow-inner"
            }`}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className={`absolute right-2 p-1.5 rounded-lg transition-all ${
              text.trim()
                ? "text-brand-blue hover:bg-brand-blue/10 scale-100"
                : "text-slate-400 opacity-30 scale-90"
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
