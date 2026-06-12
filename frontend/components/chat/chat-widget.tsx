"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Transition, TransitionChild } from "@headlessui/react";
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "สวัสดีครับ! 🥩 ผม Smart Butcher AI ช่วยแนะนำเนื้อหรือสูตรอาหารได้เลยครับ",
    },
  ]);
  const [input, setInput] = useState("");

  const quickReplies = ["แนะนำเนื้อสำหรับสเต็ก", "วิธีย่างที่ดี", "ดูโปรโมชัน"];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text };
    const botMsg = {
      id: Date.now() + 1,
      role: "bot",
      text: "ขอบคุณครับ กำลังประมวลผล... (mock)",
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#4E0707] text-white shadow-lg flex items-center justify-center hover:bg-[#6B0A0A] transition-colors"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-100  rounded-xl border border-gray-200 bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#4E0707] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B4915B] flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Smart Butcher AI</p>
              <p className="text-white/60 text-xs">พร้อมให้บริการ</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-3 p-4 bg-gray-50 flex-1 max-h-64 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`rounded-2xl px-3 py-2 text-sm max-w-[200px] ${
                    msg.role === "bot"
                      ? "bg-white border border-gray-100 text-gray-800"
                      : "bg-[#4E0707] text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="flex gap-2 flex-wrap px-4 py-2 bg-gray-50">
            {quickReplies.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs border border-[#B4915B] text-[#4E0707] rounded-full px-3 py-1 hover:bg-[#4E0707] hover:text-white transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 items-center p-3 border-t border-gray-100">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="พิมพ์ข้อความ..."
              className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#B4915B]"
            />
            <button
              onClick={() => sendMessage(input)}
              className="w-8 h-8 rounded-full bg-[#4E0707] flex items-center justify-center"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
