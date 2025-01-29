import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { audioUrl } = await req.json();

  if (!audioUrl) {
    return NextResponse.json({ error: 'Audio URL is required' }, { status: 400 });
  }

  try {
    // Fetch the audio file
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error('Failed to fetch audio file');
    }
    const audioBlob = await audioResponse.blob();

    // Prepare form data for Groq API
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.ogg');
    formData.append('model', 'whisper-large-v3');
    formData.append('response_format', 'verbose_json');

    // Make request to Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
      },
      body: formData,
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      throw new Error(`Groq API error: ${errorData}`);
    }

    const transcription = await groqResponse.json();

    return NextResponse.json({
      text: transcription.text,
      words: transcription.words
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}

