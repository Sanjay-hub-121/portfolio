'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ backgroundColor: '#1A1A2E', border: '1px solid #252540' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: '#f87171' }} />
            </div>
            <h3 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#5E5E7A' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm mb-6 leading-relaxed" style={{ color: '#9898B0' }}>
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-outline flex-1 justify-center text-sm py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
            style={{ backgroundColor: '#ef4444', opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
