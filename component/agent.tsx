"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader,
  Sparkles,
  Menu,
  Settings,
  History,
  Plus,
  Trash2,
} from "lucide-react";

export default function AIAgentUI() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "agent",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userInput = input;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: userInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      const output =
        data.output.trim() !== ""
          ? data.output
          : "I couldn’t find any relevant information.";
      const agentMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "agent",
        content: output,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 2,
        type: "agent",
        content: `❌ Error: ${error.message}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "Explain quantum computing",
    "Write a Python function",
    "Summarize this topic",
    "Help me brainstorm ideas",
  ];

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:relative lg:translate-x-0 w-64 bg-white border-r border-slate-200 h-full transition-transform duration-300 ease-in-out z-20`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-800">AI Agent</span>
            </div>
            <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Recent Chats
              </div>
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">Chat Session {i}</span>
                  <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 space-y-2">
            <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </button>
            <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">
                Agent Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {messages.length} messages
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 1 && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  What can I help you with?
                </h1>
                <p className="text-slate-600">
                  Ask me anything or try one of these:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(prompt)}
                      className="px-4 py-3 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl text-left text-sm text-slate-700 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "agent"
                      ? "bg-linear-to-br from-blue-500 to-purple-600"
                      : "bg-slate-300"
                  }`}
                >
                  {message.type === "agent" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-slate-600" />
                  )}
                </div>
                <div
                  className={`flex-1 ${
                    message.type === "user" ? "flex justify-end" : ""
                  }`}
                >
                  <div
                    className={`inline-block max-w-xl px-4 py-3 rounded-2xl ${
                      message.type === "agent"
                        ? "bg-white border border-slate-200"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        message.type === "agent"
                          ? "text-slate-800"
                          : "text-white"
                      }`}
                    >
                      {message.content}
                    </p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.type === "agent"
                          ? "text-slate-400"
                          : "text-blue-100"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-white px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 items-end">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows="1"
                  className="w-full px-4 py-3 bg-transparent resize-none outline-none text-slate-800 placeholder-slate-400"
                  style={{ maxHeight: "120px" }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`p-3 rounded-xl transition-all ${
                  input.trim() && !isTyping
                    ? "bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isTyping ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
