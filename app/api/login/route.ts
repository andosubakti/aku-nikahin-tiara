import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  const { name, password } = await req.json()

  // Cari user dengan name dan password yang cocok
  const result = await sql`
    SELECT id, email, name, created_at
    FROM users
    WHERE name = ${name} AND password = ${password}
    LIMIT 1
  `

  if (result.length === 0) {
    return NextResponse.json(
      { error: 'Nama atau password salah.' },
      { status: 401 },
    )
  }

  // Sukses login
  return NextResponse.json({ user: result[0] })
}
