import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Alle Kunden abrufen
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Fehler beim Abrufen der Kunden:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Kunden" },
      { status: 500 }
    );
  }
}

// POST - Neuen Kunden erstellen
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, gender, notes, selectedAreas, totalPrice } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "Vorname und Nachname sind erforderlich" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        gender: gender || "Frau",
        notes: notes || null,
        selectedAreas: selectedAreas || null,
        totalPrice: totalPrice || null,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Erstellen des Kunden:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Kunden" },
      { status: 500 }
    );
  }
}
