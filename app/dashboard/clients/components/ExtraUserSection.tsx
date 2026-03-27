interface Props {
  addExtraUser:          boolean; setAddExtraUser:          (v: boolean) => void;
  extraEmail:            string;  setExtraEmail:            (v: string)  => void;
  extraName:             string;  setExtraName:             (v: string)  => void;
  extraRole:             'finops_admin' | 'viewer'; setExtraRole: (v: 'finops_admin' | 'viewer') => void;
  extraPassword:         string;  setExtraPassword:         (v: string)  => void;
  extraPasswordConfirm:  string;  setExtraPasswordConfirm:  (v: string)  => void;
  showExtraPass:  boolean; setShowExtraPass:  (v: boolean) => void;
  showExtraPass2: boolean; setShowExtraPass2: (v: boolean) => void;
}

export default function ExtraUserSection({
  addExtraUser, setAddExtraUser,
  extraEmail, setExtraEmail, extraName, setExtraName,
  extraRole, setExtraRole, extraPassword, setExtraPassword,
  extraPasswordConfirm, setExtraPasswordConfirm,
  showExtraPass, setShowExtraPass, showExtraPass2, setShowExtraPass2,
}: Props) {
  return (
    <>
      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={addExtraUser}
          onChange={e => setAddExtraUser(e.target.checked)}
        />
        Agregar usuario adicional
      </label>

      {addExtraUser && (
        <>
          <input
            className="w-full px-4 py-2 border rounded-lg mb-3"
            placeholder="Email usuario adicional"
            value={extraEmail}
            onChange={e => setExtraEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border rounded-lg mb-3"
            placeholder="Nombre usuario adicional"
            value={extraName}
            onChange={e => setExtraName(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border rounded-lg mb-3"
            value={extraRole}
            onChange={e => setExtraRole(e.target.value as 'finops_admin' | 'viewer')}
          >
            <option value="finops_admin">FinOps Admin</option>
            <option value="viewer">Viewer</option>
          </select>

          <PasswordField
            placeholder="Contraseña"
            value={extraPassword}
            onChange={setExtraPassword}
            show={showExtraPass}
            onToggle={() => setShowExtraPass(!showExtraPass)}
            className="mb-3"
          />
          <PasswordField
            placeholder="Confirmar contraseña"
            value={extraPasswordConfirm}
            onChange={setExtraPasswordConfirm}
            show={showExtraPass2}
            onToggle={() => setShowExtraPass2(!showExtraPass2)}
            className="mb-4"
          />
        </>
      )}
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
