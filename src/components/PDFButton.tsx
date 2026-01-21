"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { generateQuotePDF, downloadPDF } from "@/lib/pdfGenerator";

interface PDFButtonProps {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  gender: string;
  selectedAreas: { name: string; price: number }[];
  subtotal: number;
  discountPercent: number;
  total: number;
  disabled?: boolean;
}

export function PDFButton({
  customerName,
  customerEmail,
  customerPhone,
  gender,
  selectedAreas,
  subtotal,
  discountPercent,
  total,
  disabled = false,
}: PDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (disabled || isGenerating) return;

    setIsGenerating(true);
    try {
      const blob = await generateQuotePDF({
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

      const filename = `Angebot_${customerName.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      downloadPDF(blob, filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Fehler beim Erstellen des PDFs");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGeneratePDF}
      disabled={disabled || isGenerating}
      className="flex items-center gap-2 px-4 py-2 bg-secondary-color text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
    >
      {isGenerating ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <FileText size={18} />
      )}
      PDF erstellen
    </button>
  );
}
