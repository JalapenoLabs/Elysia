// Copyright © 2025 Algorivm

// Typescript
import type { BaseUser } from '@/types'
import type { TFunction } from 'i18next'
import type { ReactNode } from 'react'

// Redux
import { useSelector } from '@/framework/redux-store'
import { useTranslation } from 'react-i18next'

type Context = {
  user: BaseUser
  t: TFunction<'translation', undefined>
}

type NameBadgeProps = {
  title?: string | ((context: Context) => ReactNode) | ReactNode
  subtitle?: string
  image?: string
  className?: string
  statusDot?: boolean
  children?: ReactNode
}

export function NameBadge(props: NameBadgeProps) {
  const { t } = useTranslation()

  const user = useSelector((state) => state.auth.user)

  const {
    title,
    subtitle,
    image,
    children,
    className = ''
  } = props

  return <div className={'is-flex is-align-items-center ' + className}>
    <figure className='image is-48x48 is-rounded mr-3'>
      <img src={image} alt={t(subtitle)} />
      {
        props.statusDot && <div className='statusdot is-success' />
      }
    </figure>
    <div>
      <h1 className='title is-6 mb-1'>{
        !title
          ? <>
            <span>{ user.username }</span>
          </>
          : typeof title === 'function'
            ? title({
              user,
              t
            })
            : typeof title === 'string'
              ? t(title)
              : title
      }</h1>
      <h2 className={`subtitle is-7 mb-${ children ? '3' : '0' }`}>{
        t(subtitle)
      }</h2>
      { children }
    </div>
  </div>
}
