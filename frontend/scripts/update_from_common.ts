// Copyright © 2025 Elysia

/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-unused-vars */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { set } from 'lodash-es'

// ///////////////////////// //
//           Types           //
// ///////////////////////// //

type ErrorCode = {
  type: string
  message: string
}
type ErrorCodesFile = Record<string, ErrorCode>
type ErrorCodesOutput = Record<string, string>

// ///////////////////////// //
//         Constants         //
// ///////////////////////// //

const DEBUG: boolean = !!process.env.DEBUG
const SUBMODULE_COMMON_FOLDER_NAME = 'elysia_common' as const
const ERROR_CODES_FILENAME = 'errorCodes.json' as const
const OUTPUT_I18N_KEY_PATH = 'errors.backend' as const
const OUTPUT_WHITELIST_LANGUAGES: string[] = [ 'en-GB', 'en-US' ] as const

// ///////////////////////// //
//           Paths           //
// ///////////////////////// //

const localesFolderDirs = path.join('public/locales')
const localesFolderPath = path.resolve(localesFolderDirs)
const commonPath = path.resolve(`./${SUBMODULE_COMMON_FOLDER_NAME}`)
const errorCodesPath = path.join(
  commonPath,
  ERROR_CODES_FILENAME
)

// ///////////////////////// //
//          Utility          //
// ///////////////////////// //

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
  // ///////////////////////// //
  //         Read Files        //
  // ///////////////////////// //

  if (!fs.existsSync(commonPath)) {
    // Redundant but gives a better error message
    console.error(
      chalk.red(`Submodule ${SUBMODULE_COMMON_FOLDER_NAME} path does not exist at ${commonPath}`)
    )
    console.warn(
      chalk.yellow('Did you forget to init submodules?')
    )
    process.exit(1)
  }

  if (!fs.existsSync(errorCodesPath)) {
    console.error(
      chalk.red(`Error codes file (${
        ERROR_CODES_FILENAME
      }) does not exist at ${
        errorCodesPath
      }`)
    )
    console.warn(
      chalk.yellow('Did you forget to init submodules?')
    )
    process.exit(1)
  }

  if (!fs.existsSync(localesFolderPath)) {
    console.error(
      chalk.red(`Could not locate locales folder at ${localesFolderPath}`)
    )
    process.exit(1)
  }

  console.log(
    chalk.gray('Loading error codes')
  )

  const errorCodes: ErrorCodesFile = JSON.parse(
    fs.readFileSync(
      errorCodesPath,
      'utf8'
    )
  )

  console.log(
    chalk.green('Error codes loaded, refactoring:')
  )

  // ///////////////////////// //
  //       Refactor files      //
  // ///////////////////////// //

  const errorCodesRefactored: ErrorCodesOutput = {}

  let successCount = 0
  for (const [ key, value ] of Object.entries(errorCodes)) {
    if (!value?.message) {
      console.warn(
        chalk.yellow(`  X Error code ${key}/${value?.type} has no message!!`)
      )
      continue
    }
    errorCodesRefactored[key] = value.message
    if (DEBUG) {
      console.log(
        chalk.blue(`  > ${key}/${value?.type}`)
      )
    }
    successCount++
  }

  // ///////////////////////// //
  //        Update Files       //
  // ///////////////////////// //

  console.log(
    chalk.gray(`  >> Refactoring complete, ${successCount} error codes refactored`)
  )
  console.log(
    chalk.green('\nBeginning writing outputs:')
  )

  walkDir(
    localesFolderPath,
    (filePath) => {
      if (!filePath.endsWith('.json')) {
        console.log(
          chalk.blueBright(`  >> Skipping non-JSON file: ${filePath}`)
        )
        return
      }

      // Input: C:/**/public/locales/en-US/translation.json
      // Output: [ ...root, 'en-US/translation.json' ]
      const [ root, localPath ] = filePath.split(localesFolderDirs + path.sep)

      // Whitelist check
      // Strips to 'en-US' from 'en-US/translation.json'
      const language = localPath.split(path.sep)[0]

      // Does the whitelist array contain the language?
      if (!OUTPUT_WHITELIST_LANGUAGES.includes(language)) {
        console.log(
          chalk.blueBright(`  >> Skipping: ${language}`)
        )
        return
      }

      // Parse it!
      let translation: Record<string, any>
      try {
        translation = JSON.parse(
          fs.readFileSync(
            filePath,
            'utf8'
          )
        )
      }
      catch (error: unknown) {
        console.error(
          chalk.red(`  >> Invalid json at ${filePath}`)
        )
        return
      }

      // Update it!
      const newTranslation = set(
        translation,
        OUTPUT_I18N_KEY_PATH,
        errorCodesRefactored
      )

      // Write it!
      fs.writeFileSync(
        filePath,
        JSON.stringify(
          newTranslation,
          null,
          2
        )
      )

      console.log(
        chalk.green(`  >> Outputting to: ${language}`)
      )
    }
  )

  console.log(
    chalk.green('\nScript finished successfully!')
  )
  process.exit(0)
}

main()
