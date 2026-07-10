'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  aspectRatio?: '16/9' | '1/1' | '4/3'
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'portfolio',
  label = 'Upload Image',
  aspectRatio = '16/9',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const aspectClasses = {
    '16/9': 'aspect-video',
    '1/1': 'aspect-square',
    '4/3': 'aspect-[4/3]',
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB.')
      return
    }

    setError('')
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm" style={{ color: '#9898B0' }}>{label}</label>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden" style={{ border: '1px solid #252540' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded"
            className={`w-full ${aspectClasses[aspectRatio]} object-cover`}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: '#6366F1' }}
            >
              <Upload className="w-4 h-4" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: 'rgba(239,68,68,0.8)' }}
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl cursor-pointer transition-all ${aspectClasses[aspectRatio]}`}
          style={{
            border: `2px dashed ${dragOver ? '#6366F1' : '#252540'}`,
            backgroundColor: dragOver ? 'rgba(99,102,241,0.05)' : '#141420',
          }}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#6366F1' }} />
              <p className="text-sm" style={{ color: '#9898B0' }}>Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(99,102,241,0.1)' }}>
                <ImageIcon className="w-6 h-6" style={{ color: '#6366F1' }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: '#F1F1F5' }}>
                  Drop image here or click to upload
                </p>
                <p className="text-xs mt-1" style={{ color: '#5E5E7A' }}>
                  PNG, JPG, WebP · Max 5MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
