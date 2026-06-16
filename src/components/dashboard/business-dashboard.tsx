"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, ImagePlus, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadProductImage, uploadVendorCover } from "@/lib/supabase/upload-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductTable } from "@/components/product-table";
import { CategoryCombobox } from "@/components/category-combobox";
import type { CategoryComboboxHandle } from "@/components/category-combobox";
import { useTranslation } from "@/components/locale-toggle";
import { buildCategoryOptions, ensureCategoryInCatalog, type CategoryOption } from "@/lib/data/categories";
import { formatPrice, slugify } from "@/lib/utils";
import type { Product, Vendor } from "@/types/database";

export function BusinessDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemUnit, setItemUnit] = useState("plate");
  const [itemCategory, setItemCategory] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const itemImageInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const categoryComboboxRef = useRef<CategoryComboboxHandle>(null);

  async function revalidateVendor(slug: string) {
    await fetch("/api/revalidate-vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  }

  async function loadData() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: vendorData } = await supabase
      .from("vendors")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!vendorData) {
      setLoading(false);
      return;
    }

    setVendor(vendorData);
    setImageUrl(vendorData.image_url || "/placeholder.svg");
    setDescription(vendorData.description || "");
    setAddress(vendorData.address);
    setPhone(vendorData.phone);
    setWhatsapp(vendorData.whatsapp);

    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .eq("vendor_id", vendorData.id)
      .order("updated_at", { ascending: false });

    setProducts(productData ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!vendor) return;

    const currentVendor = vendor;

    async function loadCategories() {
      const categoryType = currentVendor.type === "supplier" ? "wholesale" : "food";
      const supabase = createClient();
      const { data } = await supabase
        .from("categories")
        .select("name, slug")
        .eq("type", categoryType)
        .order("name");

      setCategoryOptions(
        buildCategoryOptions(
          categoryType,
          products.map((p) => p.category),
          data ?? undefined
        )
      );
    }

    loadCategories();
  }, [vendor, products]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    let finalImageUrl = imageUrl.trim() || "/placeholder.svg";

    try {
      if (coverImageFile) {
        finalImageUrl = await uploadVendorCover(supabase, vendor.id, coverImageFile);
      }
    } catch (uploadErr) {
      setSaving(false);
      setError(uploadErr instanceof Error ? uploadErr.message : "Cover image upload failed.");
      return;
    }

    const { data: updated, error: updateError } = await supabase
      .from("vendors")
      .update({
        image_url: finalImageUrl,
        description: description || null,
        address,
        phone,
        whatsapp: whatsapp || phone,
      })
      .eq("id", vendor.id)
      .select("slug, image_url")
      .single();

    setSaving(false);

    if (updateError || !updated) {
      setError(
        updateError?.message ??
          "Could not save changes. Run auth.sql in Supabase if you have not already."
      );
      return;
    }

    await revalidateVendor(updated.slug);

    setImageUrl(finalImageUrl);
    setCoverImageFile(null);
    if (coverImageInputRef.current) coverImageInputRef.current.value = "";
    setSuccess(t("profileSaved"));
    router.refresh();
    await loadData();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    setProductLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    let productImageUrl = itemImageUrl.trim() || "/placeholder.svg";

    try {
      if (itemImageFile) {
        productImageUrl = await uploadProductImage(supabase, vendor.id, itemImageFile);
      }
    } catch (uploadErr) {
      setProductLoading(false);
      setError(uploadErr instanceof Error ? uploadErr.message : "Recipe photo upload failed.");
      return;
    }

    const committedCategory = categoryComboboxRef.current?.commitPending();
    const category =
      slugify(committedCategory || itemCategory) || committedCategory || itemCategory || "general";

    const { error: insertError } = await supabase.from("products").insert({
      vendor_id: vendor.id,
      name: itemName,
      price: parseFloat(itemPrice),
      unit: itemUnit,
      category,
      image_url: productImageUrl,
    });

    setProductLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    const categoryType = vendor.type === "supplier" ? "wholesale" : "food";
    await ensureCategoryInCatalog(supabase, category, categoryType);

    setItemName("");
    setItemPrice("");
    setItemCategory("");
    setItemImageUrl("");
    setItemImageFile(null);
    setItemImagePreview(null);
    if (itemImageInputRef.current) itemImageInputRef.current.value = "";
    setSuccess(t("productAdded"));
    await revalidateVendor(vendor.slug);
    await loadData();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!vendor) return;

    setError(null);
    setSuccess(null);
    setDeletingId(productId);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setDeletingId(null);
      setError(t("loginRequired"));
      return;
    }

    const { data, error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .eq("vendor_id", vendor.id)
      .select("id");

    setDeletingId(null);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (!data?.length) {
      setError(t("deleteProductFailed"));
      return;
    }

    setSuccess(t("productDeleted"));
    await revalidateVendor(vendor.slug);
    await loadData();
  };

  if (loading) {
    return <div className="h-48 animate-pulse rounded-xl bg-muted" />;
  }

  if (!vendor) {
    return (
      <div className="rounded-xl border p-8 text-center">
        <p className="text-muted-foreground">{t("noBusinessYet")}</p>
        <Button asChild className="mt-4">
          <Link href="/add-shop">{t("addShop")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("myBusiness")}</h1>
          <p className="text-sm text-muted-foreground">{vendor.name}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/vendor/${vendor.slug}`}>
            {t("viewPublicPage")}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-md px-3 py-2">
          {success}
        </p>
      )}

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">{t("businessProfile")}</TabsTrigger>
          <TabsTrigger value="prices">{t("rateList")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={handleSaveProfile} className="space-y-5 rounded-xl border p-5 md:p-6">
            <div className="space-y-2">
              <Label>{t("coverImageUrl")}</Label>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={coverImageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  id="coverImageFile"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCoverImageFile(file);
                      setImageUrl(URL.createObjectURL(file));
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => coverImageInputRef.current?.click()}
                >
                  <ImagePlus className="h-4 w-4" />
                  {t("uploadCover")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{t("coverUploadHint")}</p>
              <Input
                id="imageUrl"
                placeholder="https://example.com/your-shop-photo.jpg"
                value={imageUrl.startsWith("blob:") ? "" : imageUrl}
                onChange={(e) => {
                  setCoverImageFile(null);
                  setImageUrl(e.target.value);
                }}
              />
              <p className="text-xs text-muted-foreground">{t("coverImageHint")}</p>
              <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutText">{t("about")}</Label>
              <textarea
                id="aboutText"
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("shopDescriptionPlaceholder")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dashAddress">{t("address")}</Label>
                <Input id="dashAddress" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dashPhone">{t("phone")}</Label>
                <Input id="dashPhone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashWhatsapp">{t("whatsapp")}</Label>
              <Input id="dashWhatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>

            <Button type="submit" loading={saving}>
              {t("saveChanges")}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="prices">
          <div className="space-y-6">
            <form
              onSubmit={handleAddProduct}
              className="rounded-xl border p-5 md:p-6 space-y-4"
            >
              <h3 className="font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4 text-teal" />
                {t("addPriceItem")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>{t("item")}</Label>
                  <Input
                    placeholder="Chicken Biryani"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("rate")} (Rs)</Label>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="350"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input
                    placeholder="plate, kg, tin..."
                    value={itemUnit}
                    onChange={(e) => setItemUnit(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>{t("itemPhoto")}</Label>
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="flex flex-col gap-2">
                      <input
                        ref={itemImageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        id="itemImageFile"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setItemImageFile(file);
                            setItemImagePreview(URL.createObjectURL(file));
                            setItemImageUrl("");
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => itemImageInputRef.current?.click()}
                      >
                        <ImagePlus className="h-4 w-4" />
                        {t("uploadPhoto")}
                      </Button>
                      <p className="text-xs text-muted-foreground max-w-xs">{t("itemPhotoHint")}</p>
                    </div>
                    {(itemImagePreview || itemImageUrl) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={itemImagePreview || itemImageUrl}
                        alt="Preview"
                        className="h-20 w-20 rounded-lg border object-cover bg-muted"
                      />
                    )}
                  </div>
                  <Label className="text-xs text-muted-foreground">{t("orPasteImageUrl")}</Label>
                  <Input
                    placeholder="https://example.com/dish-photo.jpg"
                    value={itemImageUrl}
                    onChange={(e) => {
                      setItemImageUrl(e.target.value);
                      setItemImageFile(null);
                      setItemImagePreview(null);
                      if (itemImageInputRef.current) itemImageInputRef.current.value = "";
                    }}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>{t("category")}</Label>
                  <CategoryCombobox
                    ref={categoryComboboxRef}
                    options={categoryOptions}
                    value={itemCategory}
                    onChange={setItemCategory}
                    placeholder="biryani, karahi, noodles..."
                    disabled={productLoading}
                    addNewPrefix={t("addCategoryPrefix")}
                  />
                  <p className="text-xs text-muted-foreground">{t("categoryPickOrType")}</p>
                </div>
              </div>
              <Button type="submit" loading={productLoading}>
                {t("addPriceItem")}
              </Button>
            </form>

            {products.length > 0 ? (
              <ProductTable
                products={products}
                labels={{
                  item: t("item"),
                  rate: t("rate"),
                  lastUpdated: t("lastUpdated"),
                }}
              />
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8 border rounded-xl">
                {t("noPricesYet")}
              </p>
            )}

            {products.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{t("removeItems")}</p>
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border px-4 py-2 text-sm"
                  >
                    <span>
                      {p.name} — {formatPrice(p.price)}/{p.unit}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deletingId === p.id}
                      loading={deletingId === p.id}
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
