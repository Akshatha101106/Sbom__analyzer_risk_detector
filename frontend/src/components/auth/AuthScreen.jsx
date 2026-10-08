import React, { useState } from 'react';
import { authenticate } from '../../services/api';
import { ShieldIcon } from '../common/Icons';

export function AuthScreen({ onAuthenticated, initialError = '' }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(initialError);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const user = await authenticate(email, password, mode);
      await onAuthenticated(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090d16] px-4 py-12 flex items-center justify-center text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-[#1b253b] bg-[#101726] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-600/15">
            <ShieldIcon className="h-7 w-7 text-blue-400" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">SBOM Risk &amp; Trust Auditor</p>
          <h1 className="mt-3 text-2xl font-bold">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-sm text-slate-400">
            {mode === 'login' ? 'Sign in to securely access your SBOM scans.' : 'Create an account to start auditing your SBOMs.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-xs font-semibold text-slate-300">Email address</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[#253659] bg-[#0d1320] px-3 py-3 text-sm outline-none transition focus:border-blue-500"
              placeholder="you@company.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-slate-300">Password</span>
            <input
              type="password"
              name="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={mode === 'register' ? 8 : undefined}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-[#253659] bg-[#0d1320] px-3 py-3 text-sm outline-none transition focus:border-blue-500"
              placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'}
            />
            {mode === 'register' && (
              <span className="block text-[11px] text-slate-500">Use at least 8 characters; passwords are limited to 72 UTF-8 bytes.</span>
            )}
          </label>

          {error && <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {mode === 'login' ? 'New to the auditor?' : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>
        <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-500">
          Your password is securely hashed on the backend. Authentication uses an HttpOnly session cookie.
        </p>
      </section>
    </main>
  );
}
