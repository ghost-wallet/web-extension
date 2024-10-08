import { useState, useMemo } from 'react'
import { i18n } from 'webextension-polyfill'

enum PasswordErrors {
  TooShort,
}

export default function Password({
  onPasswordSet,
}: {
  onPasswordSet: (password: string) => void
}) {
  const [password, setPassword] = useState('')
  const [isHidden, setIsHidden] = useState(true)

  const errors = useMemo(() => {
    const errors = new Set<PasswordErrors>()

    if (password.length < 8) errors.add(PasswordErrors.TooShort)

    return errors
  }, [password])

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        padding: '1rem',
      }}
    >
      <h1>{i18n.getMessage('setPassword')}</h1>
      <p>{i18n.getMessage('passwordDescription')}</p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '15rem',
          gap: '1rem',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            id="password"
            placeholder={i18n.getMessage('password')}
            type={isHidden ? 'password' : 'text'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => {
              if (e.key !== 'Enter' || password === '') return
              onPasswordSet(password)
            }}
            style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
          />
          <button
            onClick={() => setIsHidden(!isHidden)}
            style={{
              marginLeft: '0.5rem',
              padding: '0.5rem',
              cursor: 'pointer',
            }}
          >
            {isHidden ? '👁️' : '🙈'}
          </button>
        </div>
        <label
          style={{
            fontSize: '0.875rem',
            color: errors.has(PasswordErrors.TooShort) ? 'red' : 'green',
          }}
        >
          {errors.has(PasswordErrors.TooShort) ? '❌ ' : '✅ '}
          {i18n.getMessage('passwordTooShort')}
        </label>
      </div>
      <div style={{ margin: '0 auto' }}>
        <button
          disabled={errors.size > 0}
          onClick={() => onPasswordSet(password)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem',
            cursor: 'pointer',
          }}
        >
          ➡️ {i18n.getMessage('confirm')}
        </button>
      </div>
    </main>
  )
}
