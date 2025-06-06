// Copyright © 2025 Jalapeno Labs

export function forEachFileInDirectory(
  dirPath: string,
  callback: (filePath: string, filename: string, ext: string) => void,
  recursive: boolean = false
): void {
  const normalizedPath = path.resolve(dirPath)

  if (!fs.existsSync(normalizedPath)) {
    return
  }

  const files = fs.readdirSync(normalizedPath)

  for (const file of files) {
    const filePath = path.join(normalizedPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory() && recursive) {
      forEachFileInDirectory(filePath, callback, true)
    }
    else if (stats.isFile()) {
      callback(
        filePath,
        path.basename(file, path.extname(file)),
        path.extname(file).toLowerCase()
      )
    }
  }
}

export function searchUpwardsForFile(fromPath: string, filename: string): string | null {
  // Resolve the starting path to an absolute path
  let currentDir = path.resolve(fromPath)

  // Traverse upward until the filesystem root is reached
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Build the path to the specified file in the current directory
    const filePath = path.join(currentDir, filename)

    // Check if the specified file exists and is a file
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath
    }

    // Determine the parent directory
    const parentDir = path.dirname(currentDir)

    // If we've reached the filesystem root (parent equals current), stop searching
    if (parentDir === currentDir) {
      break
    }

    // Move up one level and continue searching
    currentDir = parentDir
  }

  // If no package.json was found in any parent, return null
  return null
}

export function ensureFileExists(filePath: string, errorMessage: string): string {
  if (!filePath) {
    throw new Error(errorMessage)
  }

  // Normalize the file path to ensure it is absolute
  const normalizedPath = path.resolve(filePath)

  // Check if the file exists
  if (!fs.existsSync(normalizedPath)) {
    throw new Error(`File not found: ${normalizedPath}`)
  }

  return normalizedPath
}

/**
 * Ensures that all parent directories of the given file path exist,
 * then writes the provided contents to the file.
 *
 * @param {string} filePath - Path to the file to write
 * @param {string | Buffer} contents - Data to write to the file (string or Buffer)
 */
export function touch(filePath: string, contents: string | Buffer): void {
  const dir: string = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, contents)
}

export async function watchFileUntil(
  filePath: string,
  callback: (fileContent: string) => boolean
): Promise<void> {
  // Asynchronously watch a file until the callback returns true
  return new Promise<void>((resolve, reject) => {
    // Create a watcher on the specified file path
    const watcher = fs.watch(filePath, () => {
      try {
        // Invoke the callback; if it returns true, close watcher and resolve
        if (callback(fs.readFileSync(filePath, 'utf-8'))) {
          watcher.close()
          resolve()
        }
      }
      catch (error) {
        // On callback error, close watcher and reject the promise
        watcher.close()
        reject(error)
      }
    })

    // Handle watcher errors by closing and rejecting
    watcher.on('error', (error: any) => {
      watcher.close()
      reject(error)
    })
  })
}
