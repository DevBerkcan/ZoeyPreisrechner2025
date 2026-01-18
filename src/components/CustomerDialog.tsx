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
import { UserPlus } from "lucide-react";

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
}

const CustomerDialog = ({
  onSave,
  currentGender = "Frau",
  selectedAreas = [],
  totalPrice = 0
}: CustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CustomerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: currentGender,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName) {
      alert("Bitte Vorname und Nachname eingeben");
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
        setOpen(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          gender: currentGender,
          notes: "",
        });
      } else {
        alert("Fehler beim Speichern des Kunden");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Fehler beim Speichern");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-main-color text-white text-sm hover:bg-opacity-90 transition-colors">
          <UserPlus size={18} />
          Neuer Kunde
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neuen Kunden anlegen</DialogTitle>
          <DialogDescription>
            Erfasse die Kundendaten für das Beratungsgespräch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vorname *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nachname *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-Mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Geschlecht
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
            >
              <option value="Frau">Frau</option>
              <option value="Mann">Mann</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notizen (Hauttyp, Allergien, etc.)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
              placeholder="z.B. empfindliche Haut, keine Allergien bekannt..."
            />
          </div>

          {selectedAreas.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Ausgewählte Areale werden gespeichert:
              </p>
              <ul className="text-sm text-gray-600">
                {selectedAreas.map((area, index) => (
                  <li key={index}>• {area.name} - {area.price}€</li>
                ))}
              </ul>
              <p className="text-sm font-bold mt-2">Gesamt: {totalPrice}€</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-main-color text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Speichern..." : "Kunde speichern"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
