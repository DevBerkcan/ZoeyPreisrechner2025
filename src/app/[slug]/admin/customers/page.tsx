"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Trash2,
  Phone,
  Mail,
  Calendar,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto text-main-color mb-2" />
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                Zurück
              </Link>
              <div className="flex items-center gap-2">
                <Users className="text-main-color" size={24} />
                <h1 className="text-xl font-bold text-gray-800">
                  Kundenverwaltung
                </h1>
              </div>
            </div>
            <button
              onClick={fetchCustomers}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <RefreshCw size={16} />
              Aktualisieren
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Gesamt Kunden</p>
            <p className="text-2xl font-bold text-main-color">{customers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Frauen</p>
            <p className="text-2xl font-bold text-pink-600">
              {customers.filter((c) => c.gender === "Frau").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">Männer</p>
            <p className="text-2xl font-bold text-blue-600">
              {customers.filter((c) => c.gender === "Mann").length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Kunden suchen (Name, E-Mail, Telefon)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
            />
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? "Keine Kunden gefunden" : "Noch keine Kunden angelegt"}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="hover:bg-gray-50">
                  {/* Customer Row */}
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
                            customer.gender === "Frau"
                              ? "bg-pink-500"
                              : "bg-blue-500"
                          }`}
                        >
                          {customer.firstName.charAt(0)}
                          {customer.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
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
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {customer.totalPrice.toFixed(2)}€
                          </span>
                        )}
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDate(customer.createdAt)}
                        </span>
                        {expandedCustomer === customer.id ? (
                          <ChevronUp className="text-gray-400" />
                        ) : (
                          <ChevronDown className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedCustomer === customer.id && (
                    <div className="px-4 pb-4 bg-gray-50 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* Notizen */}
                        {customer.notes && (
                          <div className="bg-white p-3 rounded-md">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                              Notizen
                            </p>
                            <p className="text-gray-800">{customer.notes}</p>
                          </div>
                        )}

                        {/* Ausgewählte Areale */}
                        {customer.selectedAreas &&
                          customer.selectedAreas.length > 0 && (
                            <div className="bg-white p-3 rounded-md">
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Ausgewählte Areale
                              </p>
                              <ul className="text-sm text-gray-800">
                                {customer.selectedAreas.map((area, index) => (
                                  <li key={index} className="flex justify-between">
                                    <span>{area.name}</span>
                                    <span className="text-gray-500">
                                      {area.price}€
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomer(customer.id);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
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
