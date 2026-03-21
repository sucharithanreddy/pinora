'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  visible: boolean
}

export function Toast({ message, visible }: ToastProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [visible])

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 z-[300] -translate-x-1/2 rounded-full bg-[var(--toast-bg)] px-6 py-3 text-sm font-medium text-[var(--toast-text)] shadow-[var(--shadow-lg)] transition-all duration-300',
        show ? 'translate-y-0' : 'translate-y-20'
      )}
    >
      {message}
    </div>
  )
}
