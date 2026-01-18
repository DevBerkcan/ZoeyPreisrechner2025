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
  return (
    <div className="fixed bottom-0 left-0 right-0 mt-6 border-t-2  text-main-color mb-2 border-t-main-color px-4 pt-2">
      <div className="space-y-2">
        {/* {selectedItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <p>{`${item.gender} - ${item.selectedTreatment} - ${item.treatment.name} (${item.area})`}</p>
            <p>{`${item.price?.toFixed(2) || "0.00"}€`}</p>
          </div>
        ))} */}

        {/* Einsparungen Abschnitt */}
        {/* {selectedItems.length >= 3 && (
          <div>
            <h1 className="font-semibold">EINSPARUNGEN</h1>

            <div className="flex justify-between">
              <p>Einsparungen basierend auf Einzelpreis pro Behandlung</p>
              <p>
                {singleItemsPricingValue - subtotal} (
                {(
                  ((singleItemsPricingValue - subtotal) /
                    singleItemsPricingValue) *
                  100
                ).toFixed(2)}
                %)
              </p>
            </div>

            {selectedItems.length >= 5 && (
              <div className="flex justify-between">
                <p>Einsparungen basierend auf ab 3 Areale</p>
                <p>
                  {threeItemsPricingValue - subtotal} (
                  {(
                    ((threeItemsPricingValue - subtotal) /
                      threeItemsPricingValue) *
                    100
                  ).toFixed(2)}
                  %)
                </p>
              </div>
            )}
          </div>
        )} */}
        {/* Zwischensumme und Rabatt */}
        <div className="flex justify-between">
          <p>Summe der Einzelpreise:</p>
          <p>{singleItemsPricingValue.toFixed(2)}€</p>
        </div>
        <div className="flex justify-between">
          <p>{`Ihr ZOEY ESTHETICS-Paket-Preis(pro Behandlung)`}</p>
          <p>
            {subtotal.toFixed(2)}€ {`(${discountOnSelectingMore.toFixed(2)}%)`}
          </p>
        </div>
        <div className="flex justify-between">
          <p>Rabattprozentsatz:</p>
          <div>
            <input
              type="number"
              id="discountInput"
              className="text-gray-800 border px-2 py-1 rounded"
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
          </div>
        </div>

        {/* Gesamtpreis nach Rabatt */}
        <div className="flex justify-between font-bold">
          <p>Gesamt:</p>
          <p>{total.toFixed(2)}€</p>
        </div>

        {/* Du sparst - Highlight Box */}
        {singleItemsPricingValue > total && selectedItems.length > 0 && (
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg py-2 px-4 mt-2">
            <Sparkles size={18} />
            <span className="font-bold">
              Du sparst {(singleItemsPricingValue - total).toFixed(2)}€
            </span>
            <span className="text-green-100">
              ({((singleItemsPricingValue - total) / singleItemsPricingValue * 100).toFixed(0)}%)
            </span>
            <TrendingDown size={18} />
          </div>
        )}

        {/* Hinweis für mehr Ersparnis */}
        {selectedItems.length > 0 && selectedItems.length < 3 && (
          <p className="text-xs text-center text-gray-500 mt-1">
            Ab 3 Arealen: Zusätzlicher Mengenrabatt!
          </p>
        )}
        {selectedItems.length >= 3 && selectedItems.length < 5 && (
          <p className="text-xs text-center text-gray-500 mt-1">
            Noch {5 - selectedItems.length} Areal(e) für maximalen Rabatt!
          </p>
        )}

        {/* Finanzierungsrechner */}
        <FinancingCalculator total={total} />

        {/* Link zur externen Website */}
        <div className="mt-4 text-center">
          <Link
            href="https://credit4beauty.de/"
            className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
          >
            Jetzt finanzieren
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
