import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const { login, loading } = useAuth();
  const { language } = useNotifications();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    try {
      await login(email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleQuickDemoLogin = async () => {
    const demoEmail = 'admin@ourvillage.tn.gov.in';
    const demoPass = 'Admin@12345';
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);

    try {
      await login(demoEmail, demoPass);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-8 text-white text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-3xl shadow-lg mb-4">
            🌾
          </div>
          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Authentication Gateway</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            OUR VILLAGE ADMIN
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Nesal Village & Villupuram District Crawler Management
          </p>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-start space-x-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Administrator Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ourvillage.tn.gov.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-emerald-700 disabled:bg-slate-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Default Admin Credentials</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Ready to Use
              </span>
            </div>

            <div className="text-xs font-mono bg-white p-2.5 rounded-xl border border-emerald-100 space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Email:</span>
                <span className="font-bold select-all text-slate-900">admin@ourvillage.tn.gov.in</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Password:</span>
                <span className="font-bold select-all text-emerald-800">Admin@12345</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs font-bold py-2 px-3 rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>1-Click Auto Fill & Sign In</span>
            </button>
          </div>

          {/* Back to Public View */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Return to Public Village Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
