from whisper_live.client import TranscriptionClient

client = TranscriptionClient(
  "localhost",
  9090,
  lang="en",
  translate=False,
  model="small",
  use_vad=False,
  save_output_recording=False,
  output_recording_filename="./output_recording.wav",
  max_clients=4,
  max_connection_time=600,
  mute_audio_playback=False,
)

print(client())
