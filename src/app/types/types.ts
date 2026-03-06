export type Pricing = {
  [key: string]: number;
};

export type Treatment = {
  id: string;
  name: string;
  pricing: Pricing;
};

export type Service = {
  [serviceType: string]: Treatment[];
};

export type GenderPricingData = {
  [gender: string]: Service;
};

export type Gender = "Frau" | "Mann";

export type SELECTED_TYPE = {
  id: string;
  gender: Gender;
  area: string;
  treatment: Treatment;
  price: number;
  selectedTreatment: string;
};

export type PRICING_TYPE = "Area1" | "Area3" | "Area5";

export type COMPARISON_ITEM = {
  id: string;
  timestamp: number;
  selectedItems: SELECTED_TYPE[];
  subtotal: number;
  total: number;
  discountPercent: number;
  label: string;
};
