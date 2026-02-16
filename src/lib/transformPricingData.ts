import { GenderPricingData } from "@/app/types/types";

interface TenantServiceRow {
  id: string;
  gender: string;
  serviceType: string;
  category: string;
  name: string;
  priceArea5: number | null;
  priceArea3: number | null;
  priceSingle: number;
  sortOrder: number;
}

/**
 * Transforms flat TenantService rows from the database
 * into the nested GenderPricingData format used by the frontend.
 *
 * DB: [{ gender, serviceType, category, name, priceArea5, priceArea3, priceSingle }]
 * Output: { Frau: { Haarentfernung: { Kopf: [{ id, name, pricing }] } } }
 */
export function transformToGenderPricingData(
  services: TenantServiceRow[]
): GenderPricingData {
  const result: GenderPricingData = {};

  for (const service of services) {
    const { gender, serviceType, category, name, priceArea5, priceArea3, priceSingle, sortOrder } = service;

    if (!result[gender]) {
      result[gender] = {};
    }
    if (!result[gender][serviceType]) {
      result[gender][serviceType] = {};
    }
    if (!result[gender][serviceType][category]) {
      result[gender][serviceType][category] = [];
    }

    result[gender][serviceType][category].push({
      id: sortOrder, // Use sortOrder as the numeric id for frontend compatibility
      name,
      pricing: {
        ...(priceArea5 != null ? { "ab 5 Areale": priceArea5 } : {}),
        ...(priceArea3 != null ? { "ab 3 Areale": priceArea3 } : {}),
        "Einzelpreis pro Behandlung": priceSingle,
      },
    });
  }

  return result;
}
