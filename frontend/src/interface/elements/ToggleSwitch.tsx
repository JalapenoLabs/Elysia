// Copyright © 2025 Algorivm

// Core
import { useTranslation } from 'react-i18next'

// Typescript
import type { I18text } from '@/types'
import type { CSSProperties, ChangeEvent, ReactNode } from 'react'

type ToggleSwitchProps =
  // Colors
  {
    primary?: boolean
    success?: boolean
    danger?: boolean
    warning?: boolean
    info?: boolean
    link?: boolean
    color?: 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'link'
  }
  // Sizes
  & {
    small?: boolean
    medium?: boolean
    large?: boolean
  }
  // Styles
  & {
    rounded?: boolean
    noPadding?: boolean
  }
  // Values
  & {
    checked: boolean
    onChange: (newValue: boolean, event: ChangeEvent<HTMLInputElement>) => void
    onClick?: (event: React.MouseEvent<HTMLLabelElement>) => void
    disabled?: boolean
  }
  // Helpers
  & {
    id: string // Required is good practice!
    title?: I18text
    className?: string
    style?: CSSProperties
    label?: I18text | ReactNode
  }
  & Record<string, unknown>

export function ToggleSwitch(props: ToggleSwitchProps) {
  const { t } = useTranslation()

  const {
    id,
    title,
    style,
    label,
    checked,
    disabled,
    onChange,
    onClick,
    color,
    className,
    small,
    medium,
    large,
    primary,
    success,
    danger,
    warning,
    info,
    link,
    rounded,
    noPadding,
    ...rest
  } = props

  // Construct class names
  const classes = [
    'switch',
    rounded && 'is-rounded',
    disabled && 'is-disabled',

    small && 'is-small',
    medium && 'is-medium',
    large && 'is-large',

    primary && 'is-primary',
    success && 'is-success',
    danger && 'is-danger',
    warning && 'is-warning',
    info && 'is-info',
    link && 'is-link',
    color && `is-${color}`,
    !noPadding && 'mr-2',

    className
  ].filter(Boolean)

  return (
    <label
      htmlFor={id}
      title={t(title)}
      className={classes.join(' ')}
      style={style}
      onClick={onClick}
    >
      <input
        id={id}
        type='checkbox'
        checked={checked}
        disabled={disabled}
        onChange={function handleChange(event: ChangeEvent<HTMLInputElement>) {
          if (onChange) {
            onChange(event.target.checked, event)
          }
        }}
        {...rest}
      />
      <span className='slider' />
      {label && <span style={{ marginLeft: '0.5rem' }}>{
        (typeof label === 'string')
          ? t(label)
          : label
      }</span>}
    </label>
  )
}
