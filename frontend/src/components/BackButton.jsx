import { FiArrowLeft } from 'react-icons/fi'

function BackButton({ fallback = '/login' }) {
  function buildFallbackUrl() {
    const normalizedHash = fallback.startsWith('#')
      ? fallback
      : `#${fallback.startsWith('/') ? fallback : `/${fallback}`}`

    return `${window.location.pathname}${normalizedHash}`
  }

  function handleBack() {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    window.location.replace(buildFallbackUrl())
  }

  return (
    <button
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 px-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-slate-800"
      onClick={handleBack}
      type="button"
    >
      <FiArrowLeft />
      Back
    </button>
  )
}

export default BackButton
