"use client";

import { Suspense } from "react";
import YapeQRContent from "./YapeQRContent";

export const dynamic = "force-dynamic";

export default function YapeQRPageWrapper() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Cargando...</div>}>
      <YapeQRContent />
    </Suspense>
  );
}
