"use client";

import { Printer } from "lucide-react";

interface PrintButtonProps {
  className?: string;
}

export function PrintButton({ className = "" }: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-main-color text-main-color text-sm font-medium min-h-[44px] hover:bg-main-color/10 hover:shadow-md transition-all duration-200 active:scale-95 no-print ${className}`}
    >
      <Printer size={16} />
      <span className="hidden sm:inline">Drucken</span>
    </button>
  );
}
