'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { AuthCard } from '../component/AuthCard'
import { loginUser } from '../utils/requests'
import { isLoggedIn, setToken } from '../utils/auth'

interface LoginInput {
  username: string
  password: string
}

export function Login() {
  const router = useRouter()
  const [formError, setFormError] = useState<string>()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>()

  // Already logged in: skip the form.
  useEffect(() => {
    if (isLoggedIn()) router.replace('/Tracker')
  }, [router])

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    setFormError(undefined)
    try {
      const res = await loginUser(data)
      if (res.ok) {
        setToken(res.token, res.expiresIn, res.profile)
        router.replace('/Tracker')
        return
      }
      res.details?.forEach((d) => {
        if (d.fieldName === 'username' || d.fieldName === 'password') {
          setError(d.fieldName, { message: d.message })
        }
      })
      setFormError(res.error)
    } catch {
      setFormError('Could not reach the server. Please try again.')
    }
  }

  return (
    <AuthCard title="Log in">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Username"
            autoComplete="username"
            autoFocus
            error={!!errors.username}
            helperText={errors.username?.message}
            {...register('username', { required: 'Username is required' })}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </Button>
          <p className="text-sm">
            No account?{' '}
            <Link href="/register" className="underline">
              Register
            </Link>
          </p>
        </Stack>
      </form>
    </AuthCard>
  )
}
