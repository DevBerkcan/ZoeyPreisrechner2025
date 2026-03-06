interface Treatment {
  id: string;
  name: string;
  pricing: {
    "ab 5 Areale"?: number;
    "ab 3 Areale"?: number;
    "Einzelpreis pro Behandlung": number;
  };
}

type Service = Record<string, Treatment[]>;
type GenderPricingData = Record<string, Service>;

interface ServiceWithType {
  id: string;
  gender: string;
  serviceTypeId: string;
  serviceType: { id: string; name: string };
  name: string;
  priceArea5: number | null;
  priceArea3: number | null;
  priceSingle: number;
  sortOrder: number;
  isActive: boolean;
}

export function transformToGenderPricingData(services: ServiceWithType[]): GenderPricingData {
  const result: GenderPricingData = {};

  for (const service of services) {
    const gender = service.gender;
    const typeName = service.serviceType.name;

    if (!result[gender]) result[gender] = {};
    if (!result[gender][typeName]) result[gender][typeName] = [];

    result[gender][typeName].push({
      id: service.id,
      name: service.name,
      pricing: {
        "ab 5 Areale": service.priceArea5 ?? undefined,
        "ab 3 Areale": service.priceArea3 ?? undefined,
        "Einzelpreis pro Behandlung": service.priceSingle,
      },
    });
  }

  return result;
}