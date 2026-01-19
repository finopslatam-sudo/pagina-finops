import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nombre, empresa, email, telefono, servicio, mensaje } = body;

    // Validación básica
    if (!nombre || !empresa || !email || !servicio || !mensaje) {
      return NextResponse.json(
        { error: "Campos obligatorios faltantes" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"FinOpsLatam Web" <${process.env.SMTP_USER}>`,
      to: "contacto@finopslatam.com",
      replyTo: email,
      subject: `Nueva solicitud de consultoría - ${servicio}`,
      html: `
        <h2>Nueva solicitud de consultoría</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono || "No informado"}</p>
        <p><strong>Servicio:</strong> ${servicio}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("CONTACT ERROR:", error);
    return NextResponse.json(
      { error: "Error interno al enviar el mensaje" },
      { status: 500 }
    );
  }
}
