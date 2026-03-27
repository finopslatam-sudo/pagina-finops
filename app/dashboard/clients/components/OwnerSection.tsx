interface Props {
  ownerEmail:           string; setOwnerEmail:           (v: string) => void;
  ownerName:            string; setOwnerName:            (v: string) => void;
  ownerPassword:        string; setOwnerPassword:        (v: string) => void;
  ownerPasswordConfirm: string; setOwnerPasswordConfirm: (v: string) => void;
  showOwnerPass:  boolean; setShowOwnerPass:  (v: boolean) => void;
  showOwnerPass2: boolean; setShowOwnerPass2: (v: boolean) => void;
}

export default function OwnerSection({
  ownerEmail, setOwnerEmail, ownerName, setOwnerName,
  ownerPassword, setOwnerPassword, ownerPasswordConfirm, setOwnerPasswordConfirm,
  showOwnerPass, setShowOwnerPass, showOwnerPass2, setShowOwnerPass2,
}: Props) {
  return (
    <>
      <hr className="my-4" />
      <h3 className="font-medium mb-3">Usuario Owner (Obligatorio)</h3>

      <input
        className="w-full px-4 py-2 border rounded-lg mb-3"
        placeholder="Email Owner"
        value={ownerEmail}
        onChange={e => setOwnerEmail(e.target.value)}
      />
      <input
        className="w-full px-4 py-2 border rounded-lg mb-3"
        placeholder="Nombre Owner"
        value={ownerName}
        onChange={e => setOwnerName(e.target.value)}
      />

      <PasswordField
        placeholder="Contraseña Owner"
        value={ownerPassword}
        onChange={setOwnerPassword}
        show={showOwnerPass}
        onToggle={() => setShowOwnerPass(!showOwnerPass)}
        className="mb-3"
      />
      <PasswordField
        placeholder="Confirmar contraseña Owner"
        value={ownerPasswordConfirm}
        onChange={setOwnerPasswordConfirm}
        show={showOwnerPass2}
        onToggle={() => setShowOwnerPass2(!showOwnerPass2)}
        className="mb-4"
      />
    </>
  );
}

function PasswordField({ placeholder, value, onChange, show, onToggle, className }: {
  placeholder: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; className?: string;
}) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <input
        type={show ? 'text' : 'password'}
        className="w-full px-4 py-2 border rounded-lg pr-10"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button type="button" onClick={onToggle} className="absolute right-2 top-2">
        {show ? '🙈' : '👁️'}
      </button>
    </div>
  );
}
