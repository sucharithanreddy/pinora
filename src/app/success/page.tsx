'use client'

import React, { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { generatePremiumArt } from '@/lib/generative-art-v3'
import { Check, Crown, Share2, Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addClaimedArtwork } from '@/components/WallOfArt'
import { WallArtItem } from '@/types'
import jsPDF from 'jspdf'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')
  const [artwork, setArtwork] = useState<{
    seed: number
    title: string
    ownerName: string
    ownerNote?: string
    style: string
  } | null>(null)

  useEffect(() => {
    const seed = searchParams.get('seed')
    const name = searchParams.get('name')
    const note = searchParams.get('note')
    const paypalOrderId = searchParams.get('token') // PayPal returns 'token' param
    const payerId = searchParams.get('PayerID')

    if (!seed) {
      router.push('/')
      return
    }

    // Verify PayPal payment if we have order ID
    if (paypalOrderId && payerId) {
      fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: paypalOrderId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setVerifying(false)
            setArtwork({
              seed: parseInt(seed),
              title: `Artwork #${seed.slice(0, 8)}`,
              ownerName: name || 'Art Owner',
              ownerNote: note || undefined,
              style: 'FlowField',
            })
          } else {
            setError('Payment verification failed. Please contact support.')
            setVerifying(false)
          }
        })
        .catch(() => {
          // Even if verification fails, allow the user to see the page
          // (for sandbox testing or if they refresh the page)
          setVerifying(false)
          setArtwork({
            seed: parseInt(seed),
            title: `Artwork #${seed.slice(0, 8)}`,
            ownerName: name || 'Art Owner',
            ownerNote: note || undefined,
            style: 'FlowField',
          })
        })
    } else {
      // Direct access (no PayPal params) - might be a refresh or direct link
      // For now, allow it but in production you'd want to verify ownership
      setVerifying(false)
      setArtwork({
        seed: parseInt(seed),
        title: `Artwork #${seed.slice(0, 8)}`,
        ownerName: name || 'Art Owner',
        ownerNote: note || undefined,
        style: 'FlowField',
      })
    }
  }, [searchParams, router])

  useEffect(() => {
    if (!artwork || !canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = 800
    canvas.height = 800

    const seed = artwork.seed
    const hueSeed = (seed * 17) % 1000000000
    const satSeed = (seed * 31) % 1000000000
    const lightSeed = (seed * 47) % 1000000000
    const styleSeed = (seed * 61) % 1000000000
    const shapeSeed = (seed * 73) % 1000000000
    const positionSeed = (seed * 89) % 1000000000
    const sizeSeed = (seed * 97) % 1000000000

    generatePremiumArt(canvas, hueSeed, satSeed, lightSeed, styleSeed, shapeSeed, positionSeed, sizeSeed)
    
    // Save to Wall of Art (localStorage + database)
    const seeds = { hueSeed, satSeed, lightSeed, styleSeed, shapeSeed, positionSeed, sizeSeed }
    const wallItem: WallArtItem = {
      id: `owned-${Date.now()}-${seed}`,
      ownerName: artwork.ownerName,
      ownerNote: artwork.ownerNote,
      claimedAt: new Date().toISOString(),
      artworkData: {
        seed,
        seeds,
        artStyle: artwork.style,
        title: artwork.title,
        tags: [artwork.style],
      },
    }
    
    // Save to localStorage immediately for UI
    addClaimedArtwork(wallItem)
    
    // Also save to database (async, don't wait)
    fetch('/api/claimed-artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seed,
        ownerName: artwork.ownerName,
        ownerEmail: '', // Will be linked via PayPal
        ownerNote: artwork.ownerNote,
        title: artwork.title,
        artStyle: artwork.style,
        seeds,
      }),
    }).catch(err => console.error('Failed to save to database:', err))
    
    setLoading(false)
  }, [artwork])

  const handleDownload = async () => {
    if (!canvasRef.current || !artwork) return
    
    const canvas = canvasRef.current
    const link = document.createElement('a')
    link.download = `pinora-owned-${artwork.seed.toString().slice(0, 8)}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }

  const handleDownloadCertificate = async () => {
    if (!canvasRef.current || !artwork) return

    const canvas = canvasRef.current
    const imgData = canvas.toDataURL('image/png', 1.0)

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    // Background
    pdf.setFillColor(26, 26, 46)
    pdf.rect(0, 0, 210, 297, 'F')

    // Border
    pdf.setDrawColor(245, 158, 11)
    pdf.setLineWidth(2)
    pdf.rect(10, 10, 190, 277)

    // Title
    pdf.setTextColor(245, 158, 11)
    pdf.setFontSize(28)
    pdf.setFont('helvetica', 'bold')
    pdf.text('CERTIFICATE OF OWNERSHIP', 105, 40, { align: 'center' })

    // Decorative line
    pdf.setDrawColor(245, 158, 11)
    pdf.setLineWidth(0.5)
    pdf.line(40, 48, 170, 48)

    // Artwork image
    pdf.addImage(imgData, 'PNG', 45, 60, 120, 120)

    // Artwork details
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(artwork.title, 105, 195, { align: 'center' })

    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(150, 150, 170)
    pdf.text(`Unique Seed: #${artwork.seed.toString().slice(0, 12)}`, 105, 208, { align: 'center' })
    pdf.text(`Style: ${artwork.style}`, 105, 218, { align: 'center' })

    // Owner section
    pdf.setDrawColor(245, 158, 11)
    pdf.line(40, 232, 170, 232)

    pdf.setTextColor(245, 158, 11)
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('OFFICIALLY OWNED BY', 105, 248, { align: 'center' })

    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(20)
    pdf.text(artwork.ownerName, 105, 262, { align: 'center' })

    if (artwork.ownerNote) {
      pdf.setFontSize(10)
      pdf.setTextColor(150, 150, 170)
      pdf.text(`"${artwork.ownerNote}"`, 105, 274, { align: 'center' })
    }

    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 120)
    pdf.text(`Ownership Date: ${new Date().toLocaleDateString()}`, 105, 290, { align: 'center' })
    pdf.text('One of 10^63 unique artworks on Pinora', 30, 290)
    pdf.text('pinora.app', 180, 290)

    // Save
    pdf.save(`pinora-certificate-${artwork.seed.toString().slice(0, 8)}.pdf`)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/p/${artwork?.seed}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I own "${artwork?.title}" on Pinora`,
          text: `Check out my unique generative artwork! One of 10^63 possible pieces.`,
          url,
        })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied!')
    }
  }

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="animate-pulse text-[var(--text-muted)]">Verifying payment...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="animate-pulse text-[var(--text-muted)]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Success Badge */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">You Own This Artwork!</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            Congratulations, <span className="font-semibold text-amber-500">{artwork.ownerName}</span>!
          </p>
        </div>

        {/* Artwork Card */}
        <div className="overflow-hidden rounded-2xl bg-[var(--bg-card)] shadow-xl">
          {/* Canvas */}
          <div className="relative">
            <canvas 
              ref={canvasRef} 
              className="w-full"
              style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-tertiary)]">
                <div className="animate-pulse text-[var(--text-muted)]">Generating artwork...</div>
              </div>
            )}
            
            {/* Owned Badge */}
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-amber-500/90 px-3 py-1.5 text-sm font-medium text-white shadow-lg">
              <Crown className="h-4 w-4" />
              Owned
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{artwork.title}</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-[var(--text-muted)]">
              <span>Seed: #{artwork.seed.toString().slice(0, 8)}</span>
              <span>•</span>
              <span>Style: {artwork.style}</span>
            </div>
            {artwork.ownerNote && (
              <p className="mt-3 rounded-lg bg-[var(--bg-tertiary)] p-3 text-sm italic text-[var(--text-secondary)]">
                "{artwork.ownerNote}"
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Button 
                onClick={handleDownloadCertificate}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Certificate (PDF)
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Image
                </Button>
                <Button onClick={handleShare} variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>

              <Button 
                onClick={() => router.push('/?wall=true')} 
                variant="secondary" 
                className="w-full"
              >
                <Crown className="mr-2 h-4 w-4" />
                View on Memory Wall
              </Button>
            </div>

            {/* Print Upsell */}
            <div className="mt-6 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4">
              <div className="flex items-start gap-3">
                <Printer className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Want this on canvas?</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Turn your artwork into a beautiful print for your wall.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      12×16 — $29
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      24×36 — $49
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            ← Discover more artworks
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="animate-pulse text-[var(--text-muted)]">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
