import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, empresa, email, telefono, servicio, mensaje } = body;

    // 🔒 Validación mínima
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    // 🟢 Transporte SMTP (Zoho compatible)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // ej: smtp.zoho.com
      port: Number(process.env.SMTP_PORT),  // 587
      secure: false,                        // OBLIGATORIO con Zoho + 587
      auth: {
        user: process.env.SMTP_USER,        // contacto@finopslatam.com
        pass: process.env.SMTP_PASS,        // App Password
      },
    });

    // 🔥 Esto ayuda muchísimo a debuggear en Vercel
    await transporter.verify();

    // ✉️ Envío del correo
    await transporter.sendMail({
      // ⚠️ MUY IMPORTANTE: el FROM debe ser EXACTAMENTE el SMTP_USER
      from: `"FinOpsLatam" <${process.env.SMTP_USER}>`,

      // Te llega a ti
      to: process.env.SMTP_USER,

      // Para responder directo al cliente
      replyTo: email,

      subject: "📩 Nueva solicitud de consultoría",
      html: `
        <h3>Nueva solicitud de consultoría</h3>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Empresa:</b> ${empresa || "No informado"}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Teléfono:</b> ${telefono || "No informado"}</p>
        <p><b>Servicio:</b> ${servicio || "No especificado"}</p>
        <p><b>Mensaje:</b><br/>${mensaje}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ ERROR CONTACT API:", error);

    return NextResponse.json(
      {
        error: "Error enviando correo",
        detail: error?.message || "SMTP error",
      },
      { status: 500 }
    );
  }
}
