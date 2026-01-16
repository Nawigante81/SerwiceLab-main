export type InpostMethodType = "locker" | "courier";

export interface InpostMethod {
  code: string;
  name: string;
  type: InpostMethodType;
  price_pln: number;
  eta: string;
  featured?: boolean;
}

export interface InpostPoint {
  point_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "locker" | "partner";
  hours?: string | null;
  description?: string | null;
  image_url?: string | null;
}
