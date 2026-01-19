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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-gray-800">
          {/* Cleaner Header */}
          <thead>
            <tr className="bg-main-color text-white">
              <th className="py-4 px-3 md:px-4 w-12"></th>
              <th className="py-4 px-3 md:px-4 text-left text-sm md:text-base font-semibold">
                Behandlung
              </th>
              <th className="py-4 px-3 md:px-4 text-center text-sm md:text-base font-semibold hidden md:table-cell">
                ab 5 Areale
              </th>
              <th className="py-4 px-3 md:px-4 text-center text-sm md:text-base font-semibold hidden sm:table-cell">
                ab 3 Areale
              </th>
              <th className="py-4 px-3 md:px-4 text-center text-sm md:text-base font-semibold">
                Einzelpreis
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Object.entries(servicesBySelectedTreatment).map(
              ([serviceName, treatments], serviceIndex) => (
                <React.Fragment key={serviceIndex}>
                  {/* Section Header */}
                  <tr className="bg-gray-100">
                    <td colSpan={5} className="px-4 py-3 font-bold text-main-color text-sm md:text-base">
                      {serviceName}
                    </td>
                  </tr>
                  {/* Treatment Rows */}
                  {(treatments as Treatment[]).map(
                    (treatment: Treatment, treatmentIndex) => {
                      const isSelected = selectedItems.some(
                        (item) =>
                          item.gender === selectedGender &&
                          item.area === serviceName &&
                          item.treatment.name === treatment.name &&
                          item.selectedTreatment === selectedTreatment
                      );
                      return (
                        <tr
                          key={treatmentIndex}
                          className={`min-h-[52px] transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-main-color/10 border-l-4 border-l-main-color"
                              : "hover:bg-main-color/5"
                          }`}
                          onClick={() => addItemToCart(treatment, serviceName)}
                        >
                          <td className="px-3 md:px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              className="w-5 h-5 accent-main-color cursor-pointer transition-transform checked:scale-110"
                              checked={isSelected}
                              onChange={() =>
                                addItemToCart(treatment, serviceName)
                              }
                            />
                          </td>
                          <td className="px-3 md:px-4 py-4 font-medium text-sm md:text-base">
                            {treatment.name}
                          </td>
                          <td className="px-3 md:px-4 py-4 text-center hidden md:table-cell">
                            <span className="text-sm md:text-base font-semibold text-gray-600">
                              {treatment.pricing["ab 5 Areale"] ?? 0}€
                            </span>
                          </td>
                          <td className="px-3 md:px-4 py-4 text-center hidden sm:table-cell">
                            <span className="text-sm md:text-base font-semibold text-gray-600">
                              {treatment.pricing["ab 3 Areale"] ?? 0}€
                            </span>
                          </td>
                          <td className="px-3 md:px-4 py-4 text-center">
                            <span className="text-base md:text-lg font-bold text-secondary-color">
                              {(treatment.pricing["Einzelpreis pro Behandlung"] ||
                                treatment.pricing["Kurspreis"]) ?? 0}€
                            </span>
                          </td>
                        </tr>
                      );
                    }
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
