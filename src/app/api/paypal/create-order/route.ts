import { NextRequest, NextResponse } from 'next/server'

// PayPal API base URL - use sandbox for testing, live for production
const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com'

// Get PayPal access token
async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token')
  }

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { seed, title, ownerName, ownerNote, ownerEmail } = body

    // Validate required fields
    if (!ownerEmail || !ownerName || !seed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()
    
    // Create PayPal order
    const orderResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            description: `Artwork Ownership: ${title || `#${seed.toString().slice(0, 8)}`}`,
            custom_id: JSON.stringify({
              seed,
              ownerName,
              ownerNote: ownerNote || '',
              title: title || '',
            }),
            amount: {
              currency_code: 'USD',
              value: '5.00',
            },
          },
        ],
        application_context: {
          brand_name: 'Pinora',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?paypal=approved&seed=${seed}&name=${encodeURIComponent(ownerName)}${ownerNote ? `&note=${encodeURIComponent(ownerNote)}` : ''}`,
          cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/`,
        },
        payer: {
          email_address: ownerEmail,
        },
      }),
    })

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json()
      console.error('PayPal order creation failed:', errorData)
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
      )
    }

    const order = await orderResponse.json()
    
    return NextResponse.json({ 
      orderId: order.id,
      approveUrl: order.links?.find((link: { rel: string; href: string }) => link.rel === 'approve')?.href 
    })
  } catch (error) {
    console.error('PayPal error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    )
  }
}
