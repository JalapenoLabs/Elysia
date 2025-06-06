// Copyright © 2025 Elysia

// Core
import { Logo } from './Logo'
import { useTranslation } from 'react-i18next'
import styles from './Loader.module.scss'

type Props = {
  fullscreen?: boolean
  noHero?: boolean
}

export function Loader({ fullscreen, noHero }: Props) {
  const { t } = useTranslation()

  if (fullscreen) {
    const Loader = <div>
      <Logo
        centered
        unClickable
        width={256}
        className='block'
      />
      <div className='block'>
        <div
          className={`${styles.loader} ${styles.centered}`}
        />
      </div>
      <div className='block has-text-centered is-size-5'>
        <span>{
          t('common.loading')
        }</span>
      </div>
    </div>

    if (noHero) {
      return Loader
    }

    return <div className='hero is-fullheight'>
      <div className={'hero-body ' + styles.centered}>
        { Loader }
      </div>
    </div>
  }

  return <div className={styles.centered}>
    <div
      className={styles.loader}
    />
  </div>
}
