// Copyright © 2025 Jalapeno Labs


// Core
import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { UrlTree } from '@/constants'

// Typescript
import type { ReactNode } from 'react'

// Iconography
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons'

// UI
import { Logo } from '../widget/Logo'

// Utility
import { useTranslation } from 'react-i18next'

type NavigationProps = {
  children: ReactNode
}

export function Navigator(props: NavigationProps) {
  const { t } = useTranslation()
  const location = useLocation()

  const [ isActive, setIsActive ] = useState(false)

  useEffect(() => {
    setIsActive(false)
  }, [ location.pathname ])

  const rootClassName = [
    'navbar',
    isActive && 'is-active'
  ].filter(Boolean).join(' ')

  const navbarMenuclassName = [
    'navbar-menu',
    isActive && 'is-active'
  ].filter(Boolean).join(' ')

  const burgerClassname = [
    'navbar-burger',
    isActive && 'is-active'
  ].filter(Boolean).join(' ')

  return <>
    {/* Navbar */}
    <nav className={rootClassName} role='navigation' aria-label='main navigation'>
      <div className='navbar-brand'>
        <div className='navbar-item mr-2'>
          <Logo width={150} />
        </div>
        <div
          role='button'
          className={burgerClassname}
          onClick={() => setIsActive(!isActive)}
          aria-label='menu'
          aria-expanded={isActive}
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </div>

      </div>

      <div className={navbarMenuclassName}>
        <div className='navbar-start'>

          <NavLink
            to={UrlTree.songList}
            className={({ isActive }) => `navbar-item ${isActive ? 'is-active' : ''}`}
          >
            <div className='icon-text'>
              <span className='icon'>
                <FontAwesomeIcon icon={faMusic} />
              </span>
              <span>{
                t('navigation.songs')
              }</span>
            </div>
          </NavLink>

        </div>
        <div className='navbar-end'>
          <NavLink
            to={UrlTree.profile}
            className={({ isActive }) => `navbar-item ${isActive ? 'is-active' : ''}`}
          >
            <div className='icon-text'>
              <span className='icon'>
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span>{
                t('navigation.my-profile')
              }</span>
            </div>
          </NavLink>
          <NavLink
            to={UrlTree.logout}
            className={({ isActive }) => `navbar-item ${isActive ? 'is-active' : ''}`}
          >
            <div className='icon-text'>
              <span className='icon'>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>
              <span>{
                t('navigation.logout')
              }</span>
            </div>
          </NavLink>
        </div>
      </div>
    </nav>

    <section className='hero is-fullheight-with-navbar'>
      <div className='hero-body is-align-items-flex-start is-flex-direction-column'>{
        props.children
      }</div>
    </section>
  </>
}
