'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonPinProps {
  height?: number
}

export function SkeletonPin({ height = 250 }: SkeletonPinProps) {
  return (
    <div className="pin-card rounded-[var(--radius-md)] bg-[var(--bg-card)]">
      <div
        className="skeleton-shimmer h-[250px] w-full rounded-t-[var(--radius-md)]"
        style={{ height: `${height}px` }}
      />
      <div className="p-3.5">
        <div className="skeleton-shimmer h-3.5 w-full rounded" />
        <div className="skeleton-shimmer mt-2 h-3.5 w-3/5 rounded" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="masonry-grid max-w-[1600px] mx-auto px-4 pb-20">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPin key={i} height={180 + Math.random() * 170} />
      ))}
    </div>
  )
}
