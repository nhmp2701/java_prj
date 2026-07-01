/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { UserSession } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (session: UserSession) => void;
  defaultEmail: string;
}

export default function AuthScreen({ onLoginSuccess, defaultEmail }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!isLogin) {
      if (!firstName || !lastName) {
        setError('Please enter your first and last name');
        return;
      }
      if (!agreedToTerms) {
        setError('You must agree to the Terms of Service and Privacy Policy');
        return;
      }
    }

    if (isLogin) {
      fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'Login failed') }).catch(() => { throw new Error('Invalid email or password') });
        }
        return res.json();
      })
      .then(apiRes => {
        if (apiRes.success && apiRes.data && apiRes.data.token) {
          const token = apiRes.data.token;
          localStorage.setItem('token', token);
          
          // Fetch user profile info
          return fetch('http://localhost:8080/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(res => {
            if (!res.ok) throw new Error('Failed to retrieve profile');
            return res.json();
          })
          .then(profileRes => {
            if (profileRes.success && profileRes.data) {
              const profile = profileRes.data;
              const nameParts = profile.username ? profile.username.split(' ') : ['User', ''];
              onLoginSuccess({
                email: profile.email,
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(' '),
                isLoggedIn: true,
                role: profile.role,
                username: profile.username,
                token: token
              });
            } else {
              throw new Error(profileRes.message || 'Failed to fetch profile details');
            }
          });
        } else {
          throw new Error(apiRes.message || 'Invalid authentication token');
        }
      })
      .catch(err => {
        setError(err.message || 'Connection error. Please check if backend is running.');
      });
    } else {
      fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: `${firstName} ${lastName}`.trim(),
          email,
          password
        })
      })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'Registration failed') }).catch(() => { throw new Error('Registration failed. Email might be in use.') });
        }
        return res.json();
      })
      .then(apiRes => {
        if (apiRes.success) {
          setIsLogin(true);
          setError('Registration successful! Please login with your new credentials.');
          setPassword('');
        } else {
          throw new Error(apiRes.message || 'Registration failed');
        }
      })
      .catch(err => {
        setError(err.message || 'Connection error. Please check if backend is running.');
      });
    }
  };


  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative py-12 select-none overflow-hidden">
      {/* Decorative floating blurred background elements */}
      <div className="fixed top-20 right-[15%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="fixed bottom-20 left-[10%] w-96 h-96 bg-primary-container/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative w-full max-w-[460px]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="font-display-lg text-4xl font-extrabold text-primary mb-2 tracking-tight">
            Manga Management System
          </h1>
          <p className="text-on-surface-variant text-sm font-medium">
            The professional workspace for digital storytellers.
          </p>
        </div>

        {/* glass container */}
        <div className="glass-panel p-8 md:p-10 rounded-[24px] long-soft-shadow relative overflow-hidden bg-white/60">
          
          {isLogin ? (
            /* Login panel */
            <div>
              <div className="mb-6 relative">
                <h2 className="text-2xl font-bold text-on-surface mb-1">Welcome back</h2>
                <p className="text-sm text-on-surface-variant">
                  Enter your credentials to continue creating.
                </p>
                <div className="absolute top-0 right-0 text-primary/20 pointer-events-none">
                  <Sparkles size={36} />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-error-container/30 border border-error/20 text-error text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-on-surface-variant">Password</label>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-container text-on-primary-container font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-4 cursor-pointer text-sm"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-sm text-on-surface-variant font-medium">Don't have an account? </span>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  className="text-sm text-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Register now
                </button>
              </div>
            </div>
          ) : (
            /* Register panel */
            <div>
              <div className="mb-6 relative">
                <h2 className="text-2xl font-bold text-on-surface mb-1">Start creating</h2>
                <p className="text-sm text-on-surface-variant">
                  Join the community of professional manga artists.
                </p>
                <div className="absolute top-0 right-0 text-primary/20 pointer-events-none">
                  <Sparkles size={36} />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-error-container/30 border border-error/20 text-error text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant ml-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jane"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant ml-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@studio.com"
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant ml-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>

                <div className="flex items-start gap-3 py-1">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    id="terms-checkbox"
                    className="mt-1 w-4 h-4 rounded text-primary border-outline-variant focus:ring-primary-container cursor-pointer"
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-on-surface-variant cursor-pointer">
                    I agree to the{' '}
                    <span className="text-primary font-semibold hover:underline">Terms of Service</span> and{' '}
                    <span className="text-primary font-semibold hover:underline">Privacy Policy</span>.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-container text-on-primary-container font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-2 cursor-pointer text-sm"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-sm text-on-surface-variant font-medium">Already have an account? </span>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                  className="text-sm text-primary font-bold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Log in here
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer links */}
        <footer className="flex justify-center gap-6 mt-8">
          <a href="#" className="text-xs text-outline hover:text-primary transition-colors font-medium">Help Center</a>
          <a href="#" className="text-xs text-outline hover:text-primary transition-colors font-medium">Privacy</a>
          <a href="#" className="text-xs text-outline hover:text-primary transition-colors font-medium">Contact</a>
        </footer>
      </div>
    </div>
  );
}
