"use client";

import { Suspense } from "react";
import RevisarContent from "./RevisarContent";

export const dynamic = "force-dynamic";

export default function RevisarPageWrapper() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Cargando...</div>}>
      <RevisarContent />
    </Suspense>
  );
}
