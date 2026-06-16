"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/components/locale-toggle";
import { slugify } from "@/lib/utils";
import type { VendorInsert, VendorType } from "@/types/database";

export function AddShopForm() {
  const router = useRouter();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [type, setType] = useState<VendorType>("restaurant");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(t("loginRequired"));
      setLoading(false);
      router.push("/login?next=/add-shop");
      return;
    }

    const { data: existingBusiness } = await supabase
      .from("vendors")
      .select("slug")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (existingBusiness) {
      setError(t("alreadyHasBusiness"));
      setLoading(false);
      router.push("/dashboard");
      return;
    }

    let slug = slugify(name);
    if (!slug) slug = `shop-${Date.now()}`;

    const { data: existing } = await supabase
      .from("vendors")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const payload: VendorInsert = {
      name,
      slug,
      type,
      area,
      address,
      phone,
      whatsapp: whatsapp || phone,
      description: description || null,
      image_url: "/placeholder.svg",
      owner_id: user.id,
    };

    const { data, error: insertError } = await supabase
      .from("vendors")
      .insert(payload)
      .select("slug")
      .single();

    setLoading(false);

    if (insertError) {
      if (insertError.message.includes("owner_id") || insertError.code === "42501") {
        setError(t("runAuthSql"));
      } else {
        setError(insertError.message);
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="shopName">{t("shopName")}</Label>
        <Input
          id="shopName"
          placeholder="Shahjahan Restaurant"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>{t("shopType")}</Label>
        <div className="flex gap-3">
          {(["restaurant", "supplier"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setType(option)}
              className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                type === option
                  ? "border-teal bg-teal text-white"
                  : "border-input hover:border-teal hover:text-teal"
              }`}
            >
              {option === "restaurant" ? t("restaurant") : t("supplier")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="area">{t("area")}</Label>
          <Input
            id="area"
            placeholder="Gulgasht, Cantt..."
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="03001234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t("address")}</Label>
        <Input
          id="address"
          placeholder="Street, landmark..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">{t("whatsapp")}</Label>
        <Input
          id="whatsapp"
          type="tel"
          placeholder={t("whatsappOptional")}
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("about")}</Label>
        <textarea
          id="description"
          rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder={t("shopDescriptionPlaceholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        {t("submitShop")}
      </Button>
    </form>
  );
}
