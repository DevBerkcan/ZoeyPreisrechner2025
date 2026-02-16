import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// GET - Alle Admins laden (optional mit tenantId Filter)
export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    const admins = await prisma.admin.findMany({
      where: tenantId ? { tenantId } : {},
      select: {
        id: true,
        username: true,
        tenantId: true,
        updateAt: true,
        // Passwort wird NICHT zurueckgegeben
      },
      orderBy: { username: "asc" },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Fehler beim Abrufen der Admins:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Admins" },
      { status: 500 }
    );
  }
}

// POST - Neuen Admin erstellen
export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, password, tenantId } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Benutzername und Passwort sind Pflichtfelder" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.create({
      data: {
        username,
        password,
        tenantId: tenantId || null,
      },
      select: {
        id: true,
        username: true,
        tenantId: true,
        updateAt: true,
      },
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Erstellen des Admins:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Admins" },
      { status: 500 }
    );
  }
}

// PUT - Admin aktualisieren
export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, username, password, tenantId } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Admin ID fehlt" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = password;
    if (tenantId !== undefined) updateData.tenantId = tenantId;

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        tenantId: true,
        updateAt: true,
      },
    });

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Admins:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren des Admins" },
      { status: 500 }
    );
  }
}

// DELETE - Admin loeschen
export async function DELETE(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Admin ID fehlt" },
        { status: 400 }
      );
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Loeschen des Admins:", error);
    return NextResponse.json(
      { error: "Fehler beim Loeschen des Admins" },
      { status: 500 }
    );
  }
}
