import { NextRequest, NextResponse } from 'next/server'

// Email sending using Resend (or fallback to console log for demo)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      ownerName, 
      ownerNote, 
      artworkTitle, 
      artworkSeed, 
      artworkStyle,
      seeds 
    } = body

    // Validate required fields
    if (!email || !ownerName || !artworkTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      // Dynamic import of Resend (only when API key is available)
      const { Resend } = await import('resend')
      const resend = new Resend(resendApiKey)

      // Generate artwork image URL (we'll attach it inline)
      const artworkImageUrl = `${process.env.NEXT_PUBLIC_URL || 'https://pinora-tau.vercel.app'}/api/generate-art?seed=${artworkSeed}&hueSeed=${seeds?.hueSeed || 0}&satSeed=${seeds?.satSeed || 0}&lightSeed=${seeds?.lightSeed || 0}&styleSeed=${seeds?.styleSeed || 0}&shapeSeed=${seeds?.shapeSeed || 0}&positionSeed=${seeds?.positionSeed || 0}&sizeSeed=${seeds?.sizeSeed || 0}`

      const { data, error } = await resend.emails.send({
        from: 'Pinora Memory Wall <noreply@pinora.art>',
        to: email,
        subject: `🎨 Your Artwork "${artworkTitle}" is Now Yours Forever!`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #f59e0b; font-size: 28px; margin: 0;">✨ Memory Wall ✨</h1>
              <p style="color: #94a3b8; font-size: 16px; margin-top: 8px;">You are now part of history forever</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #fff; font-size: 22px; margin: 0 0 12px 0;">${artworkTitle}</h2>
              <p style="color: #94a3b8; margin: 0 0 16px 0;">
                Style: <span style="color: #f59e0b;">${artworkStyle}</span><br>
                Unique ID: <span style="color: #60a5fa;">#${artworkSeed.toString().slice(0, 8)}</span>
              </p>
              ${ownerNote ? `<p style="color: #cbd5e1; font-style: italic; margin: 0; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">"${ownerNote}"</p>` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <img src="${artworkImageUrl}" alt="${artworkTitle}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);" />
            </div>

            <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%); border-radius: 12px; padding: 20px; text-align: center;">
              <p style="color: #f59e0b; font-size: 18px; margin: 0 0 8px 0; font-weight: bold;">
                🎉 Congratulations, ${ownerName}!
              </p>
              <p style="color: #cbd5e1; font-size: 14px; margin: 0;">
                This unique artwork is now exclusively yours. No one else can ever own it.
                <br><br>
                Your name will be displayed on the Memory Wall forever.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                View your artwork on the Memory Wall at
                <a href="https://pinora-tau.vercel.app" style="color: #f59e0b; text-decoration: none;">pinora-tau.vercel.app</a>
              </p>
              <p style="color: #475569; font-size: 11px; margin: 8px 0 0 0;">
                10^63 unique artworks • One of them is yours
              </p>
            </div>
          </div>
        `,
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
      }

      return NextResponse.json({ success: true, id: data?.id })
    } else {
      // Demo mode - just log the email
      console.log('=== EMAIL (Demo Mode) ===')
      console.log('To:', email)
      console.log('Subject:', `🎨 Your Artwork "${artworkTitle}" is Now Yours Forever!`)
      console.log('Owner:', ownerName)
      console.log('Artwork:', artworkTitle)
      console.log('Style:', artworkStyle)
      console.log('Note:', ownerNote || '(none)')
      console.log('=========================')

      return NextResponse.json({ 
        success: true, 
        demo: true,
        message: 'Email logged (demo mode - add RESEND_API_KEY for real emails)'
      })
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
