export function ProfileInput({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        value={value || ''}
        disabled
        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
      />
    </div>
  );
}

export function EditableField({
  label,
  value,
  editable,
  onEdit,
  onChange,
}: {
  label: string;
  value: string;
  editable: boolean;
  onEdit: () => void;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!editable}
        className={`w-full px-4 py-3 border rounded-xl ${
          editable ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
        }`}
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onEdit}
          className="text-blue-600 text-sm font-medium"
        >
          {editable ? 'Cancelar' : 'Editar'}
        </button>
      </div>
    </div>
  );
}
