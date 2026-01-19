"use client";
import React, { useState } from "react";
import Navbar from "./Navbar";
import {
  Gender,
  PRICING_TYPE,
  SELECTED_TYPE,
  Treatment,
} from "@/app/types/types";
import { pricingData } from "@/app/data";
import Footer from "./Footer";
import PricingTable from "./PricingTable";
import CustomerDialog from "./CustomerDialog";
import QuickNotes from "./QuickNotes";
import BeforeAfterGallery from "./BeforeAfterGallery";

const Home = () => {
  const [gender, setGender] = useState<Gender>("Frau");
  const [selectedTreatment, setSelectedTreatment] =
    useState<string>("Haarentfernung");
  const [selectedPricingType, setSelectedPricingType] =
    useState<PRICING_TYPE>("Area1");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<SELECTED_TYPE[]>([]);
  const [sessionNotes, setSessionNotes] = useState<string[]>([]);

  const updatePricing = (
    selectedItems: SELECTED_TYPE[],
    selectedPricingType: string
  ) => {
    return selectedItems.map((item) => {
      const pricingValueString =
        selectedPricingType === "Area5"
          ? "ab 5 Areale"
          : selectedPricingType === "Area3"
          ? "ab 3 Areale"
          : "Einzelpreis pro Behandlung";

      return {
        ...item,
        price:
          item.treatment.pricing[pricingValueString] ||
          item.treatment.pricing["Einzelpreis pro Behandlung"] ||
          item.treatment.pricing["Kurspreis"],
      };
    });
  };

  const addItemToCart = (treatment: Treatment, area: string) => {
    const existingItem = selectedItems.find((item) => item.id === treatment.id);

    if (existingItem) {
      let updatedItems = selectedItems.filter(
        (item) => item.id !== existingItem.id
      );

      const newPricingType =
        updatedItems.length >= 5
          ? "Area5"
          : updatedItems.length >= 3
          ? "Area3"
          : "Area1";

      if (newPricingType !== selectedPricingType) {
        updatedItems = updatePricing(updatedItems, newPricingType);
        setSelectedPricingType(newPricingType as PRICING_TYPE);
      }

      setSelectedItems(updatedItems);
      return;
    }

    const pricingKey =
      selectedPricingType === "Area5"
        ? "ab 5 Areale"
        : selectedPricingType === "Area3"
        ? "ab 3 Areale"
        : "Einzelpreis pro Behandlung";
    const price =
      treatment.pricing[pricingKey] ||
      treatment.pricing["Einzelpreis pro Behandlung"] ||
      treatment.pricing["Kurspreis"];

    const newItem = {
      id: treatment.id,
      gender,
      area,
      treatment,
      selectedTreatment,
      price,
    };
    const updatedItems = [...selectedItems, newItem];

    // Determine the new pricing type after adding the item
    const newPricingType =
      updatedItems.length >= 5
        ? "Area5"
        : updatedItems.length >= 3
        ? "Area3"
        : "Area1";

    if (newPricingType !== selectedPricingType) {
      const updatedItemsWithPricing = updatePricing(
        updatedItems,
        newPricingType
      );
      setSelectedPricingType(newPricingType as PRICING_TYPE);
      setSelectedItems(updatedItemsWithPricing);
    } else {
      setSelectedItems(updatedItems);
    }
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce(
      (total, item) => total + item.price,
      0
    );
    const discount = discountPercent * subtotal * 0.01;

    const total = subtotal - discount;
    return { subtotal, total };
  };

  const { subtotal, total } = calculateTotal();

  return (
    <div className="w-full bg-gray-50 text-white overflow-hidden relative">
      <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-250px)] overflow-auto">
        <Navbar />
        <div className="flex justify-between flex-wrap gap-2 px-5 mb-4">
          <div className=" flex gap-4 ">
            {["Frau", "Mann"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g as Gender)}
                className={`px-6 py-2 rounded-md font-medium ${
                  gender === g
                    ? "bg-[#007A89] text-white"
                    : "bg-gray-200 text-[#007A89]"
                } hover:shadow-md`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <CustomerDialog
              currentGender={gender}
              selectedAreas={selectedItems.map((item) => ({
                name: item.treatment.name,
                price: item.price,
              }))}
              totalPrice={total}
              onSave={(customer) => {
                console.log("Kunde gespeichert:", customer);
                alert(`Kunde ${customer.firstName} ${customer.lastName} wurde gespeichert!`);
              }}
            />
            <QuickNotes
              notes={sessionNotes}
              onNotesChange={setSessionNotes}
            />
            <BeforeAfterGallery
              selectedAreas={selectedItems.map((item) => item.treatment.name)}
            />
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-solid bg-red-600 text-sm text-white hover:bg-red-500"
              onClick={() => {
                setSelectedItems([]);
                setDiscountPercent(0);
                setSessionNotes([]);
              }}
            >
              Zurücksetzen
            </button>
          </div>
        </div>
        {/* <div className="flex  "> */}
        <div className="flex flex-row  px-5 align-middle items-center gap-4 mb-6 flex-wrap">
          {Object.keys(pricingData[gender]).map((treatmentType) => (
            <button
              key={treatmentType}
              onClick={() => setSelectedTreatment(treatmentType)}
              className={`px-4 py-2 border border-solid shadow-md hover:shadow-lg transition-shadow rounded-md ${
                selectedTreatment === treatmentType
                  ? "bg-main-color text-white border-main-color"
                  : "bg-gray-50 text-secondary-color border-gray-300 hover:bg-gray-100"
              }`}
            >
              {treatmentType}
            </button>
          ))}
        </div>

        <PricingTable
          selectedGender={gender}
          selectedTreatment={selectedTreatment}
          selectedItems={selectedItems}
          addItemToCart={addItemToCart}
        />
      </div>
      {/* Payment Section */}
      <Footer
        selectedItems={selectedItems}
        subtotal={subtotal}
        discountPercent={discountPercent}
        setDiscountPercent={setDiscountPercent}
        total={total}
      />
    </div>
  );
};

export default Home;
