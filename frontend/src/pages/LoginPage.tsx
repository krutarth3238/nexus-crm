import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Chrome,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NexusLogo } from '../components/common/NexusLogo';

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

type Mode = 'signin' | 'signup';

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const {
    login,
    register,
    loginWithGoogle,
    isAuthenticated,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');

  /* Sign-in */
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siShowPw, setSiShowPw] = useState(false);

  /* Sign-up */
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');
  const [suShowPw, setSuShowPw] = useState(false);

  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isAuthenticated) onNavigate?.('dashboard');
  }, [isAuthenticated, onNavigate]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setLocalError('');
    clearError();
  };

  const displayError = localError || error;

  /* ── Sign In ── */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    if (!siEmail.trim()) return setLocalError('Email is required.');
    if (!siPassword) return setLocalError('Password is required.');
    try { await login(siEmail.trim(), siPassword); } catch { /* from context */ }
  };

  /* ── Sign Up ── */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();
    if (!suName.trim()) return setLocalError('Full name is required.');
    if (!suEmail.trim()) return setLocalError('Email is required.');
    if (suPassword.length < 6) return setLocalError('Password must be at least 6 characters.');
    if (suPassword !== suConfirm) return setLocalError('Passwords do not match.');
    try { await register(suEmail.trim(), suPassword, suName.trim()); } catch { /* from context */ }
  };

  /* ── Google ── */
  const handleGoogle = async () => {
    setLocalError('');
    clearError();
    try { await loginWithGoogle(); } catch { /* from context */ }
  };

  const inputCls =
    'w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#FF4400] focus:ring-2 focus:ring-[#FF4400]/15 disabled:opacity-50';

  const labelCls =
    'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7280]';

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex">

      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-[#FF4400] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/2 right-8 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative z-10">
          <NexusLogo variant="mark" size={36} id="login-brand-logo" color="#ffffff" />
        </div>

        <div className="relative z-10">
          <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/60 mb-4">
            NEXUS.CRM // ZERO-DRAG ENTERPRISE SUPPORT CORE
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            RADICAL<br />INCIDENT<br />VELOCITY.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            High-cadence support cockpit built for engineering-led teams.
            Instant search, shared Kanban, sub-millisecond SLA triage.
          </p>

          <div className="mt-10 flex flex-col gap-3">
            {['Sub-ms ticket search', 'Shared Kanban pipeline', 'Real-time SLA analytics'].map(
              (feat) => (
                <div key={feat} className="flex items-center gap-2.5 text-sm text-white/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  {feat}
                </div>
              )
            )}
          </div>
        </div>

        <div className="relative z-10 text-[11px] font-mono text-white/40">
          FOR ISSUES — krutarth.a@somaiya.edu
        </div>
      </div>

      {/* ── Right auth panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex items-center gap-2">
          <NexusLogo variant="mark" size={28} id="login-mobile-logo" />
          <span className="font-black text-lg text-[#111827]">NEXUS.CRM</span>
        </div>

        <div className="w-full max-w-md">
          {/* Tab switcher */}
          <div className="flex rounded-xl bg-[#F3F4F6] p-1 mb-8 gap-1">
            {(['signin', 'signup'] as Mode[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => switchMode(key)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === key
                    ? 'bg-white text-[#FF4400] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {key === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#111827]">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                {mode === 'signin'
                  ? 'Sign in to your Nexus CRM workspace.'
                  : 'Get started — your account will be ready instantly.'}
              </p>
            </div>

            {/* Error */}
            {displayError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {displayError}
              </div>
            )}

            {/* ── SIGN IN ── */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="si-email" className={labelCls}>Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    <input
                      id="si-email"
                      type="email"
                      value={siEmail}
                      onChange={(e) => setSiEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="si-password" className={labelCls}>Password</label>
                  <div className="relative">
                    <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    <input
                      id="si-password"
                      type={siShowPw ? 'text' : 'password'}
                      value={siPassword}
                      onChange={(e) => setSiPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className={`${inputCls} pl-10 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setSiShowPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                      tabIndex={-1}
                    >
                      {siShowPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF4400] hover:bg-[#E63D00] active:bg-[#CC3600] px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 mt-2"
                >
                  {isLoading
                    ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
                    : <>Sign in <ArrowRight size={16} /></>}
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">or</span>
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#374151] transition disabled:opacity-60"
                >
                  {isLoading
                    ? <Loader2 size={16} className="animate-spin text-[#9CA3AF]" />
                    : <Chrome size={16} className="text-[#4285F4]" />}
                  Continue with Google
                </button>
              </form>
            )}

            {/* ── SIGN UP ── */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label htmlFor="su-name" className={labelCls}>Full name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    <input
                      id="su-name"
                      type="text"
                      value={suName}
                      onChange={(e) => setSuName(e.target.value)}
                      placeholder="Jane Smith"
                      autoComplete="name"
                      disabled={isLoading}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="su-email" className={labelCls}>Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    <input
                      id="su-email"
                      type="email"
                      value={suEmail}
                      onChange={(e) => setSuEmail(e.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="su-password" className={labelCls}>Password</label>
                  <div className="relative">
                    <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    <input
                      id="su-password"
                      type={suShowPw ? 'text' : 'password'}
                      value={suPassword}
                      onChange={(e) => setSuPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className={`${inputCls} pl-10 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setSuShowPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                      tabIndex={-1}
                    >
                      {suShowPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="su-confirm" className={labelCls}>Confirm password</label>
                  <div className="relative">
                    <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    <input
                      id="su-confirm"
                      type={suShowPw ? 'text' : 'password'}
                      value={suConfirm}
                      onChange={(e) => setSuConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF4400] hover:bg-[#E63D00] active:bg-[#CC3600] px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 mt-2"
                >
                  {isLoading
                    ? <><Loader2 size={16} className="animate-spin" /> Creating account…</>
                    : <>Create account <ArrowRight size={16} /></>}
                </button>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">or</span>
                  <div className="h-px flex-1 bg-[#E5E7EB]" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] px-4 py-3 text-sm font-medium text-[#374151] transition disabled:opacity-60"
                >
                  {isLoading
                    ? <Loader2 size={16} className="animate-spin text-[#9CA3AF]" />
                    : <Chrome size={16} className="text-[#4285F4]" />}
                  Sign up with Google
                </button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-[#9CA3AF]">
            Authentication handled securely via JWT &amp; Firebase.
          </p>
        </div>
      </div>
    </main>
  );
}
