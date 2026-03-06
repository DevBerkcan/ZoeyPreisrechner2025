"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
  Plus,
  ExternalLink,
  Layers,
  Users,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";

interface TenantData {
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
}

interface AdminData {
  id: string;
  username: string;
  tenantId: string | null;
  updateAt: string;
}

export default function TenantDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;

  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Neuer Admin
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "" });
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // Passwort aendern
  const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && tenantId) {
      fetchData();
    }
  }, [status, tenantId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tenantsRes, adminsRes] = await Promise.all([
        fetch("/api/tenants"),
        fetch(`/api/admins?tenantId=${tenantId}`),
      ]);

      if (tenantsRes.ok) {
        const tenants = await tenantsRes.json();
        const found = tenants.find(
          (t: TenantData & { _count?: unknown }) => t.id === tenantId
        );
        if (found) {
          setTenant(found);
        } else {
          setError("Mandant nicht gefunden");
        }
      }

      if (adminsRes.ok) {
        const data = await adminsRes.json();
        setAdmins(data);
      }
    } catch (err) {
      console.error("Fehler:", err);
      setError("Fehler beim Laden der Daten");
    }
    setLoading(false);
  };

  const saveTenant = async () => {
    if (!tenant) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/tenants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          logoUrl: tenant.logoUrl || null,
          mainColor: tenant.mainColor,
          secondaryColor: tenant.secondaryColor,
          contactEmail: tenant.contactEmail || null,
          contactPhone: tenant.contactPhone || null,
          website: tenant.website || null,
          isActive: tenant.isActive,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Fehler beim Speichern");
      }
    } catch (err) {
      console.error("Fehler:", err);
      setError("Fehler beim Speichern");
    }
    setSaving(false);
  };

  const deleteTenant = async () => {
    if (!tenant) return;
    if (
      !confirm(
        `"${tenant.name}" wirklich loeschen?\n\nAlle Services, Kunden und Zugaenge werden unwiderruflich geloescht!`
      )
    )
      return;

    try {
      await fetch(`/api/tenants?id=${tenant.id}`, { method: "DELETE" });
      router.push("/admin/tenants");
    } catch (err) {
      console.error("Fehler:", err);
    }
  };

  const addAdmin = async () => {
    if (!newAdmin.username || !newAdmin.password) return;
    setCreatingAdmin(true);

    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newAdmin.username,
          password: newAdmin.password,
          tenantId,
        }),
      });

      if (res.ok) {
        setNewAdmin({ username: "", password: "" });
        const adminsRes = await fetch(`/api/admins?tenantId=${tenantId}`);
        if (adminsRes.ok) setAdmins(await adminsRes.json());
      }
    } catch (err) {
      console.error("Fehler:", err);
    }
    setCreatingAdmin(false);
  };

  const updateAdminPassword = async (adminId: string) => {
    if (!newPassword) return;

    try {
      await fetch("/api/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: adminId, password: newPassword }),
      });
      setEditingPasswordId(null);
      setNewPassword("");
    } catch (err) {
      console.error("Fehler:", err);
    }
  };

  const deleteAdmin = async (adminId: string, username: string) => {
    if (!confirm(`Zugang "${username}" wirklich loeschen?`)) return;

    try {
      await fetch(`/api/admins?id=${adminId}`, { method: "DELETE" });
      setAdmins(admins.filter((a) => a.id !== adminId));
    } catch (err) {
      console.error("Fehler:", err);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!session || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          {error || "Mandant nicht gefunden"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/tenants"
              className="flex items-center gap-1 text-emerald-600 hover:underline"
            >
              <ArrowLeft size={18} />
              Zurück
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {tenant.name}
            </h1>
            <div
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                tenant.isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {tenant.isActive ? "Aktiv" : "Inaktiv"}
            </div>
          </div>
        </div>

        {/* Meldungen */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm">
            Aenderungen gespeichert!
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Sektion 1: Grundeinstellungen */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">
            Grundeinstellungen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Name
              </label>
              <input
                value={tenant.name}
                onChange={(e) =>
                  setTenant({ ...tenant, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Slug (URL-Pfad)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">/</span>
                <input
                  value={tenant.slug}
                  onChange={(e) =>
                    setTenant({ ...tenant, slug: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg font-mono"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </label>
              <button
                onClick={() =>
                  setTenant({ ...tenant, isActive: !tenant.isActive })
                }
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  tenant.isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    tenant.isActive ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tenant.isActive ? "Aktiv" : "Inaktiv"}
              </span>
            </div>
          </div>
        </div>

        {/* Sektion 2: Branding */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">
            Branding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Hauptfarbe
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={tenant.mainColor}
                  onChange={(e) =>
                    setTenant({ ...tenant, mainColor: e.target.value })
                  }
                  className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={tenant.mainColor}
                  onChange={(e) =>
                    setTenant({ ...tenant, mainColor: e.target.value })
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
                  value={tenant.secondaryColor}
                  onChange={(e) =>
                    setTenant({ ...tenant, secondaryColor: e.target.value })
                  }
                  className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                />
                <input
                  type="text"
                  value={tenant.secondaryColor}
                  onChange={(e) =>
                    setTenant({ ...tenant, secondaryColor: e.target.value })
                  }
                  className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Live-Vorschau */}
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-4">
            <div
              className="p-4 flex items-center justify-between"
              style={{ backgroundColor: tenant.mainColor }}
            >
              <span className="text-white font-bold text-lg">
                {tenant.name || "Vorschau"}
              </span>
              <div className="flex gap-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white/30"
                  style={{ backgroundColor: tenant.secondaryColor }}
                />
              </div>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <button
                  className="px-4 py-2 rounded-lg text-white text-sm"
                  style={{ backgroundColor: tenant.mainColor }}
                >
                  Beispiel Button
                </button>
                <span
                  className="text-sm font-medium"
                  style={{ color: tenant.mainColor }}
                >
                  Link-Farbe
                </span>
                <span
                  className="px-2 py-1 rounded text-xs text-white"
                  style={{ backgroundColor: tenant.secondaryColor }}
                >
                  Akzent
                </span>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Logo URL
            </label>
            <input
              value={tenant.logoUrl || ""}
              onChange={(e) =>
                setTenant({ ...tenant, logoUrl: e.target.value || null })
              }
              placeholder="/assets/logo.png"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg mb-2"
            />
            {tenant.logoUrl ? (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tenant.logoUrl}
                  alt="Logo Vorschau"
                  className="max-h-20 object-contain"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-400">Kein Logo hinterlegt</p>
            )}
          </div>
        </div>

        {/* Sektion 3: Kontakt */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">
            Kontaktinformationen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                value={tenant.contactEmail || ""}
                onChange={(e) =>
                  setTenant({
                    ...tenant,
                    contactEmail: e.target.value || null,
                  })
                }
                placeholder="info@example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={tenant.contactPhone || ""}
                onChange={(e) =>
                  setTenant({
                    ...tenant,
                    contactPhone: e.target.value || null,
                  })
                }
                placeholder="+49 123 456789"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Webseite
              </label>
              <input
                type="url"
                value={tenant.website || ""}
                onChange={(e) =>
                  setTenant({ ...tenant, website: e.target.value || null })
                }
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Sektion 4: Zugaenge */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">
            <Key size={18} className="inline mr-2" />
            Zugaenge ({admins.length})
          </h2>

          {/* Admin-Liste */}
          {admins.length > 0 ? (
            <div className="space-y-3 mb-4">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {admin.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingPasswordId === admin.id ? (
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <input
                            type={showPassword[admin.id] ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Neues Passwort"
                            className="w-40 px-3 py-1.5 pr-8 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded text-sm"
                          />
                          <button
                            onClick={() =>
                              setShowPassword({
                                ...showPassword,
                                [admin.id]: !showPassword[admin.id],
                              })
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showPassword[admin.id] ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={() => updateAdminPassword(admin.id)}
                          disabled={!newPassword}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Speichern
                        </button>
                        <button
                          onClick={() => {
                            setEditingPasswordId(null);
                            setNewPassword("");
                          }}
                          className="px-3 py-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm"
                        >
                          Abbrechen
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingPasswordId(admin.id)}
                          className="px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded"
                        >
                          Passwort aendern
                        </button>
                        <button
                          onClick={() =>
                            deleteAdmin(admin.id, admin.username)
                          }
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Loeschen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">
              Keine Zugaenge vorhanden.
            </p>
          )}

          {/* Neuen Zugang hinzufuegen */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <input
              placeholder="Benutzername"
              value={newAdmin.username}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, username: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={newAdmin.password}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, password: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm"
            />
            <button
              onClick={addAdmin}
              disabled={
                !newAdmin.username || !newAdmin.password || creatingAdmin
              }
              className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              {creatingAdmin ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Plus size={14} />
              )}
              Hinzufuegen
            </button>
          </div>
        </div>

        {/* Sektion 5: Schnelllinks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100">
            Schnelllinks
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${tenant.slug}/admin/services`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm"
            >
              <Layers size={16} />
              Services verwalten
            </Link>
            <Link
              href={`/admin/customers`}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-sm"
            >
              <Users size={16} />
              Kunden ansehen
            </Link>
            <a
              href={`/${tenant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
            >
              <ExternalLink size={16} />
              Preisrechner oeffnen
            </a>
          </div>
        </div>

        {/* Footer Aktionen */}
        <div className="flex items-center justify-between">
          <button
            onClick={deleteTenant}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <Trash2 size={16} />
            Mandant loeschen
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/tenants"
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Abbrechen
            </Link>
            <button
              onClick={saveTenant}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
