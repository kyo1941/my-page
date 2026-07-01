"use client";

import { usePathname } from "next/navigation";
import SkyBackground from "./SkyBackground";

export default function ConditionalSkyBackground() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <SkyBackground />;
}
