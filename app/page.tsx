"use client";
export const dynamic = "force-dynamic";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PagoPage() {
  const router = useRouter();
  const params = useSearchParams();

  // 🔹 Lee el monto desde la URL, o usa 150 por defecto
  const montoParam = params.get("monto");
  const [monto, setMonto] = useState<number>(150);

  useEffect(() => {
    if (montoParam) setMonto(Number(montoParam));
  }, [montoParam]);

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[system-ui,Segoe UI,Roboto,sans-serif] text-[#111]">
      {/* CONTENEDOR GENERAL */}
      <div className="max-w-6xl mx-auto py-10 px-6 flex flex-col md:grid md:grid-cols-[1fr_380px] md:gap-10">
        
        {/* PANEL DERECHO */}
        <aside className="order-1 md:order-2 mb-6 md:mb-0">
          <div className="flex items-center justify-between md:justify-start md:gap-3 mb-3">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-lacueva.png"
                alt="La cueva del terror"
                width={36}
                height={36}
                className="rounded-full border border-[#ddd]"
              />
              <span className="text-[15px] font-medium">La cueva del terror</span>
            </div>
          </div>

          <div className="bg-white rounded-md border border-[#ddd] p-5 shadow-sm">
            {/* Mobile */}
            <div className="flex items-center justify-between md:hidden">
              <p className="text-[14px] text-[#555]">Link de pago</p>
              <p className="text-[14px] font-medium text-[#111]">S/. {monto}</p>
            </div>

            {/* Desktop */}
            <div className="hidden md:block">
              <p className="text-[15px] font-semibold mb-4">Detalles del pago</p>
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#555]">Link de pago</p>
                <p className="text-[14px] font-medium text-[#111]">S/. {monto}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* PANEL IZQUIERDO */}
        <section className="order-2 md:order-1 space-y-6">
          <h2 className="text-[20px] font-semibold">¿Cómo quieres pagar?</h2>

          {/* Con cuenta de Mercado Pago */}
          <div className="space-y-3">
            <p className="text-[14px] font-medium">Con tu cuenta de Mercado Pago</p>
            <button className="w-full flex items-center justify-between bg-white rounded-md px-4 py-4 border border-[#ddd] hover:bg-[#f9f9f9] transition">
              <span className="flex items-center gap-3">
                <Image
                  src="/logo-mercadopago.jpeg"
                  alt="Mercado Pago"
                  width={28}
                  height={28}
                  className="rounded-md"
                />
                <span className="text-[15px] text-[#111]">Ingresar con mi cuenta</span>
              </span>
              <span className="text-[#999] text-[20px]">›</span>
            </button>
          </div>

          {/* Sin cuenta de Mercado Pago */}
          <div className="space-y-3">
            <p className="text-[14px] font-medium">Sin cuenta de Mercado Pago</p>

            <div className="bg-white rounded-md border border-[#ddd] overflow-hidden">
              {[
                { icon: "/credit-card-front-svgrepo-com.svg", label: "Tarjeta de crédito", path: "/pago/credito" },
                { icon: "/credit-card-front-svgrepo-com.svg", label: "Tarjeta de débito", path: "/pago/debito" },
                { icon: "/yape-loguito.png", label: "Yape", path: "/pago/yape" },
              ].map((m, i, arr) => (
                <button
                  key={m.label}
                  onClick={() => router.push(`${m.path}?monto=${monto}`)} // ✅ Pasa el monto
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#f9f9f9] transition ${
                    i < arr.length - 1 ? "border-b border-[#eee]" : ""
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Image
                      src={m.icon}
                      alt={m.label}
                      width={28}
                      height={28}
                      className="rounded-sm"
                    />
                    <span className="text-[15px] text-[#111]">{m.label}</span>
                  </span>
                  <span className="text-[#999] text-[20px]">›</span>
                </button>
              ))}
            </div>
          </div>

          <footer className="text-center text-[13px] text-[#888] pt-8">
            Procesado por Mercado Pago.
          </footer>
        </section>
      </div>
    </main>
  );
}
