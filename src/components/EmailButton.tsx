"use client";

import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
import { generateQuotePDF } from "@/lib/pdfGenerator";

interface EmailButtonProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  gender: string;
  selectedAreas: { name: string; price: number }[];
  subtotal: number;
  discountPercent: number;
  total: number;
  disabled?: boolean;
}

export function EmailButton({
  customerName,
  customerEmail,
  customerPhone,
  gender,
  selectedAreas,
  subtotal,
  discountPercent,
  total,
  disabled = false,
}: EmailButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendEmail = async () => {
    if (disabled || isSending || !customerEmail) return;

    setIsSending(true);
    try {
      // Generate PDF first
      const pdfBlob = await generateQuotePDF({
        customerName,
        customerEmail,
        customerPhone,
        gender,
        selectedAreas,
        subtotal,
        discountPercent,
        total,
        date: new Date(),
      });

      // Send via API
      const formData = new FormData();
      formData.append("email", customerEmail);
      formData.append("customerName", customerName);
      formData.append("pdf", pdfBlob, "angebot.pdf");

      const response = await fetch("/api/offers/send-email", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Email send failed");
      }

      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Fehler beim Senden der E-Mail. Bitte prüfen Sie die Konfiguration.");
    } finally {
      setIsSending(false);
    }
  };

  if (!customerEmail) {
    return null;
  }

  return (
    <button
      onClick={handleSendEmail}
      disabled={disabled || isSending || sent}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
        sent
          ? "bg-green-500 text-white"
          : "bg-main-color text-white hover:opacity-90 disabled:opacity-50"
      }`}
    >
      {isSending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : sent ? (
        <Check size={18} />
      ) : (
        <Mail size={18} />
      )}
      {sent ? "Gesendet!" : "Per E-Mail senden"}
    </button>
  );
}
