import { SELECTED_TYPE } from "@/app/types/types";
import Link from "next/link";
import { useState } from "react";
import { CreditCard, ChevronDown, ChevronUp, TrendingDown, Sparkles, UserPlus } from "lucide-react";
import CustomerDialog from "./CustomerDialog";

const FinancingCalculator = ({ total }: { total: number }) => {
  const [showFinancing, setShowFinancing] = useState(false);

  const calculateMonthlyRate = (months: number) => {
    return (total / months).toFixed(2);
  };

  if (total <= 0) return null;

  return (
    <div className="mt-3 border-t border-main-color/30 pt-3">
      <button
        onClick={() => setShowFinancing(!showFinancing)}
        className="flex items-center gap-2 text-sm font-medium text-main-color hover:opacity-80 w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <CreditCard size={16} />
          Finanzierung möglich
        </span>
        {showFinancing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showFinancing && (
        <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
          <p className="font-medium mb-2 text-gray-700 dark:text-gray-200">Monatliche Raten:</p>
          <div className="space-y-1 text-gray-700 dark:text-gray-200">
            {[6, 12, 24].map((months) => (
              <div key={months} className="flex justify-between">
                <span>{months} Monate:</span>
                <span className="font-semibold">{calculateMonthlyRate(months)}€/Monat</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">* Konditionen über Credit4Beauty</p>
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
  currentGender,
}: {
  selectedItems: SELECTED_TYPE[];
  setDiscountPercent: React.Dispatch<React.SetStateAction<number>>;
  subtotal: number;
  discountPercent: number;
  total: number;
  currentGender?: string;
}) => {
  const calculateTotalPrice = (pricingKey: string) => {
    return selectedItems.reduce((acc, curr) => {
      const price = curr.treatment.pricing[pricingKey];
      if (!price) return acc + (curr.treatment.pricing["Einzelpreis pro Behandlung"] || curr.treatment.pricing["Kurspreis"] || 0);
      return acc + price;
    }, 0);
  };

  const singleItemsPricingValue = calculateTotalPrice("Einzelpreis pro Behandlung");

  const discountOnSelectingMore = singleItemsPricingValue
    ? (100 * (singleItemsPricingValue - subtotal)) / singleItemsPricingValue
    : 0;

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-main-color shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

          {/* Left: Price Breakdown */}
          <div className="md:col-span-1">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-sm font-medium text-main-color md:hidden w-full justify-between mb-2"
            >
              <span>Preisdetails</span>
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <div className={`space-y-1.5 text-sm ${showDetails ? "block" : "hidden"} md:block`}>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Einzelpreise:</span>
                <span className="font-medium">{singleItemsPricingValue.toFixed(2)}€</span>
              </div>
              {subtotal !== singleItemsPricingValue && (
                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                  <span>Paketpreis:</span>
                  <span className="text-main-color font-semibold">
                    {subtotal.toFixed(2)}€{" "}
                    <span className="text-xs opacity-70">(-{discountOnSelectingMore.toFixed(0)}%)</span>
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400 shrink-0">Rabatt:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="w-16 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-2 py-1 rounded-lg text-center text-sm focus:ring-2 focus:ring-main-color focus:border-transparent"
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
                  <span className="text-gray-500 dark:text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Total */}
          <div className="md:col-span-1">
            <div className="bg-main-color/5 dark:bg-main-color/10 p-3 rounded-xl border-l-4 border-main-color">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">Gesamtbetrag</p>
              <p className="text-3xl md:text-4xl font-bold text-main-color leading-tight">
                {total.toFixed(2)}€
              </p>
              {singleItemsPricingValue > total && selectedItems.length > 0 && (
                <div className="inline-flex items-center gap-1 mt-1.5 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  <Sparkles size={10} />
                  <span>Du sparst {(singleItemsPricingValue - total).toFixed(2)}€</span>
                  <TrendingDown size={10} />
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="md:col-span-1 space-y-2">
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

            {selectedItems.length > 0 && (
              <CustomerDialog
                currentGender={currentGender}
                selectedAreas={selectedItems.map((item) => ({
                  name: item.treatment.name,
                  price: item.price,
                }))}
                totalPrice={total}
                onSave={(customer) => {
                  console.log("Kunde gespeichert:", customer);
                }}
                triggerClassName="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-main-color text-white font-semibold min-h-[44px] hover:opacity-90 hover:shadow-lg transition-all duration-200 active:scale-95"
                triggerLabel="Kunde hinzufügen"
              />
            )}

            <FinancingCalculator total={total} />

            <Link
              href="https://beautyfinanzierung.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-2.5 rounded-lg bg-secondary-color text-white font-semibold min-h-[44px] hover:opacity-90 hover:shadow-lg transition-all duration-200 active:scale-95"
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
