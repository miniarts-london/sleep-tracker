import React from 'react'
import { Paper } from '@mui/material'

// Shared card for the login and register forms.
export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper elevation={2} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </Paper>
  )
}
