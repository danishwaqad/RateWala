"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Settings, Shield, Store, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/locale-toggle";
import { useOwnerVendor } from "@/lib/hooks/use-owner-vendor";
import { useIsAdmin } from "@/lib/hooks/use-is-admin";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

function AuthButtons({
  user,
  isAdmin,
  hasBusiness,
  onLogout,
  logoutLoading,
}: {
  user: SupabaseUser;
  isAdmin: boolean;
  hasBusiness: boolean;
  onLogout: () => void;
  logoutLoading: boolean;
}) {
  const { t } = useTranslation();

  return (
    <>
      {hasBusiness ? (
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
          <Link href="/dashboard">
            <Settings className="h-4 w-4" />
            <span>{t("myBusiness")}</span>
          </Link>
        </Button>
      ) : !isAdmin ? (
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
          <Link href="/add-shop">
            <Store className="h-4 w-4" />
            <span>{t("addShop")}</span>
          </Link>
        </Button>
      ) : null}

      {isAdmin && (
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
          <Link href="/admin">
            <Shield className="h-4 w-4" />
            <span>{t("adminPanel")}</span>
          </Link>
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:inline-flex gap-1.5 max-w-[140px]"
        onClick={onLogout}
        loading={logoutLoading}
      >
        <User className="h-4 w-4 shrink-0" />
        <span className="truncate text-xs">{user.email?.split("@")[0]}</span>
        <LogOut className="h-3.5 w-3.5 shrink-0 opacity-60" />
      </Button>
    </>
  );
}

export function HeaderAuth() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { hasBusiness, loading: vendorLoading } = useOwnerVendor();
  const { isAdmin, loading: adminLoading } = useIsAdmin(user?.email ?? null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLogoutLoading(false);
    router.push("/");
    router.refresh();
  };

  if (loading || vendorLoading || adminLoading) {
    return <div className="hidden sm:block h-9 w-24 animate-pulse rounded-md bg-muted" />;
  }

  if (user) {
    return (
      <AuthButtons
        user={user}
        isAdmin={isAdmin}
        hasBusiness={hasBusiness}
        onLogout={handleLogout}
        logoutLoading={logoutLoading}
      />
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
        <Link href="/add-shop">
          <Store className="h-4 w-4" />
          <span>{t("addShop")}</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
        <Link href="/login">
          <LogIn className="h-4 w-4" />
          {t("login")}
        </Link>
      </Button>
    </>
  );
}

export function MobileHeaderAuth() {
  const { t } = useTranslation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { hasBusiness, loading: vendorLoading } = useOwnerVendor();
  const { isAdmin, loading: adminLoading } = useIsAdmin(user?.email ?? null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  if (loading || vendorLoading || adminLoading) return null;

  if (user) {
    return (
      <div className="flex flex-col gap-2">
        {hasBusiness && (
          <Button variant="outline" asChild>
            <Link href="/dashboard">{t("myBusiness")}</Link>
          </Button>
        )}
        {!hasBusiness && !isAdmin && (
          <Button variant="outline" asChild>
            <Link href="/add-shop">{t("addShop")}</Link>
          </Button>
        )}
        {isAdmin && (
          <Button variant="outline" asChild>
            <Link href="/admin">{t("adminPanel")}</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" asChild>
        <Link href="/add-shop">{t("addShop")}</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/login">{t("login")}</Link>
      </Button>
    </div>
  );
}
