'use client'

import { useState } from 'react'
import { Mail, MailOpen, Trash2, Clock, RefreshCw } from 'lucide-react'

type Message = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}

const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Ravi Kumar',
    email: 'ravi@business.com',
    subject: 'Website redesign project',
    message: 'Hi Sanjay, we are looking for a developer to redesign our company website. Please let us know your availability and pricing for a full redesign with admin panel.',
    read: false,
    createdAt: new Date('2024-01-15T10:30:00').toISOString(),
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@startup.io',
    subject: 'Mobile app UI design',
    message: 'We need UI/UX design for our new fintech mobile app. Could you share your portfolio and rates? We have a budget of ₹45,000.',
    read: true,
    createdAt: new Date('2024-01-12T14:00:00').toISOString(),
  },
]

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selected, setSelected] = useState<Message | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const unread = messages.filter((m) => !m.read).length

  const handleSelect = async (msg: Message) => {
    setSelected(msg)
    if (!msg.read) {
      // Optimistic update
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m))
      // API call
      await fetch(`/api/contact/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' })
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch {
      // handle error
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: '#F1F1F5' }}>Messages</h1>
          <p className="text-sm mt-1" style={{ color: '#5E5E7A' }}>
            {unread > 0 ? <span style={{ color: '#6366F1' }}>{unread} unread</span> : 'All read'} · {messages.length} total
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors"
          style={{ color: '#9898B0', border: '1px solid #252540', background: 'transparent' }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: '#5E5E7A' }} />
          <p className="text-sm" style={{ color: '#5E5E7A' }}>No messages yet</p>
          <p className="text-xs mt-1" style={{ color: '#5E5E7A' }}>Messages from your contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Message list */}
          <div className="lg:col-span-2 space-y-2">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className="w-full text-left p-4 rounded-xl border transition-all"
                style={{
                  backgroundColor: selected?.id === msg.id ? 'rgba(99,102,241,0.08)' : '#1A1A2E',
                  borderColor: selected?.id === msg.id ? 'rgba(99,102,241,0.4)' : '#252540',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {msg.read
                      ? <MailOpen className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#5E5E7A' }} />
                      : <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6366F1' }} />
                    }
                    <span className="text-sm font-medium truncate" style={{ color: msg.read ? '#9898B0' : '#F1F1F5' }}>
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: '#5E5E7A' }}>
                    {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div className="text-xs mb-0.5 truncate" style={{ color: msg.read ? '#5E5E7A' : '#9898B0', fontWeight: msg.read ? 400 : 500 }}>
                  {msg.subject}
                </div>
                <div className="text-xs truncate" style={{ color: '#5E5E7A' }}>{msg.message}</div>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className="lg:col-span-3 card-glass p-6 min-h-72">
            {selected ? (
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-display font-semibold" style={{ color: '#F1F1F5' }}>{selected.subject}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm" style={{ color: '#5E5E7A' }}>
                      <span style={{ color: '#9898B0' }}>{selected.name}</span>
                      <span>·</span>
                      <a href={`mailto:${selected.email}`} style={{ color: '#6366F1' }} className="hover:underline">
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    disabled={isDeleting === selected.id}
                    className="p-2 rounded-lg transition-all flex-shrink-0"
                    style={{ color: '#5E5E7A' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#5E5E7A'; e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    {isDeleting === selected.id
                      ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs mb-5" style={{ color: '#5E5E7A' }}>
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(selected.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium', timeStyle: 'short'
                  })}
                </div>

                <div className="p-4 rounded-xl mb-6 text-sm leading-relaxed" style={{ backgroundColor: '#141420', border: '1px solid #252540', color: '#9898B0' }}>
                  {selected.message}
                </div>

                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="btn-primary text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Reply to {selected.name}
                </a>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                <Mail className="w-10 h-10 mb-3 opacity-20" style={{ color: '#5E5E7A' }} />
                <p className="text-sm" style={{ color: '#5E5E7A' }}>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
