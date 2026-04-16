"use client";

import dynamic from "next/dynamic";

const AnnouncementBar = dynamic(() => import("@/components/AnnouncementBar"), {
  ssr: false,
});
const AliceChat = dynamic(() => import("@/components/AliceChat"), {
  ssr: false,
});

export default function ClientWidgets({
  position,
}: {
  position: "top" | "bottom";
}) {
  if (position === "top") return <AnnouncementBar />;
  return <AliceChat />;
}
