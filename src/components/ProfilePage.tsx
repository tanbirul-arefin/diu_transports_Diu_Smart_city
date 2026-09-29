import React, { useState } from 'react';
import {
  User,
  CreditCard,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  Wallet,
  CheckCircle2,
  Sparkles,
  ImagePlus,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigateTickets: () => void;
  onOpenSpringBoot: () => void;
  onUpdateUser: (user: UserProfile) => Promise<void>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onLogout,
  onNavigateTickets,
  onOpenSpringBoot,
  onUpdateUser,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editName, setEditName] = useState(user.name);
  const [editStudentId, setEditStudentId] = useState(user.studentId);
  const [editPicture, setEditPicture] = useState(user.avatarUrl);
  const [editPictureName, setEditPictureName] = useState('');
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editRoute, setEditRoute] = useState(user.preferredRoute);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('200');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError('');
    try {
      await onUpdateUser({
        ...user,
        name: editName,
        studentId: editStudentId,
        avatarUrl: editPicture,
        phone: editPhone,
        preferredRoute: editRoute,
      });
      setActiveModal(null);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Could not save your profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleEditPicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      setProfileError('Choose an image smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setEditPicture(typeof reader.result === 'string' ? reader.result : user.avatarUrl);
      setEditPictureName(file.name);
      setProfileError('');
    };
    reader.readAsDataURL(file);
  };

  const handleTopUp = () => {
    const amt = parseInt(topUpAmount, 10) || 0;
    onUpdateUser({
      ...user,
      walletBalance: user.walletBalance + amt,
    });
    setActiveModal(null);
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-800 pb-20">
      {/* Profile Header matching Figma Screen 6 */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-6 rounded-b-3xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-18 h-18 rounded-2xl object-cover ring-4 ring-white/20 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-blue-900 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold truncate">{user.name}</h2>
            </div>
            <p className="text-xs font-mono font-semibold text-blue-200 mt-0.5">
              ID: {user.studentId}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-blue-100 mt-0.5 truncate">
              <Building2 className="w-3 h-3 shrink-0" />
              <span>{user.department}</span>
            </div>
            <p className="text-[10px] text-blue-300 font-medium">
              {user.campus}
            </p>
          </div>
        </div>

        {/* Semester Pass Badge */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Transport Fee: {user.transportFeeStatus} (Fall 2026)</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('wallet')}
            className="bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Wallet className="w-3 h-3" />
            <span>৳{user.walletBalance} BDT</span>
          </button>
        </div>
      </div>

      {/* Menu List matching Figma Screen 6 */}
      <div className="p-4 space-y-2">
        {/* Edit Profile */}
        <button
          type="button"
          onClick={() => setActiveModal('editProfile')}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
              Edit Profile
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* My Bookings */}
        <button
          type="button"
          onClick={onNavigateTickets}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
              My Bookings
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Payment Methods */}
        <button
          type="button"
          onClick={() => setActiveModal('wallet')}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 block text-left">
                Payment Methods & Wallet
              </span>
              <span className="text-[10px] text-slate-400 block text-left">
                bKash, Nagad, Student Card (Balance: ৳{user.walletBalance})
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Notification Settings */}
        <button
          type="button"
          onClick={() => setActiveModal('notifications')}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
              Notification Settings
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Help & Support */}
        <button
          type="button"
          onClick={() => setActiveModal('help')}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
              Help & Support
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* About DIU Transports */}
        <button
          type="button"
          onClick={() => setActiveModal('about')}
          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
              About DIU Transports
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Spring Boot Backend Architecture Option */}
        <button
          type="button"
          onClick={onOpenSpringBoot}
          className="w-full p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs hover:bg-emerald-100/70 transition-all flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
              ☕
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-emerald-950 block">
                Spring Boot & Thymeleaf Architecture
              </span>
              <span className="text-[10px] text-emerald-700 block">
                Explore Java Backend & REST APIs requested in prompt
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 transition-all" />
        </button>

        {/* Logout matching Figma Screen 6 */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="w-full p-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100/80 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {activeModal === 'editProfile' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-slate-900">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Profile Picture</label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 p-2.5">
                  <img src={editPicture} alt="Profile preview" className="h-10 w-10 rounded-full object-cover" />
                  <span className="flex min-w-0 items-center gap-2 truncate text-slate-600">
                    <ImagePlus className="h-4 w-4 shrink-0" />
                    {editPictureName || 'Choose a new image (up to 2 MB)'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleEditPicture} className="sr-only" />
                </label>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Student ID</label>
                <input
                  type="text"
                  required
                  maxLength={40}
                  value={editStudentId}
                  onChange={(e) => setEditStudentId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferred Daily Route</label>
                <input
                  type="text"
                  value={editRoute}
                  onChange={(e) => setEditRoute(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>
              {profileError && <p role="alert" className="rounded-lg bg-rose-50 p-2 text-rose-700">{profileError}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2 bg-slate-100 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold shadow disabled:opacity-60"
                >
                  {isSavingProfile ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet / Payment Modal */}
      {activeModal === 'wallet' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">DIU Student Transit Wallet</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
              <span className="text-xs text-blue-600 font-bold uppercase">Current Balance</span>
              <div className="text-2xl font-black text-blue-900 mt-1">৳{user.walletBalance} BDT</div>
              <span className="text-[10px] text-slate-500">Connected to DIU Student ID #{user.studentId}</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Top-Up Amount (BDT)</label>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {['100', '200', '500'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-1.5 text-xs font-bold rounded-xl border ${
                      topUpAmount === amt ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleTopUp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition-colors"
              >
                Recharge via bKash / Nagad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-slate-900">DIU Transport Helpdesk</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  Transport Office (DSC Campus)
                </div>
                <p className="text-[11px]">Ground Floor, Central Administrative Building, Daffodil Smart City, Ashulia.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Emergency Hotline
                </div>
                <p className="text-[11px] font-mono font-bold text-emerald-700">+880 1847-140000 / +880 1713-493050</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Official Email
                </div>
                <p className="text-[11px] font-mono text-blue-700">transport@daffodilvarsity.edu.bd</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-3 shadow-xl text-xs">
            <h3 className="text-sm font-extrabold text-slate-900">About DIU Transports</h3>
            <p className="text-slate-600 leading-relaxed">
              Official fleet tracking and digital pass management application for Daffodil International University (DIU), connecting students, faculty, and administrative staff across Dhaka and Daffodil Smart City (DSC).
            </p>
            <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] space-y-1 text-slate-500">
              <div><strong>Version:</strong> 2.4.0 (Fall-2026 Release)</div>
              <div><strong>Campus:</strong> Daffodil Smart City, Birulia, Savar</div>
              <div><strong>Backend API:</strong> Java Spring Boot 3.3.3 + JPA + PostgreSQL</div>
              <div><strong>Frontend:</strong> React 19 + Vite + Tailwind CSS + Thymeleaf SSR</div>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
