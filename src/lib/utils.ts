import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLikes(n: number): string {
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'k'
  }
  return n.toString()
}

export function formatNumber(n: number): string {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T'
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toString()
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
