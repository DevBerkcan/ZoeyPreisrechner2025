import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { services: true, customers: true, admins: true },
        },
      },
    });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error("Fehler beim Abrufen der Tenants:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Tenants" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      logoUrl,
      mainColor,
      secondaryColor,
      contactEmail,
      contactPhone,
      website,
      adminUsername,
      adminPassword,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name und Slug sind Pflichtfelder" },
        { status: 400 }
      );
    }

    const existing = await prisma.tenant.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Dieser Slug wird bereits verwendet" },
        { status: 409 }
      );
    }

    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        logoUrl: logoUrl || null,
        mainColor: mainColor || "#059669",
        secondaryColor: secondaryColor || "#D4A574",
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        website: website || null,
        isActive: true,
      },
    });

    if (adminUsername && adminPassword) {
      await prisma.admin.create({
        data: {
          username: adminUsername,
          password: adminPassword,
          tenantId: tenant.id,
        },
      });
    }

    const result = await prisma.tenant.findUnique({
      where: { id: tenant.id },
      include: {
        _count: {
          select: { services: true, customers: true, admins: true },
        },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Fehler beim Erstellen des Tenants:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Tenants" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Tenant ID fehlt" }, { status: 400 });
    }

    if (updateData.slug) {
      const existing = await prisma.tenant.findFirst({
        where: { slug: updateData.slug, NOT: { id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Dieser Slug wird bereits verwendet" },
          { status: 409 }
        );
      }
    }

    const tenant = await prisma.tenant.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Tenants:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren des Tenants" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Tenant ID fehlt" }, { status: 400 });
    }

    await prisma.admin.deleteMany({ where: { tenantId: id } });
    await prisma.customer.deleteMany({ where: { tenantId: id } });
    await prisma.tenant.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Loeschen des Tenants:", error);
    return NextResponse.json(
      { error: "Fehler beim Loeschen des Tenants" },
      { status: 500 }
    );
  }
}