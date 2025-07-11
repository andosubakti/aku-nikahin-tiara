'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Table } from '../../components/ui/table'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Alert, AlertTitle, AlertDescription } from '../../components/ui/alert'
import andoContacts from '../../lib/ando-contacts.json'
// import tiaraContacts from "../../lib/tiara-contacts.json"; // contoh jika ada file lain
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '../../components/ui/command'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import React, { useCallback } from 'react'
import defaultTemplates from '../../lib/template-msg.json'
import MarkdownPreview from '@uiw/react-markdown-preview'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
})

export default function ConfigPage() {
  const router = useRouter()
  interface Guest {
    id: number
    name: string
    category: string
    formal: boolean
    physical: boolean
    digital: boolean
    wa?: string
    terkirim?: boolean
    message_template_id?: string
  }
  const categories = ['Ando', 'Tiara', 'Orang Tua Tiara', 'Orang Tua Ando']
  // Semua useState di bawah ini
  const [guests, setGuests] = useState<Guest[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [formal, setFormal] = useState(false)
  const [physical, setPhysical] = useState(false)
  const [digital, setDigital] = useState(false)
  const [wa, setWa] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const invLink = `https://aku-nikahin-tiara.vercel.app`
  // Reference kontak dinamis
  const referenceSourceToCategory: Record<string, string> = {
    'ando-contacts': 'Ando',
    // "tiara-contacts": "Tiara",
    // dst
  }
  const allReferenceContacts = [
    ...(Array.isArray(andoContacts)
      ? andoContacts
          .filter((c) => c['Display Name'] && c['Mobile Phone'])
          .map((c) => ({
            name: c['Display Name'],
            wa: c['Mobile Phone'].replace(/[^\d+]/g, ''),
            source: 'ando-contacts',
          }))
      : []),
    // ...(Array.isArray(tiaraContacts) ? tiaraContacts.map(c => ({ ... })) : []),
  ]
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredContacts, setFilteredContacts] = useState<
    typeof allReferenceContacts
  >([])
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState<number>(-1)

  const [editorOpen, setEditorOpen] = useState(false)
  const [messageTemplate, setMessageTemplate] = useState('')
  const [mdEditorTab, setMdEditorTab] = useState<'write' | 'preview' | 'both'>(
    'write',
  )

  const onChangeMessageTemplate = useCallback((val: string | undefined) => {
    setMessageTemplate(val || '')
  }, [])

  // Tambahkan state untuk multi-template
  const [templates, setTemplates] = useState<
    Array<{ id: string; title: string; content: string }>
  >([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  // State lokal untuk editor judul & konten
  const [editedTitle, setEditedTitle] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [loadingTemplates, setLoadingTemplates] = useState(true)

  const isLogin = localStorage.getItem('isAdmin') === 'true'

  // Fetch templates dari API
  async function fetchTemplates() {
    setLoadingTemplates(true)
    const res = await fetch('/api/message-templates')
    const data = await res.json()
    setTemplates(data)
    setLoadingTemplates(false)
    if (
      data.length > 0 &&
      !data.find((t: { id: string }) => t.id === selectedTemplateId)
    ) {
      setSelectedTemplateId(data[0].id)
    }
  }

  // Tambah template ke state lokal, tidak ke API
  async function handleAddTemplate() {
    const newId = `local-${Date.now()}`
    const newTitle = `Template ${templates.length + 1}`
    const newTemplate = { id: newId, title: newTitle, content: '' }
    setTemplates((prev) => [...prev, newTemplate])
    setSelectedTemplateId(newId)
    setEditedTitle(newTitle)
    setEditedContent('')
  }

  // Hapus template dari API
  async function handleDeleteTemplate(id: string) {
    if (templates.length === 1) return
    await fetch('/api/message-templates', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await fetchTemplates()
  }

  // Update template ke API
  async function handleUpdateTemplate(
    id: string,
    title: string,
    content: string,
  ) {
    await fetch('/api/message-templates', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, content }),
    })
    await fetchTemplates()
  }

  // Handler untuk perubahan content (sekarang hanya update state lokal)
  function handleTemplateChange(val: string | undefined) {
    setEditedContent(val || '')
  }
  // Handler untuk perubahan title (sekarang hanya update state lokal)
  function handleTemplateTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditedTitle(e.target.value)
  }
  // Handler pilih template
  function handleSelectTemplate(id: string) {
    setSelectedTemplateId(id)
    const t = templates.find((t) => t.id === id)
    setEditedTitle(t?.title || '')
    setEditedContent(t?.content || '')
  }

  // Saat templates berubah, sinkronkan judul & konten jika selectedTemplateId berubah
  useEffect(() => {
    const t = templates.find((t) => t.id === selectedTemplateId)
    setEditedTitle(t?.title || '')
    setEditedContent(t?.content || '')
  }, [templates, selectedTemplateId])

  const [
    selectedMessageTemplateIdForGuest,
    setSelectedMessageTemplateIdForGuest,
  ] = useState<number | null>(null)

  const [copySuccess, setCopySuccess] = useState('')

  const [previewOpen, setPreviewOpen] = useState(false)
  const [copyPreviewSuccess, setCopyPreviewSuccess] = useState(false)

  // Tambahkan state untuk pagination
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  // Tambahkan state filter
  const [filterTerkirim, setFilterTerkirim] = useState<
    'all' | 'true' | 'false'
  >('all')
  const [filterDigital, setFilterDigital] = useState<'all' | 'true' | 'false'>(
    'all',
  )
  const [filterFormal, setFilterFormal] = useState<'all' | 'true' | 'false'>(
    'all',
  )
  const [filterPhysical, setFilterPhysical] = useState<
    'all' | 'true' | 'false'
  >('all')
  const [filterKategori, setFilterKategori] = useState('all')

  // Update fetchGuests agar menerima filter
  async function fetchGuests(
    pageArg = page,
    pageSizeArg = pageSize,
    qArg = searchQuery,
    terkirimArg = filterTerkirim,
    digitalArg = filterDigital,
    formalArg = filterFormal,
    physicalArg = filterPhysical,
    kategoriArg = filterKategori,
  ) {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(pageArg),
      pageSize: String(pageSizeArg),
    })
    if (qArg && qArg.trim()) {
      params.append('q', qArg.trim())
    }
    if (terkirimArg !== 'all') params.append('terkirim', terkirimArg)
    if (digitalArg !== 'all') params.append('digital', digitalArg)
    if (formalArg !== 'all') params.append('formal', formalArg)
    if (physicalArg !== 'all') params.append('physical', physicalArg)
    if (kategoriArg !== 'all') params.append('category', kategoriArg)
    const res = await fetch(`/api/guests?${params.toString()}`)
    const result = await res.json()
    setGuests(result.data)
    setTotal(result.total)
    setPage(result.page)
    setPageSize(result.pageSize)
    setLoading(false)
  }

  // Panggil fetchGuests saat filter berubah
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('isAdmin') !== 'true'
    ) {
      router.replace('/login')
    } else {
      fetchGuests(
        page,
        pageSize,
        searchQuery,
        filterTerkirim,
        filterDigital,
        filterFormal,
        filterPhysical,
        filterKategori,
      )
      fetchTemplates()
    }
    // eslint-disable-next-line
  }, [
    page,
    pageSize,
    searchQuery,
    filterTerkirim,
    filterDigital,
    filterFormal,
    filterPhysical,
    filterKategori,
  ])

  function resetForm() {
    setName('')
    setCategory(categories[0])
    setFormal(false)
    setPhysical(false)
    setDigital(false)
    setWa('')
    setEditId(null)
    setEditMode(false)
    setFormError('')
  }

  async function handleAddOrEditGuest(e: React.FormEvent) {
    e.preventDefault()
    // Validasi
    if (!name.trim()) {
      setFormError('Nama wajib diisi')
      return
    }
    if (!category) {
      setFormError('Kategori wajib dipilih')
      return
    }
    // Hapus validasi WA wajib saat digital aktif
    // Jika multi-nama, validasi hanya jika WA diisi
    const names = name
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
    const was = wa
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean)
    if (names.length > 1 && !editMode) {
      if (digital && wa && names.length !== was.length) {
        setFormError(
          'Jumlah nama dan nomor WA harus sama jika ingin menambah banyak tamu sekaligus.',
        )
        return
      }
      setLoading(true)
      await Promise.all(
        names.map((n, i) => {
          const guestPayload = {
            name: n,
            category,
            formal,
            physical,
            digital,
            wa: digital ? was[i] || undefined : undefined,
            message_template_id:
              selectedMessageTemplateIdForGuest !== null
                ? Number(selectedMessageTemplateIdForGuest)
                : null,
          }
          return fetch('/api/guests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guestPayload),
          })
        }),
      )
      setOpen(false)
      resetForm()
      await fetchGuests()
      setLoading(false)
      return
    }
    const guestPayload = {
      name: names[0],
      category,
      formal,
      physical,
      digital,
      wa: digital ? was[0] || undefined : undefined,
      message_template_id:
        selectedMessageTemplateIdForGuest !== null
          ? Number(selectedMessageTemplateIdForGuest)
          : null,
      terkirim: editMode ? terkirim : undefined,
    }
    if (editMode && editId !== null) {
      await fetch('/api/guests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...guestPayload }),
      })
      await fetchGuests()
    } else {
      await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestPayload),
      })
    }
    setOpen(false)
    resetForm()
    fetchGuests()
  }

  async function handleEdit(guest: Guest) {
    if (templates.length === 0) {
      setLoadingTemplates(true)
      await fetchTemplates()
      setLoadingTemplates(false)
    }
    setEditId(guest.id)
    setName(guest.name)
    setCategory(guest.category)
    setFormal(guest.formal)
    setPhysical(guest.physical)
    setDigital(guest.digital)
    setWa(guest.wa || '')
    setEditMode(true)
    setOpen(true)
    setSelectedMessageTemplateIdForGuest(
      typeof guest.message_template_id === 'number'
        ? guest.message_template_id
        : templates[0]?.id
        ? Number(templates[0].id)
        : null,
    )
    setTerkirim(!!guest.terkirim)
  }

  function handleDeleteConfirm(id: number) {
    setDeleteId(id)
    setDeleteDialogOpen(true)
  }

  async function handleDelete() {
    if (deleteId !== null) {
      await fetch('/api/guests', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteId }),
      })
      setDeleteDialogOpen(false)
      setDeleteId(null)
      fetchGuests()
    }
  }

  function handleLogout() {
    localStorage.removeItem('isAdmin')
    router.replace('/login')
  }

  const nameInputRef = useRef<HTMLInputElement>(null)
  const suggestionBoxRef = useRef<HTMLDivElement>(null)

  function handleNameInput(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)

    // Ambil nama terakhir setelah koma
    const parts = e.target.value.split(',')
    const lastPart = parts[parts.length - 1].trim()

    // Ambil daftar nomor WA yang sudah diinput, normalisasi ke awalan 0
    const waParts = wa
      .split(',')
      .map((w) => w.trim().replace(/^\+62/, '0'))
      .filter(Boolean)

    if (lastPart.length >= 2) {
      setFilteredContacts(
        allReferenceContacts.filter(
          (c) =>
            c.name.toLowerCase().includes(lastPart.toLowerCase()) &&
            !waParts.includes(c.wa.replace(/^\+62/, '0')),
        ),
      )
      setShowSuggestions(true)
      setActiveSuggestionIdx(0)
    } else {
      setShowSuggestions(false)
      setActiveSuggestionIdx(-1)
    }
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || filteredContacts.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestionIdx((prev) =>
        prev < filteredContacts.length - 1 ? prev + 1 : 0,
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestionIdx((prev) =>
        prev > 0 ? prev - 1 : filteredContacts.length - 1,
      )
    } else if (e.key === 'Enter') {
      if (
        activeSuggestionIdx >= 0 &&
        activeSuggestionIdx < filteredContacts.length
      ) {
        e.preventDefault()
        handleSelectSuggestion(filteredContacts[activeSuggestionIdx])
      }
    }
  }

  // Sembunyikan suggestion saat input kehilangan fokus, tapi beri delay agar klik suggestion tetap bisa
  function handleNameBlur() {
    setTimeout(() => {
      setShowSuggestions(false)
    }, 100)
  }

  // Jika suggestion box diklik, batalkan blur
  function handleSuggestionBoxMouseDown(e: React.MouseEvent) {
    e.preventDefault()
  }
  function handleSelectSuggestion(s: {
    name: string
    wa: string
    source: string
  }) {
    // Replace nama terakhir dengan suggestion
    const parts = name.split(',')
    const idx = parts.length - 1
    parts[idx] = s.name
    setName(parts.join(', '))

    // Untuk WA: update/insert di posisi yang sama
    let waParts = wa.split(',').map((w) => w.trim())
    const waValue = s.wa.replace(/^\+62/, '0')
    if (waParts.length < parts.length) {
      // Tambah WA baru di posisi yang sama
      waParts[idx] = waValue
    } else {
      // Replace WA di posisi yang sama
      waParts[idx] = waValue
    }
    setWa(waParts.join(', '))

    // Kategori otomatis hanya jika satu nama
    if (parts.length === 1 && referenceSourceToCategory[s.source]) {
      setCategory(referenceSourceToCategory[s.source])
    }
    if (!digital) setDigital(true)
    setShowSuggestions(false)
  }

  // Fungsi untuk encode nama ke param to
  function encodeNameForUrl(name: string) {
    return name
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '+')
  }

  // Handler simpan perubahan template ke API
  async function handleSaveTemplate() {
    if (!selectedTemplateId) return
    const isLocal =
      typeof selectedTemplateId === 'string' &&
      selectedTemplateId.startsWith('local-')
    if (isLocal) {
      // POST jika template baru (local)
      await fetch('/api/message-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle, content: editedContent }),
      })
      await fetchTemplates()
    } else {
      await handleUpdateTemplate(selectedTemplateId, editedTitle, editedContent)
    }
    setEditorOpen(false)
  }

  useEffect(() => {
    if (templates.length > 0 && selectedMessageTemplateIdForGuest === null) {
      setSelectedMessageTemplateIdForGuest(
        templates[0].id ? Number(templates[0].id) : null,
      )
    }
  }, [templates, selectedMessageTemplateIdForGuest])

  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([])

  // Tambahkan fungsi bulk delete
  async function handleBulkDelete() {
    for (const id of selectedGuestIds) {
      await handleDeleteGuest(id)
    }
    setSelectedGuestIds([])
    fetchGuests()
  }

  async function handleBulkMarkTerkirim() {
    for (const id of selectedGuestIds) {
      await fetch('/api/guests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, terkirim: true }),
      })
    }
    setSelectedGuestIds([])
    fetchGuests()
  }

  async function handleDeleteGuest(id: string) {
    await fetch('/api/guests', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  async function handleKirimGuest(id: string) {
    // Contoh: update status terkirim, atau lakukan aksi pengiriman lain
    await fetch('/api/guests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, terkirim: true }),
    })
    fetchGuests()
  }

  function getGuestMessageTemplate(guest: Guest) {
    const template =
      templates.find((t) => t.id === guest.message_template_id)?.content || ''
    return template
      .replace(/\[nama\]/gi, guest.name)
      .replace(
        /\[url\]/gi,
        invLink +
          (guest.name
            ? `?to=${encodeNameForUrl(guest.name)}${
                guest.formal ? '&formal=true' : ''
              }`
            : ''),
      )
  }

  function getWhatsappLink(wa: string, message: string) {
    let phone = wa.trim().replace(/^0/, '62').replace(/\D/g, '')
    const encodedMsg = encodeURIComponent(message || '')
    return `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMsg}`
  }

  const [confirmKirim, setConfirmKirim] = useState<{
    id: string
    name: string
    wa: string
  } | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    function handleFocus() {
      if (confirmKirim) {
        setShowConfirmDialog(true)
      }
    }
    if (confirmKirim) {
      window.addEventListener('focus', handleFocus)
    }
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [confirmKirim])

  const [terkirim, setTerkirim] = useState(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      className={`min-h-screen h-screen overflow-y-auto bg-gradient-to-br from-primary/80 to-secondary/80 ${
        isLogin ? '' : 'hidden'
      }`}
    >
      {/* Header Navigasi Modern */}
      <header className="sticky top-0 z-20 w-full bg-white/90 backdrop-blur-md shadow border-b border-primary/20 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-primary">
            Admin Panel
          </span>
          <span className="text-sm text-gray-500 ml-2 hidden sm:inline">
            Undangan Pernikahan
          </span>
        </div>
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="transition-all duration-200 hover:bg-red-600 hover:text-white bg-red-500/90 text-white"
        >
          Logout
        </Button>
      </header>
      {/* Konten Dashboard */}
      <main className="flex flex-col items-center justify-start px-2 sm:px-6 py-8 w-full min-h-[calc(100vh-64px)] overflow-y-auto">
        <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-2xl font-bold text-primary-foreground w-full">
            Daftar Tamu Undangan
          </h2>
          <div className="flex flex-row gap-2 justify-end w-full">
            <Button
              onClick={() => setEditorOpen(true)}
              variant="outline"
              className="transition-all duration-200"
            >
              Editor Pesan
            </Button>
            <Button
              onClick={() => {
                setOpen(true)
                resetForm()
              }}
              className="transition-all duration-200 hover:scale-105 mb-4"
            >
              Tambah Tamu
            </Button>
          </div>
        </div>
        <div className="w-full max-w-4xl">
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v)
              if (!v) resetForm()
            }}
          >
            <DialogTrigger asChild />
            <DialogContent className="bg-white border border-primary/20 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-primary text-2xl font-bold">
                  {editMode ? 'Edit Tamu' : 'Tambah Tamu Undangan'}
                </DialogTitle>
              </DialogHeader>
              {loadingTemplates ? (
                <div className="py-8 text-center">
                  Loading template pesan...
                </div>
              ) : (
                <form onSubmit={handleAddOrEditGuest} className="space-y-4">
                  <div className="flex flex-row gap-4 w-full">
                    <div className="flex flex-col gap-4 w-1/2">
                      <div className="relative">
                        <label className="block font-semibold mb-1 text-gray-800">
                          Nama <span className="text-red-500">*</span>
                        </label>
                        <Input
                          ref={nameInputRef}
                          value={name}
                          onChange={handleNameInput}
                          onBlur={handleNameBlur}
                          onKeyDown={handleNameKeyDown}
                          required
                          className="bg-white border-primary/30 focus:ring-primary/60 text-gray-900 placeholder:text-gray-400"
                          autoComplete="off"
                        />
                        {/* Helper text multi-nama */}
                        <div className="text-xs text-gray-500 mt-1">
                          Untuk menambah banyak tamu sekaligus, pisahkan nama
                          dengan koma. Contoh: Budi, Siti, Andi
                        </div>
                        {showSuggestions && filteredContacts.length > 0 && (
                          <div
                            ref={suggestionBoxRef}
                            onMouseDown={handleSuggestionBoxMouseDown}
                            className="absolute z-50 w-full mt-1 bg-white border border-primary/20 rounded-md shadow-lg max-h-60 overflow-auto"
                          >
                            <Command>
                              <CommandList>
                                {filteredContacts.map((c, idx) => (
                                  <CommandItem
                                    key={c.name + c.wa + c.source}
                                    onSelect={() => handleSelectSuggestion(c)}
                                    className={`cursor-pointer hover:bg-primary/10${
                                      idx === activeSuggestionIdx
                                        ? ' bg-primary/10 font-bold'
                                        : ''
                                    }`}
                                  >
                                    <span className="font-medium text-gray-900">
                                      {c.name}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500">
                                      {c.wa}
                                    </span>
                                    <span className="ml-auto text-xs text-primary font-semibold">
                                      {referenceSourceToCategory[c.source] ||
                                        c.source}
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandList>
                              <CommandEmpty>
                                Tidak ada kontak ditemukan
                              </CommandEmpty>
                            </Command>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-gray-800">
                          Kategori <span className="text-red-500">*</span>
                        </label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="bg-white border-primary/30 text-gray-900">
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-gray-900">
                            {categories.map((opt) => (
                              <SelectItem
                                key={opt}
                                value={opt}
                                className="text-gray-900"
                              >
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-6 mt-2 mb-2">
                        <label className="flex items-center gap-2 text-gray-700 font-medium">
                          <Switch
                            checked={formal}
                            onCheckedChange={setFormal}
                            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200"
                          />
                          Formal
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 font-medium">
                          <Switch
                            checked={physical}
                            onCheckedChange={setPhysical}
                            className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200"
                          />
                          Undangan Fisik
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 font-medium">
                          <Switch
                            checked={digital}
                            onCheckedChange={setDigital}
                            className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200"
                          />
                          Undangan Digital
                        </label>
                      </div>
                    </div>
                    {digital && (
                      <div className="flex flex-col gap-4 w-1/2">
                        <div>
                          <label className="block font-semibold mb-1 text-gray-800">
                            Nomor WA
                          </label>
                          <Input
                            value={wa}
                            onChange={(e) => setWa(e.target.value)}
                            placeholder="08xxxxxxxxxx"
                            className="bg-white border-primary/30 focus:ring-primary/60 text-gray-900 placeholder:text-gray-400"
                          />
                          {/* Helper text multi-nomor WA */}
                          <div className="text-xs text-gray-500 mt-1">
                            Jika menambah banyak tamu sekaligus, pisahkan nomor
                            WA dengan koma sesuai urutan nama. Contoh: 0811...,
                            0822..., 0833...
                          </div>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1 text-gray-800">
                            Template Pesan
                          </label>
                          <select
                            className="w-full border rounded px-2 py-2 text-gray-800 focus:outline-primary"
                            value={selectedMessageTemplateIdForGuest ?? ''}
                            onChange={(e) =>
                              setSelectedMessageTemplateIdForGuest(
                                e.target.value ? Number(e.target.value) : null,
                              )
                            }
                          >
                            {templates.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.title}
                              </option>
                            ))}
                          </select>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2"
                            onClick={() => setPreviewOpen(true)}
                          >
                            Preview
                          </Button>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1 text-gray-800">
                            Link Undangan
                          </label>
                          <div className="flex gap-2 items-center">
                            <Input
                              value={
                                invLink +
                                (name.trim()
                                  ? `?to=${encodeNameForUrl(name)}${
                                      formal ? '&formal=true' : ''
                                    }`
                                  : formal
                                  ? '?formal=true'
                                  : '')
                              }
                              disabled
                              className="bg-gray-100 border-primary/30 text-gray-700"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="px-3 py-2"
                              onClick={() => {
                                const link =
                                  invLink +
                                  (name.trim()
                                    ? `?to=${encodeNameForUrl(name)}${
                                        formal ? '&formal=true' : ''
                                      }`
                                    : formal
                                    ? '?formal=true'
                                    : '')
                                navigator.clipboard.writeText(link)
                                setCopySuccess('Link berhasil disalin!')
                                setTimeout(() => setCopySuccess(''), 2000)
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                          {copySuccess && (
                            <div className="text-green-600 text-xs mt-1">
                              {copySuccess}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-full flex flex-row gap-4 justify-end">
                    {editMode && (
                      <div>
                        <label className="flex items-center gap-2 text-gray-700 font-medium mt-2">
                          <Switch
                            checked={terkirim}
                            onCheckedChange={setTerkirim}
                            className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200"
                          />
                          {terkirim ? 'Sudah terkirim' : 'Belum terkirim'}
                        </label>
                      </div>
                    )}
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="transition-all duration-200 bg-primary text-white hover:bg-primary/90"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4 mr-1 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                              ></path>
                            </svg>
                            Menyimpan...
                          </span>
                        ) : editMode ? (
                          'Update'
                        ) : (
                          'Simpan'
                        )}
                      </Button>
                    </DialogFooter>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
          <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
            <DialogContent className="bg-white border border-primary/20 shadow-xl max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-primary text-2xl font-bold">
                  Editor Pesan Broadcast
                </DialogTitle>
              </DialogHeader>
              <div className="flex gap-4">
                {/* List template */}
                <div className="w-1/3 min-w-[180px] border-r pr-2 flex flex-col gap-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-700">
                      Daftar Template
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddTemplate}
                    >
                      Tambah
                    </Button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {templates.map((t) => (
                      <div
                        key={t.id}
                        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                          selectedTemplateId === t.id
                            ? 'bg-primary/10'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleSelectTemplate(t.id)}
                      >
                        <span className="flex-1 truncate font-medium text-gray-800">
                          {t.title}
                        </span>
                        {templates.length > 1 && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="border-none text-red-500 hover:bg-red-100 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTemplate(t.id)
                            }}
                          >
                            <span className="text-xs">🗑️</span>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Editor template */}
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    className="border rounded px-2 py-1 font-semibold text-lg text-gray-800 mb-2 focus:outline-primary"
                    value={editedTitle}
                    onChange={handleTemplateTitleChange}
                  />
                  <div data-color-mode="light">
                    <MDEditor
                      value={editedContent}
                      onChange={handleTemplateChange}
                      height={300}
                      preview="edit"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSaveTemplate}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  Simpan & Tutup
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="w-full max-w-4xl">
          <Card className="shadow-lg bg-white/95 border border-primary/10">
            <CardHeader className="pb-2 mb-4 w-full border-b border-primary/10 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-xl sticky top-0 z-10 flex flex-row gap-16 justify-end">
              {/* Bulk actions, hanya muncul jika ada yang terseleksi */}
              {selectedGuestIds.length > 0 && (
                <div className="flex gap-2 items-center">
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={handleBulkMarkTerkirim}
                    className="flex items-center gap-1"
                  >
                    Tandai Terkirim
                  </Button>
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={handleBulkDelete}
                    className="flex items-center gap-1"
                  >
                    Hapus Terpilih
                  </Button>
                  <span className="text-sm text-gray-600 ml-2 text-nowrap">
                    {selectedGuestIds.length} terpilih
                  </span>
                </div>
              )}
              <div className="flex flex-row gap-2 items-center">
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={filterTerkirim === 'true'}
                    onChange={() =>
                      setFilterTerkirim(
                        filterTerkirim === 'true' ? 'all' : 'true',
                      )
                    }
                    className="accent-primary"
                  />{' '}
                  Terkirim
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={filterDigital === 'true'}
                    onChange={() =>
                      setFilterDigital(
                        filterDigital === 'true' ? 'all' : 'true',
                      )
                    }
                    className="accent-primary"
                  />{' '}
                  Digital
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={filterFormal === 'true'}
                    onChange={() =>
                      setFilterFormal(filterFormal === 'true' ? 'all' : 'true')
                    }
                    className="accent-primary"
                  />{' '}
                  Formal
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={filterPhysical === 'true'}
                    onChange={() =>
                      setFilterPhysical(
                        filterPhysical === 'true' ? 'all' : 'true',
                      )
                    }
                    className="accent-primary"
                  />{' '}
                  Fisik
                </label>
                <select
                  value={filterKategori}
                  onChange={(e) => setFilterKategori(e.target.value)}
                  className="border border-primary/30 rounded-lg px-2 py-1 text-xs text-primary focus:outline-primary"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setPage(1)
                    setSearchQuery(e.target.value)
                  }}
                  placeholder="Cari nama..."
                  className="w-full max-w-[200px] text-primary border border-primary/30 rounded-lg px-2 py-1 text-xs placeholder:text-primary focus:outline-primarytransition-all"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto scrollbar-hide rounded-lg border bg-white/80 shadow-md">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-primary/10 text-primary sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold align-middle">
                          <input
                            type="checkbox"
                            checked={
                              guests.length > 0 &&
                              selectedGuestIds.length === guests.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedGuestIds(
                                  guests.map((g) => String(g.id)),
                                )
                              } else {
                                setSelectedGuestIds([])
                              }
                            }}
                            className="accent-primary w-4 h-4 rounded border-gray-300"
                          />
                        </th>
                        <th className="px-3 py-2 text-left font-semibold align-middle">
                          Nama
                        </th>
                        <th className="px-3 py-2 text-left font-semibold align-middle">
                          Kategori
                        </th>
                        <th className="px-3 py-2 text-center font-semibold align-middle">
                          Formal
                        </th>
                        <th className="px-3 py-2 text-center font-semibold align-middle">
                          Fisik
                        </th>
                        <th className="px-3 py-2 text-center font-semibold align-middle">
                          Digital
                        </th>
                        <th className="px-3 py-2 text-left font-semibold align-middle">
                          WA
                        </th>
                        <th className="px-3 py-2 text-center font-semibold align-middle">
                          Terkirim
                        </th>
                        <th className="px-3 py-2 text-center font-semibold align-middle">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {guests.map((guest, idx) => (
                        <tr
                          key={guest.id}
                          className={`transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-primary/5'
                          } hover:bg-primary/20`}
                        >
                          <td className="px-3 py-2 align-middle">
                            <input
                              type="checkbox"
                              checked={selectedGuestIds.includes(
                                String(guest.id),
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGuestIds((prev) => [
                                    ...prev,
                                    String(guest.id),
                                  ])
                                } else {
                                  setSelectedGuestIds((prev) =>
                                    prev.filter(
                                      (id) => id !== String(guest.id),
                                    ),
                                  )
                                }
                              }}
                              className="accent-primary w-4 h-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="px-3 py-2 text-gray-800 font-medium align-middle">
                            {guest.name}
                          </td>
                          <td className="px-3 py-2 text-gray-700 font-medium align-middle">
                            {guest.category}
                          </td>
                          <td className="px-3 py-2 text-center align-middle">
                            {guest.formal ? (
                              <span className="text-green-600 font-semibold">
                                Ya
                              </span>
                            ) : (
                              <span className="text-gray-400">Tidak</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center align-middle">
                            {guest.physical ? (
                              <span className="text-blue-600 font-semibold">
                                Ya
                              </span>
                            ) : (
                              <span className="text-gray-400">Tidak</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center align-middle">
                            {guest.digital ? (
                              <span className="text-emerald-600 font-semibold">
                                Ya
                              </span>
                            ) : (
                              <span className="text-gray-400">Tidak</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-800 font-medium align-middle">
                            {guest.digital ? (
                              <span className="text-green-700">{guest.wa}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center align-middle">
                            {guest.terkirim ? (
                              <span className="text-green-600 font-semibold">
                                Ya
                              </span>
                            ) : (
                              <span className="text-gray-400">Tidak</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center align-middle">
                            {!guest.terkirim && guest.wa && (
                              <Button
                                size="xs"
                                variant="default"
                                className="mr-2 bg-primary text-white hover:bg-primary/90"
                                onClick={() => {
                                  setConfirmKirim({
                                    id: String(guest.id),
                                    name: guest.name,
                                    wa: guest.wa!,
                                  })
                                  window.open(
                                    getWhatsappLink(
                                      guest.wa!,
                                      getGuestMessageTemplate(guest),
                                    ),
                                    '_blank',
                                  )
                                }}
                              >
                                Kirim
                              </Button>
                            )}
                            <Button
                              size="xs"
                              onClick={() => handleEdit(guest)}
                              className="mr-2 bg-primary/90 text-white hover:bg-primary"
                            >
                              Edit
                            </Button>
                            <Button
                              size="xs"
                              variant="destructive"
                              onClick={() => handleDeleteConfirm(guest.id)}
                              className="bg-red-500/90 text-white hover:bg-red-600"
                            >
                              Hapus
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2 px-8">
              <div className="text-sm text-gray-700">
                Menampilkan {guests.length > 0 ? (page - 1) * pageSize + 1 : 0}-
                {(page - 1) * pageSize + guests.length} dari {total} tamu
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={page === 1 ? 'outline' : 'default'}
                  size="xs"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`border border-primary rounded-lg transition-colors duration-150 ${
                    page === 1
                      ? 'bg-white text-gray-300 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-sm font-semibold text-primary mx-2">
                  Halaman {page}{' '}
                  <span className="font-normal text-gray-400">/</span>{' '}
                  {Math.ceil(total / pageSize) || 1}
                </span>
                <Button
                  variant={
                    page >= Math.ceil(total / pageSize) ? 'outline' : 'default'
                  }
                  size="xs"
                  onClick={() =>
                    setPage((p) =>
                      p < Math.ceil(total / pageSize) ? p + 1 : p,
                    )
                  }
                  disabled={page >= Math.ceil(total / pageSize)}
                  className={`border border-primary rounded-lg transition-colors duration-150 ${
                    page >= Math.ceil(total / pageSize)
                      ? 'bg-white text-gray-300 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                <select
                  className="ml-2 border border-primary rounded-lg px-2 py-1 text-sm text-primary font-semibold focus:outline-primary hover:bg-primary/5 transition-colors duration-150"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setPage(1)
                  }}
                >
                  {[5, 10, 20, 50, 100].map((size) => (
                    <option key={size} value={size} className="text-primary">
                      {size} per halaman
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>
      </main>
      {/* Dialog konfirmasi hapus */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menghapus tamu ini?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Hapus
            </Button>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Preview Pesan Undangan</DialogTitle>
          </DialogHeader>
          <div className="mb-2">
            <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
              <MarkdownPreview
                source={(
                  templates.find(
                    (t) => Number(t.id) === selectedMessageTemplateIdForGuest,
                  )?.content || ''
                )
                  .replace(/\[nama\]/gi, name || '[nama]')
                  .replace(
                    /\[url\]/gi,
                    invLink +
                      (name.trim()
                        ? `?to=${encodeNameForUrl(name)}${
                            formal ? '&formal=true' : ''
                          }`
                        : formal
                        ? '?formal=true'
                        : ''),
                  )}
                className="bg-white p-2 rounded border"
              />
            </div>
          </div>
          <DialogFooter>
            {copyPreviewSuccess && (
              <span className="text-green-600 text-xs ml-2">
                Pesan berhasil disalin!
              </span>
            )}
            <Button
              variant="outline"
              onClick={() => {
                const text = (
                  templates.find(
                    (t) => Number(t.id) === selectedMessageTemplateIdForGuest,
                  )?.content || ''
                )
                  .replace(/\[nama\]/gi, name || '[nama]')
                  .replace(
                    /\[url\]/gi,
                    invLink +
                      (name.trim()
                        ? `?to=${encodeNameForUrl(name)}${
                            formal ? '&formal=true' : ''
                          }`
                        : formal
                        ? '?formal=true'
                        : ''),
                  )
                navigator.clipboard.writeText(text)
                setCopyPreviewSuccess(true)
                setTimeout(() => setCopyPreviewSuccess(false), 2000)
              }}
            >
              Copy
            </Button>
            <Button onClick={() => setPreviewOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pengiriman</DialogTitle>
          </DialogHeader>
          <div>
            Apakah pesan sudah terkirim ke <b>{confirmKirim?.name}</b> (
            {confirmKirim?.wa})?
          </div>
          <DialogFooter>
            <Button
              onClick={async () => {
                await fetch('/api/guests', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: confirmKirim?.id,
                    terkirim: true,
                  }),
                })
                setShowConfirmDialog(false)
                setConfirmKirim(null)
                fetchGuests()
              }}
              className="bg-primary text-white"
            >
              Sudah
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false)
                setConfirmKirim(null)
              }}
            >
              Belum
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
