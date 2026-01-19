"use client";

import { useState } from "react";
import { Save, Scale, Trash2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { COMPARISON_ITEM, SELECTED_TYPE } from "@/app/types/types";

interface ComparisonManagerProps {
  selectedItems: SELECTED_TYPE[];
  subtotal: number;
  total: number;
  discountPercent: number;
  comparisons: COMPARISON_ITEM[];
  onSaveComparison: () => void;
  onLoadComparison: (comparison: COMPARISON_ITEM) => void;
  onDeleteComparison: (id: string) => void;
  onClearAllComparisons: () => void;
}

const ComparisonManager = ({
  selectedItems,
  comparisons,
  onSaveComparison,
  onLoadComparison,
  onDeleteComparison,
  onClearAllComparisons,
}: ComparisonManagerProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Save Button */}
      <button
        onClick={onSaveComparison}
        disabled={selectedItems.length === 0}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-main-color text-white text-sm font-medium min-h-[44px] hover:bg-main-color/90 hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save size={16} />
        <span className="hidden sm:inline">Zwischenspeichern</span>
      </button>

      {/* View Comparisons Button */}
      <button
        onClick={() => setShowModal(true)}
        disabled={comparisons.length === 0}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-main-color text-main-color text-sm font-medium min-h-[44px] hover:bg-main-color/10 hover:shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Scale size={16} />
        <span className="hidden sm:inline">Vergleich</span>
        {comparisons.length > 0 && (
          <span className="bg-secondary-color text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {comparisons.length}
          </span>
        )}
      </button>

      {/* Comparison Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-main-color">
              <Scale size={20} />
              Gespeicherte Varianten ({comparisons.length})
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {comparisons.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Scale size={48} className="mx-auto mb-4 opacity-30" />
                <p>Noch keine Varianten gespeichert.</p>
                <p className="text-sm mt-2">
                  Wähle Areale aus und klicke auf &quot;Zwischenspeichern&quot;.
                </p>
              </div>
            ) : (
              comparisons.map((comparison) => (
                <div
                  key={comparison.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-main-color transition-colors"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-main-color text-lg">
                        {comparison.label}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(comparison.timestamp).toLocaleString("de-DE")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-main-color">
                        {comparison.total.toFixed(2)}€
                      </p>
                      {comparison.discountPercent > 0 && (
                        <p className="text-xs text-gray-500">
                          inkl. {comparison.discountPercent}% Rabatt
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Selected Areas */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">
                      {comparison.selectedItems.length} Behandlung(en):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {comparison.selectedItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-main-color/10 text-main-color px-2 py-1 rounded-full"
                        >
                          {item.treatment.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        onLoadComparison(comparison);
                        setShowModal(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-main-color text-white text-sm font-medium rounded-lg hover:bg-main-color/90 transition-colors"
                    >
                      <Upload size={14} />
                      Laden
                    </button>
                    <button
                      onClick={() => onDeleteComparison(comparison.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="border-t pt-4 flex gap-2">
            {comparisons.length > 0 && (
              <button
                onClick={() => {
                  onClearAllComparisons();
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                Alle löschen
              </button>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors ml-auto"
            >
              <X size={16} />
              Schließen
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComparisonManager;
