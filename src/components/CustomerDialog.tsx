"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, CheckCircle, FilePlus, X, AlertCircle } from "lucide-react";
import { PDFButton } from "./PDFButton";
import { EmailButton } from "./EmailButton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface CustomerData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  notes: string;
}

interface CustomerDialogProps {
  onSave: (customer: CustomerData) => void;
  currentGender?: string;
  selectedAreas?: { name: string; price: number }[];
  totalPrice?: number;
  triggerClassName?: string;
  triggerLabel?: string;
}

const CustomerDialog = ({
  onSave,
  currentGender = "Frau",
  selectedAreas = [],
  totalPrice = 0,
  triggerClassName,
  triggerLabel,
}: CustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedCustomer, setSavedCustomer] = useState<CustomerData | null>(null);
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const [formData, setFormData] = useState<CustomerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: currentGender,
    notes: "",
  });

  const showError = (message: string) => {
    setErrorDialog({ open: true, message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName) {
      showError("Bitte Vorname und Nachname eingeben.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          selectedAreas,
          totalPrice,
        }),
      });

      if (response.ok) {
        const customer = await response.json();
        onSave(customer);
        setSavedCustomer(formData);
      } else {
        showError("Fehler beim Speichern des Kunden. Bitte versuchen Sie es erneut.");
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSavedCustomer(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: currentGender,
      notes: "",
    });
  };

  const defaultTriggerClass =
    "flex items-center gap-2 px-4 py-2.5 rounded-lg bg-main-color text-white text-sm font-medium min-h-[44px] hover:opacity-90 hover:shadow-md transition-all duration-200 active:scale-95";

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className={triggerClassName ?? defaultTriggerClass}>
            <UserPlus size={18} />
            {triggerLabel ?? "Neuer Kunde"}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {savedCustomer ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2" style={{ color: "#c49994" }}>
                  <CheckCircle size={24} />
                  Kunde gespeichert!
                </DialogTitle>
                <DialogDescription>
                  {savedCustomer.firstName} {savedCustomer.lastName} wurde erfolgreich angelegt.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#c4999420" }}>
                  <p className="text-sm mb-3" style={{ color: "#c49994" }}>
                    Jetzt können Sie ein Angebot als PDF erstellen oder per E-Mail versenden.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <PDFButton
                      customerName={`${savedCustomer.firstName} ${savedCustomer.lastName}`}
                      customerEmail={savedCustomer.email}
                      customerPhone={savedCustomer.phone}
                      gender={savedCustomer.gender}
                      selectedAreas={selectedAreas}
                      subtotal={selectedAreas.reduce((sum, a) => sum + a.price, 0)}
                      discountPercent={0}
                      total={totalPrice}
                    />
                    {savedCustomer.email && (
                      <EmailButton
                        customerName={`${savedCustomer.firstName} ${savedCustomer.lastName}`}
                        customerEmail={savedCustomer.email}
                        customerPhone={savedCustomer.phone}
                        gender={savedCustomer.gender}
                        selectedAreas={selectedAreas}
                        subtotal={selectedAreas.reduce((sum, a) => sum + a.price, 0)}
                        discountPercent={0}
                        total={totalPrice}
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <FilePlus size={16} />
                    Neuen Kunden anlegen
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-main-color text-white rounded-lg hover:opacity-90 transition-colors"
                  >
                    <CheckCircle size={16} />
                    Fertig
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Neuen Kunden anlegen</DialogTitle>
                <DialogDescription>
                  Erfasse die Kundendaten für das Beratungsgespräch.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Vorname *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Nachname *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Geschlecht
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color"
                  >
                    <option value="Frau">Frau</option>
                    <option value="Mann">Mann</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Notizen (Hauttyp, Allergien, etc.)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color"
                    placeholder="z.B. empfindliche Haut, keine Allergien bekannt..."
                  />
                </div>

                {selectedAreas.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Ausgewählte Areale:
                    </p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-0.5">
                      {selectedAreas.map((area, index) => (
                        <li key={index}>
                          • {area.name} — {area.price}€
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-bold mt-2 text-gray-800 dark:text-gray-100">
                      Gesamt: {totalPrice}€
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={16} />
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-main-color text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
                  >
                    <UserPlus size={16} />
                    {loading ? "Speichern..." : "Kunde speichern"}
                  </button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={errorDialog.open}
        onOpenChange={(open) => setErrorDialog({ open, message: open ? errorDialog.message : "" })}
        title="Hinweis"
        description={errorDialog.message}
        confirmLabel="OK"
        cancelLabel=""
        variant="warning"
        icon={<AlertCircle size={20} />}
        onConfirm={() => setErrorDialog({ open: false, message: "" })}
      />
    </>
  );
};

export default CustomerDialog;
