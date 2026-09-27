import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCw,
  Bus,
  CheckCircle2,
  Circle,
  Phone,
  Navigation,
  Play,
  Pause,
  Clock,
  Gauge,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { BusRoute, BusTracking } from '../types';
import { buildBusTracking, getAvailableBuses } from '../data/busTracking';

interface LiveTrackingPageProps {
  tracking: BusTracking;
  routes: BusRoute[];
  onBack: () => void;
  onUpdateTracking: (updated: BusTracking) => void;
}

export const LiveTrackingPage: React.FC<LiveTrackingPageProps> = ({
  tracking,
  routes,
  onBack,
  onUpdateTracking,
}) => {
  const [isSimulating, setIsSimulating] = useState(true);
  const availableBuses = getAvailableBuses(routes);

  // Live simulation tick: every 3 seconds advance progress or coordinates
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      onUpdateTracking({
        ...tracking,
        progressPercentage: (tracking.progressPercentage + 4) % 100,
        currentSpeedKm: Math.floor(28 + Math.random() * 15),
        currentCoordIndex: (tracking.currentCoordIndex + 1) % tracking.coordinates.length,
        lastUpdated: 'Just now',
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isSimulating, tracking, onUpdateTracking]);

  const handleNextStop = () => {
    const nextIdx = (tracking.currentStopIndex + 1) % tracking.stops.length;
    const updatedStops = tracking.stops.map((s, idx) => {
      if (idx < nextIdx) return { ...s, status: 'Departed' as const };
      if (idx === nextIdx) return { ...s, status: 'Arrived' as const };
      return { ...s, status: 'Upcoming' as const };
    });

    onUpdateTracking({
      ...tracking,
      currentStopIndex: nextIdx,
      stops: updatedStops,
      nextStopEtaMinutes: nextIdx === tracking.stops.length - 1 ? 2 : 7,
      progressPercentage: Math.round(((nextIdx + 1) / tracking.stops.length) * 100),
    });
  };

  const handleRefresh = () => {
    onUpdateTracking({
      ...tracking,
      currentSpeedKm: 35,
      lastUpdated: 'Refreshed',
    });
  };

  // Coordinates on interactive SVG route
  const currentCoord =
    tracking.coordinates[tracking.currentCoordIndex] || { x: 50, y: 50 };

  return (
    <div className="min-h-full bg-slate-100 text-slate-800 flex flex-col justify-between pb-18">
      {/* Top Header matching Figma Screen 4 */}
      <div className="bg-white px-4 py-3 border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">
              Live Tracking
            </h1>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Demo GPS Tracking
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors active:rotate-180"
          title="Refresh Live Data"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3 py-2 bg-white border-b border-slate-200">
        <label htmlFor="mobile-tracking-bus" className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
          Available buses ({availableBuses.length})
        </label>
        <select
          id="mobile-tracking-bus"
          value={tracking.busNumber}
          onChange={(event) => {
            const busIndex = availableBuses.findIndex((bus) => bus.busNumber === event.target.value);
            const selectedBus = availableBuses[busIndex];
            if (selectedBus) {
              onUpdateTracking(buildBusTracking(selectedBus, tracking, busIndex));
            }
          }}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableBuses.map(({ busNumber, route }) => (
            <option key={busNumber} value={busNumber}>
              {busNumber} - {route.name}
            </option>
          ))}
        </select>
      </div>

      {/* Interactive Map Visualizer matching Figma Screen 4 */}
      <div className="relative w-full h-[270px] bg-slate-200 overflow-hidden border-b border-slate-300 select-none">
        {/* SVG Map Canvas: Corridors from Dhaka to Daffodil Smart City (Birulia/Ashulia) */}
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#cbd5e1" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Background grid */}
          <rect width="100" height="100" fill="#f1f5f9" />
          <rect width="100" height="100" fill="url(#grid)" opacity="0.6" />

          {/* Waterway / Turag River curve */}
          <path
            d="M 10 100 Q 40 70 45 40 T 70 0"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Secondary Arterial roads */}
          <path d="M 0 50 L 100 50" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
          <path d="M 30 100 L 30 0" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
          <path d="M 70 100 L 70 0" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />

          {/* Bus Route Path (Dhanmondi / Mirpur -> Gabtoli -> Beribadh -> Birulia -> Daffodil Smart City) */}
          <path
            d="M 18 72 Q 28 55 45 42 T 82 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Active progress glow line */}
          <path
            d="M 18 72 Q 28 55 45 42 T 82 24"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="100"
            strokeDashoffset={`${100 - tracking.progressPercentage}`}
            className="transition-all duration-700"
          />

          {/* Landmark Stops */}
          {/* 1. DIU Main Campus / Sobhanbag */}
          <circle cx="18" cy="72" r="3" fill="#1e40af" stroke="#fff" strokeWidth="1" />
          <text x="18" y="79" fontSize="3.2" fontWeight="bold" fill="#1e293b" textAnchor="middle">
            DIU Main Campus
          </text>

          {/* 2. Gabtoli / Technical Mor */}
          <circle cx="38" cy="46" r="2.5" fill="#64748b" stroke="#fff" strokeWidth="1" />
          <text x="38" y="52" fontSize="2.8" fill="#475569" textAnchor="middle">
            Gabtoli / Birulia
          </text>

          {/* 3. Daffodil Smart City Main Gate */}
          <circle cx="68" cy="32" r="3" fill="#0284c7" stroke="#fff" strokeWidth="1" />
          <text x="68" y="38" fontSize="3.2" fontWeight="bold" fill="#0369a1" textAnchor="middle">
            Daffodil Smart City
          </text>

          {/* 4. DIU Permanent Campus (DSC) */}
          <circle cx="82" cy="24" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
          <text x="82" y="19" fontSize="3.2" fontWeight="extrabold" fill="#047857" textAnchor="middle">
            DIU Permanent Campus
          </text>

          {/* Real-time Animating Bus Pin */}
          <g
            transform={`translate(${currentCoord.x}, ${currentCoord.y})`}
            className="transition-transform duration-700 ease-out"
          >
            {/* Pulse rings */}
            <circle cx="0" cy="0" r="6" fill="#3b82f6" opacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
            {/* Bus vehicle label */}
            <rect x="-10" y="-13" width="20" height="7" rx="2" fill="#1e293b" />
            <text x="0" y="-8" fontSize="2.5" fontWeight="bold" fill="#ffffff" textAnchor="middle">
              {tracking.busNumber.split('-')[2] || '1203'}
            </text>
          </g>
        </svg>

        {/* Floating live status overlay */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-2">
          <Gauge className="w-4 h-4 text-blue-600" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Speed</div>
            <div className="text-xs font-black text-slate-900">{tracking.currentSpeedKm} km/h</div>
          </div>
        </div>

        {/* Floating Simulation toggle control */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              isSimulating
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isSimulating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isSimulating ? 'Simulating' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Route & Stop Tracking Sheet matching Figma Screen 4 */}
      <div className="p-4 space-y-3 bg-white flex-1">
        {/* Bus Info Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              {tracking.routeName}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-blue-600">
                Bus No: {tracking.busNumber}
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[11px] text-slate-500">
                {tracking.occupiedSeats}/{tracking.totalSeats} passengers
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
            {tracking.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Current Status</div>
            <div className="text-xs font-bold text-emerald-700 mt-0.5">{tracking.status}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Destination ETA</div>
            <div className="text-xs font-bold text-blue-700 mt-0.5">{tracking.nextStopEtaMinutes} min</div>
          </div>
        </div>

        {/* Live Timeline matching Figma Screen 4 */}
        <div className="space-y-3.5 py-1">
          {tracking.stops.map((stop, index) => {
            const isDeparted = stop.status === 'Departed';
            const isArrived = stop.status === 'Arrived';
            const isUpcoming = stop.status === 'Upcoming';

            return (
              <div key={index} className="flex items-start gap-3">
                {/* Status Indicator Icon */}
                <div className="mt-0.5 shrink-0">
                  {isDeparted && (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  {isArrived && (
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center relative">
                      <Circle className="w-3.5 h-3.5 fill-blue-600" />
                      <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75" />
                    </div>
                  )}
                  {isUpcoming && (
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                      <Circle className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Stop Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isArrived ? 'text-blue-700' : isDeparted ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {stop.name}
                    </span>
                    <span className="text-[11px] font-bold text-slate-600">
                      {stop.actualTime || stop.scheduledTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span
                      className={`font-semibold ${
                        isArrived ? 'text-blue-600' : isDeparted ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {stop.status}
                    </span>
                    {isArrived && (
                      <span className="text-blue-600 font-bold">
                        ETA: {tracking.nextStopEtaMinutes} min
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Driver Contact & Simulation Step Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
              👨‍✈️
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{tracking.driverName}</div>
              <div className="text-[10px] text-slate-500">{tracking.driverPhone}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {tracking.driverPhone !== 'Not provided' && (
              <a
                href={`tel:${tracking.driverPhone}`}
                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                title="Call Driver"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <button
              type="button"
              onClick={handleNextStop}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Advance Stop ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
