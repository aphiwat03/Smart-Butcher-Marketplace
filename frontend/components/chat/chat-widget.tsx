"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Transition, TransitionChild } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "สวัสดีครับ! ผม Smart Butcher AI ช่วยแนะนำเนื้อหรือสูตรอาหารได้เลยครับ",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToNewMessage = () => {
    if (lastMessageRef.current) {
      const isBot = lastMessageRef.current.getAttribute("data-role") === "bot";
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: isBot ? "start" : "end",
      });
    }
  };

  useEffect(() => {
    scrollToNewMessage();
  }, [messages, isLoading]);

  const quickReplies = ["แนะนำเนื้อสำหรับสเต็ก", "วิธีย่างที่ดี"];

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 1)
        .map((m) => ({ role: m.role, text: m.text }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/ai/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
        },
      );

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "bot",
            text: "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อระบบ AI ",
          },
        ]);
        return;
      }

      const data = await response.json();

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: data.data,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.warn("AI Chat error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อระบบ AI ",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (text: string) => {
    // Match [PRODUCT:id=...,name=...,price=...,img=...] allowing optional spaces
    const productRegex = /\[PRODUCT:\s*id=(.*?),\s*name=(.*?),\s*price=(.*?),\s*img=(.*?)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = productRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex}>{text.substring(lastIndex, match.index)}</span>,
        );
      }

      const id = match[1];
      const name = match[2];
      const price = match[3];
      const img = match[4];

      parts.push(
        <div key={match.index} className="mt-3 mb-2 inline-block w-full">
          <Link
            href={`/product/${id}`}
            className="block border border-gray-100 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            {img && img.trim() !== "" ? (
              <div className="relative h-[140px] w-full bg-gray-50 overflow-hidden">
                <Image
                  src={img.trim()}
                  alt={name.trim()}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.parentElement!.style.display = 'none';
                  }}
                />
              </div>
            ) : null}
            <div className="p-3">
              <h4 className="font-bold text-[#4E0707] text-sm line-clamp-1">
                {name}
              </h4>
              <p className="text-[#B4915B] font-semibold text-xs mt-1">
                ฿{Number(price).toLocaleString()}
              </p>
            </div>
          </Link>
        </div>,
      );

      lastIndex = productRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#4E0707] text-white shadow-lg flex items-center justify-center hover:bg-[#6B0A0A] hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {isOpen ? (
          <X
            size={22}
            className="transition-transform duration-300 hover:rotate-90"
          />
        ) : (
          <MessageCircle
            size={22}
            className="transition-transform duration-300"
          />
        )}
      </button>

      {/* Chat Panel */}
      <Transition
        show={isOpen}
        as="div"
        enter="transition duration-200 ease-out"
        enterFrom="transform scale-95 opacity-0 translate-y-4"
        enterTo="transform scale-100 opacity-100 translate-y-0"
        leave="transition duration-150 ease-in"
        leaveFrom="transform scale-100 opacity-100 translate-y-0"
        leaveTo="transform scale-95 opacity-0 translate-y-4"
        className="fixed bottom-24 right-6 z-50 w-[350px] h-[600px] max-h-[85vh] rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col overflow-hidden"
      >
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
        <div className="flex flex-col gap-3 p-4 bg-gray-50 flex-1 overflow-y-auto">
          {messages.map((msg, index) => {
            const isLast = index === messages.length - 1 && !isLoading;
            return (
              <div
                key={msg.id}
                ref={isLast ? lastMessageRef : null}
                data-role={msg.role}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm max-w-[85%] leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                    msg.role === "bot"
                      ? "bg-white border border-gray-100 text-gray-800"
                      : "bg-[#4E0707] text-white"
                  }`}
                >
                  {renderMessageContent(msg.text)}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div
              className="flex gap-2 mb-2"
              ref={lastMessageRef}
              data-role="bot"
            >
              <div className="rounded-2xl px-4 py-2.5 text-sm bg-white border border-gray-100 text-gray-800 shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        <div className="flex gap-2 flex-wrap px-4 py-2 bg-gray-50">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="text-xs border border-[#B4915B] text-[#4E0707] rounded-full px-3 py-1 hover:bg-[#4E0707] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isLoading}
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#B4915B] disabled:bg-gray-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 rounded-full bg-[#4E0707] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </Transition>
    </>
  );
}
