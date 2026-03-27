'use client';

import { useState } from "react";
import { API_URL } from "@/app/lib/api";
import PublicFooter from "@/app/components/layout/PublicFooter";
import ContactInfo  from "./components/ContactInfo";
import ContactForm  from "./components/ContactForm";
import ProcessSteps from "./components/ProcessSteps";
import ContactFAQ   from "./components/ContactFAQ";

type FormState = {
  nombre: string; empresa: string; email: string;
  telefono: string; servicio: string; mensaje: string;
};

const EMPTY_FORM: FormState = { nombre: '', empresa: '', email: '', telefono: '', servicio: '', mensaje: '' };

export default function ContactoPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || 'Error al enviar la solicitud'); return; }
    alert('Solicitud enviada correctamente');
    setForm(EMPTY_FORM);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 sm:py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Contáctanos</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            ¿Listo para optimizar tus costos en la nube? Hablemos sobre cómo podemos
            ayudarte a transformar la gestión financiera de tu infraestructura cloud.
          </p>
        </div>
      </section>

      {/* Info + Form */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <ContactInfo />
            <ContactForm form={form} setForm={setForm} onSubmit={handleSubmit} />
          </div>
        </div>
      </section>

      <ProcessSteps />
      <ContactFAQ />

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">¿Listo para Comenzar?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Agenda tu consultoría gratuita hoy mismo y descubre cómo podemos ayudarte
            a reducir tus costos cloud mientras mejoramos el rendimiento.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="https://wa.me/56965090121?text=Hola,%20quiero%20agendar%20una%20consultoría%20gratuita%20de%20FinOps"
              target="_blank"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Agenda por WhatsApp
            </a>
            <a
              href="mailto:contacto@finopslatam.com?subject=Consultoría FinOps Gratuita"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Enviar Email
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
