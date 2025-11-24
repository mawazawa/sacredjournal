import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const deepgramApiKey = process.env.DEEPGRAM_API_KEY
  if (!deepgramApiKey) {
    return NextResponse.json({ error: 'DeepGram API key not configured' }, { status: 500 })
  }

  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as Blob

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    const arrayBuffer = await audioFile.arrayBuffer()
    const audioBuffer = Buffer.from(arrayBuffer)

    const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${deepgramApiKey}`,
        'Content-Type': 'audio/webm'
      },
      body: audioBuffer
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `DeepGram API error: ${errorText}` }, { status: response.status })
    }

    const result = await response.json()
    const transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''

    return NextResponse.json({ text: transcript })
  } catch (error) {
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
