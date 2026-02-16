"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Search,
  Plus,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Settings,
  Trash2,
  Power,
  Loader2,
  Users,
  Layers,
} from "lucide-react";

interface TenantWithCounts {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  mainColor: string;
  secondaryColor: string;
  contactEmail: string | null;
  contactPhone: string | null;
  website: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    services: number;
    customers: number;
    admins: number;
  };
}

export default function ControlPlatformPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tenants, setTenants] = useState<TenantWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [toggling, setToggling] = useState<string | null>(null);

  // Neuer Mandant Formular
  const [showAddForm, setShowAddForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    slug: "",
    mainColor: "#059669",
    secondaryColor: "#D4A574",
    logoUrl: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    adminUsername: "",
    adminPassword: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTenants();
    }
  }, [status]);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tenants");
      if (res.ok) {
        const data = await res.json();
        setTenants(data);
      }
    } catch (error) {
      console.error("Fehler beim Laden:", error);
    }
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[äÄ]/g, "ae")
      .replace(/[öÖ]/g, "oe")
      .replace(/[üÜ]/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string) => {
    setNewTenant({
      ...newTenant,
      name,
      slug: generateSlug(name),
    });
  };

  const createTenant = async () => {
    if (!newTenant.name || !newTenant.slug) return;
    setCreating(true);
    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTenant),
      });

      if (res.ok) {
        setShowAddForm(false);
        setNewTenant({
          name: "",
          slug: "",
          mainColor: "#059669",
          secondaryColor: "#D4A574",
          logoUrl: "",
          contactEmail: "",
          contactPhone: "",
          website: "",
          adminUsername: "",
          adminPassword: "",
        });
        fetchTenants();
      } else {
        const error = await res.json();
        alert(error.error || "Fehler beim Erstellen");
      }
    } catch (error) {
      console.error("Fehler:", error);
      alert("Fehler beim Erstellen des Mandanten");
    }
    setCreating(false);
  };

  const toggleActive = async (tenant: TenantWithCounts) => {
    setToggling(tenant.id);
    try {
      await fetch("/api/tenants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tenant.id, isActive: !tenant.isActive }),
      });
      setTenants(
        tenants.map((t) =>
          t.id === tenant.id ? { ...t, isActive: !t.isActive } : t
        )
      );
    } catch (error) {
      console.error("Fehler:", error);
    }
    setToggling(null);
  };

  const deleteTenant = async (id: string, name: string) => {
    if (
      !confirm(
        `"${name}" wirklich loeschen?\n\nAlle Services, Kunden und Zugaenge werden unwiderruflich geloescht!`
      )
    )
      return;

    try {
      await fetch(`/api/tenants?id=${id}`, { method: "DELETE" });
      setTenants(tenants.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Fehler:", error);
    }
  };

  // Filter + Suche
  const filteredTenants = tenants.filter((t) => {
    if (statusFilter === "active" && !t.isActive) return false;
    if (statusFilter === "inactive" && t.isActive) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        t.name.toLowerCase().includes(term) ||
        t.slug.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Stats
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.isActive).length;
  const inactiveTenants = totalTenants - activeTenants;
  const totalServices = tenants.reduce((sum, t) => sum + t._count.services, 0);
  const totalCustomers = tenants.reduce(
    (sum, t) => sum + t._count.customers,
    0
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-emerald-600 hover:underline"
            >
              <ArrowLeft size={18} />
              Zurueck
            </Link>
            <div className="flex items-center gap-2">
              <Building2 size={24} className="text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Control Platform
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTenants}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Aktualisieren"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <Plus size={18} />
              Neuer Mandant
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Gesamt</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {totalTenants}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Aktiv</p>
            <p className="text-2xl font-bold text-green-600">{activeTenants}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Inaktiv</p>
            <p className="text-2xl font-bold text-red-500">{inactiveTenants}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Services</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {totalServices}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Kunden</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {totalCustomers}
            </p>
          </div>
        </div>

        {/* Suche + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Suche nach Name oder Slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === f
                    ? "bg-emerald-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {f === "all" ? "Alle" : f === "active" ? "Aktiv" : "Inaktiv"}
              </button>
            ))}
          </div>
        </div>

        {/* Neuer Mandant Formular */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">
              Neuen Mandanten anlegen
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name + Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Name *
                </label>
                <input
                  placeholder="z.B. Beauty Salon München"
                  value={newTenant.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Slug (URL-Pfad) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 dark:text-gray-500 text-sm">/</span>
                  <input
                    value={newTenant.slug}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, slug: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Farben */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Hauptfarbe
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newTenant.mainColor}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, mainColor: e.target.value })
                    }
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={newTenant.mainColor}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, mainColor: e.target.value })
                    }
                    className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Sekundaerfarbe
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newTenant.secondaryColor}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        secondaryColor: e.target.value,
                      })
                    }
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={newTenant.secondaryColor}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        secondaryColor: e.target.value,
                      })
                    }
                    className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg font-mono text-sm"
                  />
                </div>
              </div>

              {/* Logo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Logo URL (optional)
                </label>
                <input
                  placeholder="/assets/logo.png"
                  value={newTenant.logoUrl}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, logoUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                />
              </div>

              {/* Kontakt */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  E-Mail (optional)
                </label>
                <input
                  type="email"
                  placeholder="info@example.com"
                  value={newTenant.contactEmail}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, contactEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Telefon (optional)
                </label>
                <input
                  type="tel"
                  placeholder="+49 123 456789"
                  value={newTenant.contactPhone}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, contactPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                />
              </div>
            </div>

            {/* Erster Zugang */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                Erster Zugang (optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Benutzername"
                  value={newTenant.adminUsername}
                  onChange={(e) =>
                    setNewTenant({
                      ...newTenant,
                      adminUsername: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Passwort"
                  value={newTenant.adminPassword}
                  onChange={(e) =>
                    setNewTenant({
                      ...newTenant,
                      adminPassword: e.target.value,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Abbrechen
              </button>
              <button
                onClick={createTenant}
                disabled={!newTenant.name || !newTenant.slug || creating}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {creating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                Mandant erstellen
              </button>
            </div>
          </div>
        )}

        {/* Mandanten-Tabelle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 text-left text-sm text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Farben</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3 text-center">
                    <Layers size={14} className="inline mr-1" />
                    Services
                  </th>
                  <th className="px-4 py-3 text-center">
                    <Users size={14} className="inline mr-1" />
                    Kunden
                  </th>
                  <th className="px-4 py-3 text-center">Zugaenge</th>
                  <th className="px-4 py-3 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredTenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      !tenant.isActive ? "opacity-60" : ""
                    }`}
                  >
                    {/* Status */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(tenant)}
                        disabled={toggling === tenant.id}
                        className="group relative"
                        title={
                          tenant.isActive
                            ? "Klicken zum Deaktivieren"
                            : "Klicken zum Aktivieren"
                        }
                      >
                        {toggling === tenant.id ? (
                          <Loader2
                            size={16}
                            className="animate-spin text-gray-400"
                          />
                        ) : (
                          <div
                            className={`w-3 h-3 rounded-full ${
                              tenant.isActive ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                        )}
                      </button>
                    </td>

                    {/* Farben */}
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                          style={{ backgroundColor: tenant.mainColor }}
                          title={`Hauptfarbe: ${tenant.mainColor}`}
                        />
                        <div
                          className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                          style={{ backgroundColor: tenant.secondaryColor }}
                          title={`Sekundaer: ${tenant.secondaryColor}`}
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800 dark:text-gray-100">
                        {tenant.name}
                      </span>
                    </td>

                    {/* Slug */}
                    <td className="px-4 py-3">
                      <code className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        /{tenant.slug}
                      </code>
                    </td>

                    {/* Services */}
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                      {tenant._count.services}
                    </td>

                    {/* Kunden */}
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                      {tenant._count.customers}
                    </td>

                    {/* Zugaenge */}
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                      {tenant._count.admins}
                    </td>

                    {/* Aktionen */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/tenants/${tenant.id}`}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded"
                          title="Bearbeiten"
                        >
                          <Settings size={16} />
                        </Link>
                        <Link
                          href={`/${tenant.slug}/admin/services`}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          title="Services verwalten"
                        >
                          <Layers size={16} />
                        </Link>
                        <a
                          href={`/${tenant.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Preisrechner oeffnen"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => toggleActive(tenant)}
                          disabled={toggling === tenant.id}
                          className={`p-1.5 rounded ${
                            tenant.isActive
                              ? "text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                              : "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                          title={
                            tenant.isActive ? "Deaktivieren" : "Aktivieren"
                          }
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => deleteTenant(tenant.id, tenant.name)}
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

          {filteredTenants.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== "all"
                ? "Keine Mandanten gefunden."
                : "Noch keine Mandanten vorhanden. Erstelle den ersten Mandanten."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
