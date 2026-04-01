import { Link } from 'react-router-dom'
import BackButton from './BackButton.jsx'

function AuthLayout({
  title,
  description,
  footerLabel,
  footerLink,
  footerText,
  backFallback,
  children,
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8">
        <section className="w-full rounded-3xl border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/30 backdrop-blur">
          <BackButton fallback={backFallback} />

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            {description}
          </p>

          <div className="mt-8">{children}</div>

          <p className="mt-6 text-sm text-slate-400">
            {footerText}{' '}
            <Link className="font-medium text-blue-300 transition hover:text-blue-200" to={footerLink}>
              {footerLabel}
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default AuthLayout
