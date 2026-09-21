import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { signIn, isLoading, operator } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const targetEmail = email.trim() || operator.email || 'mdnoor4860@gmail.com';
    const result = await signIn(targetEmail, password || undefined);

    if (result.success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setErrorMessage(result.error || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div
      id="login-page-container"
      className="w-full min-h-screen bg-white flex flex-col justify-center items-center px-6 py-10 selection:bg-blue-100"
    >
      <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center">
        {/* Center top: App Logo */}
        <div
          id="login-logo-wrapper"
          className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-amber-300 bg-amber-400 flex items-center justify-center p-2 mb-3.5"
        >
          <img
            id="login-logo-image"
            src="/logo.svg"
            alt="SmartRun Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Below of logo: SmartRun Store  Operation */}
        <p
          id="login-store-operation-title"
          className="text-base font-bold text-slate-800 tracking-tight text-center mb-6"
        >
          SmartRun Store  Operation
        </p>

        {/* Below of it: Sign in heading */}
        <h1
          id="login-sign-in-heading"
          className="text-2xl font-black text-slate-900 tracking-tight text-center mb-8"
        >
          Sign in
        </h1>

        {/* Error notification banner */}
        {errorMessage && (
          <div
            id="login-error-message"
            className="w-full mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-left animate-fade-in"
          >
            {errorMessage}
          </div>
        )}

        {/* Sign in form */}
        <form
          id="login-form"
          onSubmit={handleSubmit}
          className="w-full flex flex-col"
        >
          {/* Email heading left side and below of horizontal line to write email */}
          <div className="w-full mb-6 text-left">
            <label
              htmlFor="login-email-input"
              className="block text-sm font-semibold text-slate-700 text-left mb-1.5"
            >
              Email
            </label>
            <input
              id="login-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              className="w-full py-2.5 bg-transparent text-slate-900 text-base placeholder:text-slate-400 border-0 border-b-2 border-slate-300 focus:border-blue-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Password heading left side and horizontal line to fill password */}
          <div className="w-full mb-8 text-left">
            <label
              htmlFor="login-password-input"
              className="block text-sm font-semibold text-slate-700 text-left mb-1.5"
            >
              Password
            </label>
            <div className="relative flex items-center border-b-2 border-slate-300 focus-within:border-blue-600 transition-colors">
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full py-2.5 pr-10 bg-transparent text-slate-900 text-base placeholder:text-slate-400 border-0 focus:outline-none"
              />
              <button
                id="toggle-password-visibility-btn"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2 cursor-pointer transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-500" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>
          </div>

          {/* Below of it: Sign in button */}
          <button
            id="login-submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-base shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
