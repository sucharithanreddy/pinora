'use client'

import React, { useState } from 'react'
import { Pin } from '@/types'
import { X, Crown, Sparkles, Check, Loader2, Mail } from 'lucide-react'
import { Button } from './ui/button'

interface ClaimModalProps {
  pin: Pin
  open: boolean
  onOpenChange: (open: boolean) => void
  onClaim: (pinId: string, ownerName: string, ownerMessage: string, ownerEmail: string) => void
}

export function ClaimModal({ pin, open, onOpenChange, onClaim }: ClaimModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
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
    setStep('processing')
    
    // Simulate payment processing
    setTimeout(() => {
      onClaim(pin.id, name.trim(), note.trim(), email.trim())
      setStep('success')
    }, 1500)
  }

  const handleClose = () => {
    if (step === 'success') {
      onOpenChange(false)
      // Reset after close animation
      setTimeout(() => {
        setStep('form')
        setName('')
        setEmail('')
        setNote('')
        setError('')
      }, 300)
    } else {
      onOpenChange(false)
    }
  }

  if (!open) return null

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
          className="absolute right-4 top-4 rounded-full p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 'form' && (
          <>
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
                Own This Artwork
              </h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Be remembered forever for $1
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
                  <p className="text-xs text-[var(--text-muted)]">ID: {pin.seed}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                  Your Name (as it will appear)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Alex Chen"
                  maxLength={30}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <p className="mt-1 text-xs text-[var(--text-muted)]">{name.length}/30 characters</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                  Your Email <span className="text-[var(--text-muted)]">(we'll send you the artwork)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., alex@example.com"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] py-2.5 pl-10 pr-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
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
                  placeholder="e.g., In loving memory of..."
                  maxLength={100}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
                <p className="mt-1 text-xs text-[var(--text-muted)]">{note.length}/100 characters</p>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Pricing */}
              <div className="rounded-lg bg-[var(--bg-tertiary)] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">One-time ownership fee</span>
                  <span className="text-lg font-bold text-[var(--text-primary)]">$1.00</span>
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  You'll receive the artwork image in your email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Crown className="mr-2 h-4 w-4" />
                Own for $1
              </Button>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[var(--accent)]" />
            <p className="mt-4 text-[var(--text-secondary)]">Making it yours...</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Sending your artwork to {email}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">You Own This Artwork!</h3>
            <p className="mt-2 text-[var(--text-secondary)]">
              This unique artwork now belongs to <span className="font-semibold text-amber-600">{name}</span>
            </p>
            <div className="mt-4 rounded-lg bg-green-500/10 p-3">
              <p className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                <Mail className="h-4 w-4" />
                Check your email for the artwork!
              </p>
            </div>
            <div className="mt-4 rounded-lg bg-[var(--bg-tertiary)] p-4">
              <p className="text-sm text-[var(--text-muted)]">
                <Sparkles className="mr-1 inline h-4 w-4" />
                View it on the Memory Wall
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="mt-6 w-full"
              variant="outline"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
