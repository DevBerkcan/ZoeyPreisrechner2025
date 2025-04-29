"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Neues Passwort und Bestätigung stimmen nicht überein.");
      return;
    }

    const response = await fetch("/api/changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      signOut();
    }
  };

  return (
    <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-col gap-1">
        <label
          htmlFor="oldPassword"
          className="text-sm font-medium text-gray-700"
        >
          Altes Passwort
        </label>
        <input
          id="oldPassword"
          name="oldPassword"
          type="password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
          placeholder="Geben Sie Ihr altes Passwort ein"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="newPassword"
          className="text-sm font-medium text-gray-700"
        >
          Neues Passwort
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
          placeholder="Geben Sie Ihr neues Passwort ein"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Bestätigen Sie Ihr neues Passwort
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color"
          placeholder="Bestätigen Sie Ihr neues Passwort"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-main-color text-white rounded-md hover:bg-main-color-dark transition"
        >
          Passwort aktualisieren
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
