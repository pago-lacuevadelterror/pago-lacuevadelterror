"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function YapeQRPage() {
  const router = useRouter();
  const params = useSearchParams();
  const monto = params.get("monto") || "0";
  const celular = params.get("celular") || "";
  const [confirmado, setConfirmado] = useState(false);

  return (
    <main className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-4 font-[system-ui,Segoe UI,Roboto,sans-serif] text-[#111]">
      <div className="bg-white rounded-md border border-[#ddd] shadow-sm p-8 max-w-md w-full text-center">
        <h2 className="text-[20px] font-semibold mb-3">Paga con Yape</h2>
        <p className="text-[14px] text-[#555] mb-6">
          Escanea el código QR con tu app de Yape y completa el pago de{" "}
          <b>S/. {monto}</b>.
        </p>

        {/* QR DE YAPE */}
        <div className="border border-[#eee] rounded-lg p-3 mb-6 bg-[#fafafa] inline-block">
          <Image
            src="/qr-yape.png"
            alt="QR de Yape"
            width={220}
            height={220}
            className="mx-auto"
          />
        </div>

        <p className="text-[13px] text-[#777] mb-6">
          Una vez realizado el pago, presiona el botón de abajo.
        </p>

        {!confirmado ? (
          <button
            onClick={() => setConfirmado(true)}
            className="w-full bg-[#0b57d0] text-white rounded-md py-3 text-[15px] font-medium hover:bg-[#094dc1] transition disabled:opacity-70"
          >
            Ya realicé el pago
          </button>
        ) : (
          <div className="mt-4">
            <p className="text-[14px] text-[#0b57d0] font-medium mb-3">
              ✅ Pago registrado correctamente
            </p>
            <button
              onClick={() =>
                (window.location.href = "https://www.lacuevadelterrorpe.com/")
              }
              className="w-full bg-[#e4e7ee] text-[#0b57d0] rounded-md py-3 text-[15px] font-medium hover:bg-[#dce1eb] transition"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
