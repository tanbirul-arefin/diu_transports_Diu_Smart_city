import React, { useState } from 'react';
import { ArrowRight, Bus, Eye, EyeOff, ImagePlus, Lock, Mail, User } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const inputClassName = 'w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [picture, setPicture] = useState('');
  const [pictureName, setPictureName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeRequested, setIsCodeRequested] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Choose a profile picture smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPicture(typeof reader.result === 'string' ? reader.result : '');
      setPictureName(file.name);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const sendVerificationCode = async () => {
    setError('');
    setNotice('');
    if (!email.trim().toLowerCase().endsWith('@diu.edu.bd')) {
      setError('Use your @diu.edu.bd email address.');
      return;
    }
    setIsCodeRequested(true);
    setIsCodeSent(false);
    setIsEmailVerified(false);
    setIsSendingCode(true);
    try {
      const response = await fetch('/api/v1/auth/email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not send the verification code.');
      setIsCodeSent(true);
      setVerificationCode('');
      setNotice('A verification code was sent to your DIU email. It is valid for 10 minutes.');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Could not send the verification code.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyEmail = async () => {
    setError('');
    setNotice('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'That code could not be verified.');
      setIsEmailVerified(true);
      setNotice('DIU email verified. You can create your account now.');
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'That code could not be verified.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (isRegistering && !isEmailVerified) {
      setError('Verify your @diu.edu.bd email before creating your account.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/auth/${isRegistering ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegistering
          ? { name, username, studentId, email, password, picture }
          : { email, studentId, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not sign in. Please try again.');
      onLoginSuccess(result as UserProfile);
    } catch (submitError) {
      setError(submitError instanceof TypeError
        ? 'Could not connect to the server. Please make sure the transport backend is running.'
        : submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegistering((current) => !current);
    setError('');
    setNotice('');
    setPassword('');
    setIsCodeRequested(false);
    setIsCodeSent(false);
    setIsEmailVerified(false);
    setVerificationCode('');
  };

  return (
    <div className="min-h-full flex flex-col justify-center bg-gradient-to-b from-slate-50 via-sky-50/50 to-slate-100 p-5 text-slate-800 sm:p-7">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-900/20">
            <Bus className="h-8 w-8" />
          </div>
          <p className="text-xs font-bold uppercase text-blue-700">Daffodil International University</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-950">DIU Transports</h1>
          <p className="mt-1 text-sm text-slate-500">Your official ride, every day</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-slate-900">{isRegistering ? 'Create your account' : 'Welcome back'}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isRegistering ? 'Use your DIU email and student information.' : 'Sign in with your DIU email, Student ID, and password.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {isRegistering && (
              <>
                <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                  Full name
                  <span className="relative block">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <input required maxLength={80} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className={`${inputClassName} pl-10`} />
                  </span>
                </label>
                <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                  Username
                  <input required minLength={3} maxLength={32} pattern="[a-zA-Z0-9._\-]+" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Choose a username" className={inputClassName} />
                </label>
              </>
            )}

            {isRegistering && (
              <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                Student ID
                <input required maxLength={40} autoComplete="off" value={studentId} onChange={(event) => setStudentId(event.target.value)} placeholder="Your DIU student ID" className={inputClassName} />
              </label>
            )}

            <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
              DIU email
              <span className="relative block">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input required type="email" pattern={isRegistering ? ".+@diu[.]edu[.]bd" : undefined} maxLength={254} autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setIsEmailVerified(false); setIsCodeRequested(false); setIsCodeSent(false); setVerificationCode(''); setNotice(''); }} placeholder="name@diu.edu.bd" className={`${inputClassName} pl-10`} />
              </span>
              {isRegistering && <span className="block text-[11px] font-normal text-slate-500">Registration requires an email ending in @diu.edu.bd.</span>}
            </label>

            {!isRegistering && (
              <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                Student ID
                <input required maxLength={40} autoComplete="username" value={studentId} onChange={(event) => setStudentId(event.target.value)} placeholder="Your DIU student ID" className={inputClassName} />
              </label>
            )}

            {isRegistering && (
              <div className="space-y-2">
                <button type="button" disabled={isSendingCode || !email} onClick={sendVerificationCode} className="w-full rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-800 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50">
                  {isSendingCode ? 'Sending code…' : isCodeRequested ? 'Resend verification code' : 'Send verification code'}
                </button>
                {isCodeRequested && (
                  <div className="flex gap-2">
                    <input aria-label="Verification code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={verificationCode} onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit code" className={`${inputClassName} min-w-0`} />
                    <button type="button" disabled={!isCodeSent || isLoading || verificationCode.length !== 6} onClick={verifyEmail} className="shrink-0 rounded-xl bg-slate-800 px-3 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50">
                      Verify
                    </button>
                  </div>
                )}
                {isCodeRequested && !isCodeSent && !isSendingCode && error && <p className="text-[11px] text-slate-500">The code field is ready, but no code was delivered. Email verification must be configured before you can continue.</p>}
                {isEmailVerified && <p className="text-xs font-semibold text-emerald-700">DIU email verified</p>}
              </div>
            )}

            <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
              Password
              <span className="relative block">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input required minLength={isRegistering ? 8 : undefined} maxLength={72} type={showPassword ? 'text' : 'password'} autoComplete={isRegistering ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegistering ? 'At least 8 characters' : 'Your password'} className={`${inputClassName} pl-10 pr-11`} />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            {isRegistering && (
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-slate-700">Profile picture</span>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 hover:border-blue-400 hover:bg-blue-50/50">
                  {picture ? <img src={picture} alt="Profile preview" className="h-11 w-11 rounded-full object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-700"><ImagePlus className="h-5 w-5" /></span>}
                  <span className="min-w-0 flex-1 truncate text-xs text-slate-600">{pictureName || 'Choose a profile picture, up to 2 MB'}</span>
                  <input required={!picture} type="file" accept="image/*" onChange={handlePictureChange} className="sr-only" />
                </label>
              </div>
            )}

            {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{notice}</p>}
            {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

            <button type="submit" disabled={isLoading || (isRegistering && !isEmailVerified)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading ? 'Please wait…' : isRegistering ? 'Create account' : 'Login'}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-600">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={switchMode} className="font-bold text-blue-700 hover:text-blue-900">
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};