import React, { useState } from 'react';
import { ArrowLeft, Search, Bus, Clock, MapPin, Users, CheckCircle2, ChevronRight, AlertTriangle, Calendar } from 'lucide-react';
import { BusRoute, RouteCategory } from '../types';

interface RoutesPageProps {
  routes: BusRoute[];
  onBack: () => void;
  onSelectRouteForTracking: (route: BusRoute) => void;
  onBookSeat: (route: BusRoute) => void;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({
  routes,
  onBack,
  onSelectRouteForTracking,
  onBookSeat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RouteCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRouteModal, setActiveRouteModal] = useState<BusRoute | null>(null);

  const categories: RouteCategory[] = ['All', 'City Routes', 'DIU Shuttle', 'Friday Schedule'];

  const filteredRoutes = routes.filter((route) => {
    const matchesCategory =
      selectedCategory === 'All' || route.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      route.name.toLowerCase().includes(q) ||
      route.routeNo.toLowerCase().includes(q) ||
      route.startPoint.toLowerCase().includes(q) ||
      route.destination.toLowerCase().includes(q) ||
      route.stops.some((s) => s.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-full bg-slate-50 text-slate-800 pb-20">
      {/* Top Header matching Figma Screen 3 */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200/80 sticky top-0 z-20 flex items-center gap-3 shadow-xs">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-extrabold text-slate-900">Routes</h1>
        <span className="ml-auto text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {filteredRoutes.length} Available
        </span>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Search Bar matching Figma Screen 3 */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search route or location"
            className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips matching Figma Screen 3 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? 'All Routes' : cat}
            </button>
          ))}
        </div>

        {/* Routes List matching Figma Screen 3 */}
        <div className="space-y-2.5">
          {filteredRoutes.map((route) => {
            const isUnavailable = route.status === 'Temporarily Unavailable';

            return (
              <div
                key={route.id}
                onClick={() => setActiveRouteModal(route)}
                className={`w-full p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-left group cursor-pointer ${
                  isUnavailable ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Bus icon badge */}
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Bus className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-blue-100/80 text-blue-800 text-[10px] font-black rounded-md">
                          {route.routeNo}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 truncate">
                          {route.name}
                        </h3>
                      </div>
                      {isUnavailable ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                          Coming Soon
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      <span className="font-semibold text-slate-700">{route.startPoint}</span>
                      <span className="mx-1 text-slate-400">➔</span>
                      <span>{route.destination}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      {route.frequency && (
                        <span className="text-blue-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {route.frequency}
                        </span>
                      )}
                      {route.startTimesToDSC.length > 0 && (
                        <span>
                          Start: {route.startTimesToDSC[0]}
                        </span>
                      )}
                      <span className="ml-auto font-bold text-slate-700">
                        {route.availableSeats} seats left
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 self-center transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Route Detail Modal */}
      {activeRouteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-black">
                  {activeRouteModal.routeNo}
                </span>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">
                    {activeRouteModal.name}
                  </h3>
                  <span className="text-[10px] text-blue-100">
                    {activeRouteModal.category}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveRouteModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-700">
              {/* Note / Alert */}
              {activeRouteModal.note && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    {activeRouteModal.note}
                  </span>
                </div>
              )}

              {/* Schedule Timing Box */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Morning (To DSC)
                  </span>
                  {activeRouteModal.startTimesToDSC.length > 0 ? (
                    <div className="space-y-1">
                      {activeRouteModal.startTimesToDSC.map((t, idx) => (
                        <span key={idx} className="inline-block mr-1 px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">Coming soon</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Return (From DSC)
                  </span>
                  {activeRouteModal.departureTimesFromDSC.length > 0 ? (
                    <div className="space-y-1">
                      {activeRouteModal.departureTimesFromDSC.map((t, idx) => (
                        <span key={idx} className="inline-block mr-1 px-2 py-0.5 bg-slate-200 text-slate-800 font-bold rounded text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">Coming soon</span>
                  )}
                </div>
              </div>

              {/* Stops Timeline */}
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Route Stops & Pickups ({activeRouteModal.stops.length})
                </h4>
                <div className="relative pl-5 border-l-2 border-blue-200 space-y-3 my-2">
                  {activeRouteModal.stops.map((stop, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-white border-2 border-blue-600" />
                      <div className="font-semibold text-slate-800 text-[11px]">{stop}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Fleet */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Fleet</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {activeRouteModal.activeBuses.length > 0
                      ? activeRouteModal.activeBuses.join(', ')
                      : 'Standby Fleet'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Seats</span>
                  <span className="font-bold text-emerald-600 text-xs">
                    {activeRouteModal.availableSeats} of {activeRouteModal.totalSeats}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onSelectRouteForTracking(activeRouteModal);
                  setActiveRouteModal(null);
                }}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-100 text-blue-700 font-bold rounded-xl border border-slate-300 text-xs transition-colors cursor-pointer"
              >
                Track Live Bus
              </button>
              <button
                type="button"
                disabled={activeRouteModal.status === 'Temporarily Unavailable'}
                onClick={() => {
                  onBookSeat(activeRouteModal);
                  setActiveRouteModal(null);
                }}
                className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                Book Seat / Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
