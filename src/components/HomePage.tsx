import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  MapPin,
  Calendar,
  Compass,
  Ticket as TicketIcon,
  ChevronRight,
  Bus,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { BusRoute, BusTracking, Ticket, TransportNotice, UserProfile } from '../types';

interface HomePageProps {
  user: UserProfile;
  routes: BusRoute[];
  tracking: BusTracking;
  tickets: Ticket[];
  notices: TransportNotice[];
  onNavigate: (tab: 'home' | 'routes' | 'tracking' | 'tickets' | 'profile') => void;
  onSelectRoute: (route: BusRoute) => void;
  onOpenNotices: () => void;
  onOpenSchedule: () => void;
  onOpenSpringBoot: () => void;
  onOpenDrawer?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  routes,
  tracking,
  tickets,
  notices,
  onNavigate,
  onSelectRoute,
  onOpenNotices,
  onOpenSchedule,
  onOpenSpringBoot,
  onOpenDrawer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BusRoute[] | null>(null);

  const upcomingTicket = tickets.find((t) => t.bookingType === 'Upcoming');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = routes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.routeNo.toLowerCase().includes(q) ||
        r.stops.some((s) => s.toLowerCase().includes(q)) ||
        r.startPoint.toLowerCase().includes(q)
    );
    setSearchResults(matches);
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-800 pb-20">
      {/* Top Header matching Figma Screen 2 */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={onOpenDrawer}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-xs">
            D
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            DIU Transports
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenNotices}
          className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          title="Transport Notices"
        >
          <Bell className="w-5 h-5" />
          {notices.some((n) => n.important) && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Campus Hero Card matching Figma Screen 2 */}
        <div className="relative rounded-2xl overflow-hidden shadow-md group">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80"
            alt="Daffodil Smart City Campus"
            className="w-full h-36 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-3.5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 bg-blue-600/90 text-white text-[10px] font-bold rounded-md uppercase tracking-wider mb-1">
                  Daffodil Smart City
                </span>
                <h3 className="text-sm font-bold leading-tight">
                  Fall 2026 Regular Bus Transit
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-slate-900/60 backdrop-blur-sm px-2 py-1 rounded-md border border-emerald-500/30">
                ● Live Fleet Active
              </span>
            </div>
          </div>
        </div>

        {/* Hello Greeting & Destination Search matching Figma Screen 2 */}
        <div className="space-y-2">
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              Hello, {user.name.split(' ')[0]}!
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Where do you want to go today?
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destination (e.g. Dhanmondi, Uttara)"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Search result preview dropdown */}
          {searchResults && (
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Search Results ({searchResults.length})</span>
                <button
                  type="button"
                  onClick={() => setSearchResults(null)}
                  className="text-blue-600 hover:underline"
                >
                  Clear
                </button>
              </div>
              {searchResults.length === 0 ? (
                <p className="text-xs text-slate-400 py-2 text-center">
                  No matching DIU routes found. Try "Mirpur", "Uttara", or "Dhanmondi".
                </p>
              ) : (
                searchResults.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      onSelectRoute(r);
                      onNavigate('routes');
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-bold text-xs text-blue-700 mr-1.5">{r.routeNo}</span>
                      <span className="text-xs font-semibold text-slate-800">{r.name}</span>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{r.startPoint} ➔ {r.destination}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* 4 Main Action Buttons matching Figma Screen 2 */}
        <div className="grid grid-cols-4 gap-2.5 pt-1">
          {/* Routes */}
          <button
            type="button"
            onClick={() => onNavigate('routes')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all group active:scale-95"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
              <Bus className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-600">
              Routes
            </span>
          </button>

          {/* Schedule */}
          <button
            type="button"
            onClick={onOpenSchedule}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all group active:scale-95"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-600">
              Schedule
            </span>
          </button>

          {/* Live Tracking */}
          <button
            type="button"
            onClick={() => onNavigate('tracking')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group active:scale-95"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs relative">
              <Compass className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-emerald-600">
              Live Tracking
            </span>
          </button>

          {/* My Tickets */}
          <button
            type="button"
            onClick={() => onNavigate('tickets')}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all group active:scale-95"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
              <TicketIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 group-hover:text-amber-600">
              My Tickets
            </span>
          </button>
        </div>

        {/* Active Upcoming Pass Quick Glance (if available) */}
        {upcomingTicket && (
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-3.5 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                Active Digital Pass
              </span>
              <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                {upcomingTicket.busNumber}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm">{upcomingTicket.routeName}</h4>
                <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  Departure: {upcomingTicket.departureTime} (Seat #{upcomingTicket.seatNumber})
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('tickets')}
                className="px-3 py-1.5 bg-white text-blue-900 rounded-xl text-xs font-bold shadow hover:bg-blue-50 transition-colors"
              >
                View Pass
              </button>
            </div>
          </div>
        )}

        {/* Quick Access Section matching Figma Screen 2 */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Quick Access
          </h3>

          {/* Nearest Bus Card */}
          <button
            type="button"
            onClick={() => onNavigate('tracking')}
            className="w-full text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Nearest Bus
                </h4>
                <p className="text-[11px] text-slate-500">
                  See nearest bus from your location
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Transport Notice Card */}
          <button
            type="button"
            onClick={onOpenNotices}
            className="w-full text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Transport Notice
                </h4>
                <p className="text-[11px] text-slate-500">
                  Check latest updates and notices
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Live Tracking Widget Preview */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <h4 className="text-xs font-bold text-slate-900">Live Campus Bus</h4>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {tracking.busNumber}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">{tracking.routeName}</span>
            <span className="text-slate-400">{tracking.currentSpeedKm} km/h</span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${tracking.progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Main Campus</span>
              <span className="font-bold text-blue-600">
                Next: {tracking.stops[tracking.currentStopIndex]?.name || 'Daffodil Smart City'} ({tracking.nextStopEtaMinutes} min)
              </span>
              <span>DSC Permanent</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tracking')}
            className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-slate-200/70 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Open Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Developer & Backend Spring Boot Architecture Banner */}
        <button
          type="button"
          onClick={onOpenSpringBoot}
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-emerald-950 to-slate-900 text-white border border-emerald-800/40 shadow-sm flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Java Spring Boot & Thymeleaf Backend
                <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                  v3.3.3
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                View Controller, Security JWT, JPA Entity & Thymeleaf SSR code
              </p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
