// Copyright © 2025 Jalapeno Labs

import * as fs from 'fs'
import * as path from 'path'

// Interface to represent parsed command-line options
interface Options {
    rootPath: string
    ignorePatterns: string[]
}

// Parse command-line arguments to extract the root path and any ignore patterns
function parseArgs(): Options {
  // Slice off the first two elements ("node" and script name)
  const args = process.argv.slice(2)
  let rootPath = process.cwd()
  const ignorePatterns: string[] = []
  let i = 0

  while (i < args.length) {
    const arg = args[i]
    if (arg === '--ignore' || arg === '-i') {
      // Next argument is a pattern to ignore
      const pattern = args[i + 1]
      if (pattern) {
        ignorePatterns.push(pattern)
        i += 2
      }
      else {
        // If no pattern provided after flag, skip it
        i++
      }
    }
    else if (!arg.startsWith('-') && rootPath === process.cwd()) {
      // First non-flag argument is taken as the root path
      rootPath = path.resolve(arg)
      i++
    }
    else {
      // Unknown flag or extra argument; skip it
      i++
    }
  }

  return { rootPath, ignorePatterns }
}

// Recursively traverse a directory and print its contents in a tree-like format
function traverseDirectory(dirPath: string, depth: number, ignorePatterns: string[]): void {
  let entries: fs.Dirent[]
  try {
    // Read directory entries with their types (files vs. directories)
    entries = fs.readdirSync(dirPath, { withFileTypes: true })
  }
  catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    // If we can't read the directory (permissions, symlink loop, etc.), skip it
    return
  }

  // Filter out entries whose name matches any ignore pattern
  entries = entries.filter((entry) => !ignorePatterns.includes(entry.name))

  // Sort entries alphabetically by name for consistent output
  entries.sort((a, b) => a.name.localeCompare(b.name))

  // For each entry (file or directory), print it and recurse if it's a directory
  for (const entry of entries) {
    // Build the indentation prefix based on current depth (5 spaces per level)
    const indent = '     '.repeat(depth)
    const line = `${indent}|-- ${entry.name}`

    console.log(line)

    if (entry.isDirectory()) {
      // Recurse into subdirectory
      const nextPath = path.join(dirPath, entry.name)
      traverseDirectory(nextPath, depth + 1, ignorePatterns)
    }
  }
}

// Main execution function
function main(): void {
  const options = parseArgs()
  const { rootPath, ignorePatterns } = options
  ignorePatterns.push(
    'node_modules', // Default ignore pattern for node_modules
    '.git', // Default ignore pattern for .git directories
    '.vscode', // Default ignore pattern for Next.js build directories
    'dist' // Default ignore pattern for distribution directories
  )

  // Extract the base name of the root path to print as the top-level label
  const baseName = path.basename(rootPath)

  // Print the root directory name
  console.log(baseName)

  // Start recursive traversal at depth 1
  traverseDirectory(rootPath, 1, ignorePatterns)
}

// Invoke main
main()
