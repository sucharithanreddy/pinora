import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/claimed-artworks - Fetch all claimed artworks for Memory Wall
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    let where = {}
    
    if (search) {
      where = {
        OR: [
          { ownerName: { contains: search, mode: 'insensitive' } },
          { ownerNote: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { artStyle: { contains: search, mode: 'insensitive' } },
        ]
      }
    }

    const [artworks, total] = await Promise.all([
      db.claimedArtwork.findMany({
        where,
        orderBy: { claimedAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          seed: true,
          ownerName: true,
          ownerNote: true,
          title: true,
          artStyle: true,
          claimedAt: true,
          hueSeed: true,
          satSeed: true,
          lightSeed: true,
          styleSeed: true,
          shapeSeed: true,
          positionSeed: true,
          sizeSeed: true,
        },
      }),
      db.claimedArtwork.count({ where }),
    ])

    // Transform for client (convert BigInt to string)
    const transformedArtworks = artworks.map(artwork => ({
      id: artwork.id,
      seed: artwork.seed.toString(),
      ownerName: artwork.ownerName,
      ownerNote: artwork.ownerNote,
      title: artwork.title,
      artStyle: artwork.artStyle,
      claimedAt: artwork.claimedAt.toISOString(),
      seeds: {
        hueSeed: artwork.hueSeed,
        satSeed: artwork.satSeed,
        lightSeed: artwork.lightSeed,
        styleSeed: artwork.styleSeed,
        shapeSeed: artwork.shapeSeed,
        positionSeed: artwork.positionSeed,
        sizeSeed: artwork.sizeSeed,
      },
    }))

    return NextResponse.json({ 
      artworks: transformedArtworks,
      total,
      hasMore: offset + limit < total,
    })
  } catch (error) {
    console.error('Failed to fetch claimed artworks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
}

// POST /api/claimed-artworks - Save a new claimed artwork
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      seed,
      ownerName,
      ownerEmail,
      ownerNote,
      title,
      artStyle,
      seeds,
      stripeSessionId,
    } = body

    // Validate required fields
    if (!seed || !ownerName || !ownerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if already claimed
    const existing = await db.claimedArtwork.findUnique({
      where: { seed: BigInt(seed) },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'This artwork is already owned', owner: existing.ownerName },
        { status: 409 }
      )
    }

    // Create the claimed artwork
    const artwork = await db.claimedArtwork.create({
      data: {
        seed: BigInt(seed),
        ownerName,
        ownerEmail,
        ownerNote: ownerNote || null,
        title: title || `Artwork #${seed.toString().slice(0, 8)}`,
        artStyle: artStyle || 'FlowField',
        hueSeed: seeds?.hueSeed || (seed * 17) % 1000000000,
        satSeed: seeds?.satSeed || (seed * 31) % 1000000000,
        lightSeed: seeds?.lightSeed || (seed * 47) % 1000000000,
        styleSeed: seeds?.styleSeed || (seed * 61) % 1000000000,
        shapeSeed: seeds?.shapeSeed || (seed * 73) % 1000000000,
        positionSeed: seeds?.positionSeed || (seed * 89) % 1000000000,
        sizeSeed: seeds?.sizeSeed || (seed * 97) % 1000000000,
        stripeSessionId: stripeSessionId || null,
        paymentStatus: stripeSessionId ? 'paid' : 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      id: artwork.id,
      seed: artwork.seed.toString(),
    })
  } catch (error) {
    console.error('Failed to save claimed artwork:', error)
    return NextResponse.json(
      { error: 'Failed to save artwork' },
      { status: 500 }
    )
  }
}
