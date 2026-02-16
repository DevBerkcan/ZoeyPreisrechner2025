import { PrismaClient } from "@prisma/client";
import { pricingData } from "../src/app/data";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildServicesFromPricingData(tenantId: string, data: any) {
  const services = [];
  let sortOrder = 1;

  for (const [gender, genderServices] of Object.entries(data)) {
    for (const [serviceType, categories] of Object.entries(
      genderServices as Record<string, unknown>
    )) {
      for (const [category, treatments] of Object.entries(
        categories as Record<string, unknown>
      )) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const treatment of treatments as any[]) {
          services.push({
            tenantId,
            gender,
            serviceType,
            category,
            name: treatment.name,
            priceArea5: treatment.pricing["ab 5 Areale"] ?? null,
            priceArea3: treatment.pricing["ab 3 Areale"] ?? null,
            priceSingle:
              treatment.pricing["Einzelpreis pro Behandlung"] ??
              treatment.pricing["Kurspreis"] ??
              0,
            sortOrder: sortOrder++,
            isActive: true,
          });
        }
      }
    }
  }

  return services;
}

async function seedTenant(
  slug: string,
  name: string,
  config: {
    logoUrl?: string;
    mainColor: string;
    secondaryColor: string;
  }
) {
  const tenant = await prisma.tenant.upsert({
    where: { slug },
    update: {
      name,
      mainColor: config.mainColor,
      secondaryColor: config.secondaryColor,
      logoUrl: config.logoUrl ?? null,
    },
    create: {
      slug,
      name,
      logoUrl: config.logoUrl ?? null,
      mainColor: config.mainColor,
      secondaryColor: config.secondaryColor,
      isActive: true,
    },
  });

  console.log(`Tenant: ${tenant.name} (${tenant.slug})`);

  // Delete existing services before re-seeding
  await prisma.tenantService.deleteMany({
    where: { tenantId: tenant.id },
  });

  const services = buildServicesFromPricingData(tenant.id, pricingData);

  const result = await prisma.tenantService.createMany({
    data: services,
  });

  console.log(`  -> ${result.count} services created`);

  return tenant;
}

async function main() {
  console.log("Seeding database...\n");

  // 1. NAZAR Beauty & Wellness
  const nazar = await seedTenant("nazar", "NAZAR Beauty & Wellness", {
    logoUrl: "/assets/Nazar-Logo.png",
    mainColor: "#059669",
    secondaryColor: "#D4A574",
  });

  // Link existing admins/customers without tenant to NAZAR
  await prisma.admin.updateMany({
    where: { tenantId: null },
    data: { tenantId: nazar.id },
  });
  await prisma.customer.updateMany({
    where: { tenantId: null },
    data: { tenantId: nazar.id },
  });

  // 2. Zoey Esthetics
  await seedTenant("zoey", "Zoey Esthetics", {
    mainColor: "#007A89",
    secondaryColor: "#FAA003",
  });

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
