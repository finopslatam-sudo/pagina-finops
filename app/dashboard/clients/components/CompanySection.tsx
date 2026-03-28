import { PLANS } from '@/app/lib/plans';

interface Props {
  companyName: string; setCompanyName: (v: string) => void;
  email:       string; setEmail:       (v: string) => void;
  contactName: string; setContactName: (v: string) => void;
  phone:       string; setPhone:       (v: string) => void;
  pais:        string; setPais:        (v: string) => void;
  planId:      number; setPlanId:      (v: number) => void;
}

export default function CompanySection({
  companyName, setCompanyName, email, setEmail,
  contactName, setContactName, phone, setPhone,
  pais, setPais, planId, setPlanId,
}: Props) {
  return (
    <>
      <h3 className="font-medium mb-3">Datos de la empresa</h3>

      <input
        className="w-full px-4 py-2 border rounded-lg mb-3"
        placeholder="Nombre empresa"
        value={companyName}
        onChange={e => setCompanyName(e.target.value)}
      />
      <input
        className="w-full px-4 py-2 border rounded-lg mb-3"
        placeholder="Email empresa"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <select
        className="w-full px-4 py-2 border rounded-lg mb-3"
        value={planId}
        onChange={e => setPlanId(Number(e.target.value))}
      >
        {PLANS.map(plan => (
          <option key={plan.id} value={plan.id}>{plan.name}</option>
        ))}
      </select>
      <input
        className="w-full px-4 py-2 border rounded-lg mb-3"
        placeholder="Nombre contacto empresa"
        value={contactName}
        onChange={e => setContactName(e.target.value)}
      />
      <input
        className="w-full px-4 py-2 border rounded-lg mb-3"
        placeholder="Teléfono"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />
      <select
        className="w-full px-4 py-2 border rounded-lg mb-4 bg-white"
        value={pais}
        onChange={e => setPais(e.target.value)}
      >
        <option value="">País (opcional)</option>
        <option>México</option><option>Chile</option><option>Colombia</option>
        <option>Argentina</option><option>Perú</option><option>Brasil</option>
        <option>Ecuador</option><option>Uruguay</option><option>Bolivia</option>
        <option>Paraguay</option><option>Venezuela</option><option>Otro</option>
      </select>
    </>
  );
}
