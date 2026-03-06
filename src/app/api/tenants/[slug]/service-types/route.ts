import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) {
    return NextResponse.json({ error: "Tenant nicht gefunden" }, { status: 404 });
  }

  const serviceTypes = await prisma.tenantServiceType.findMany({
    where: { tenantId: tenant.id },
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(serviceTypes);
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
  const { name, sortOrder } = body;

  if (!name) {
    return NextResponse.json({ error: "Name ist ein Pflichtfeld" }, { status: 400 });
  }

  const serviceType = await prisma.tenantServiceType.create({
    data: {
      tenantId: tenant.id,
      name,
      sortOrder: sortOrder ?? 0,
      isActive: true,
    },
  });

  return NextResponse.json(serviceType, { status: 201 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const body = await request.json();
  const { id, name, sortOrder, isActive } = body;

  if (!id) {
    return NextResponse.json({ error: "ServiceType ID fehlt" }, { status: 400 });
  }

  const serviceType = await prisma.tenantServiceType.update({
    where: { id },
    data: { name, sortOrder, isActive },
  });

  return NextResponse.json(serviceType);
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
    return NextResponse.json({ error: "ServiceType ID fehlt" }, { status: 400 });
  }

  await prisma.tenantServiceType.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
