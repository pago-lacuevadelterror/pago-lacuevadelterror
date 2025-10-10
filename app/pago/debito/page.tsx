"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import RightPanel from "@/components/RightPanel";

export default function DebitoPage() {
  const [monto] = useState<number>(150);
  const router = useRouter();
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
        `&cvv=${encodeURIComponent(form.cvv)}` +
        `&tipo=debito`
    );
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3] font-[system-ui,Segoe UI,Roboto,sans-serif] text-[#111]">
      <div className="max-w-6xl mx-auto py-10 px-6 flex flex-col md:grid md:grid-cols-[1fr_380px] md:gap-10">
        {/* IZQUIERDA */}
        <section className="order-2 md:order-1 bg-white rounded-md border border-[#ddd] p-6 shadow-sm">
          <h2 className="text-[20px] font-semibold mb-5">
            Completa los datos de tu tarjeta de débito
          </h2>

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
            <p className="text-[14px] text-[#111] leading-snug">
              Activa compras por internet en la app de tu banco o llamando al
              teléfono que está en la tarjeta.
            </p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">

            {/* 🔹 NÚMERO DE TARJETA */}
            <div className="relative">
              <label className="block text-[14px] font-medium text-[#111] mb-1">
                Número de tarjeta
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tarjeta"
                  placeholder="1234 1234 1234 1234"
                  value={form.tarjeta}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 16) value = value.slice(0, 16);
                    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                    setForm({ ...form, tarjeta: formatted });
                  }}
                  required
                  maxLength={19}
                  className={`w-full rounded-md px-3 py-3 text-[15px] pr-10 outline-none border border-[#ccc] focus:border-[#007bff] ${
                    form.tarjeta.replace(/\s/g, "").length < 14 && form.tarjeta !== ""
                      ? "border-[#d32f2f]"
                      : ""
                  }`}
                />
                <img
                  src="/credit-card-svgrepo-com.svg"
                  alt="Tarjeta"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px] opacity-80 pointer-events-none"
                />
              </div>
              {form.tarjeta.replace(/\s/g, "").length > 0 &&
                form.tarjeta.replace(/\s/g, "").length < 14 && (
                  <p className="text-[13px] text-[#d32f2f] mt-1">
                    Debe contener entre 14 y 16 dígitos.
                  </p>
                )}
            </div>

            {/* TITULAR */}
            <div>
              <label className="block text-[14px] font-medium text-[#111] mb-1">
                Nombre del titular
              </label>
              <input
                type="text"
                name="titular"
                placeholder="Ej: María López"
                value={form.titular}
                onChange={handleChange}
                className="w-full border border-[#ccc] rounded-md px-3 py-3 text-[15px] focus:border-[#007bff] outline-none"
                required
              />
              <p className="text-[13px] text-[#666] mt-1">
                Como aparece en la tarjeta.
              </p>
            </div>

            {/* 🔹 VENCIMIENTO Y CVV */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[14px] font-medium text-[#111] mb-1">
                  Vencimiento
                </label>
                <input
                  type="text"
                  name="vencimiento"
                  placeholder="MM/AA"
                  value={form.vencimiento}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 4) value = value.slice(0, 4);
                    if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2);
                    setForm({ ...form, vencimiento: value });
                  }}
                  required
                  maxLength={5}
                  className="w-full border border-[#ccc] rounded-md px-3 py-3 text-[15px] focus:border-[#007bff] outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-[14px] font-medium text-[#111] mb-1">
                  Código de seguridad
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cvv"
                    placeholder="Ej: 123"
                    value={form.cvv}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#ccc] rounded-md px-3 py-3 pr-9 text-[15px] focus:border-[#007bff] outline-none"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0b57d0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="#0b57d0" strokeWidth="1.5" fill="none" />
                    <path
                      d="M9.09 9a3 3 0 1 1 5.82 1c0 1.5-2.91 2.25-2.91 4"
                      stroke="#0b57d0"
                      strokeWidth="1.6"
                      fill="none"
                    />
                    <circle cx="12" cy="17" r="0.9" fill="#0b57d0" />
                  </svg>
                </div>
              </div>
            </div>

            {/* DOCUMENTO */}
            <div>
              <label className="block text-[14px] font-medium text-[#111] mb-1">
                Documento del titular
              </label>
              <div className="flex gap-3 items-stretch" ref={dropdownRef}>
                <div className="relative w-[150px]">
                  <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="w-full border border-[#ccc] rounded-md px-3 py-3 text-[15px] flex items-center justify-between hover:shadow-sm focus:border-[#007bff]"
                  >
                    <span>{form.docType}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M6 8l4 4 4-4"
                        stroke="#333"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {open && (
                    <ul className="absolute z-50 w-full mt-2 bg-white border border-[#ddd] rounded-md shadow-lg">
                      {docOptions.map((opt) => (
                        <li
                          key={opt}
                          onClick={() => {
                            setForm({ ...form, docType: opt });
                            setOpen(false);
                          }}
                          className={`px-4 py-2 text-[15px] cursor-pointer ${
                            form.docType === opt
                              ? "bg-[#f5faff] text-[#0b57d0]"
                              : "hover:bg-[#f9f9f9]"
                          }`}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <input
                  type="text"
                  name="documento"
                  placeholder="Ej: 71234567"
                  value={form.documento}
                  onChange={handleChange}
                  className="flex-1 border border-[#ccc] rounded-md px-3 py-3 text-[15px] focus:border-[#007bff] outline-none"
                  required
                />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 pt-6 border-t border-[#eee] mt-4">
              <button
                type="button"
                onClick={() => router.push("/")}
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
          </form>
        </section>

        {/* DERECHA */}
        <RightPanel monto={monto} />
      </div>
    </main>
  );
}
