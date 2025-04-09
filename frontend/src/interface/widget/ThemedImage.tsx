// Copyright © 2025 Algorivm

// Core
import { useSystemTheme } from '@/framework/theme'
import { useTranslation } from 'react-i18next'

// Typescript
import type { ImgHTMLAttributes } from 'react'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | ((theme: string, oppositeTheme: string) => string)
  alt: string
  title?: string
  centered?: boolean
  className?: string
}

// Manages dark theme vs light theme images
export function ThemedImage({ src, ...props }: Props) {
  const { t } = useTranslation()
  const { theme, oppositeTheme } = useSystemTheme()

  const className = [
    'image',
    props.className,
    props.centered && 'is-centered'
  ].filter(Boolean).join(' ')

  return <img
    { ...props }
    className={className}
    src={typeof src === 'string'
      ? '/images/' + src
        // Ensuring there is no prepended slash in the src variable
        .replace(/^\/+/, '')
        // Replace the theme and opposite theme
        .replaceAll('${theme}', theme)
        .replaceAll('${oppositeTheme}', oppositeTheme)
      : src(theme, oppositeTheme)
    }
    alt={t(props.alt)}
    title={t(props.title)}
  />
}
