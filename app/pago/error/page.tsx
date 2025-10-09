"use client";

import { Suspense } from "react";
import ErrorContent from "./ErrorContent";

export const dynamic = "force-dynamic";

export default function ErrorPagoPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Cargando...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
