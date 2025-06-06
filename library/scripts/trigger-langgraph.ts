// Copyright © 2025 Jalapeno Labs


import { Client } from '@langchain/langgraph-sdk'

async function main(): Promise<void> {
  // Initialize SDK client (defaults to http://localhost:8123 or your CLI port)
  const client = new Client()

  // Fetch the first available assistant
  const assistants = await client.assistants.search({ metadata: null, offset: 0, limit: 1 })
  const assistant = assistants[0]
  if (!assistant) {
    throw new Error('No assistants found')
  }

  // Start a new thread for this conversation
  const thread = await client.threads.create()

  // Hardcoded user message
  const messages = [{ role: 'human', content: 'Hello, how are you?' }]

  // Stream the assistant’s response
  const stream = client.runs.stream(thread.thread_id, assistant.assistant_id, {
    input: { messages }
  })

  // Print each chunk as it arrives
  for await (const chunk of stream) {
    console.log(chunk.data)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
