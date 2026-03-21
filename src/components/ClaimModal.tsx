'use client'

import React, { useState } from 'react'
import { Pin } from '@/types'
import { X, Crown, Loader2, Mail, Sparkles } from 'lucide-react'
import { Button } from './ui/button'

import { isArtworkClaimed } from './WallOfArt'

interface ClaimModalProps {
  pin: Pin
  open: boolean
  onOpenChange: (open: boolean) => void
  onClaim: (pinId: string, ownerName: string, ownerNote: string, ownerEmail: string) => void
}

export function ClaimModal({ pin, open, onOpenChange, onClaim }: ClaimModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if already claimed
  const existingOwner = isArtworkClaimed(pin.seed)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (existingOwner) {
      setError('This artwork is already owned')
      return
    }
    
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    
    if (name.trim().length > 30) {
      setError('Name must be 30 characters or less')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address')
      return
    }
    
    if (note.length > 100) {
      setError('Note must be 100 characters or less')
      return
    }
    
    setError('')
    setLoading(true)

    try {
      // Create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seed: pin.seed,
          title: pin.title,
          style: pin.tags?.[0] || 'FlowField',
          ownerName: name.trim(),
          ownerNote: note.trim() || undefined,
          ownerEmail: email.trim(),
        }),
      })

      const data = await response.json()

      if (data.approveUrl) {
        // Redirect to PayPal for approval
        window.location.href = data.approveUrl
      } else {
        setError(data.error || 'Failed to create PayPal order. Please try again.')
        setLoading(false)
      }
    } catch (err) {
      console.error('PayPal error:', err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false)
    }
  }

  if (!open) return null

  // If already claimed, show owned state
  if (existingOwner) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div 
          className="relative z-10 w-full max-w-md rounded-2xl bg-[var(--bg-card)] p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
              <Crown className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">This Artwork is Owned</h3>
            <p className="mt-2 text-[var(--text-secondary)]">
              Owned by <span className="font-semibold text-amber-500">{existingOwner.ownerName}</span>
            </p>
            {existingOwner.ownerNote && (
              <p className="mt-3 rounded-lg bg-[var(--bg-tertiary)] p-3 text-sm italic text-[var(--text-secondary)]">
                "{existingOwner.ownerNote}"
              </p>
            )}
            <Button
              onClick={handleClose}
              className="mt-6 w-full"
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative z-10 w-full max-w-md rounded-2xl bg-[var(--bg-card)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-full p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
            <Crown className="h-7 w-7 text-white" />
          </div>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
            Own This Artwork Forever
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Your name on the Memory Wall — permanently
          </p>
        </div>

        {/* Artwork Preview */}
        <div className="mb-6 overflow-hidden rounded-xl bg-[var(--bg-tertiary)] p-3">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--bg-secondary)]">
              <div className="h-full w-full bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
            </div>
            <div>
              <p className="font-medium text-[var(--text-primary)]">{pin.title}</p>
              <p className="text-xs text-[var(--text-muted)]">Style: {pin.tags?.[0] || 'Generative'}</p>
              <p className="text-xs text-[var(--text-muted)]">ID: #{pin.seed.toString().slice(0, 8)}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
              Your Name (as it will appear forever)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Chen"
              maxLength={30}
              disabled={loading}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">{name.length}/30 characters</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
              Your Email <span className="text-[var(--text-muted)]">(certificate & artwork sent here)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., alex@example.com"
                disabled={loading}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] py-2.5 pl-10 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
              Optional Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., In loving memory of... or I was here!"
              maxLength={100}
              rows={2}
              disabled={loading}
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">{note.length}/100 characters</p>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Pricing */}
          <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">One-time payment</span>
              <span className="text-2xl font-bold text-[var(--text-primary)]">$5</span>
            </div>
            <div className="mt-2 space-y-1">
              <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Ownership certificate (PDF)
              </p>
              <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Permanent spot on Memory Wall
              </p>
              <p className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <Sparkles className="h-3 w-3 text-amber-500" />
                High-res artwork download
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="mr-2 h-4 w-4" />
                Own Forever — $5
              </>
            )}
          </Button>

          <p className="text-center text-xs text-[var(--text-muted)]">
            Secure payment via PayPal
          </p>
        </form>
      </div>
    </div>
  )
}
