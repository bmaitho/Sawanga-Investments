"use client";
import { MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/data";

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
        "Hello SAWANGA, I'd like to enquire about your finishing products."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-luxe transition-transform duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" fill="white" />
    </a>
  );
}
