import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import FormField from '../components/FormField.jsx'
import GitHubAccessCard from '../components/GitHubAccessCard.jsx'
import { useAuth } from '../hooks/useAuth.js'

const INITIAL_SIGNUP_FORM = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
}

function SignupPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formValues, setFormValues] = useState(INITIAL_SIGNUP_FORM)
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
      await register(formValues)
      navigate('/profile', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      backFallback="/login"
      description="Create your account with email and password or continue with GitHub."
      footerLabel="Log in"
      footerLink="/login"
      footerText="Already have an account?"
      title="Create your account"
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            autoComplete="given-name"
            label="First name"
            name="firstName"
            onChange={handleChange}
            placeholder="Aarav"
            value={formValues.firstName}
          />
          <FormField
            autoComplete="family-name"
            label="Last name"
            name="lastName"
            onChange={handleChange}
            placeholder="Sharma"
            value={formValues.lastName}
          />
        </div>

        <FormField
          autoComplete="username"
          label="Username"
          name="username"
          onChange={handleChange}
          placeholder="aarav.codes"
          value={formValues.username}
        />
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
          autoComplete="new-password"
          label="Password"
          minLength={8}
          name="password"
          onChange={handleChange}
          placeholder="Create a secure password"
          type="password"
          value={formValues.password}
        />

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}

        <button
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <GitHubAccessCard
        buttonLabel="Continue with GitHub"
      />
    </AuthLayout>
  )
}

export default SignupPage
