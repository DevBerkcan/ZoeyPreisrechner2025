import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// GET all services for a tenant
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      services: {
        orderBy: [{ gender: "asc" }, { serviceType: "asc" }, { category: "asc" }, { sortOrder: "asc" }],
      },
    },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Tenant nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json(tenant.services);
}

// POST create a new service
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    return NextResponse.json({ error: "Tenant nicht gefunden" }, { status: 404 });
  }

  const body = await request.json();
  const { gender, serviceType, category, name, priceArea5, priceArea3, priceSingle, sortOrder } = body;

  if (!gender || !serviceType || !category || !name || priceSingle == null) {
    return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
  }

  const service = await prisma.tenantService.create({
    data: {
      tenantId: tenant.id,
      gender,
      serviceType,
      category,
      name,
      priceArea5: priceArea5 ?? null,
      priceArea3: priceArea3 ?? null,
      priceSingle,
      sortOrder: sortOrder ?? 0,
    },
  });

  return NextResponse.json(service, { status: 201 });
}

// PUT update a service
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: "Service ID fehlt" }, { status: 400 });
  }

  const service = await prisma.tenantService.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(service);
}

// DELETE a service
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Service ID fehlt" }, { status: 400 });
  }

  await prisma.tenantService.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
