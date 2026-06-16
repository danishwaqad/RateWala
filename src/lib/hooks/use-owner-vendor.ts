"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Vendor } from "@/types/database";

export function useOwnerVendor() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setVendor(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("vendors")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      setVendor(data ?? null);
      setLoading(false);
    }

    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { vendor, hasBusiness: Boolean(vendor), loading };
}
