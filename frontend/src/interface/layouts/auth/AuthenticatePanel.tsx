// Copyright © 2024 Algorivm

// Core
import { useState, useEffect, Fragment } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'

// Typescript
import type { I18key, Noni18text } from '@/types'
import type { SignupRequest } from '@/api/routes/users/signup'

// Iconography
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEye,
  faEnvelope,
  faLock,
  faUser,
  faCalendarDay
} from '@fortawesome/free-solid-svg-icons'

// UI
import { Input, Button } from 'bulma-smart-react-forms'
import { PasswordStrength } from '@/interface/widget/PasswordStrength'
import { InstitutionSearch } from '@/interface/elements/InstitutionSearch'
import { ToggleSwitch } from '@/interface/elements/ToggleSwitch'
import { DisplayErrors } from '@/api/DisplayErrors'
import { Logo } from '@/interface/widget/Logo'
import { Trans, useTranslation } from 'react-i18next'

// Actions
import { userSignup, userSignupValidator } from '@/api/routes/users/signup'
import { userLogin, userLoginValidator } from '@/api/routes/users/login'

// Misc
import { UrlTree, MIN_ZXCVBN_STRENGTH } from '@/constants'
import { useValidator } from '@/framework/validators'

type State = SignupRequest & {
  acceptEula: boolean
  showPassword: boolean
  institutionId: string
  confirmPassword: string
  zxcvbnScore: number
  zxcvbnFeedback: Noni18text[]
  backendValidators: Record<string, I18key>
  backendErrors: I18key[]
}

const DEFAULT_STATE: State = {
  // SignupRequest
  email: '',
  username: '',
  password: '',
  dob: '',
  institutionId: '',
  // State
  confirmPassword: '',
  acceptEula: false,
  showPassword: false,
  zxcvbnScore: 0,
  zxcvbnFeedback: [],
  // From backend
  backendValidators: {},
  backendErrors: []
} as const

type LoginProps = {
  login?: boolean
  signup?: never
}

type SignupProps = {
  login?: never
  signup?: boolean
}

type Props = LoginProps | SignupProps

export function AuthenticatePanel(props: Props) {
  const { t } = useTranslation()

  const navigate = useNavigate()
  const location = useLocation()

  const [ state, setState ] = useState<State>({ ...DEFAULT_STATE })
  const [ isLoading, setLoading ] = useState<boolean>(false)

  const isLogin = !!props.login

  const {
    valid: signupValid,
    errors: signupErrors,
    sanitized: signupSanitized
  } = useValidator(
    userSignupValidator,
    state
  )

  const {
    valid: loginValid,
    errors: loginErrors,
    sanitized: loginSanitized
  } = useValidator(
    userLoginValidator,
    state
  )

  // Merge all validator errors into one object
  const errors = {
    ...state.backendValidators,
    ...(isLogin
      ? loginErrors
      : signupErrors
    )
  }

  // This also re-triggers on a hot reload:
  useEffect(() => {
    setState((state) => ({
      ...state,
      password: '',
      showPassword: false,
      zxcvbnScore: 0,
      zxcvbnFeedback: [],
      backendValidators: {},
      backendErrors: []
    }))
    setLoading(false)
  }, [ location.pathname ])

  const isValid: boolean = isLogin
    // Login mode:
    ? loginValid
    // Signup mode:
    : signupValid
      && MIN_ZXCVBN_STRENGTH <= state.zxcvbnScore
      && state.password === state.confirmPassword
      && state.acceptEula

  async function authenticate() {
    if (!isValid || isLoading) {
      return
    }
    setLoading(true)
    setState((state) => ({
      ...state,
      backendErrors: []
    }))

    try {
      if (isLogin) {
        const response = await userLogin(
          loginSanitized.username,
          loginSanitized.password
        )

        // If it was a successful login...
        if (response.success) {
          // Send the user on their way down the yellow brick road
          navigate(
            UrlTree.dashboard
          )
        }
        // If a unsuccessful login...
        else {
          setState((state) => ({
            ...state,
            backendErrors: response.errors
          }))
        }
      }
      else {
        const response = await userSignup(signupSanitized)

        // If it was a successful signup...
        if (response.success) {
          // Send the user on their way down the yellow brick road
          navigate(
            UrlTree.dashboard
          )
        }
        // If a unsuccessful signup...
        else {
          setState((state) => ({
            ...state,
            backendErrors: response.errors
          }))
        }
      }
    }
    catch (error: unknown) {
      if (error instanceof Error) {
        setState((state) => ({
          ...state,
          backendErrors: [
            error.message
          ]
        }))
      }
      else {
        console.error(error)
      }
    }
    finally {
      setLoading(false)
    }
  }

  return <form className='block'>
    {/* Logo */}
    <div className='block'>
      <Logo centered width={256} unClickable />
    </div>
    {/* Signup box */}
    <div className='block box'>
      <div className='block titles'>
        <h1 className='title'>{
          isLogin
            ? t('auth.sign-in')
            : t('auth.sign-up')
        }</h1>
        <h2 className='subtitle is-size-6'>{
          isLogin
            ? t('auth.login-subtitle')
            : t('auth.signup-subtitle')
        }</h2>
      </div>
      {
        isLogin
        // Login mode:
          ? <>
            <div className='field floating-label'>
              <Input
                autoFocus
                id='username'
                type='text'
                autoComplete='username'
                value={state.username}
                onChange={(event) => setState({ ...state, username: event.value })}
                placeholder={'common.username'}
                label={'common.username'}
                errorMessage={errors.username}
                onEnter={authenticate}
                max={64}
                min={1}
              />
            </div>
            <div className='field floating-label'>
              <div className='control'>
                <Input
                  id='password'
                  type={state.showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  value={state.password}
                  onChange={(event: any) => setState({ ...state, password: event.value })}
                  placeholder={'common.password'}
                  label={'common.password'}
                  errorMessage={errors.password}
                  onEnter={authenticate}
                  max={64}
                  min={1}
                />
                <a
                  className='input-overlay-action'
                  onClick={() => setState({ ...state, showPassword: !state.showPassword })}
                >{
                    state.showPassword
                      ? t('common.hide')
                      : t('common.show')
                  }</a>
              </div>
            </div>
            <InstitutionSearch />
            <div className='block'>
              <Link
                to={UrlTree.forgotPassword}
                state={{
                  email: state.username
                }}
              >{
                  t('auth.forgot-password.prompt')
                }</Link>
            </div>
            {
              state.backendErrors.length
                ? <div className='field'>
                  <DisplayErrors
                    centered
                    errors={state.backendErrors}
                  />
                </div>
                : <></>
            }
            <Button
              id='submit'
              primary
              fullwidth
              disabled={!isValid}
              onClick={authenticate}
              loading={isLoading}
            >
              <span>{ t('auth.sign-in') }</span>
            </Button>
          </>
        // Signup mode:
          : <>
            <div className='field'>
              <Input
                autoFocus
                id='email'
                type='email'
                icon={<FontAwesomeIcon icon={faEnvelope} />}
                autoComplete='email'
                value={state.email}
                onChange={(event) => setState({ ...state, email: event.value })}
                placeholder={'common.email'}
                label={'common.email'}
                errorMessage={errors.email}
                onEnter={authenticate}
                max={64}
                min={1}
              />
            </div>
            <div className='field'>
              <Input
                id='username'
                type='text'
                icon={<FontAwesomeIcon icon={faUser} />}
                autoComplete='username'
                value={state.username}
                onChange={(event) => setState({ ...state, username: event.value })}
                placeholder={'common.username'}
                label={'common.username'}
                errorMessage={errors.username}
                onEnter={authenticate}
                max={64}
                min={1}
              />
            </div>
            <div className='field'>
              <Input
                id='password'
                type={state.showPassword ? 'text' : 'password'}
                icon={<FontAwesomeIcon icon={state.showPassword ? faEye : faLock} />}
                autoComplete='new-password'
                value={state.password}
                onChange={(event: any) => setState({ ...state, password: event.value })}
                placeholder={'auth.create-password'}
                label={'auth.create-password'}
                onEnter={authenticate}
                max={64}
                min={1}
              />
              <a
                className='input-overlay-action'
                onClick={() => setState({ ...state, showPassword: !state.showPassword })}
              >{
                  state.showPassword
                    ? t('common.hide')
                    : t('common.show')
                }</a>
            </div>
            {
              state.password
                ? <div className='field'>
                  <PasswordStrength
                    password={state.password}
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
                        setState((state) => ({
                          ...state,
                          zxcvbnFeedback: feedbackAsArray,
                          zxcvbnScore: score
                        }))
                      }
                      else {
                        setState((state) => ({
                          ...state,
                          zxcvbnFeedback: null,
                          zxcvbnScore: score
                        }))
                      }
                    }}
                  />
                </div>
                : <></>
            }
            <div className='field is-size-7'>{
              state.password && (<>
                {
                  errors.password && <p className='help has-text-danger'>{
                    errors.password
                  }</p>
                }
                {
                  !errors.password && MIN_ZXCVBN_STRENGTH > state.zxcvbnScore && <p className='help has-text-danger'>{
                    t('auth.password-weak')
                  }</p>
                }
                {
                  state.zxcvbnFeedback?.map((feedback, index) => (
                    <Fragment key={index}>
                      <span className='has-text-warning'>• { feedback }</span>
                      <br />
                    </Fragment>
                  ))
                }
              </>)
            }</div>
            <div className='field'>
              <Input
                id='confirm-password'
                type={state.showPassword ? 'text' : 'password'}
                icon={<FontAwesomeIcon icon={state.showPassword ? faEye : faLock} />}
                autoComplete='new-password'
                value={state.confirmPassword}
                onChange={(event: any) => setState({ ...state, confirmPassword: event.value })}
                placeholder={'auth.confirm-password'}
                label={'auth.confirm-password'}
                onEnter={authenticate}
                errorMessage={state.confirmPassword !== state.password
                  ? t('auth.reset-password.passwords-mismatch')
                  : ''
                }
                max={64}
                min={1}
              />
            </div>
            <div className='field'>
              <Input
                id='birthday'
                type='date'
                autoComplete='bday'
                icon={<FontAwesomeIcon icon={faCalendarDay} />}
                value={state.dob}
                onChange={(event) => setState({ ...state, dob: event.value })}
                placeholder={'common.birthday'}
                label={'common.birthday'}
                className='is-clickable'
                onEnter={authenticate}
                errorMessage={errors.dob}
              />
              <a
                className='input-overlay-action'
                onClick={() => {
                  const dobInput: HTMLInputElement = document.querySelector('#birthday')
                  if (!dobInput) {
                    console.error('Could not find date of birth input')
                    return
                  }
                  dobInput.showPicker()
                }}
              >{
                  t('auth.pick-date')
                }</a>
            </div>
            <div className='field'>
              <div className='control is-flex'>
                <div>
                  <ToggleSwitch
                    rounded
                    primary
                    id='accept-eula'
                    checked={state.acceptEula}
                    onChange={(checked) => setState({ ...state, acceptEula: checked })}
                  />
                </div>
                <div>
                  <Trans
                    i18nKey='auth.eula'
                    values={{
                      terms: t('auth.terms'),
                      privacy: t('auth.privacy')
                    }}
                    components={{
                      terms: <Link key='terms' target='_blank' to={UrlTree.terms} />,
                      privacy: <Link key='privacy' target='_blank' to={UrlTree.privacy} />
                    }}
                  />
                </div>
              </div>
            </div>
            {
              state.backendErrors.length
                ? <div className='field'>
                  <DisplayErrors
                    centered
                    errors={state.backendErrors}
                  />
                </div>
                : <></>
            }
            <div className='field mt-4'>
              <Button
                id='submit'
                primary
                fullwidth
                className='mt-2'
                disabled={!isValid}
                onClick={authenticate}
                loading={isLoading}
                title={
                  !state.acceptEula
                    ? t('auth.eula-required')
                    : t('auth.sign-up')
                }
              >
                <span>{ t('auth.sign-up') }</span>
              </Button>
            </div>
          </>
      }
    </div>
    <div className='block has-text-centered'>
      {
        isLogin
          // Login mode, switch to signup text:
          ?<p>
            <span>{ t('auth.new-account') }</span>
            {' '}
            <strong>
              <Link to={UrlTree.signup}>
                <span>{ t('auth.join-now') }</span>
              </Link>
            </strong>
          </p>
          // Signup mode, switch to login text:
          : <p>
            <span>{ t('auth.already-account') }</span>
            {' '}
            <strong>
              <Link to={UrlTree.login}>
                <span>{ t('auth.sign-in') }</span>
              </Link>
            </strong>
          </p>
      }
    </div>
  </form>
}
