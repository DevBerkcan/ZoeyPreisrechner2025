"use client";
import React, { useState } from "react";
import Navbar from "./Navbar";
import {
  Gender,
  PRICING_TYPE,
  SELECTED_TYPE,
  Treatment,
  COMPARISON_ITEM,
} from "@/app/types/types";
import { pricingData } from "@/app/data";
import Footer from "./Footer";
import PricingTable from "./PricingTable";
import CustomerDialog from "./CustomerDialog";
import QuickNotes from "./QuickNotes";
import BeforeAfterGallery from "./BeforeAfterGallery";
import ComparisonManager from "./ComparisonManager";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PrintButton } from "./PrintButton";

const Home = () => {
  // Persisted state (localStorage)
  const [gender, setGender, genderLoaded] = useLocalStorage<Gender>("zoey-gender", "Frau");
  const [discountPercent, setDiscountPercent, discountLoaded] = useLocalStorage<number>("zoey-discountPercent", 0);
  const [selectedItems, setSelectedItems, itemsLoaded] = useLocalStorage<SELECTED_TYPE[]>("zoey-selectedItems", []);
  const [sessionNotes, setSessionNotes, notesLoaded] = useLocalStorage<string[]>("zoey-sessionNotes", []);
  const [comparisons, setComparisons, comparisonsLoaded] = useLocalStorage<COMPARISON_ITEM[]>("zoey-comparisons", []);

  // Non-persisted state
  const [selectedTreatment, setSelectedTreatment] = useState<string>("Haarentfernung");
  const [selectedPricingType, setSelectedPricingType] = useState<PRICING_TYPE>("Area1");
  const [showAllTreatments, setShowAllTreatments] = useState<boolean>(false);

  // Check if all localStorage data is loaded
  const isLoaded = genderLoaded && discountLoaded && itemsLoaded && notesLoaded && comparisonsLoaded;

  // Number of treatments to show initially
  const INITIAL_TREATMENTS_COUNT = 4;

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

  // Comparison handlers
  const saveComparison = () => {
    if (selectedItems.length === 0) return;

    const newComparison: COMPARISON_ITEM = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      selectedItems: [...selectedItems],
      subtotal,
      total,
      discountPercent,
      label: `Variante ${comparisons.length + 1}`,
    };
    setComparisons([...comparisons, newComparison]);
  };

  const loadComparison = (comparison: COMPARISON_ITEM) => {
    setSelectedItems(comparison.selectedItems);
    setDiscountPercent(comparison.discountPercent);
    // Update pricing type based on loaded items
    const newPricingType =
      comparison.selectedItems.length >= 5
        ? "Area5"
        : comparison.selectedItems.length >= 3
        ? "Area3"
        : "Area1";
    setSelectedPricingType(newPricingType as PRICING_TYPE);
  };

  const deleteComparison = (id: string) => {
    setComparisons(comparisons.filter((c) => c.id !== id));
  };

  const clearAllComparisons = () => {
    setComparisons([]);
  };

  const handleReset = () => {
    setSelectedItems([]);
    setDiscountPercent(0);
    setSessionNotes([]);
    setComparisons([]);
  };

  // Show loading state while localStorage is being loaded
  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-main-color" />
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 text-white overflow-hidden relative">
      <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-250px)] overflow-auto">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Control Bar */}
          <div className="flex justify-between flex-wrap gap-4 mb-6">
            {/* Gender Selector */}
            <div className="flex gap-3">
              {["Frau", "Mann"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g as Gender)}
                  className={`px-6 py-2.5 rounded-lg font-semibold min-h-[44px] transition-all duration-200 active:scale-95 ${
                    gender === g
                      ? "bg-main-color text-white shadow-lg ring-2 ring-main-color ring-offset-2"
                      : "bg-white text-main-color border-2 border-main-color hover:bg-main-color/10 hover:shadow-md"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <ComparisonManager
                selectedItems={selectedItems}
                subtotal={subtotal}
                total={total}
                discountPercent={discountPercent}
                comparisons={comparisons}
                onSaveComparison={saveComparison}
                onLoadComparison={loadComparison}
                onDeleteComparison={deleteComparison}
                onClearAllComparisons={clearAllComparisons}
              />
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
              <PrintButton />
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 text-sm text-white font-medium min-h-[44px] hover:bg-red-600 hover:shadow-md transition-all duration-200 active:scale-95 no-print"
                onClick={handleReset}
              >
                Zurücksetzen
              </button>
            </div>
          </div>

          {/* Treatment Type Tabs */}
          {(() => {
            const allTreatments = Object.keys(pricingData[gender]);
            const visibleTreatments = showAllTreatments
              ? allTreatments
              : allTreatments.slice(0, INITIAL_TREATMENTS_COUNT);
            const hasMoreTreatments = allTreatments.length > INITIAL_TREATMENTS_COUNT;
            const hiddenCount = allTreatments.length - INITIAL_TREATMENTS_COUNT;

            return (
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {visibleTreatments.map((treatmentType) => (
                    <button
                      key={treatmentType}
                      onClick={() => setSelectedTreatment(treatmentType)}
                      className={`px-4 py-3 min-h-[48px] border-2 rounded-lg font-medium transition-all duration-200 active:scale-95 ${
                        selectedTreatment === treatmentType
                          ? "bg-main-color text-white border-main-color shadow-lg scale-[1.02]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-main-color hover:shadow-md hover:bg-gray-50"
                      }`}
                    >
                      {treatmentType.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>

                {/* Expand/Collapse Button */}
                {hasMoreTreatments && (
                  <button
                    onClick={() => setShowAllTreatments(!showAllTreatments)}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-main-color bg-main-color/5 hover:bg-main-color/10 rounded-lg transition-all duration-200"
                  >
                    {showAllTreatments ? (
                      <>
                        <span>Weniger anzeigen</span>
                        <ChevronUp size={18} />
                      </>
                    ) : (
                      <>
                        <span>Weitere Behandlungen anzeigen ({hiddenCount})</span>
                        <ChevronDown size={18} />
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })()}
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <PricingTable
            selectedGender={gender}
            selectedTreatment={selectedTreatment}
            selectedItems={selectedItems}
            addItemToCart={addItemToCart}
          />
        </div>
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
