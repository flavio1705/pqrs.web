import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://l0w2wr04-3000.brs.devtunnels.ms/pqrs');
    if (!response.ok) {
      throw new Error('Failed to fetch PQRS data');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching PQRS data:', error);
    return NextResponse.json({ error: 'Failed to fetch PQRS data' }, { status: 500 });
  }
}

