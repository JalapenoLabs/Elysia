// Copyright © 2025 Algorivm

// Core
import { Fragment, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router'
import { MIN_ZXCVBN_STRENGTH, UrlTree } from '@/constants'

// Typescript
import type { Noni18text } from '@/types'

// Iconography
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEye, faLock, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'

// UI
import { Logo } from '@/interface/widget/Logo'
import { Button, Hero, Input } from 'bulma-smart-react-forms'
import { PasswordStrength } from '@/interface/widget/PasswordStrength'
import { DisplayErrors } from '@/api/DisplayErrors'
import { useValidator } from '@/framework/validators'
import { useTranslation } from 'react-i18next'

// API
import { resetPassword, resetPasswordValidator } from '@/api/routes/password/reset'

// Utility
// import { newToast } from 'bulma-smart-react-forms'


// This page expects a token as a query param in the URL
// It can optionally take a user email as a query param in the URL
export function ResetPassword() {
  const { t } = useTranslation()

  const location = useLocation()
  const navigate = useNavigate()

  const token = decodeURIComponent(
    new URLSearchParams(location.search).get('token')
  )
  const emailQuery = decodeURIComponent(
    new URLSearchParams(location.search).get('email') || ''
  )

  // Form state
  const [ email, setEmail ] = useState<string>(emailQuery || '')
  const [ password, setPassword ] = useState<string>('')
  const [ confirm, setConfirm ] = useState<string>('')

  // Feedback
  const [ showPassword, setShowPassword ] = useState<boolean>(false)
  const [ zxcvbnFeedback, setZxcvbnFeedback ] = useState<Noni18text[]>()
  const [ zxcvbnScore, setZxcvbnScore ] = useState<number>(0)

  // API state
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ errors, setErrors ] = useState<string[]>([])

  const adjudicated = useValidator(
    resetPasswordValidator,
    {
      email,
      new_password: password,
      token
    }
  )

  const isValid = adjudicated.valid && password === confirm

  async function submit() {
    if (isLoading || !isValid) {
      return
    }
    setErrors([])
    setIsLoading(true)

    // API call to reset the password
    const request = await resetPassword(email, password, token)

    // ❌❌❌ Unsuccessful
    if (!request.success) {
      setErrors(request.errors)
      setIsLoading(false)
      return
    }

    // ✅✅✅ Successful

    // TODO: Enable once bulma-forms has issues fixed
    // newToast({
    //   color: 'success',
    //   message: t('auth.reset-password.success')
    // })

    // Redirect to login
    navigate(UrlTree.login)

    setIsLoading(false)
  }

  if (!token) {
    console.log('No token provided, redirecting to login')
    // newToast({
    //   color: 'danger',
    //   message: t('auth.reset-password.bad-token')
    // })
    return <Navigate to={UrlTree.login} />
  }

  return <Hero
    fullHeight
    className='has-background'
    style={{
      backgroundImage: 'url(/images/dark/Pattern.png)'
    }}
  >
    <div className='container is-max-fullhd'>
      <form className='subcontainer is-mini'>
        <div className='block'>
          <Logo
            centered
            width={256}
            unClickable
          />
        </div>
        <div className='block has-text-centered'>
          <h1 className='title'>{
            t('auth.reset-password.title')
          }</h1>
        </div>
        <div className='field box'>
          <div className='block'>
            <p>{
              t('auth.reset-password.description')
            }</p>
          </div>
          {/* Email */}
          <div className='field'>
            <Input
              autoFocus
              id='email'
              type='email'
              icon={<FontAwesomeIcon icon={faEnvelope} />}
              autoComplete='email'
              value={email}
              onChange={(event) => setEmail(event.value)}
              placeholder={'common.email'}
              label={'common.email'}
              errorMessage={adjudicated.errors?.email}
              onEnter={submit}
              max={64}
              min={1}
            />
          </div>
          {/* New password input */}
          <div className='field'>
            <div className='control'>
              <Input
                id='new-password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='new-password'
                value={password}
                onEnter={submit}
                label={t('auth.reset-password.new-password')}
                title={t('auth.reset-password.new-password')}
                placeholder={t('auth.reset-password.new-password')}
                onChange={(event: any) => setPassword(event.value)}
                icon={<FontAwesomeIcon icon={showPassword ? faEye : faLock} />}
                errorMessage={adjudicated.errors.new_password}
                max={64}
                min={1}
              />
              <a
                className='input-overlay-action'
                onClick={() => setShowPassword(!showPassword)}
              >{
                  showPassword
                    ? t('common.hide')
                    : t('common.show')
                }</a>
            </div>
          </div>
          {/* Confirm password input */}
          <div className='field'>
            <Input
              id='confirm-password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='new-password'
              value={confirm}
              onEnter={submit}
              label={t('auth.reset-password.confirm-password')}
              title={t('auth.reset-password.confirm-password')}
              placeholder={t('auth.reset-password.confirm-password')}
              onChange={(event: any) => setConfirm(event.value)}
              icon={<FontAwesomeIcon icon={showPassword ? faEye : faLock} />}
              max={64}
              min={1}
            />
          </div>
          {/* Password strength bar */}
          <div className='field'>
            <PasswordStrength
              password={password}
              minLength={8}
              shortScoreWord={t('auth.password.too-short')}
              scoreWords={
                // Default is:
                // [ 'weak', 'weak', 'okay', 'good', 'strong' ]
                [
                  t('auth.password.strength-0'),
                  t('auth.password.strength-1'),
                  t('auth.password.strength-2'),
                  t('auth.password.strength-3'),
                  t('auth.password.strength-4')
                ]
              }
              onChangeScore={(score, feedback) => {
                const feedbackAsArray: Noni18text[] = []
                if (feedback?.warning) {
                  feedbackAsArray.push(feedback.warning)
                }
                if (feedback?.suggestions?.length) {
                  feedbackAsArray.push(...feedback.suggestions)
                }
                if (feedbackAsArray.length) {
                  setZxcvbnFeedback(feedbackAsArray)
                }
                else {
                  setZxcvbnFeedback(null)
                }
                setZxcvbnScore(score)
              }}
            />
          </div>
          {
            (errors.length || (!isValid && password)) && <div className='block'>
              <DisplayErrors errors={errors} />
              { (confirm || password) && confirm !== password && <p className='help has-text-danger'>{
                t('auth.reset-password.passwords-mismatch')
              }</p> }
              {
                MIN_ZXCVBN_STRENGTH > zxcvbnScore
                  && <p className='help has-text-danger'>{
                    t('auth.password-weak')
                  }</p>
              }
              {
                zxcvbnFeedback?.map((feedback, index) => (
                  <Fragment key={index}>
                    <span className='has-text-warning'>• { feedback }</span>
                    <br />
                  </Fragment>
                ))
              }
            </div>
          }

          <DisplayErrors asBlock centered errors={adjudicated.errors._} />

          <div className='block'>
            <Button
              id='submit'
              primary
              fullwidth
              loading={isLoading}
              onClick={submit}
              disabled={!isValid}
              title={t('auth.reset-password.action')}
            >
              <span>{
                t('auth.reset-password.action')
              }</span>
              <span className='icon'>
                <FontAwesomeIcon icon={faKey} />
              </span>
            </Button>
          </div>
        </div>
        <div className='block'>
          <div className='icon-text has-text-primary is-justify-content-center'>
            <span className='icon'>
              <FontAwesomeIcon icon={faArrowLeft} />
            </span>
            <span>
              <Link to={UrlTree.login}>{
                t('auth.reset-password.go-back')
              }</Link>
            </span>
          </div>
        </div>
      </form>
    </div>
  </Hero>
}
