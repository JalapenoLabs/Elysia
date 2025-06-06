// Copyright © 2025 Elysia

// Core
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { UrlTree } from '@/constants'

// Iconography
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

// UI
import { Logo } from '@/interface/widget/Logo'
import { Button, Hero, Input } from 'bulma-smart-react-forms'
import { DisplayErrors } from '@/api/DisplayErrors'
import { useValidator } from '@/framework/validators'
import { useTranslation } from 'react-i18next'

// Utility
import {
  resetPasswordConfirm,
  resetPasswordConfirmValidator
} from '@/api/routes/password/reset/confirm'

type Context = {
  email?: string
}

export function ForgotPassword() {
  const { t } = useTranslation()

  const { state } = useLocation()
  const [ email, setEmail ] = useState<string>((state as Context)?.email || '')
  const [ error, setError ] = useState<string>('')
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ isFinished, setIsFinished ] = useState<boolean>(false)

  const adjudicated = useValidator(
    resetPasswordConfirmValidator,
    { email }
  )

  async function submit() {
    if (!adjudicated.valid || isLoading) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await resetPasswordConfirm(
        adjudicated.sanitized.email
      )

      // If unsuccessful
      if (!result.success) {
        setError(
          result.errors[0]
        )
        return
      }

      setIsFinished(true)
    }
    catch (error: unknown) {
      console.error(error)
      setError(
        t('unknown')
      )
    }
    finally {
      setIsLoading(false)
    }
  }

  return <Hero
    fullHeight
    className='has-background'
    style={{
      backgroundImage: 'url(/images/dark/Pattern.png)'
    }}
  >
    <div className='container is-max-fullhd'>
      <div className='subcontainer is-mini'>
        <div className='block'>
          <Logo
            centered
            width={256}
            unClickable
          />
        </div>
        <div className='block has-text-centered'>
          <h1 className='title'>{
            t('auth.forgot-password.title')
          }</h1>
        </div>{
          isFinished
            // Finished message
            ? <>
              <div className='block box'>
                <h1 className='title icon-text'>
                  <span className='icon mt-1 mr-2'>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                  <span>{
                    t('auth.forgot-password.confirmation-title')
                  }</span>
                </h1>
                <p>{
                  t(
                    'auth.forgot-password.confirmation',
                    { email: adjudicated.sanitized?.email }
                  )
                }</p>
              </div>
            </>
            // Unfinished form
            : <>
              <div className='field box'>
                <div className='block'>
                  <p>{
                    t('auth.forgot-password.description')
                  }</p>
                </div>
                <div className='field'>
                  <Input
                    autoFocus
                    id='email'
                    type='email'
                    autoComplete='email'
                    value={email}
                    onEnter={submit}
                    label={t('common.email')}
                    title={t('common.email')}
                    placeholder={t('common.email')}
                    onChange={(event) => setEmail(event.value)}
                    icon={<FontAwesomeIcon icon={faEnvelope} />}
                    errorMessage={adjudicated.errors.email || adjudicated.errors._}
                  />
                </div>
                {
                  error && <div className='block'>
                    <p className='has-text-danger'>{
                      t(error)
                    }</p>
                  </div>
                }

                <DisplayErrors centered asBlock errors={adjudicated.errors._} />

                <div className='block'>
                  <Button
                    id='submit'
                    primary
                    fullwidth
                    loading={isLoading}
                    onClick={submit}
                    disabled={!adjudicated.valid}
                    title={t('auth.forgot-password.action')}
                  >
                    <span>{
                      t('auth.forgot-password.action')
                    }</span>
                    <span className='icon'>
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </span>
                  </Button>
                </div>
              </div>
            </>
        }<div className='block'>
          <div className='icon-text has-text-primary is-justify-content-center'>
            <span className='icon'>
              <FontAwesomeIcon icon={faArrowLeft} />
            </span>
            <span>
              <Link to={UrlTree.login}>{
                t('auth.forgot-password.go-back')
              }</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  </Hero>
}
