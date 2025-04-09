// Copyright © 2025 Jalapeno Labs

// Typescript
import type { I18key } from '@/types'

// Utility
import { useTranslation } from 'react-i18next'
import { capitalize } from '@/common/utility'

export type DisplayErrorProps = {
  errors: I18key | I18key[]
  className?: string
  centered?: boolean
  right?: boolean
  asBlock?: boolean
}

export function DisplayErrors(props: DisplayErrorProps) {
  const { t, i18n } = useTranslation()

  // Standardize errors into an array
  const errors = !(props.errors instanceof Array)
    ? [ props.errors ]
    : props.errors

  const className = [
    props.className || 'has-text-danger',
    props.centered ? 'has-text-centered' : '',
    props.right ? 'has-text-right' : ''
  ].filter(Boolean).join(' ')

  const errorMessages = errors
    .filter(Boolean)
    .map((error, index) => {
      let content: string

      // If the error is an i18n key, translate it
      if (i18n.exists(error)) {
        content = capitalize(
          t(error)
        )
      }
      // Is it an error code or a literal message?
      // If it's an error code that we don't have
      else if (error.startsWith('errors.')) {
        console.debug('Unknown error code:', error)
        content = t('unknown')
      }
      // If it's a literal message:
      else {
        content = capitalize(error)
      }

      return <p key={index} className={className}>{
        content
      }</p>
    })

  if (!errorMessages.length) {
    return <></>
  }

  if (props.asBlock) {
    return <div className='block'>{
      errorMessages
    }</div>
  }

  return errorMessages
}
