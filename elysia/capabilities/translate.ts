// Copyright © 2025 Jalapeno Labs

import { Capability } from '../lib/Capability'

export class TranslateAudio extends Capability {
  readonly name = 'Translate audio'
  readonly description = 'Translates an audio file from .mp3 or .wav to text'
  readonly version = 1
  readonly group = 'whisper'

  public async execute() {
    // Implementation for translating audio files

    const formData = new FormData()
    formData.append('audio_file', new Blob(['']))

    try {
      const request = await fetch('http://localhost:9000/asr', {
        method: 'POST',
        body: formData,
      })

      if (request.status !== 200) {
        console.error('Error:', request.statusText)
        return
      }

      return request.text()
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message)
      }
      else {
        console.error('Unexpected error:', error)
      }
    }

    return null
  }
}
