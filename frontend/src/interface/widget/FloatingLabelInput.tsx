// Copyright © 2025 Algorivm

// Core
import { useTranslation } from 'react-i18next'

// Typescript
import type { InputProps } from 'bulma-smart-react-forms/dist/form/Input'

// UI
import { Input } from 'bulma-smart-react-forms'

type FloatingLabelInputProps = InputProps & {
  label: string
}

// Warning: This is a work in progress! Will likely get removed...
export function FloatingLabelInput(props: FloatingLabelInputProps) {
  const { t } = useTranslation()

  return <div className={'field floating-label' + (props.value ? ' has-value' : '')}>
    <label className='placeholder-label'>{ t(props.label) }</label>
    <Input
      { ...props }
      label={undefined}
    />
  </div>
}
