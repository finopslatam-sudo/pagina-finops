type Props = {
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  resetLoading: boolean;
  resetSuccess: boolean;
  resetError: string | null;
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  setShowPassword: (v: boolean) => void;
  setShowConfirmPassword: (v: boolean) => void;
  onReset: () => void;
};

function PasswordField({ label, value, show, onChange, onToggle }: {
  label: string; value: string; show: boolean;
  onChange: (v: string) => void; onToggle: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full border rounded px-3 py-2 pr-10"
        />
        <button type="button" onClick={onToggle} className="absolute right-2 top-2 text-sm">
          {show ? '🙈' : '👁'}
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordSection({
  newPassword, confirmPassword, showPassword, showConfirmPassword,
  resetLoading, resetSuccess, resetError,
  setNewPassword, setConfirmPassword, setShowPassword, setShowConfirmPassword,
  onReset,
}: Props) {
  return (
    <>
      <hr className="my-4" />
      <h3 className="font-semibold text-lg">Reset Password</h3>

      <PasswordField
        label="Nueva password"
        value={newPassword}
        show={showPassword}
        onChange={setNewPassword}
        onToggle={() => setShowPassword(!showPassword)}
      />
      <PasswordField
        label="Confirmar nueva password"
        value={confirmPassword}
        show={showConfirmPassword}
        onChange={setConfirmPassword}
        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      {resetError   && <p className="text-sm text-red-600">{resetError}</p>}
      {resetSuccess && <p className="text-sm text-green-600">✅ Password actualizada correctamente</p>}

      <button
        onClick={onReset}
        disabled={resetLoading}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
      >
        {resetLoading ? 'Reseteando...' : 'Reset Password'}
      </button>
    </>
  );
}
