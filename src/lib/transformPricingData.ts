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

const BEHANDLUNGEN_SERVICE_TYPES = new Set([
  "Gesicht",
  "PRP",
  "Radiofrequenz",
  "Medizinisches Microneedling Dermapen 4",
  "Microneedling DermaPen 4",
]);

export function transformToGenderPricingData(
  services: TenantServiceRow[]
): GenderPricingData {
  const result: GenderPricingData = {};

  for (const service of services) {
    const { gender, serviceType, name, priceArea5, priceArea3, priceSingle, sortOrder } = service;

    const isBehandlung = BEHANDLUNGEN_SERVICE_TYPES.has(serviceType);

    const area5Label = isBehandlung ? "ab 5 Behandlungen" : "ab 5 Areale";
    const area3Label = isBehandlung ? "ab 3 Behandlungen" : "ab 3 Areale";

    if (!result[gender]) result[gender] = {};
    if (!result[gender][serviceType]) result[gender][serviceType] = {};
    if (!result[gender][serviceType]["Behandlungen"]) result[gender][serviceType]["Behandlungen"] = [];

    result[gender][serviceType]["Behandlungen"].push({
      id: sortOrder,
      name,
      pricing: {
        ...(priceArea5 != null && priceArea5 > 0 ? { [area5Label]: priceArea5 } : {}),
        ...(priceArea3 != null && priceArea3 > 0 ? { [area3Label]: priceArea3 } : {}),
        "Einzelpreis pro Behandlung": priceSingle,
      },
    });
  }

  return result;
}
