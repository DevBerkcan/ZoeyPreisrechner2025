import React from "react";
import { Gender, SELECTED_TYPE, Treatment } from "@/app/types/types";
import { pricingData as data } from "@/app/data";

const PricingTable = ({
  selectedItems,
  selectedGender,
  selectedTreatment,
  addItemToCart,
}: {
  selectedItems: SELECTED_TYPE[];
  selectedGender: Gender;
  selectedTreatment: string;
  addItemToCart: (treatment: Treatment, area: string) => void;
}) => {
  const allServicesByGender = data[selectedGender];
  const servicesBySelectedTreatment = allServicesByGender[selectedTreatment];

  if (!servicesBySelectedTreatment) {
    return (
      <p className="text-red-500">
        No data available for the selected treatment.
      </p>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <div className="overflow-x-auto">
        {/* Allow horizontal scrolling */}
        <table className="w-full border-collapse border border-gray-300 text-gray-800">
          <thead>
            <tr className="[&>th]:relative [&>th]:overflow-hidden">
              <th className="py-2 px-2 bg-white/40">
                <div className="relative z-10 flex items-center justify-center"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-100/20 to-transparent" />
              </th>
              <th className="py-2 px-2 bg-white/40">
                <div className="text-2xl bg-main-color rounded-t-full pt-5 pb-1 text-white">
                  Treatment Name
                </div>
              </th>
              <th className="py-2 px-2 bg-white/40">
                <div className="text-2xl bg-main-color rounded-t-full pt-5 pb-1 text-white">
                  ab 5 Areale
                </div>
              </th>
              <th className="py-2 px-2 bg-white/40">
                <div className="text-2xl bg-main-color rounded-t-full pt-5 pb-1 text-white">
                  Ab 3 Areale
                </div>
              </th>
              <th className="py-2 px-2 bg-white/40">
                <div className="text-2xl bg-main-color rounded-t-full pt-5 pb-1 text-white">
                  Einzelpreis pro Behandlungen
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(servicesBySelectedTreatment).map(
              ([serviceName, treatments], serviceIndex) => (
                <React.Fragment key={serviceIndex}>
                  {/* Collapsible Header */}
                  <tr className="bg-gray-200 cursor-pointer">
                    <td colSpan={6} className="px-4 py-3 font-semibold">
                      {serviceName}{" "}
                    </td>
                  </tr>
                  {/* Expandable Rows */}
                  {(treatments as Treatment[]).map(
                    (treatment: Treatment, treatmentIndex) => (
                      <tr
                        key={treatmentIndex}
                        className={`${
                          treatmentIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition cursor-pointer`}
                        onClick={() => addItemToCart(treatment, serviceName)}
                      >
                        <td className="border px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-gray-700 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            checked={selectedItems.some(
                              (item) =>
                                item.gender === selectedGender &&
                                item.area === serviceName &&
                                item.treatment.name === treatment.name &&
                                item.selectedTreatment === selectedTreatment
                            )}
                            onChange={() =>
                              addItemToCart(treatment, serviceName)
                            }
                          />
                        </td>
                        <td className="border px-4 py-3">{treatment.name}</td>
                        <td className="border px-4 py-3 text-center">
                          {treatment.pricing["ab 5 Areale"] ?? 0}€
                          {/* {treatment.pricing["ab 5 Areale"] && "€"} */}
                        </td>
                        <td className="border px-4 py-3 text-center">
                          {treatment.pricing["ab 3 Areale"] ?? "0"}€
                          {/* {treatment.pricing["ab 3 Areale"] && "€"} */}
                        </td>
                        <td className="border px-4 py-3 text-center">
                          {(treatment.pricing["Einzelpreis pro Behandlung"] ||
                            treatment.pricing["Kurspreis"]) ??
                            0}
                          {treatment.pricing["Einzelpreis pro Behandlung"] &&
                            "€"}
                        </td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingTable;
