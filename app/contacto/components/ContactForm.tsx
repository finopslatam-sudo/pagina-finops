type FormState = {
  nombre: string; empresa: string; email: string;
  telefono: string; servicio: string; mensaje: string;
};

interface Props {
  form: FormState;
  setForm: (f: FormState) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ContactForm({ form, setForm, onSubmit }: Props) {
  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  const inputCls = "w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Solicita tu Consultoría Gratuita</h3>

      <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
            <input type="text" required {...field('nombre')} className={inputCls} placeholder="Tu nombre completo" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Empresa *</label>
            <input type="text" required {...field('empresa')} className={inputCls} placeholder="Nombre de tu empresa" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input type="email" required {...field('email')} className={inputCls} placeholder="tu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input type="tel" {...field('telefono')} className={inputCls} placeholder="+56 9 1234 5678" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Servicio de Interés *</label>
          <select required {...field('servicio')} className={inputCls}>
            <option value="">Selecciona un servicio</option>
            <option value="auditoria">FinOps Foundation</option>
            <option value="dashboards">FinOps Professional</option>
            <option value="gobernanza">FinOps Enterprise</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje *</label>
          <textarea
            required rows={4} {...field('mensaje')} className={inputCls}
            placeholder="Cuéntanos sobre tu proyecto y necesidades específicas..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          Enviar Solicitud
        </button>
      </form>
    </div>
  );
}
