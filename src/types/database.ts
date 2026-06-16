export type VendorType = "restaurant" | "supplier";
export type CategoryType = "food" | "wholesale";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  type: VendorType;
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  image_url: string;
  rating: number;
  review_count?: number;
  is_verified: boolean;
  approval_status: ApprovalStatus;
  description?: string | null;
  owner_id?: string | null;
  created_at: string;
  last_reminder_at?: string | null;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image_url?: string | null;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  icon?: string | null;
}

export interface VendorWithProducts extends Vendor {
  products: Product[];
  min_price?: number;
}

export interface Click {
  id: string;
  vendor_id: string;
  clicked_at: string;
}

export interface VendorReview {
  id: string;
  vendor_id: string;
  user_id: string;
  rating: number;
  comment: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface VendorInsert {
  name: string;
  slug: string;
  type: VendorType;
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  image_url?: string;
  description?: string | null;
  owner_id: string;
}

export interface VendorUpdate {
  name?: string;
  slug?: string;
  type?: VendorType;
  area?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  image_url?: string;
  description?: string | null;
  owner_id?: string;
  is_verified?: boolean;
  approval_status?: ApprovalStatus;
  last_reminder_at?: string | null;
}

export type Database = {
  public: {
    Tables: {
      vendors: {
        Row: Vendor;
        Insert: VendorInsert;
        Update: VendorUpdate;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, "id" | "updated_at"> & { id?: string; updated_at?: string };
        Update: Partial<Product>;
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id"> & { id?: string };
        Update: Partial<Category>;
        Relationships: [];
      };
      vendor_reviews: {
        Row: VendorReview;
        Insert: Omit<VendorReview, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<VendorReview, "id" | "vendor_id" | "user_id">>;
        Relationships: [];
      };
      clicks: {
        Row: Click;
        Insert: { vendor_id: string; clicked_at?: string };
        Update: Partial<Click>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      vendor_type: VendorType;
      category_type: CategoryType;
    };
    CompositeTypes: Record<string, never>;
  };
};
