import type { Category, Product, Vendor, VendorWithProducts } from "@/types/database";

export const SAMPLE_CATEGORIES: Category[] = [
  { id: "1", name: "Biryani", slug: "biryani", type: "food", icon: "utensils" },
  { id: "2", name: "Karahi", slug: "karahi", type: "food", icon: "flame" },
  { id: "3", name: "Pizza", slug: "pizza", type: "food", icon: "pizza" },
  { id: "4", name: "Oil & Ghee", slug: "oil-ghee", type: "wholesale", icon: "droplet" },
  { id: "5", name: "Chicken", slug: "chicken", type: "wholesale", icon: "drumstick" },
  { id: "6", name: "Rice", slug: "rice", type: "wholesale", icon: "wheat" },
  { id: "7", name: "Daal", slug: "daal", type: "food", icon: "bowl" },
  { id: "8", name: "Packaging", slug: "packaging", type: "wholesale", icon: "package" },
];

export const SAMPLE_VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "Shahjahan Restaurant",
    slug: "shahjahan-restaurant",
    type: "restaurant",
    area: "Gulgasht",
    address: "Bosan Road, Gulgasht Colony",
    phone: "03001234567",
    whatsapp: "03001234567",
    image_url: "/placeholder.svg",
    rating: 4.5,
    is_verified: true,
    approval_status: "approved",
    description: "Famous for authentic desi biryani since 1985. Family recipes passed down generations.",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "v2",
    name: "Bundu Khan BBQ",
    slug: "bundu-khan-bbq",
    type: "restaurant",
    area: "Cantt",
    address: "Mall Road, Cantt Area",
    phone: "03007654321",
    whatsapp: "03007654321",
    image_url: "/placeholder.svg",
    rating: 4.3,
    is_verified: true,
    approval_status: "approved",
    description: "Premium BBQ and karahi specialist. Open till late night.",
    created_at: "2024-02-20T00:00:00Z",
  },
  {
    id: "v3",
    name: "Pizza Max",
    slug: "pizza-max",
    type: "restaurant",
    area: "Gulgasht",
    address: "Gulgasht Avenue",
    phone: "03009876543",
    whatsapp: "03009876543",
    image_url: "/placeholder.svg",
    rating: 4.1,
    is_verified: false,
    approval_status: "approved",
    description: "Fast food and pizza delivery across the city.",
    created_at: "2024-03-10T00:00:00Z",
  },
  {
    id: "v4",
    name: "Al-Madina Karahi House",
    slug: "al-madina-karahi",
    type: "restaurant",
    area: "Old City",
    address: "Near Main Bazaar, Old City",
    phone: "03005551234",
    whatsapp: "03005551234",
    image_url: "/placeholder.svg",
    rating: 4.6,
    is_verified: true,
    approval_status: "approved",
    description: "Traditional desi karahi and handi. Popular with locals and tourists.",
    created_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "v5",
    name: "Student Biryani",
    slug: "student-biryani",
    type: "restaurant",
    area: "Bosan Road",
    address: "Bosan Road, Near University Campus",
    phone: "03004443322",
    whatsapp: "03004443322",
    image_url: "/placeholder.svg",
    rating: 4.0,
    is_verified: true,
    approval_status: "approved",
    description: "Budget-friendly biryani perfect for students. Quick delivery.",
    created_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "v6",
    name: "Malik Poultry",
    slug: "malik-poultry",
    type: "supplier",
    area: "Wholesale Hub",
    address: "Poultry Market, Wholesale Hub",
    phone: "03001112233",
    whatsapp: "03001112233",
    image_url: "/placeholder.svg",
    rating: 4.7,
    is_verified: true,
    approval_status: "approved",
    description: "Wholesale chicken supplier. Fresh daily stock from farm to shop.",
    created_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "v7",
    name: "Al-Habib Oil Traders",
    slug: "al-habib-oil",
    type: "supplier",
    area: "Ghanta Ghar",
    address: "Wholesale Market, Ghanta Ghar",
    phone: "03002223344",
    whatsapp: "03002223344",
    image_url: "/placeholder.svg",
    rating: 4.4,
    is_verified: true,
    approval_status: "approved",
    description: "Cooking oil, ghee, and tin packaging. Bulk orders welcome.",
    created_at: "2024-02-15T00:00:00Z",
  },
  {
    id: "v8",
    name: "Rice King Wholesale",
    slug: "rice-king-wholesale",
    type: "supplier",
    area: "Grain Market",
    address: "Grain Market, Main Road",
    phone: "03003334455",
    whatsapp: "03003334455",
    image_url: "/placeholder.svg",
    rating: 4.2,
    is_verified: false,
    approval_status: "approved",
    description: "Basmati and sella rice at wholesale rates. 25kg and 50kg bags.",
    created_at: "2024-03-25T00:00:00Z",
  },
];

export const SAMPLE_PRODUCTS: Product[] = [
  // Shahjahan Restaurant
  { id: "p1", vendor_id: "v1", name: "Chicken Biryani", price: 350, unit: "plate", category: "biryani", updated_at: new Date().toISOString() },
  { id: "p2", vendor_id: "v1", name: "Mutton Biryani", price: 550, unit: "plate", category: "biryani", updated_at: new Date().toISOString() },
  { id: "p3", vendor_id: "v1", name: "Beef Karahi", price: 1200, unit: "kg", category: "karahi", updated_at: new Date(Date.now() - 86400000).toISOString() },
  // Bundu Khan
  { id: "p4", vendor_id: "v2", name: "Chicken Tikka", price: 450, unit: "plate", category: "bbq", updated_at: new Date().toISOString() },
  { id: "p5", vendor_id: "v2", name: "Seekh Kabab", price: 400, unit: "dozen", category: "bbq", updated_at: new Date().toISOString() },
  { id: "p6", vendor_id: "v2", name: "Mutton Karahi", price: 2800, unit: "kg", category: "karahi", updated_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  // Pizza Max
  { id: "p7", vendor_id: "v3", name: "Chicken Fajita Pizza", price: 899, unit: "large", category: "pizza", updated_at: new Date().toISOString() },
  { id: "p8", vendor_id: "v3", name: "Cheese Lover Pizza", price: 799, unit: "medium", category: "pizza", updated_at: new Date().toISOString() },
  // Al-Madina
  { id: "p9", vendor_id: "v4", name: "Chicken Karahi", price: 1400, unit: "kg", category: "karahi", updated_at: new Date().toISOString() },
  { id: "p10", vendor_id: "v4", name: "Daal Mash", price: 250, unit: "plate", category: "daal", updated_at: new Date().toISOString() },
  // Student Biryani
  { id: "p11", vendor_id: "v5", name: "Student Biryani", price: 200, unit: "plate", category: "biryani", updated_at: new Date().toISOString() },
  { id: "p12", vendor_id: "v5", name: "Chicken Pulao", price: 180, unit: "plate", category: "rice", updated_at: new Date().toISOString() },
  // Malik Poultry
  { id: "p13", vendor_id: "v6", name: "Chicken (Live)", price: 580, unit: "kg", category: "chicken", updated_at: new Date().toISOString() },
  { id: "p14", vendor_id: "v6", name: "Chicken (Dressed)", price: 620, unit: "kg", category: "chicken", updated_at: new Date(Date.now() - 86400000).toISOString() },
  // Al-Habib Oil
  { id: "p15", vendor_id: "v7", name: "Oil 16kg Tin", price: 6200, unit: "tin", category: "oil-ghee", updated_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "p16", vendor_id: "v7", name: "Ghee 5kg Tin", price: 4500, unit: "tin", category: "oil-ghee", updated_at: new Date().toISOString() },
  { id: "p17", vendor_id: "v7", name: "Oil 1L Pouch", price: 420, unit: "pouch", category: "oil-ghee", updated_at: new Date().toISOString() },
  // Rice King
  { id: "p18", vendor_id: "v8", name: "Basmati Rice 25kg", price: 5500, unit: "bag", category: "rice", updated_at: new Date().toISOString() },
  { id: "p19", vendor_id: "v8", name: "Sella Rice 50kg", price: 4800, unit: "bag", category: "rice", updated_at: new Date(Date.now() - 2 * 86400000).toISOString() },
];

export const RESTAURANT_AREAS = ["Gulgasht", "Cantt", "Old City", "Bosan Road", "Ghanta Ghar"];
export const RESTAURANT_TYPES = ["Biryani", "BBQ", "Karahi", "Pizza", "Daal"];
export const SUPPLIER_CATEGORIES = ["Oil", "Chicken", "Rice", "Packaging"];

export const STATS = {
  restaurants: 200,
  suppliers: 50,
  rates: 10000,
};

function attachMinPrice(vendor: Vendor): VendorWithProducts {
  const products = SAMPLE_PRODUCTS.filter((p) => p.vendor_id === vendor.id);
  const min_price = products.length > 0 ? Math.min(...products.map((p) => p.price)) : undefined;
  return { ...vendor, products, min_price };
}

export function getMockVendors(type?: "restaurant" | "supplier"): VendorWithProducts[] {
  let vendors = SAMPLE_VENDORS;
  if (type) {
    vendors = vendors.filter((v) => v.type === type);
  }
  return vendors.map(attachMinPrice);
}

export function getMockVendorBySlug(slug: string): VendorWithProducts | null {
  const vendor = SAMPLE_VENDORS.find((v) => v.slug === slug);
  if (!vendor) return null;
  return attachMinPrice(vendor);
}

export function getMockFeaturedVendors(): VendorWithProducts[] {
  return SAMPLE_VENDORS.slice(0, 6).map(attachMinPrice);
}

export function getMockCategories(): Category[] {
  return SAMPLE_CATEGORIES;
}
