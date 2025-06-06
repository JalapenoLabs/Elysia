// Copyright © 2025 Elysia

// Core
import { Fragment, useState } from 'react'

// Typescript
import type { UpdateUserRequest } from '@/api/routes/users/update'
import type { Noni18text } from '@/types'

// Redux
import { useSelector } from '@/framework/redux-store'

// Iconography
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'

// UI
import { Button, Modal, Input } from 'bulma-smart-react-forms'
import { DisplayErrors } from '@/api/DisplayErrors'
import { PasswordStrength } from '@/interface/widget/PasswordStrength'

// API
import { userUpdate, updateUserValidator } from '@/api/routes/users/update'
import { yup, passwordSignupValidator } from '@/framework/validators'

// Utiliity
import { useBackendFormProxy } from '@/api/apiHooks'
import { useTranslation } from 'react-i18next'

// Constants
import { UrlTree, MIN_ZXCVBN_STRENGTH } from '@/constants'

export function Profile() {
  const { t } = useTranslation()

  const user = useSelector((state) => state.auth.user)

  // API
  const userForm = useBackendFormProxy<UpdateUserRequest>(
    userUpdate,
    updateUserValidator,
    user
  )

  console.debug({
    userForm
  })

  return <div className='container is-max-desktop super-padding-bottom'>
    <div className='subcontainer is-small'>
      <h1 className='title'>{
        t('auth.your-account')
      }</h1>
      <div className='block box is-fullwidth'>
        <div className='field'>
          <Input
            id='username'
            type='text'
            label={t('common.username')}
            placeholder={t('common.username')}
            value={userForm.proxy.username}
            onChange={({ value }) => userForm.setField('username', value)}
            onEnter={userForm.submit}
            errorMessage={userForm.errors.username}
            showErrorWhileEmpty
            max={64}
          />
        </div>
        <div className='field'>
          <Input
            id='email'
            type='email'
            label={t('common.email')}
            placeholder={t('common.email')}
            value={userForm.proxy.email}
            onChange={({ value }) => userForm.setField('email', value)}
            onEnter={userForm.submit}
            errorMessage={userForm.errors.email}
            showErrorWhileEmpty
            max={150}
          />
        </div>

        <DisplayErrors asBlock centered errors={userForm.errors?._} />
        <DisplayErrors asBlock centered errors={userForm.response?.errors} />

        <div className='field mt-4'>
          <Button
            id='save-account'
            primary
            fullwidth
            rounded
            loading={userForm.isLoading}
            disabled={!userForm.valid || !userForm.hasChanged}
            onClick={userForm.submit}
          >
            <span>{ t('auth.save-account') }</span>
          </Button>
        </div>
      </div>

      <div className='block'>
        <ResetPassword />
      </div>

      <div className='block buttons is-centered'>
        <Button
          as='a'
          id='terms'
          fullwidth
          className='has-text-link'
          href={UrlTree.terms}
          target='_blank'
          rel='noreferrer'
        >
          <span>{ t('auth.terms') }</span>
        </Button>
        <Button
          as='a'
          id='privacy'
          fullwidth
          className='has-text-link'
          href={UrlTree.privacy}
          target='_blank'
          rel='noreferrer'
        >
          <span>{ t('auth.privacy') }</span>
        </Button>
      </div>
    </div>
  </div>
}

type ResetPasswordState = UpdateUserRequest & {
  confirmPassword?: string
}

const defaultResetPasswordState = {
  password: '',
  confirmPassword: ''
}

function ResetPassword() {
  const { t } = useTranslation()

  const [ active, setActive ] = useState<boolean>(false)
  const [ zxcvbnFeedback, setZxcvbnFeedback ] = useState<Noni18text[] | null>(null)
  const [ zxcvbnScore, setZxcvbnScore ] = useState<number | null>(null)

  // API
  const passwordForm = useBackendFormProxy<ResetPasswordState>(
    userUpdate,
    yup.object().shape({
      password: passwordSignupValidator.clone(),
      confirmPassword: passwordSignupValidator.clone()
    }),
    defaultResetPasswordState,
    [ active ]
  )

  const Trigger = <Button
    id='change-password'
    fullwidth
    primary
    outlined
    onClick={() => setActive(true)}
  >
    <span className='icon'>
      <FontAwesomeIcon icon={faKey} />
    </span>
    <span>{ t('auth.change-password') }</span>
  </Button>

  if (!active) {
    return Trigger
  }

  console.debug(passwordForm)

  async function submit() {
    const result = await passwordForm.submit()
    if (result.success) {
      setActive(false)
    }
    // TOOD: Toast a success here
  }

  const isValid = passwordForm.valid
    && passwordForm.proxy.password === passwordForm.proxy.confirmPassword

  return <>
    { Trigger }
    <Modal
      id='reset-password-modal'
      show={true}
      onClose={() => setActive(false)}
      title={t('auth.change-password')}
      actions={[
        {
          id: 'cancel',
          onClick: () => setActive(false),
          text: t('common.cancel')
        },
        {
          id: 'submit',
          primary: true,
          onClick: submit,
          disabled: !isValid,
          loading: passwordForm.isLoading,
          text: t('auth.set-new-password')
        }
      ]}
    >
      {/* TODO: These should all be wrapped into one super re-usable password helper / wrapper component */}
      <div className='field'>
        <Input
          autoFocus
          id='password'
          type='password'
          label={t('common.password')}
          placeholder={t('common.password')}
          value={passwordForm.proxy.password}
          onChange={({ value }) => passwordForm.setField('password', value)}
          onEnter={submit}
          max={64}
        />
      </div>
      <div className='field'>
        <Input
          id='confirm-password'
          type='password'
          label={t('auth.confirm-password')}
          placeholder={t('auth.confirm-password')}
          value={passwordForm.proxy.confirmPassword}
          onChange={({ value }) => passwordForm.setField('confirmPassword', value)}
          errorMessage={passwordForm.proxy.confirmPassword !== passwordForm.proxy.password
            ? t('auth.reset-password.passwords-mismatch')
            : undefined
          }
          onEnter={submit}
          max={64}
        />
      </div>
      <div className='field'>
        <PasswordStrength
          password={passwordForm.proxy.password}
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
              setZxcvbnScore(score)
            }
            else {
              setZxcvbnFeedback(null)
              setZxcvbnScore(score)
            }
          }}
        />
      </div>
      <div className='field is-size-7'>{
        passwordForm.proxy.password && (<>
          <DisplayErrors errors={passwordForm.errors.password} />
          {
            !passwordForm.errors.password && MIN_ZXCVBN_STRENGTH > zxcvbnScore && <p className='help has-text-danger'>{
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
          {/* TODO: Backend error messages? */}
        </>)
      }</div>
    </Modal>
  </>
}
