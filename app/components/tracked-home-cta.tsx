"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackHomepageCtaClicked } from "@/lib/analytics";

type TrackedHomeCtaProps = {
  href: string;
  location: string;
  className: string;
  children: ReactNode;
};

export function TrackedHomeCta({
  href,
  location,
  className,
  children,
}: TrackedHomeCtaProps) {
  return (
    <Link
      href={href}
      onClick={() => trackHomepageCtaClicked(location)}
      className={className}
    >
      {children}
    </Link>
  );
}
