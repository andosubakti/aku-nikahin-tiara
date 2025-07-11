import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  // Ambil query param page, pageSize, q, dan filter
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
  const offset = (page - 1) * pageSize
  const q = searchParams.get('q')?.trim() || ''
  const terkirim = searchParams.get('terkirim')
  const digital = searchParams.get('digital')
  const formal = searchParams.get('formal')
  const physical = searchParams.get('physical')
  const category = searchParams.get('category')

  // Build dynamic WHERE clause
  let whereClause = ''
  let params: any[] = []
  if (q) {
    whereClause +=
      (whereClause ? ' AND ' : '') + `name ILIKE $${params.length + 1}`
    params.push(`%${q}%`)
  }
  if (terkirim === 'true' || terkirim === 'false') {
    whereClause +=
      (whereClause ? ' AND ' : '') + `terkirim = $${params.length + 1}`
    params.push(terkirim === 'true')
  }
  if (digital === 'true' || digital === 'false') {
    whereClause +=
      (whereClause ? ' AND ' : '') + `digital = $${params.length + 1}`
    params.push(digital === 'true')
  }
  if (formal === 'true' || formal === 'false') {
    whereClause +=
      (whereClause ? ' AND ' : '') + `formal = $${params.length + 1}`
    params.push(formal === 'true')
  }
  if (physical === 'true' || physical === 'false') {
    whereClause +=
      (whereClause ? ' AND ' : '') + `physical = $${params.length + 1}`
    params.push(physical === 'true')
  }
  if (category) {
    whereClause +=
      (whereClause ? ' AND ' : '') + `category = $${params.length + 1}`
    params.push(category)
  }
  const whereSQL = whereClause ? `WHERE ${whereClause}` : ''
  const orderLimit = `ORDER BY created_at DESC LIMIT $${
    params.length + 1
  } OFFSET $${params.length + 2}`

  let data: any[] = []
  let totalResult: any[] = []
  if (whereSQL) {
    data = await sql.query(
      `SELECT id, name, category, formal, physical, digital, wa, terkirim, message_template_id, created_at, updated_at FROM guests ${whereSQL} ${orderLimit}`,
      [...params, pageSize, offset],
    )
    totalResult = await sql.query(
      `SELECT COUNT(*)::int AS total FROM guests ${whereSQL}`,
      params,
    )
  } else {
    data = await sql`SELECT id, name, category, formal, physical, digital, wa, terkirim, message_template_id, created_at, updated_at FROM guests ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${offset}`
    totalResult = await sql`SELECT COUNT(*)::int AS total FROM guests`
  }
  const total = totalResult[0]?.total || 0

  return NextResponse.json({ data, total, page, pageSize })
}

export async function POST(req: NextRequest) {
  const {
    name,
    category,
    formal,
    physical,
    digital,
    wa,
    message_template_id,
  } = await req.json()
  if (!name || !category) {
    return NextResponse.json(
      { error: 'Name and category required' },
      { status: 400 },
    )
  }
  // Tidak perlu validasi WA required meskipun digital true
  const insert = await sql`
    INSERT INTO guests (name, category, formal, physical, digital, wa, message_template_id)
    VALUES (${name}, ${category}, ${!!formal}, ${!!physical}, ${!!digital}, ${
    wa || null
  }, ${message_template_id ? Number(message_template_id) : null})
    RETURNING id, name, category, formal, physical, digital, wa, terkirim, message_template_id, created_at, updated_at
  `
  return NextResponse.json(insert[0], { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }
  await sql`DELETE FROM guests WHERE id = ${id}`
  return NextResponse.json({ id })
}

export async function PATCH(req: NextRequest) {
  const {
    id,
    name,
    category,
    formal,
    physical,
    digital,
    wa,
    terkirim,
    message_template_id,
  } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }
  const update = await sql`
    UPDATE guests
    SET
      name = COALESCE(${name}, name),
      category = COALESCE(${category}, category),
      formal = COALESCE(${formal}, formal),
      physical = COALESCE(${physical}, physical),
      digital = COALESCE(${digital}, digital),
      wa = COALESCE(${wa}, wa),
      terkirim = COALESCE(${terkirim}, terkirim),
      message_template_id = COALESCE(${
        message_template_id !== undefined ? Number(message_template_id) : null
      }, message_template_id),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, name, category, formal, physical, digital, wa, terkirim, message_template_id, created_at, updated_at
  `
  if (update.length === 0) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }
  return NextResponse.json(update[0])
}
