import { SELECTED_TYPE } from "@/app/types/types";
import Link from "next/link";

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
          <p>{`Ihr Hautliebe-Paket-Preis(pro Behandlung)`}</p>
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

        {/* Link zur externen Website */}
        <div className="mt-4 text-center">
          <Link
            href="https://credit4beauty.de/"
            className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
          >
            credi4beauty
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
