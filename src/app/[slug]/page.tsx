import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { transformToGenderPricingData } from "@/lib/transformPricingData";
import Home from "@/components/homepage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TenantPage({ params }: PageProps) {
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug, isActive: true },
    include: {
services: {
  where: { isActive: true },
  orderBy: { sortOrder: "asc" },
  include: {
    serviceType: true,
  },
},
    },
  });

  if (!tenant) {
    notFound();
  }

  const pricingData = transformToGenderPricingData(tenant.services);

  const tenantConfig = {
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    logoUrl: tenant.logoUrl,
    mainColor: tenant.mainColor,
    secondaryColor: tenant.secondaryColor,
    contactEmail: tenant.contactEmail,
    contactPhone: tenant.contactPhone,
    website: tenant.website,
  };

  return (
    <div
      style={
        {
          "--tenant-main-color": tenant.mainColor,
          "--tenant-secondary-color": tenant.secondaryColor,
        } as React.CSSProperties
      }
    >
      <Home tenant={tenantConfig} pricingData={pricingData} />
    </div>
  );
}
