import React, { useState } from 'react';
import { Bus, User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  initialUser: UserProfile;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, initialUser }) => {
  const [diuId, setDiuId] = useState('262-40-017');
  const [password, setPassword] = useState('diu@fall2026');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diuId.trim()) {
      setError('Please enter your DIU Student or Faculty ID');
      return;
    }
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...initialUser,
        studentId: diuId,
      });
    }, 450);
  };

  const handleQuickFill = (id: string, name: string, dept: string) => {
    setDiuId(id);
    setPassword('diu@2026');
    setError('');
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-gradient-to-b from-slate-50 via-sky-50/40 to-slate-100 p-6 text-slate-800">
      {/* Top Graphic / Branding matching Figma screen 1 */}
      <div className="pt-6 flex flex-col items-center text-center">
        {/* DIU Transports Logo Badge */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/25 flex items-center justify-center text-white ring-4 ring-blue-100">
            <Bus className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -bottom-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            Fall 2026
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/70 border border-blue-200/80 rounded-full text-blue-700 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          Daffodil International University
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          DIU TRANSPORTS
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Your official ride, every day
        </p>
      </div>

      {/* Main Form Box */}
      <div className="my-auto py-4">
        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/80">
          <h2 className="text-base font-bold text-slate-800 mb-1">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Sign in with your DIU Student or Employee credentials
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* DIU ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                DIU ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={diuId}
                  onChange={(e) => setDiuId(e.target.value)}
                  placeholder="Enter your DIU ID (e.g. 262-40-017)"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('For student password recovery, please contact DIU IT Support or Transport Office (Ashulia DSC).')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              One-Click Demo Profiles:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('262-40-017', 'Ishrat Jahan Ahona', 'MCT')}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 transition-colors text-[11px]"
              >
                <div className="font-bold text-slate-800">Ishrat (Photo ID)</div>
                <div className="text-slate-500">262-40-017</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('251-15-863', 'DIU Student', 'CSE')}
                className="text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 transition-colors text-[11px]"
              >
                <div className="font-bold text-slate-800">User Email ID</div>
                <div className="text-slate-500">251-15-863</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="text-center pt-2 pb-4">
        <p className="text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => alert('New students are registered automatically via DIU Student Portal. Contact DSC Transport Office: transport@diu.edu.bd')}
            className="font-bold text-blue-600 hover:underline"
          >
            Contact Admin
          </button>
        </p>
        <div className="mt-2 text-[10px] text-slate-400">
          Daffodil Smart City, Birulia, Savar, Dhaka
        </div>
      </div>
    </div>
  );
};
