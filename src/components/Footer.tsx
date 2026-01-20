import { SELECTED_TYPE } from "@/app/types/types";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Footer = ({
  selectedItems,
  subtotal,
  discountPercent,
  total,
  setDiscountPercent,
}: {
  selectedItems: SELECTED_TYPE[];
  setDiscountPercent: React.Dispatch<React.SetStateAction<number>>;
  subtotal: number;
  discountPercent: number;
  total: number;
}) => {
  // Berechne den Gesamtpreis für 3- und 5-Areale-Preismodelle
  const calculateTotalPrice = (pricingKey: string) => {
    return selectedItems.reduce((acc, curr) => {
      return (
        acc +
        (curr.treatment.pricing[pricingKey] ||
          curr.treatment.pricing["Einzelpreis pro Behandlung"] ||
          curr.treatment.pricing["Kurspreis"])
      );
    }, 0);
  };

  const singleItemsPricingValue = calculateTotalPrice(
    "Einzelpreis pro Behandlung"
  );
  // const threeItemsPricingValue = calculateTotalPrice("ab 3 Areale");

  const discountOnSelectingMore = singleItemsPricingValue
    ? (100 * (singleItemsPricingValue - subtotal)) / singleItemsPricingValue
    : 0;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-main-color">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
        {/* Compact Layout */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Price Details (expandable) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-main-color"
            >
              <span>Details</span>
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showDetails && (
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>Einzelpreis: {singleItemsPricingValue.toFixed(0)}€</span>
                <span className="text-main-color">Paket: {subtotal.toFixed(0)}€ (-{discountOnSelectingMore.toFixed(0)}%)</span>
              </div>
            )}

            {/* Rabatt Input */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500">Rabatt:</span>
              <input
                type="number"
                className="w-12 text-gray-800 border border-gray-300 px-1 py-0.5 rounded text-center text-xs focus:ring-1 focus:ring-main-color"
                value={discountPercent}
                step={0.1}
                min={0}
                max={100}
                onChange={(e) => {
                  const input = e.target.value;
                  const value = parseFloat(input);
                  if (input === "") {
                    setDiscountPercent(0);
                  } else if (value >= 0 && value <= 100) {
                    setDiscountPercent(value);
                  }
                }}
              />
              <span className="text-gray-500">%</span>
            </div>
          </div>

          {/* Center: Total Price */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl md:text-3xl font-bold text-main-color">
                {total.toFixed(2)}€
              </p>
              {singleItemsPricingValue > total && selectedItems.length > 0 && (
                <p className="text-xs text-green-600 font-medium">
                  Ersparnis: {(singleItemsPricingValue - total).toFixed(0)}€
                </p>
              )}
            </div>
          </div>

          {/* Right: Finance Button */}
          <Link
            href="https://beautyfinanzierung.de/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-secondary-color text-white text-sm font-semibold hover:bg-orange-500 transition-all duration-200 active:scale-95"
          >
            Jetzt finanzieren
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
