import React, { useState } from 'react';
import { X, Calendar, Download, Printer, Search, Bus, Filter, CheckCircle2 } from 'lucide-react';
import { BusRoute } from '../types';

interface ScheduleTableModalProps {
  routes: BusRoute[];
  onClose: () => void;
  onSelectRouteToBook: (route: BusRoute) => void;
}

export const ScheduleTableModal: React.FC<ScheduleTableModalProps> = ({
  routes,
  onClose,
  onSelectRouteToBook,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'City Routes' | 'DIU Shuttle' | 'Friday Schedule'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = routes.filter((r) => {
    const matchesFilter = activeFilter === 'All' || r.category === activeFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(q) ||
      r.routeNo.toLowerCase().includes(q) ||
      r.routeDetails.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-black">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                DIU Transport Schedule @ Daffodil Smart City (DSC)
              </h2>
              <span className="text-xs text-blue-200 font-semibold">
                Semester: Fall-2026 Official Transport Timetable
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls Toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {(['All', 'City Routes', 'DIU Shuttle', 'Friday Schedule'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f === 'All' ? 'All Schedules (21 Routes)' : f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by stop, route..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table View matching official document */}
        <div className="p-3 overflow-auto flex-1 text-xs">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-blue-50/70 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider sticky top-0">
                <th className="p-2.5">Route No</th>
                <th className="p-2.5 min-w-[130px]">Start Time (To DSC)</th>
                <th className="p-2.5 min-w-[150px]">Route Name</th>
                <th className="p-2.5 min-w-[280px]">Route Details</th>
                <th className="p-2.5 min-w-[140px]">Departure Time (From DSC)</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((route) => (
                <tr
                  key={route.id}
                  className="hover:bg-blue-50/40 transition-colors group text-slate-700 align-top"
                >
                  <td className="p-2.5 font-black text-blue-700 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-blue-100 rounded text-xs">
                      {route.routeNo}
                    </span>
                  </td>
                  <td className="p-2.5 whitespace-nowrap font-medium text-slate-900">
                    {route.startTimesToDSC.length > 0 ? (
                      <div className="space-y-0.5">
                        {route.startTimesToDSC.map((t, i) => (
                          <div key={i} className="inline-block bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-800 mr-1 mb-0.5">
                            {t}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-amber-600 font-bold">Coming Soon</span>
                    )}
                  </td>
                  <td className="p-2.5 font-bold text-slate-900">
                    {route.name}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {route.category}
                    </span>
                  </td>
                  <td className="p-2.5 text-[11px] text-slate-600 leading-relaxed max-w-sm">
                    {route.routeDetails}
                    {route.note && (
                      <div className="mt-1 text-[10px] text-blue-700 font-medium bg-blue-50 p-1 rounded">
                        Note: {route.note}
                      </div>
                    )}
                  </td>
                  <td className="p-2.5 whitespace-nowrap">
                    {route.departureTimesFromDSC.length > 0 ? (
                      <div className="space-y-0.5">
                        {route.departureTimesFromDSC.map((d, i) => (
                          <div key={i} className="inline-block bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded text-[11px] font-semibold mr-1 mb-0.5">
                            {d}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">TBA</span>
                    )}
                  </td>
                  <td className="p-2.5 text-center whitespace-nowrap">
                    {route.status === 'Active' ? (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectRouteToBook(route);
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer transition-colors"
                      >
                        Book Seat
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Unavailable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong>{filtered.length}</strong> of {routes.length} Fall 2026 routes
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Schedule
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
