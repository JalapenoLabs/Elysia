// Copyright © 2025 Algorivm

/* eslint-disable no-invalid-this, @typescript-eslint/no-unused-vars */

// Core
import * as yup from 'yup'
import { ValidationError } from 'yup'

// Typescript
import type { I18text } from '@/types'

// Utility
import { i18n } from './language'

// //////////////////// //
//     Common Regex     //
// //////////////////// //

export const dateIsoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
export const htmlDateRegex = /^\d{4}-\d{2}-\d{2}$/ // Format YYYY-MM-DD (based on HTML input)

// //////////////////// //
//    Yup Extensions    //
// //////////////////// //

// Extend yup's type definitions for our custom methods
declare module 'yup' {
  // Extend StringSchema with a custom maxTrim method.
  interface StringSchema<
    TType extends yup.Maybe<string> = string,
    TContext = yup.AnyObject,
    TDefault = undefined,
    TFlags extends yup.Flags = ''
  > {
    /**
     * Custom maxTrim method for strings.
     * If the string length exceeds `max`, it is truncated.
     */
    maxTrim(max: number): this

    /**
     * Custom replace method for strings.
     * Replaces all occurrences matching the regex with the provided replacement.
     * Defaults to an empty string if no replacement is provided.
     */
    replace(regex: RegExp, replacement?: string): this
  }

  // Extend NumberSchema with custom maxTrim and minTrim methods.
  interface NumberSchema<
    TType extends yup.Maybe<number> = number,
    TContext = yup.AnyObject,
    TDefault = undefined,
    TFlags extends yup.Flags = ''
  > {
    /**
     * Custom maxTrim method for numbers.
     * If the number is greater than `max`, it is clamped to `max`.
     */
    maxTrim(max: number): this

    /**
     * Custom minTrim method for numbers.
     * If the number is less than `min`, it is clamped to `min`.
     */
    minTrim(min: number): this
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type AnyPresentValue = {}

  // Extend MixedSchema with a custom file method.
  interface MixedSchema<
    TType extends yup.Maybe<AnyPresentValue> = AnyPresentValue | undefined,
    TContext = yup.AnyObject,
    TDefault = undefined,
    TFlags extends yup.Flags = ''
  > {
    /**
     * Custom file method for mixed types.
     * Validates that the value is a File.
     */
    file(): this

    /**
     * Custom minSize method for files.
     * Validates that the file's size is at least `minSize` bytes.
     */
    minSize(minSize: number): this

    /**
     * Custom maxSize method for files.
     * Validates that the file's size is at most `maxSize` bytes.
     */
    maxSize(maxSize: number): this
  }
}

// Custom maxTrim for string schema: trims the string to a maximum length
yup.addMethod(yup.string, 'maxTrim', function(max: number) {
  return this.transform(function(value: any, originalValue: any) {
    if (typeof originalValue === 'string' && originalValue.length > max) {
      return originalValue.slice(0, max)
    }
    return value
  })
})

// Custom replace for strings: replaces all matches of the regex with the given replacement.
// By default, the replacement is an empty string.
yup.addMethod(yup.string, 'replace', function(regex: RegExp, replacement: string = '') {
  return this.transform((value: any, originalValue: any) => {
    if (typeof originalValue === 'string') {
      return originalValue.replace(regex, replacement)
    }
    return value
  })
})

// Custom maxTrim for number schema: clamps the number to the specified maximum
yup.addMethod(yup.number, 'maxTrim', function(max: number) {
  return this.transform(function(value: any, originalValue: any) {
    if (typeof originalValue === 'number' && originalValue > max) {
      return max
    }
    return value
  })
})

// Custom minTrim for number schema: clamps the number to the specified minimum
yup.addMethod(yup.number, 'minTrim', function(min: number) {
  return this.transform(function(value: any, originalValue: any) {
    if (typeof originalValue === 'number' && originalValue < min) {
      return min
    }
    return value
  })
})

// Extend yup's mixed type to validate that the value is a File
yup.addMethod<yup.MixedSchema>(yup.mixed, 'file', function() {
  return this.test('file', 'A valid file is required', function(value) {
    const { path } = this

    if (!value) {
      return true
    }

    if (value instanceof File) {
      return true
    }

    // Check that the value is an instance of File (in browser environments)
    this.createError({ path, type: 'not-a-file' })

    return false
  })
})

// Extend yup with a minSize validator to check the file's minimum size in bytes
yup.addMethod<yup.MixedSchema>(yup.mixed, 'minSize', function(minSize: number) {
  return this.test('minSize', `File size must be at least ${minSize} bytes`, function(value) {
    const { path } = this
    // If no file is provided, let required() handle that
    if (!value || !(value instanceof File)) {
      return true
    }

    if (value.size >= minSize) {
      return true
    }

    this.createError({ path, type: 'file-too-small', params: { min: minSize }})

    return false
  })
})

// Extend yup with a maxSize validator to check the file's maximum size in bytes
yup.addMethod<yup.MixedSchema>(yup.mixed, 'maxSize', function(maxSize: number) {
  return this.test('maxSize', `File size must be at most ${maxSize} bytes`, function(value) {
    const { path } = this
    // If no file is provided, let required() handle that
    if (!value || !(value instanceof File)) {
      return true
    }

    if (value.size <= maxSize) {
      return true
    }

    this.createError({ path, type: 'file-too-large', params: { max: maxSize }})

    return false
  })
})

// //////////////////// //
//   Common Validators  //
// //////////////////// //

export const usernameValidator = yup
  .string()
  .trim()
  .max(64)
  // Usernames can only contain letters, numbers, and underscores
  // Must never contain '.' or '-'
  .matches(
    /^[a-zA-Z0-9_]+$/,
    'validators.username.invalid-characters'
  )
  .required()

export const emailValidator = yup
  .string()
  .trim()
  .email()
  .min(3)
  .max(64)
  .required()

export const passwordLoginValidator = yup
  .string()
  .trim()
  .max(64)
  .required()

export const passwordSignupValidator = yup
  .string()
  .trim()
  .min(8)
  .max(64)
  // Must have 1 capital letter
  .matches(
    /[A-Z]/,
    'validators.password.missing-capital'
  )
  // Must have 1 number
  .matches(
    /[0-9]/,
    'validators.password.missing-number'
  )
  .required()

export const dateOfBirthValidator = yup
  .string()
  .trim()
  // Format YYYY-MM-DD (based on HTML input)
  .matches(
    htmlDateRegex,
    'validators.invalid-date'
  )
  .required()

export const accessTokenValidator = yup
  .object({
    access_token: yup
      .string()
      .min(1)
      .required(),
    token_type: yup
      .string()
      .min(1)
      .oneOf([ 'Bearer' ])
      .required(),
    expires_in: yup
      .number()
      .min(1)
      .required(),
    expires_at: yup
      .string()
      .min(1)
      // Should match a date ISO
      .matches(
        dateIsoRegex,
        'validators.invalid-date'
      )
      .required()
  })

export const instrumentValidator = yup
  .string()
  .trim()

// //////////////////// //
//        Utility       //
// //////////////////// //

const keysByType: Record<ValidationError['type'], string> = {
  'typeError': 'validators.invalid-type', // TODO: Test this typeError one
  'min': 'validators.too-short',
  'max': 'validators.too-long',
  'required': 'validators.required',
  'matches': 'validators.invalid-format',
  'email': 'validators.invalid-email',
  'not-a-file': 'validators.not-a-file',
  'file-too-small': 'validators.file-too-small',
  'file-too-large': 'validators.file-too-large'
} as const

function translateError(error: ValidationError): I18text[] {
  const context = {
    type: error.type,
    value: error.params?.value || error.value,
    originalValue: error.params?.originalValue || error.value,
    path: error.path
      // Replace all underscores, periods, and dashes with spaces
      ?.replaceAll(/_|\.|-/gmi, ' ') || '_',
    min: error.params?.min,
    max: error.params?.max
  }

  if ((!error.type || !error.message) && error.inner.length > 0) {
    return error.inner.map(translateError).flat()
  }

  // Has it been given a custom message to use?
  if (error.message.startsWith('validators.')) {
    return [
      i18n.t(error.message, context)
    ]
  }
  // If not... We try to translate it ourselves!
  const key = keysByType[error.type] || 'validators.generic-invalid'
  if (!keysByType[error.type]) {
    console.log('Unknown error type:', error.type, error)
  }
  return [
    i18n.t(key, context)
  ]
}

// //////////////////// //
//         Hooks        //
// //////////////////// //

type UseValidatorReturn<Type = any> = {
  valid: boolean
  errors: Partial<Record<keyof Type, I18text[]>> & {
    _?: I18text[]
  }
  sanitized?: Type
}

export function useValidator<Type = any>(
  yup: yup.AnySchema,
  guineaPig: Type,
  settings: Omit<yup.ValidateOptions, 'disableStackTrace'> = {}
): UseValidatorReturn<Type> {
  try {
    const results: Type = yup.validateSync(
      guineaPig,
      {
        abortEarly: false,
        stripUnknown: true,
        recursive: true,
        ...settings,
        disableStackTrace: true
      }
    )

    return {
      valid: true,
      errors: {},
      sanitized: results
    }
  }
  catch (error) {
    if (error instanceof ValidationError) {
      if (typeof guineaPig !== 'object') {
        return {
          valid: false,
          errors: {
            // @ts-ignore
            _: translateError(error)
          }
        }
      }
      const errors: Partial<Record<keyof Type, I18text[]>> = {}
      const analysisRecursive = (report: ValidationError) => {
        if (report.path) {
          errors[report.path as keyof Type] = translateError(report)
        }
        for (const key in report.inner) {
          const inner = report.inner[key]
          if (inner instanceof ValidationError) {
            analysisRecursive(inner)
          }
          else {
            console.warn('Inner validator error is not a ValidationError', inner)
          }
        }
      }
      analysisRecursive(error)
      return {
        valid: false,
        errors
      }
    }
    return {
      valid: false,
      errors: {}
    }
  }
}

export {
  yup
}
