import { NextRequest, NextResponse } from 'next/server';

const INSTANTLY_API = 'https://api.instantly.ai/api/v2';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.INSTANTLY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'INSTANTLY_API_KEY not set in environment' },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    const body = await req.json();
    const { email, firstName, lastName, campaignId, customVariables } = body;

    if (!email || !campaignId) {
      return NextResponse.json(
        { error: 'Missing required fields: email, campaignId' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Add lead to Instantly campaign
    const res = await fetch(`${INSTANTLY_API}/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        first_name:       firstName || '',
        last_name:        lastName  || '',
        campaign:         campaignId,         // Instantly v2 uses 'campaign', not 'campaign_id'
        skip_if_in_campaign: false,
        custom_variables: customVariables || {},
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Instantly API error:', data);
      return NextResponse.json(
        { error: data?.message || 'Instantly API error', detail: data },
        { status: res.status, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ success: true, data }, { headers: CORS_HEADERS });
  } catch (err) {
    console.error('CRM send route error:', err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
