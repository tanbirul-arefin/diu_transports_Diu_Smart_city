import React from 'react';
import { Home, Bus, Ticket as TicketIcon, User, Compass } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'routes' | 'tracking' | 'tickets' | 'profile';
  onSelectTab: (tab: 'home' | 'routes' | 'tracking' | 'tickets' | 'profile') => void;
  ticketCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  ticketCount = 0,
}) => {
  return (
    <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 z-30 flex items-center justify-around shadow-lg">
      {/* Home */}
      <button
        type="button"
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'home' ? 'text-blue-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* Routes */}
      <button
        type="button"
        onClick={() => onSelectTab('routes')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'routes' ? 'text-blue-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Bus className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Routes</span>
      </button>

      {/* Tracking */}
      <button
        type="button"
        onClick={() => onSelectTab('tracking')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
          activeTab === 'tracking' ? 'text-emerald-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Tracking</span>
        <span className="absolute top-0.5 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
      </button>

      {/* Tickets / My Pass (Highlighted center-right badge matching Figma) */}
      <button
        type="button"
        onClick={() => onSelectTab('tickets')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
          activeTab === 'tickets' ? 'text-blue-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className="relative">
          <TicketIcon className="w-5 h-5" />
          {ticketCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
              {ticketCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Tickets</span>
      </button>

      {/* Profile */}
      <button
        type="button"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          activeTab === 'profile' ? 'text-blue-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </div>
  );
};
