'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { AuthCard } from '../component/AuthCard'
import { loginUser, registerUser } from '../utils/requests'
import { isLoggedIn, setToken } from '../utils/auth'

interface RegisterInput {
  username: string
  password: string
  firstName: string
  lastName: string
}

// API field names → form field names
const apiFieldToFormField: Record<string, keyof RegisterInput> = {
  username: 'username',
  password: 'password',
  first_name: 'firstName',
  last_name: 'lastName',
}

// Mirrors the API's rules so most mistakes are caught before submitting.
const USERNAME = /^[A-Za-z0-9_-]{1,50}$/

export function Register() {
  const router = useRouter()
  const [formError, setFormError] = useState<string>()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>()

  useEffect(() => {
    if (isLoggedIn()) router.replace('/Tracker')
  }, [router])

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    setFormError(undefined)
    try {
      const res = await registerUser({
        username: data.username,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
      })

      if (!res.success) {
        if (res.details?.length) {
          res.details.forEach((d) => {
            const field = apiFieldToFormField[d.fieldName]
            if (field) setError(field, { message: d.message })
          })
        } else {
          setFormError('Registration failed. Please try again.')
        }
        return
      }

      // Register doesn't return a token, so log straight in with the same details.
      const login = await loginUser({ username: data.username, password: data.password })
      if (login.ok) {
        setToken(login.token, login.expiresIn, login.profile)
        router.replace('/Tracker')
      } else {
        router.replace('/login')
      }
    } catch {
      setFormError('Could not reach the server. Please try again.')
    }
  }

  return (
    <AuthCard title="Create an account">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Username"
            autoComplete="username"
            autoFocus
            error={!!errors.username}
            helperText={errors.username?.message ?? 'Letters, numbers, - or _'}
            {...register('username', {
              required: 'Username is required',
              pattern: { value: USERNAME, message: 'Use 1 to 50 letters, numbers, - or _' },
            })}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password?.message ?? 'At least 8 characters'}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              maxLength: { value: 72, message: 'Password must be at most 72 characters' },
            })}
          />
          <TextField
            label="First name"
            autoComplete="given-name"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register('firstName', {
              required: 'First name is required',
              maxLength: { value: 50, message: 'At most 50 characters' },
            })}
          />
          <TextField
            label="Last name"
            autoComplete="family-name"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register('lastName', {
              required: 'Last name is required',
              maxLength: { value: 50, message: 'At most 50 characters' },
            })}
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Register'}
          </Button>
          <p className="text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </p>
        </Stack>
      </form>
    </AuthCard>
  )
}
