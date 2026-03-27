import Link from 'next/link';
import PublicFooter from '@/app/components/layout/PublicFooter';

export default function PagoSuccessPage() {
  return (
    <>
      <main className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center space-y-6">

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto">
            ✅
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Pago confirmado!
            </h1>
            <p className="text-gray-500 leading-relaxed">
              Hemos recibido tu pago correctamente. En unos minutos un administrador
              validará tu cuenta y recibirás tus credenciales de acceso por correo electrónico.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-left space-y-2">
            <p className="text-sm font-semibold text-blue-800">¿Qué pasa ahora?</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Nuestro equipo revisa tu solicitud (máx. 24 horas hábiles)</li>
              <li>Creamos tu cuenta en la plataforma</li>
              <li>Te enviamos las credenciales de acceso por email</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
            >
              Volver al inicio
            </Link>
            <Link
              href="/contacto"
              className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-xl transition text-sm"
            >
              Contactar soporte
            </Link>
          </div>

        </div>
      </main>
      <PublicFooter />
    </>
  );
}
