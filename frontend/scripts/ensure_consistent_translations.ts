// Copyright © 2025 Elysia

/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-unused-vars */

// This will go through each i18next translation.json file and
// Will ensure that all the keys are consistent across all files

// It will return 0 if all keys and subkeys are consistent
// For example, if a key (nested or root) is missing in one file, it will exit with 1

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

// ///////////////////////// //
//         Constants         //
// ///////////////////////// //

const DEBUG: boolean = process.env.DEBUG ?? true

const localesFolderDirs = path.join('public/locales')
const localesFolderPath = path.resolve(localesFolderDirs)

// ///////////////////////// //
//           Types           //
// ///////////////////////// //
type FileData = {
  locale: string
  filePath: string
  keys: Set<string>
}

// ///////////////////////// //
//          Utility          //
// ///////////////////////// //

// Recursively flattens an object into an array of dot-notation keys.
// For example, { a: { b: 1 } } becomes ['a.b']
function flattenKeys(obj: any, prefix: string = ''): string[] {
  let keys: string[] = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      const newKey = prefix ? prefix + '.' + key : key
      if (value !== null && typeof value === 'object') {
        keys = keys.concat(flattenKeys(value, newKey))
      }
      else {
        keys.push(newKey)
      }
    }
  }
  return keys
}

function walkDir(dir: string, callback: (filePath: string) => void) {
  const dirList = fs.readdirSync(dir)
  for (const file of dirList) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      walkDir(filePath, callback)
    }
    else {
      callback(filePath)
    }
  }
}

// ///////////////////////// //
//            Main           //
// ///////////////////////// //

async function main() {
  if (!localesFolderPath) {
    console.log(chalk.red('No locales folder found.'))
    process.exit(1)
  }
  if (!fs.existsSync(localesFolderPath)) {
    console.log(chalk.red('Locales folder not found.'))
    process.exit(1)
  }

  const fileDataList: FileData[] = []

  walkDir(
    localesFolderPath,
    (filePath) => {
      if (!filePath.endsWith('translation.json')) {
        throw new Error('Invalid file found: ' + filePath)
      }

      // For each file, get the locale and the keys
      const pathNames = filePath.split(path.sep)
      const fileName = pathNames.pop() // translation.json
      const locale = pathNames.pop() // en-US or es-GB

      if (!locale) {
        throw new Error('Invalid locale found: ' + filePath)
      }

      // Read the data from the file
      const file = fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(file)

      const keysArray = flattenKeys(data)
      const keysSet = new Set<string>(keysArray)

      fileDataList.push({
        locale,
        filePath,
        keys: keysSet
      })
    }
  )

  console.log(
    chalk.blue('Found', fileDataList.length, 'translation files.')
  )

  if (DEBUG) {
    console.log(fileDataList)
  }

  // Compute union of all keys
  const unionKeys = new Set<string>()
  for (const fileData of fileDataList) {
    for (const key of fileData.keys) {
      unionKeys.add(key)
    }
  }

  let hasErrors = false
  const missingKeysSummary: Record<string, string[]> = {}
  // Check each file for missing keys
  for (const fileData of fileDataList) {
    const missingKeys: string[] = []
    for (const key of unionKeys) {
      if (!fileData.keys.has(key)) {
        missingKeys.push(key)
      }
    }
    if (missingKeys.length > 0) {
      hasErrors = true
      missingKeysSummary[fileData.locale] = missingKeys
      console.log(chalk.red(`File for locale "${fileData.locale}" is missing ${missingKeys.length} key(s):`))
      missingKeys.forEach((key) => console.log(chalk.red(`  ${key}`)))
      console.log('')
    }
  }

  if (hasErrors) {
    console.log(chalk.red('Translation keys are inconsistent across locales.'))
    console.log(chalk.red('Summary of missing keys per locale:'))
    for (const [ locale, keys ] of Object.entries(missingKeysSummary)) {
      console.log(chalk.red(`Locale "${locale}" is missing the following keys:`))
      keys.forEach((key) => console.log(chalk.red(`  ${key}`)))
      console.log('')
    }
    process.exit(1)
  }

  console.log(chalk.green('All translation keys are consistent.'))
  process.exit(0)
}

main()
