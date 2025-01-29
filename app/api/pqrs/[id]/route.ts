import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  
  if (!id) {
    console.error('No ID provided');
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  console.log(`Fetching PQRS detail for ID: ${id}`);

  try {
    const response = await fetch(`https://l0w2wr04-3000.brs.devtunnels.ms/pqrs/${id}`);
    console.log(`External API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`External API error: ${errorText}`);
      throw new Error(`External API responded with status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Received data from external API:', data);
    
    if (!data || Object.keys(data).length === 0) {
      console.error('No data or empty object returned from external API');
      return NextResponse.json({ error: 'PQRS not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: `Failed to fetch PQRS detail: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
      { status: 500 }
    );
  }
}

