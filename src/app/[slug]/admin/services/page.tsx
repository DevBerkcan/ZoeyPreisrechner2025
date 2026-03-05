"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react";

interface ServiceRow {
  id: string;
  gender: string;
  serviceType: string;
  name: string;
  priceArea5: number | null;
  priceArea3: number | null;
  priceSingle: number;
  sortOrder: number;
  isActive: boolean;
}

export default function AdminServicesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState({ gender: "Frau", serviceType: "" });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    gender: "Frau",
    serviceType: "",
    name: "",
    priceArea5: "",
    priceArea3: "",
    priceSingle: "",
  });

  useEffect(() => {
    fetchServices();
  }, [slug]);

  const fetchServices = async () => {
    setLoading(true);
    const res = await fetch(`/api/tenants/${slug}/services`);
    if (res.ok) {
      const data = await res.json();
      setServices(data);
    }
    setLoading(false);
  };

  const updateService = async (service: ServiceRow) => {
    setSaving(service.id);
    await fetch(`/api/tenants/${slug}/services`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    setSaving(null);
  };

  const deleteService = async (id: string) => {
    if (!confirm("Diesen Service wirklich loeschen?")) return;
    await fetch(`/api/tenants/${slug}/services?id=${id}`, { method: "DELETE" });
    setServices(services.filter((s) => s.id !== id));
  };

  const addService = async () => {
    const res = await fetch(`/api/tenants/${slug}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gender: newService.gender,
        serviceType: newService.serviceType,
        name: newService.name,
        priceArea5: newService.priceArea5 ? parseFloat(newService.priceArea5) : null,
        priceArea3: newService.priceArea3 ? parseFloat(newService.priceArea3) : null,
        priceSingle: parseFloat(newService.priceSingle) || 0,
        sortOrder: services.length + 1,
      }),
    });
    if (res.ok) {
      setShowAddForm(false);
      setNewService({ gender: "Frau", serviceType: "", name: "", priceArea5: "", priceArea3: "", priceSingle: "" });
      fetchServices();
    }
  };

  const serviceTypes = [...new Set(services.map((s) => s.serviceType))];

  const filteredServices = services.filter((s) => {
    if (filter.gender && s.gender !== filter.gender) return false;
    if (filter.serviceType && s.serviceType !== filter.serviceType) return false;
    return true;
  });

  const grouped: Record<string, ServiceRow[]> = {};
  filteredServices.forEach((s) => {
    if (!grouped[s.serviceType]) grouped[s.serviceType] = [];
    grouped[s.serviceType].push(s);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-main-color" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href={`/${slug}`}
              className="flex items-center gap-1 text-main-color hover:underline"
            >
              <ArrowLeft size={18} />
              Zurueck
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Services verwalten
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({services.length} Services)
            </span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-main-color text-white rounded-lg hover:bg-opacity-90"
          >
            <Plus size={18} />
            Neuer Service
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <select
            value={filter.gender}
            onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
          >
            <option value="Frau">Frau</option>
            <option value="Mann">Mann</option>
          </select>
          <select
            value={filter.serviceType}
            onChange={(e) => setFilter({ ...filter, serviceType: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
          >
            <option value="">Alle Behandlungen</option>
            {serviceTypes.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">Neuen Service hinzufuegen</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <select
                value={newService.gender}
                onChange={(e) => setNewService({ ...newService, gender: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              >
                <option value="Frau">Frau</option>
                <option value="Mann">Mann</option>
              </select>
              <input
                placeholder="Behandlungsart (z.B. Haarentfernung)"
                value={newService.serviceType}
                onChange={(e) => setNewService({ ...newService, serviceType: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
              <input
                placeholder="Name (z.B. Oberlippe)"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
              <input
                type="number"
                placeholder="Preis ab 5 Areale"
                value={newService.priceArea5}
                onChange={(e) => setNewService({ ...newService, priceArea5: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
              <input
                type="number"
                placeholder="Preis ab 3 Areale"
                value={newService.priceArea3}
                onChange={(e) => setNewService({ ...newService, priceArea3: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
              <input
                type="number"
                placeholder="Einzelpreis *"
                value={newService.priceSingle}
                onChange={(e) => setNewService({ ...newService, priceSingle: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                required
              />
              <button
                onClick={addService}
                disabled={!newService.name || !newService.serviceType || !newService.priceSingle}
                className="px-4 py-2 bg-main-color text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                Hinzufuegen
              </button>
            </div>
          </div>
        )}

        {Object.entries(grouped).map(([serviceType, items]) => (
          <div key={serviceType} className="mb-8">
            <h2 className="text-xl font-bold text-main-color mb-4">
              {serviceType.replace(/_/g, " ")}
            </h2>
            <div className="mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 text-left text-sm text-gray-600 dark:text-gray-300">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3 text-center">ab 5 Areale</th>
                      <th className="px-4 py-3 text-center">ab 3 Areale</th>
                      <th className="px-4 py-3 text-center">Einzelpreis</th>
                      <th className="px-4 py-3 w-24"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {items.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                          {service.name}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={service.priceArea5 ?? ""}
                            onChange={(e) => {
                              const val = e.target.value ? parseFloat(e.target.value) : null;
                              setServices(services.map((s) =>
                                s.id === service.id ? { ...s, priceArea5: val } : s
                              ));
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-center text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={service.priceArea3 ?? ""}
                            onChange={(e) => {
                              const val = e.target.value ? parseFloat(e.target.value) : null;
                              setServices(services.map((s) =>
                                s.id === service.id ? { ...s, priceArea3: val } : s
                              ));
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-center text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={service.priceSingle}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setServices(services.map((s) =>
                                s.id === service.id ? { ...s, priceSingle: val } : s
                              ));
                            }}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded text-center text-sm font-semibold"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateService(service)}
                              className="p-1.5 text-main-color hover:bg-main-color/10 rounded"
                              title="Speichern"
                            >
                              {saving === service.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Save size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => deleteService(service.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              title="Loeschen"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Keine Services gefunden. Erstelle einen neuen Service.
          </div>
        )}
      </div>
    </div>
  );
}
