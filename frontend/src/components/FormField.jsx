function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  required = true,
  minLength,
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        autoComplete={autoComplete}
        className="h-12 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition focus:border-blue-400/60 focus:ring-4 focus:ring-blue-500/10"
        minLength={minLength}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  )
}

export default FormField
