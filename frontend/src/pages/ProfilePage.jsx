import { useMemo } from 'react'
import { FiClock, FiLogOut, FiRefreshCw, FiShield, FiUser } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function formatDate(value) {
  if (!value) {
    return 'Not available yet'
  }

  return new Date(value).toLocaleString()
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not added yet'
  }

  return value
}

function getInitials(profile, fallbackEmail) {
  const first = profile?.firstName?.[0] ?? ''
  const last = profile?.lastName?.[0] ?? ''
  const initials = `${first}${last}`.trim()

  if (initials) {
    return initials.toUpperCase()
  }

  return (profile?.username?.[0] ?? fallbackEmail?.[0] ?? 'U').toUpperCase()
}

function DetailCard({ title, description, items }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/20">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {item.label}
            </dt>
            <dd className="mt-3 break-words text-sm font-medium leading-6 text-slate-200">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function ProfilePage() {
  const navigate = useNavigate()
  const { session, logout, refreshProfile, isProfileLoading } = useAuth()

  const profile = session?.profile
  const fullName = useMemo(() => {
    const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim()
    return name || profile?.username || session?.email || 'ContriHub User'
  }, [profile, session?.email])

  const personalDetails = [
    { label: 'First name', value: formatValue(profile?.firstName) },
    { label: 'Last name', value: formatValue(profile?.lastName) },
    { label: 'Username', value: formatValue(profile?.username) },
    { label: 'Email', value: formatValue(profile?.email ?? session?.email) },
  ]

  const accountDetails = [
    { label: 'User ID', value: formatValue(profile?.id) },
    { label: 'Role', value: formatValue(profile?.role ?? session?.role) },
    { label: 'Auth type', value: formatValue(profile?.authType ?? session?.provider) },
    { label: 'GitHub ID', value: formatValue(profile?.githubId) },
    { label: 'Avatar URL', value: formatValue(profile?.avatarUrl) },
    { label: 'Signed in with', value: formatValue(session?.provider) },
  ]

  const timelineDetails = [
    { label: 'Created at', value: formatDate(profile?.createdAt) },
    { label: 'Updated at', value: formatDate(profile?.updatedAt) },
    { label: 'Authenticated at', value: formatDate(session?.authenticatedAt) },
  ]

  async function handleRefresh() {
    try {
      await refreshProfile()
    } catch {
      // The page already has the last known session state; failing refresh should not break the view.
    }
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  if (isProfileLoading && !profile) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
          <section className="w-full rounded-3xl border border-white/10 bg-slate-900/85 p-10 text-center shadow-2xl shadow-black/30">
            <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Profile</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">Loading your profile...</h1>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              We are fetching the latest account details from the authenticated `/profile` API.
            </p>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/30 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {profile?.avatarUrl ? (
                <img
                  alt={`${fullName} avatar`}
                  className="h-24 w-24 rounded-3xl border border-white/10 object-cover shadow-lg shadow-black/20"
                  src={profile.avatarUrl}
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-blue-500/10 text-3xl font-semibold text-blue-200 shadow-lg shadow-black/20">
                  {getInitials(profile, session?.email)}
                </div>
              )}

              <div>
                <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
                  Profile
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {fullName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  This page is populated from the authenticated backend `/api/v1/profile` endpoint,
                  so what you see here is the latest account data currently stored for this user.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
                    <FiUser />
                    {formatValue(profile?.username)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
                    <FiShield />
                    {formatValue(profile?.role ?? session?.role)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
                    <FiClock />
                    {formatDate(session?.authenticatedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isProfileLoading}
                onClick={handleRefresh}
                type="button"
              >
                <FiRefreshCw />
                {isProfileLoading ? 'Refreshing...' : 'Refresh profile'}
              </button>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-500/90 px-4 text-sm font-semibold text-white transition hover:bg-rose-400"
                onClick={handleLogout}
                type="button"
              >
                <FiLogOut />
                Log out
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <DetailCard
            description="These are the main identity fields currently stored for this account."
            items={personalDetails}
            title="Personal details"
          />
          <DetailCard
            description="This section shows the authentication and account metadata currently available."
            items={accountDetails}
            title="Account details"
          />
        </div>

        <DetailCard
          description="Timestamps are rendered from the backend so you can see when the account was created and last updated."
          items={timelineDetails}
          title="Timeline"
        />
      </div>
    </main>
  )
}

export default ProfilePage
