import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/check-claimed?seed=123456 - Check if a specific artwork is claimed
export async function GET(request: NextRequest) {
  try {
    const seed = request.nextUrl.searchParams.get('seed')
    
    if (!seed) {
      return NextResponse.json(
        { error: 'Seed is required' },
        { status: 400 }
      )
    }

    const artwork = await db.claimedArtwork.findUnique({
      where: { seed: BigInt(seed) },
      select: {
        id: true,
        seed: true,
        ownerName: true,
        ownerNote: true,
        title: true,
        artStyle: true,
        claimedAt: true,
      },
    })

    if (!artwork) {
      return NextResponse.json({ claimed: false })
    }

    return NextResponse.json({
      claimed: true,
      owner: {
        name: artwork.ownerName,
        note: artwork.ownerNote,
      },
      title: artwork.title,
      artStyle: artwork.artStyle,
      claimedAt: artwork.claimedAt.toISOString(),
    })
  } catch (error) {
    console.error('Failed to check claimed status:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
