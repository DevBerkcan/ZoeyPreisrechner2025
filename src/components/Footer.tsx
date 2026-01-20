import { SELECTED_TYPE } from "@/app/types/types";
import Link from "next/link";
import { useState } from "react";
import { CreditCard, ChevronDown, ChevronUp, TrendingDown, Sparkles } from "lucide-react";

// Finanzierungsrechner Komponente
const FinancingCalculator = ({ total }: { total: number }) => {
  const [showFinancing, setShowFinancing] = useState(false);

  // Berechne monatliche Raten (ohne Zinsen für Übersichtlichkeit)
  const calculateMonthlyRate = (months: number) => {
    return (total / months).toFixed(2);
  };

  if (total <= 0) return null;

  return (
    <div className="mt-3 border-t border-main-color pt-3">
      <button
        onClick={() => setShowFinancing(!showFinancing)}
        className="flex items-center gap-2 text-sm font-medium text-main-color hover:text-opacity-80 w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <CreditCard size={18} />
          Finanzierung möglich
        </span>
        {showFinancing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {showFinancing && (
        <div className="mt-2 bg-gray-50 rounded-md p-3 text-sm">
          <p className="font-medium mb-2">Monatliche Raten:</p>
          <div className="space-y-1 text-gray-700">
            <div className="flex justify-between">
              <span>6 Monate:</span>
              <span className="font-semibold">{calculateMonthlyRate(6)}€/Monat</span>
            </div>
            <div className="flex justify-between">
              <span>12 Monate:</span>
              <span className="font-semibold">{calculateMonthlyRate(12)}€/Monat</span>
            </div>
            <div className="flex justify-between">
              <span>24 Monate:</span>
              <span className="font-semibold">{calculateMonthlyRate(24)}€/Monat</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Konditionen über Credit4Beauty
          </p>
        </div>
      )}
    </div>
  );
};

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
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-main-color">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        {/* Main Price Display - Grid Layout for iPad/Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Left: Price Breakdown (collapsible on mobile) */}
          <div className="md:col-span-1">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm font-medium text-main-color md:hidden w-full justify-between"
            >
              <span>Preisdetails</span>
              {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            <div className={`space-y-1 text-sm ${showDetails ? 'block' : 'hidden'} md:block`}>
              <div className="flex justify-between text-gray-600">
                <span>Einzelpreise:</span>
                <span>{singleItemsPricingValue.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Paketpreis:</span>
                <span className="text-main-color font-medium">
                  {subtotal.toFixed(2)}€ <span className="text-xs">(-{discountOnSelectingMore.toFixed(0)}%)</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rabatt:</span>
                <input
                  type="number"
                  className="w-16 text-gray-800 border border-gray-300 px-2 py-1 rounded-lg text-center text-sm focus:ring-2 focus:ring-main-color focus:border-transparent"
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
                <span className="text-gray-600">%</span>
              </div>
            </div>
          </div>

          {/* Center: Total Price - Prominent Display */}
          <div className="md:col-span-1">
            <div className="bg-main-color/5 p-4 rounded-xl border-l-4 border-main-color text-center md:text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Gesamtbetrag</p>
              <p className="text-3xl md:text-4xl font-bold text-main-color">
                {total.toFixed(2)}€
              </p>
              {/* Savings Badge */}
              {singleItemsPricingValue > total && selectedItems.length > 0 && (
                <div className="inline-flex items-center gap-1 mt-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  <Sparkles size={12} />
                  <span>Du sparst {(singleItemsPricingValue - total).toFixed(2)}€</span>
                  <TrendingDown size={12} />
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="md:col-span-1 space-y-2">
            {/* Hint for more savings */}
            {selectedItems.length > 0 && selectedItems.length < 3 && (
              <p className="text-xs text-center text-secondary-color font-medium">
                Ab 3 Arealen: Zusätzlicher Mengenrabatt!
              </p>
            )}
            {selectedItems.length >= 3 && selectedItems.length < 5 && (
              <p className="text-xs text-center text-secondary-color font-medium">
                Noch {5 - selectedItems.length} Areal(e) für maximalen Rabatt!
              </p>
            )}

            {/* Financing Calculator */}
            <FinancingCalculator total={total} />

            {/* Finance Button */}
            <Link
              href="https://beautyfinanzierung.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 rounded-lg bg-secondary-color text-white font-semibold min-h-[44px] hover:bg-orange-500 hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              Jetzt finanzieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
