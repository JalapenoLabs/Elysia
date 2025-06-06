// Copyright © 2025 Jalapeno Labs

import '@library/globals'

import { WebSocket } from 'ws'
// Some users pull in mic like this; if TS complains, add a .d.ts as shown below:
// @ts-ignore
import micFactory from 'mic'

type MicInstance = {
  getAudioStream: () => NodeJS.ReadableStream
  start: () => void
  stop: () => void
  on: (event: string, cb: (err?: Error) => void) => void
}

// Configuration (defaults can be overridden via env)
const WHISPER_HOST = process.env.WHISPER_HOST || 'whisperlive'
const WHISPER_PORT = process.env.WHISPER_PORT || '9090'
const WS_URL = `ws://${WHISPER_HOST}:${WHISPER_PORT}/ws`

// These options match 16kHz, 16-bit, little-endian, mono PCM
const MIC_OPTIONS: Record<string, any> = {
  rate: '16000', // sample rate
  channels: '1', // mono
  bitwidth: '16', // 16-bit samples
  encoding: 'signed-integer',
  endian: 'little',
  device: 'default', // ALSA default device; adjust if needed
  debug: false,
  exitOnSilence: 0 // never auto-exit on silence
}

async function main() {
  console.log(`[client] Connecting to WhisperLive at ${WS_URL}`)
  const ws = new WebSocket(WS_URL)

  ws.on('open', () => {
    console.log('[client] WebSocket open, starting mic capture')

    // Create a Mic instance
    const mic: MicInstance = (micFactory as any)(MIC_OPTIONS)

    // Grab the audio stream
    const micInputStream = mic.getAudioStream()

    micInputStream.on('data', (chunk: Buffer) => {
      if (ws.readyState === WebSocket.OPEN) {
        // send each PCM chunk directly
        ws.send(chunk)
      }
    })

    micInputStream.on('error', (err: Error) => {
      console.error('[mic ERROR]', err)
      // Optionally: restart mic or exit
    })

    micInputStream.on('startComplete', () => {
      console.log('[mic] Started successfully')
    })
    micInputStream.on('stopComplete', () => {
      console.log('[mic] Stopped')
    })

    mic.start()

    // Close both mic and WS on Ctrl-C
    process.on('SIGINT', () => {
      console.log('[client] SIGINT received, stopping mic…')
      mic.stop()
      ws.close()
    })
  })

  ws.on('message', (msg: Buffer) => {
    // WhisperLive returns JSON frames like { segment: "...", is_final: true/false }
    try {
      const data = JSON.parse(msg.toString())
      if (data.segment) {
        console.log(`[transcript] ${data.segment}`)
      }
      if (data.is_final) {
        console.log('[transcript] (segment finalized)')
      }
    }
    catch {
      console.warn('[client] got non-JSON payload:', msg.toString())
    }
  })

  ws.on('close', () => {
    console.log('[client] WebSocket closed, exiting')
    process.exit(0)
  })

  ws.on('error', (err) => {
    console.error('[client] WebSocket error:', err)
    process.exit(1)
  })
}

main().catch((err) => {
  console.error('[client] Fatal error:', err)
  process.exit(1)
})
