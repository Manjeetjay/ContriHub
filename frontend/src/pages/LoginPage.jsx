import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import FormField from '../components/FormField.jsx'
import GitHubAccessCard from '../components/GitHubAccessCard.jsx'
import { useAuth } from '../hooks/useAuth.js'

const INITIAL_LOGIN_FORM = {
  email: '',
  password: '',
}

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formValues, setFormValues] = useState(INITIAL_LOGIN_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValue) => ({
      ...currentValue,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(formValues)
      navigate('/profile', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      backFallback="/signup"
      description="Log in with your email and password or continue with GitHub."
      footerLabel="Create an account"
      footerLink="/signup"
      footerText="New here?"
      title="Log in"
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField
          autoComplete="email"
          label="Email"
          name="email"
          onChange={handleChange}
          placeholder="you@example.com"
          type="email"
          value={formValues.email}
        />
        <FormField
          autoComplete="current-password"
          label="Password"
          minLength={8}
          name="password"
          onChange={handleChange}
          placeholder="Enter your password"
          type="password"
          value={formValues.password}
        />

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <button
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Signing in...' : 'Log in'}
        </button>
      </form>

      <GitHubAccessCard
        buttonLabel="Continue with GitHub"
      />
    </AuthLayout>
  )
}

export default LoginPage
