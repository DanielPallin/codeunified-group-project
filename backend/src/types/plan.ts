export type Plan = {
  id: string;
  name: string;
  description: string;
  access_level: number;
  price: number;
  currency: string;
  billing_interval: string;
  is_active: boolean;
};