import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { transformToGenderPricingData } from "@/lib/transformPricingData";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug, isActive: true },
    include: {
      services: {
        where: { isActive: true },
        include: { serviceType: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Tenant nicht gefunden" }, { status: 404 });
  }

  const pricingData = transformToGenderPricingData(tenant.services);

  return NextResponse.json({
    tenant: {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      logoUrl: tenant.logoUrl,
      mainColor: tenant.mainColor,
      secondaryColor: tenant.secondaryColor,
      contactEmail: tenant.contactEmail,
      contactPhone: tenant.contactPhone,
      website: tenant.website,
    },
    pricingData,
  });
}
