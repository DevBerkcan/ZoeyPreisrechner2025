export type Pricing = {
  [key: string]: number;
};

export type Treatment = {
  id: number;
  name: string;
  pricing: Pricing;
};

export type Category = {
  [treatmentName: string]: Treatment[]; // Maps treatment categories (e.g., "Kopf | Einzelbehandlung") to a list of treatments
};

export type Service = {
  [categoryName: string]: Category; // Maps service types (e.g., "Haarentfernung") to treatment categories
};

export type GenderPricingData = {
  [gender: string]: Service; // Maps genders (e.g., "Frau" or "Mann") to services
};

export type Gender = "Frau" | "Mann";

export type SELECTED_TYPE = {
  id: number;
  gender: Gender;
  area: string;
  treatment: Treatment;
  price: number;
  selectedTreatment: string;
};

export type PRICING_TYPE = "Area1" | "Area3" | "Area5";
