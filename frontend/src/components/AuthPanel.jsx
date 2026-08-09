import { useState } from 'react';

function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'Something went wrong.');
      return;
    }

    setMessage(mode === 'signup' ? 'Account created.' : 'Signed in.');
    onAuth(data);
  };

  return (
    <form className="auth-panel" onSubmit={handleSubmit}>
      <h3>{mode === 'signup' ? 'Create account' : 'Sign in'}</h3>
      <label>
        Username
        <input value={username} onChange={(event) => setUsername(event.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      <button type="submit">{mode === 'signup' ? 'Create account' : 'Sign in'}</button>
      <button type="button" className="link-button" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
        {mode === 'signup' ? 'Already have an account?' : 'Create an account'}
      </button>
      {message ? <p className="hint">{message}</p> : null}
    </form>
  );
}

export default AuthPanel;
