"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
  Trash2,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  gender: string;
  notes: string | null;
  selectedAreas: { name: string; price: number }[] | null;
  totalPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function CustomersAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchCustomers();
    }
  }, [session]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Kunden:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm("Möchten Sie diesen Kunden wirklich löschen?")) return;
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCustomers(customers.filter((c) => c.id !== id));
      } else {
        alert("Fehler beim Löschen des Kunden");
      }
    } catch (error) {
      console.error("Fehler:", error);
      alert("Fehler beim Löschen");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-main-color" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              Kundenverwaltung
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({customers.length} Kunden)
            </span>
          </div>
          <button
            onClick={fetchCustomers}
            className="flex items-center gap-2 px-4 py-2 bg-main-color text-white rounded-lg hover:bg-opacity-90"
          >
            <RefreshCw size={16} />
            Aktualisieren
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Gesamt Kunden</p>
            <p className="text-2xl font-bold text-main-color">{customers.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Frauen</p>
            <p className="text-2xl font-bold text-pink-600">
              {customers.filter((c) => c.gender === "Frau").length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Männer</p>
            <p className="text-2xl font-bold text-blue-600">
              {customers.filter((c) => c.gender === "Mann").length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Kunden suchen (Name, E-Mail, Telefon)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-main-color"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {searchTerm ? "Keine Kunden gefunden" : "Noch keine Kunden angelegt"}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() =>
                      setExpandedCustomer(
                        expandedCustomer === customer.id ? null : customer.id
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            customer.gender === "Frau" ? "bg-pink-500" : "bg-blue-500"
                          }`}
                        >
                          {customer.firstName.charAt(0)}
                          {customer.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-100">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            {customer.email && (
                              <span className="flex items-center gap-1">
                                <Mail size={14} />
                                {customer.email}
                              </span>
                            )}
                            {customer.phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={14} />
                                {customer.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {customer.totalPrice && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-medium">
                            {customer.totalPrice.toFixed(2)}€
                          </span>
                        )}
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(customer.createdAt)}
                        </span>
                        {expandedCustomer === customer.id ? (
                          <ChevronUp className="text-gray-400" size={18} />
                        ) : (
                          <ChevronDown className="text-gray-400" size={18} />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedCustomer === customer.id && (
                    <div className="px-4 pb-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {customer.notes && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Notizen
                            </p>
                            <p className="text-gray-800 dark:text-gray-100">{customer.notes}</p>
                          </div>
                        )}
                        {customer.selectedAreas && customer.selectedAreas.length > 0 && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Ausgewählte Areale
                            </p>
                            <ul className="text-sm text-gray-800 dark:text-gray-100 space-y-1">
                              {customer.selectedAreas.map((area, index) => (
                                <li key={index} className="flex justify-between">
                                  <span>{area.name}</span>
                                  <span className="text-gray-500 dark:text-gray-400">{area.price}€</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomer(customer.id);
                          }}
                          className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <Trash2 size={16} />
                          Löschen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
