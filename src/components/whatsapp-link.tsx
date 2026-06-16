"use client";

import type { ReactNode } from "react";

interface WhatsAppLinkProps {
  vendorId: string;
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}

export function WhatsAppLink({
  vendorId,
  href,
  className,
  children,
  onNavigate,
}: WhatsAppLinkProps) {
  const handleClick = () => {
    onNavigate?.();

    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendor_id: vendorId }),
      keepalive: true,
    }).catch(() => {
      // Tracking should not block WhatsApp navigation
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
