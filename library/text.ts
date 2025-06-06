// Copyright © 2025 Navarrotech

export function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

export function stripAnsiColors(input: string): string {
  // Regular expression to match ANSI escape sequences for colors

  /* eslint-disable no-control-regex */
  const ansiRegex = /\x1B\[[0-9;]*m/g

  // Replace all matches with empty string
  const result = input.replace(ansiRegex, '')

  return result
}

/**
 * Removes surrounding triple backtick code fences and any text outside them from a ChatGPT response
 * @param {string} response - The raw response string potentially containing code fences
 * @return {string} - The sanitized code content without fence markers or extra text
 */
export function removeBackticks(response: string): string {
  // define the triple backtick fence marker
  const fence = '```'

  // find the first occurrence of the opening fence
  const startFenceIndex = response.indexOf(fence)
  if (startFenceIndex === -1) {
    // no triple backticks found, return the trimmed original response
    return response.trim()
  }

  // calculate the position immediately after the opening fence
  const afterOpening = startFenceIndex + fence.length

  // locate the newline after the opening fence (to skip any language specifier)
  const nextLineBreak = response.indexOf('\n', afterOpening)
  let codeStart: number
  if (nextLineBreak !== -1) {
    // code begins on the line after the fence
    codeStart = nextLineBreak + 1
  }
  else {
    // no newline found, code starts immediately after the fence
    codeStart = afterOpening
  }

  // find the next occurrence of the triple backtick to mark the end of the code block
  const endFenceIndex = response.indexOf(fence, codeStart)
  let codeEnd: number
  if (endFenceIndex !== -1) {
    // set end of code just before the closing fence
    codeEnd = endFenceIndex
  }
  else {
    // no closing fence, take everything until the end
    codeEnd = response.length
  }

  // extract the content between the fences (or until the end if no closing fence)
  const codeContent = response.substring(codeStart, codeEnd)

  // return the trimmed code content
  return codeContent.trim()
}
