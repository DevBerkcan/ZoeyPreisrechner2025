import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      services: {
        orderBy: [{ gender: "asc" }, { serviceType: "asc" }, { sortOrder: "asc" }],
      },
    },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Tenant nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json(tenant.services);
}

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
  const { gender, serviceType, name, priceArea5, priceArea3, priceSingle, sortOrder, isActive } = body;

  if (!gender || !serviceType || !name || priceSingle == null) {
    return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
  }

  const service = await prisma.tenantService.create({
    data: {
      tenantId: tenant.id,
      gender,
      serviceType,
      name,
      priceArea5: priceArea5 ?? null,
      priceArea3: priceArea3 ?? null,
      priceSingle,
      sortOrder: sortOrder ?? 0,
      isActive: isActive ?? true,
    },
  });

  return NextResponse.json(service, { status: 201 });
}

export async function PUT(
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
  const { id, gender, serviceType, name, priceArea5, priceArea3, priceSingle, sortOrder, isActive } = body;

  if (!id) {
    return NextResponse.json({ error: "Service ID fehlt" }, { status: 400 });
  }

  const service = await prisma.tenantService.update({
    where: { id },
    data: {
      gender,
      serviceType,
      name,
      priceArea5: priceArea5 ?? null,
      priceArea3: priceArea3 ?? null,
      priceSingle,
      sortOrder,
      isActive,
    },
  });

  return NextResponse.json(service);
}

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
