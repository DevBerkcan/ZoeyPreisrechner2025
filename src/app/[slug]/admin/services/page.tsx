"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Loader2, Settings } from "lucide-react";

interface ServiceType {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

interface ServiceRow {
  id: string;
  gender: string;
  serviceTypeId: string;
  serviceType: ServiceType;
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
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [filter, setFilter] = useState({ gender: "Frau", serviceTypeId: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [newService, setNewService] = useState({
    gender: "Frau",
    serviceTypeId: "",
    name: "",
    priceArea5: "",
    priceArea3: "",
    priceSingle: "",
  });
  const [newServiceTypeName, setNewServiceTypeName] = useState("");
  const [addingType, setAddingType] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [slug]);

  const fetchAll = async () => {
    setLoading(true);
    const [servicesRes, typesRes] = await Promise.all([
      fetch(`/api/tenants/${slug}/services`),
      fetch(`/api/tenants/${slug}/service-types`),
    ]);
    if (servicesRes.ok) setServices(await servicesRes.json());
    if (typesRes.ok) setServiceTypes(await typesRes.json());
    setLoading(false);
  };

  const fetchServiceTypes = async () => {
    const res = await fetch(`/api/tenants/${slug}/service-types`);
    if (res.ok) setServiceTypes(await res.json());
  };

  const updateService = async (service: ServiceRow) => {
    setSaving(service.id);
    await fetch(`/api/tenants/${slug}/services`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: service.id,
        gender: service.gender,
        serviceTypeId: service.serviceTypeId,
        name: service.name,
        priceArea5: service.priceArea5,
        priceArea3: service.priceArea3,
        priceSingle: service.priceSingle,
        sortOrder: service.sortOrder,
        isActive: service.isActive,
      }),
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
        serviceTypeId: newService.serviceTypeId,
        name: newService.name,
        priceArea5: newService.priceArea5 ? parseFloat(newService.priceArea5) : null,
        priceArea3: newService.priceArea3 ? parseFloat(newService.priceArea3) : null,
        priceSingle: parseFloat(newService.priceSingle) || 0,
        sortOrder: services.length + 1,
      }),
    });
    if (res.ok) {
      setShowAddForm(false);
      setNewService({ gender: "Frau", serviceTypeId: "", name: "", priceArea5: "", priceArea3: "", priceSingle: "" });
      fetchAll();
    }
  };

  const addServiceType = async () => {
    if (!newServiceTypeName) return;
    setAddingType(true);
    const res = await fetch(`/api/tenants/${slug}/service-types`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newServiceTypeName, sortOrder: serviceTypes.length }),
    });
    if (res.ok) {
      setNewServiceTypeName("");
      await fetchServiceTypes();
    }
    setAddingType(false);
  };

  const deleteServiceType = async (id: string) => {
    if (!confirm("Behandlungsart loeschen? Alle zugehoerigen Services werden ebenfalls geloescht.")) return;
    await fetch(`/api/tenants/${slug}/service-types?id=${id}`, { method: "DELETE" });
    await fetchAll();
  };

  const filteredServices = services.filter((s) => {
    if (s.gender !== filter.gender) return false;
    if (filter.serviceTypeId && s.serviceTypeId !== filter.serviceTypeId) return false;
    return true;
  });

  const grouped: Record<string, ServiceRow[]> = {};
  filteredServices.forEach((s) => {
    const key = s.serviceType.name;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
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
            <Link href={`/${slug}`} className="flex items-center gap-1 text-main-color hover:underline">
              <ArrowLeft size={18} />
              Zurück
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Services verwalten</h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">({services.length} Services)</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTypeManager(!showTypeManager)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-main-color text-main-color rounded-lg hover:bg-main-color/10"
            >
              <Settings size={18} />
              Behandlungsarten
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-main-color text-white rounded-lg hover:bg-opacity-90"
            >
              <Plus size={18} />
              Neuer Service
            </button>
          </div>
        </div>

        {showTypeManager && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">Behandlungsarten verwalten</h2>
            <div className="flex gap-3 mb-4">
              <input
                placeholder="Name der Behandlungsart (z.B. Haarentfernung)"
                value={newServiceTypeName}
                onChange={(e) => setNewServiceTypeName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addServiceType()}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
              <button
                onClick={addServiceType}
                disabled={!newServiceTypeName || addingType}
                className="px-4 py-2 bg-main-color text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {addingType ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Hinzufuegen
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {serviceTypes.map((st) => (
                <div key={st.id} className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{st.name}</span>
                  <button
                    onClick={() => deleteServiceType(st.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <select
            value={filter.gender}
            onChange={(e) => setFilter({ ...filter, gender: e.target.value, serviceTypeId: "" })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
          >
            <option value="Frau">Frau</option>
            <option value="Mann">Mann</option>
          </select>
          <select
            value={filter.serviceTypeId}
            onChange={(e) => setFilter({ ...filter, serviceTypeId: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
          >
            <option value="">Alle Behandlungsarten</option>
            {serviceTypes.map((st) => (
              <option key={st.id} value={st.id}>{st.name}</option>
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
              <select
                value={newService.serviceTypeId}
                onChange={(e) => setNewService({ ...newService, serviceTypeId: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              >
                <option value="">Behandlungsart waehlen *</option>
                {serviceTypes.map((st) => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
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
                disabled={!newService.name || !newService.serviceTypeId || !newService.priceSingle}
                className="px-4 py-2 bg-main-color text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                Hinzufuegen
              </button>
            </div>
          </div>
        )}

        {Object.entries(grouped).map(([serviceTypeName, items]) => (
          <div key={serviceTypeName} className="mb-8">
            <h2 className="text-xl font-bold text-main-color mb-4">{serviceTypeName}</h2>
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
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{service.name}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={service.priceArea5 ?? ""}
                          onChange={(e) => {
                            const val = e.target.value ? parseFloat(e.target.value) : null;
                            setServices(services.map((s) => s.id === service.id ? { ...s, priceArea5: val } : s));
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
                            setServices(services.map((s) => s.id === service.id ? { ...s, priceArea3: val } : s));
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
                            setServices(services.map((s) => s.id === service.id ? { ...s, priceSingle: val } : s));
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
                            {saving === service.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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
        ))}

        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Keine Services gefunden. Erstelle zuerst eine Behandlungsart, dann einen neuen Service.
          </div>
        )}
      </div>
    </div>
  );
}
