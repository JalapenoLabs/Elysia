// Copyright © 2025 Algorivm

// Core
import { ThemedImage } from './ThemedImage'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UrlTree } from '@/constants'

type LogoProps = {
  width?: number
  height?: number
  centered?: boolean
  right?: boolean
  className?: string
  unClickable?: boolean
}

export function Logo({ unClickable, ...props }: LogoProps) {
  const { t } = useTranslation()

  const className = [
    'image',
    props.centered && 'is-centered',
    props.right && 'is-right',
    props.className
  ].filter(Boolean).join(' ')

  const Figure = <figure
    className={ className }
    style={{
      maxWidth: props.width ? (props.width + 'px') : undefined,
      maxHeight: props.height ? (props.height + 'px') : undefined
    }}
  >
    <ThemedImage
      src={(theme) => `/images/${theme}/Algorivm.png`}
      alt={t('brand.full-name')}
      title='brand.slogan'
      { ...props }
    />
  </figure>

  if (unClickable) {
    return Figure
  }

  return <Link to={UrlTree.home}>{
    Figure
  }</Link>
}
