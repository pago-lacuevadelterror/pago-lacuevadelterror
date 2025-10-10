"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RightPanel from "@/components/RightPanel";

function CreditoContent() {
  const router = useRouter();
  const params = useSearchParams();
  const monto = parseFloat(params.get("monto") || "150"); // ✅ ahora se lee desde la URL

  const [form, setForm] = useState({
    tarjeta: "",
    titular: "",
    vencimiento: "",
    cvv: "",
    docType: "DNI",
    documento: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // --- Dropdown personalizado del documento ---
  const docOptions = ["DNI", "C.E", "RUC", "Otro"];
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // --- redirige a /pago/revisar con monto dinámico ---
  const handleNext = () => {
    if (
      !form.tarjeta ||
      !form.titular ||
      !form.vencimiento ||
      !form.cvv ||
      !form.documento
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    router.push(
      `/pago/revisar?monto=${monto}` +
        `&tarjeta=${encodeURIComponent(form.tarjeta)}` +
        `&titular=${encodeURIComponent(form.titular)}` +
        `&doc=${encodeURIComponent(form.docType + "-" + form.documento)}` +
        `&vencimiento=${encodeURIComponent(form.vencimiento)}` +
        `&cvv=${encodeURIComponent(form.cvv)}`
    );
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[system-ui,Segoe UI,Roboto,sans-serif] text-[#111]">
      <div className="max-w-6xl mx-auto py-10 px-6 flex flex-col md:grid md:grid-cols-[1fr_380px] md:gap-10">
        {/* IZQUIERDA */}
        <section className="order-2 md:order-1 bg-white rounded-md border border-[#ddd] p-6 shadow-sm">
          <h2 className="text-[20px] font-semibold mb-5">Completa los datos de tu tarjeta</h2>

          {/* ... TODO EL FORMULARIO IGUAL ... */}

          <div className="flex justify-end gap-3 pt-6 border-t border-[#eee] mt-4">
            <button
              type="button"
              onClick={() => router.push(`/pago?monto=${monto}`)} // ✅ vuelve manteniendo el monto
              className="px-5 h-[40px] rounded-md bg-[#e4e7ee] text-[#0b57d0] text-[14px] font-medium hover:bg-[#dce1eb]"
            >
              Volver
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="px-5 h-[40px] rounded-md bg-[#0b57d0] text-white text-[14px] font-medium hover:bg-[#094dc1]"
            >
              Continuar
            </button>
          </div>
        </section>

        {/* DERECHA */}
        <RightPanel monto={monto} /> {/* ✅ también muestra el monto correcto */}
      </div>
    </main>
  );
}

export default function CreditoPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <CreditoContent />
    </Suspense>
  );
}
