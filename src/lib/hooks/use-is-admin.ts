"use client";

import { useEffect, useState } from "react";

export function useIsAdmin(userEmail: string | null | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch("/api/auth/role", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { isAdmin?: boolean }) => {
        if (!cancelled) {
          setIsAdmin(Boolean(data.isAdmin));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(false);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userEmail]);

  return { isAdmin, loading };
}
