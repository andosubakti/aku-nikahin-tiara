import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  const result = await sql`SELECT id, title, content FROM message_templates ORDER BY created_at DESC`
  if (!result || result.length === 0) {
    // If DB is empty, return the default template from template-msg.json
    const { readFileSync } = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'lib', 'template-msg.json')
    const defaultTemplates = JSON.parse(readFileSync(filePath, 'utf-8'))
    return NextResponse.json(defaultTemplates)
  }
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const { title, content } = await req.json()
  if (!title || !content) {
    return NextResponse.json(
      { error: 'Title and content required' },
      { status: 400 },
    )
  }
  const insert = await sql`
    INSERT INTO message_templates (title, content)
    VALUES (${title}, ${content})
    RETURNING id, title, content
  `
  return NextResponse.json(insert[0], { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }
  await sql`DELETE FROM message_templates WHERE id = ${id}`
  return NextResponse.json({ id })
}

export async function PUT(req: NextRequest) {
  const { id, title, content } = await req.json()
  if (!id || !title || !content) {
    return NextResponse.json(
      { error: 'ID, title, and content required' },
      { status: 400 },
    )
  }
  const update = await sql`
    UPDATE message_templates
    SET title = ${title}, content = ${content}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, title, content
  `
  if (update.length === 0) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }
  return NextResponse.json(update[0])
}
