'use client'

import React from 'react'
import { Pin } from '@/types'
import { PinCard } from './PinCard'

interface MasonryGridProps {
  pins: Pin[]
  onLike: (id: string) => void
  onSave: (id: string) => void
  onPinClick: (pin: Pin) => void
}

export function MasonryGrid({ pins, onLike, onSave, onPinClick }: MasonryGridProps) {
  return (
    <div className="masonry-grid mx-auto max-w-[1600px] px-4 pb-20">
      {pins.map((pin, index) => (
        <PinCard
          key={pin.id}
          pin={pin}
          index={index}
          onLike={onLike}
          onSave={onSave}
          onClick={() => onPinClick(pin)}
        />
      ))}
    </div>
  )
}
