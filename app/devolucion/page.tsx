import { Suspense } from "react";
import DevolucionClient from "./DevolucionClient";

export const dynamic = "force-dynamic";

export default function DevolucionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <DevolucionClient />
    </Suspense>
  );
}
