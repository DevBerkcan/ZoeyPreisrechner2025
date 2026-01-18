import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET - Einzelnen Kunden abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Kunde nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Fehler beim Abrufen des Kunden:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen des Kunden" },
      { status: 500 }
    );
  }
}

// PUT - Kunden aktualisieren
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, email, phone, gender, notes, selectedAreas, totalPrice } = body;

    const customer = await prisma.customer.update({
      where: { id },
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

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Kunden:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren des Kunden" },
      { status: 500 }
    );
  }
}

// DELETE - Kunden löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kunde gelöscht" });
  } catch (error) {
    console.error("Fehler beim Löschen des Kunden:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Kunden" },
      { status: 500 }
    );
  }
}
