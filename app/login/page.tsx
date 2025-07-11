'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login gagal')
      } else {
        localStorage.setItem('isAdmin', 'true')
        router.push('/config')
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/80 to-secondary/80 p-4">
      <Card className="w-full max-w-md shadow-2xl ghibli-card">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold tracking-tight mb-2">
            Login Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Login Gagal</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full transition-all duration-200 hover:scale-105"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
