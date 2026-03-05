import { GenderPricingData } from "@/app/types/types";

interface TenantServiceRow {
  id: string;
  gender: string;
  serviceType: string;
  name: string;
  priceArea5: number | null;
  priceArea3: number | null;
  priceSingle: number;
  sortOrder: number;
}

export function transformToGenderPricingData(
  services: TenantServiceRow[]
): GenderPricingData {
  const result: GenderPricingData = {};

  for (const service of services) {
    const { gender, serviceType, name, priceArea5, priceArea3, priceSingle, sortOrder } = service;

    if (!result[gender]) result[gender] = {};
    if (!result[gender][serviceType]) result[gender][serviceType] = [];

    result[gender][serviceType].push({
      id: sortOrder,
      name,
      pricing: {
        ...(priceArea5 != null && priceArea5 > 0 ? { "ab 5 Areale": priceArea5 } : {}),
        ...(priceArea3 != null && priceArea3 > 0 ? { "ab 3 Areale": priceArea3 } : {}),
        "Einzelpreis pro Behandlung": priceSingle,
      },
    });
  }

  return result;
}
