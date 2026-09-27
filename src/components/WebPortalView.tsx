import React, { useState } from 'react';
import {
  Bus,
  Calendar,
  Compass,
  Ticket as TicketIcon,
  Bell,
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  Printer,
  ChevronRight,
  ExternalLink,
  Users,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { BusRoute, BusTracking, Ticket, TransportNotice, UserProfile, RouteCategory } from '../types';
import { QRCodeView } from './QRCodeView';

interface WebPortalViewProps {
  user: UserProfile;
  routes: BusRoute[];
  tracking: BusTracking;
  tickets: Ticket[];
  notices: TransportNotice[];
  onOpenBookingModal: (route?: BusRoute) => void;
  onOpenScheduleModal: () => void;
  onOpenNoticesModal: () => void;
  onOpenSpringBootModal: () => void;
  onViewTicket: (ticket: Ticket) => void;
  onUpdateTracking: (updated: BusTracking) => void;
}

export const WebPortalView: React.FC<WebPortalViewProps> = ({
  user,
  routes,
  tracking,
  tickets,
  notices,
  onOpenBookingModal,
  onOpenScheduleModal,
  onOpenNoticesModal,
  onOpenSpringBootModal,
  onViewTicket,
  onUpdateTracking,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'tracking' | 'tickets'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<RouteCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedTrackingBus, setSelectedTrackingBus] = useState(tracking.busNumber);

  const availableBuses = routes.flatMap((route) =>
    route.status === 'Active'
      ? route.activeBuses.map((busNumber) => ({ busNumber, route }))
      : []
  );
  const selectedBus = availableBuses.find((bus) => bus.busNumber === selectedTrackingBus)
    ?? availableBuses.find((bus) => bus.busNumber === tracking.busNumber)
    ?? availableBuses[0];
  const selectedBusIndex = selectedBus
    ? availableBuses.findIndex((bus) => bus.busNumber === selectedBus.busNumber)
    : -1;
  const hasLiveTracking = selectedBus?.busNumber === tracking.busNumber;
  const progressPercentage = hasLiveTracking
    ? tracking.progressPercentage
    : 12 + (Math.max(selectedBusIndex, 0) * 17) % 75;
  const currentCoordIndex = hasLiveTracking
    ? tracking.currentCoordIndex
    : Math.round((progressPercentage / 100) * (tracking.coordinates.length - 1));
  const currentStopIndex = hasLiveTracking
    ? tracking.currentStopIndex
    : Math.min(
        Math.floor((progressPercentage / 100) * (selectedBus?.route.stops.length ?? 1)),
        (selectedBus?.route.stops.length ?? 1) - 1
      );
  const currentLocation = selectedBus?.route.stops[currentStopIndex] ?? 'Location unavailable';
  const currentSpeed = hasLiveTracking
    ? tracking.currentSpeedKm
    : 25 + (Math.max(selectedBusIndex, 0) * 7) % 16;
  const currentStatus = hasLiveTracking ? tracking.status : 'Scheduled';
  const destinationEta = hasLiveTracking
    ? tracking.nextStopEtaMinutes
    : Math.max(2, Math.ceil((100 - progressPercentage) / 10));
  const occupiedSeats = selectedBus
    ? selectedBus.route.totalSeats - selectedBus.route.availableSeats
    : tracking.occupiedSeats;
  const driverName = hasLiveTracking ? tracking.driverName : 'Driver details unavailable';
  const driverPhone = hasLiveTracking ? tracking.driverPhone : 'Not provided';

  const filteredRoutes = routes.filter((route) => {
    const matchesCategory =
      selectedCategory === 'All' || route.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    return (
      matchesCategory &&
      (route.name.toLowerCase().includes(q) ||
        route.routeNo.toLowerCase().includes(q) ||
        route.stops.some((s) => s.toLowerCase().includes(q)))
    );
  });

  const upcomingTickets = tickets.filter((t) => t.bookingType === 'Upcoming');

  const metricDetails: Record<string, { title: string; summary: string; items: string[] }> = {
    routes: {
      title: 'Available routes',
      summary: `${routes.length} routes are loaded for Fall 2026.`,
      items: routes.slice(0, 5).map((route) => `${route.routeNo}: ${route.name} - ${route.availableSeats} seats available`),
    },
    buses: {
      title: 'Buses currently on road',
      summary: 'GPS-tracked buses are available for live monitoring.',
      items: routes
        .flatMap((route) => route.activeBuses.map((bus) => `${bus} - ${route.name}`))
        .slice(0, 8),
    },
    loop: {
      title: 'Campus loop availability',
      summary: 'The DIU Campus Loop connects Main Campus and DSC.',
      items: ['Frequency: Every 15 min', 'Next departure: 09:30 AM', 'Available seats: 14', 'Stops: Main Campus, DSC Main Gate, Permanent Campus'],
    },
    friday: {
      title: 'Jummah special availability',
      summary: 'Friday-only buses are scheduled for student transit.',
      items: ['Morning departure: 7:30 AM', 'Return departure: 2:20 PM', 'Category: Friday Schedule', 'Seat booking is available from Book Seat Pass'],
    },
  };

  const handleRouteAvailabilityClick = (route: BusRoute) => {
    setSelectedMetric(null);
    if (route.status === 'Active') {
      onOpenBookingModal(route);
      return;
    }

    setSearchQuery(route.routeNo);
    setActiveTab('routes');
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top University Portal Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight">
                DIU Transports Web Portal
              </h1>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-[10px] font-bold">
                Fall 2026 @ DSC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Daffodil International University • Daffodil Smart City, Birulia, Savar
            </p>
          </div>
        </div>

        {/* Portal Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenScheduleModal}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Full Schedule Table</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenBookingModal()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <TicketIcon className="w-3.5 h-3.5" />
            <span>Book Seat Pass</span>
          </button>

          {/* Student Profile Pill */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/40"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
              <div className="text-[10px] text-slate-400 font-mono">ID: {user.studentId}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col md:flex-row gap-6">
        {/* Left Navigation & Highlights Sidebar */}
        <aside className="w-full md:w-64 space-y-4 shrink-0">
          {/* Navigation Pill Menu */}
          <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Overview & Live Fleet</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('routes')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'routes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Bus Routes ({routes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>GPS Tracking Console</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('tickets')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === 'tickets'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <TicketIcon className="w-4 h-4" />
              <span>My Passes ({upcomingTickets.length})</span>
            </button>
          </div>

          {/* Student Status Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Student Pass
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ● Active
              </span>
            </div>
            <div>
              <div className="text-sm font-black text-white">{user.name}</div>
              <div className="text-xs text-slate-400">{user.department}</div>
              <div className="text-xs text-slate-500 font-mono mt-0.5">ID: {user.studentId}</div>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Transit Wallet:</span>
              <span className="font-bold text-emerald-400">৳{user.walletBalance} BDT</span>
            </div>
          </div>

          {/* Emergency Hotline Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Transport Office Hotline
            </div>
            <div className="text-[11px] text-slate-400 leading-relaxed">
              DSC Campus Bus Terminal, Daffodil Smart City.
            </div>
            <div className="font-mono text-emerald-400 font-bold text-xs pt-1">
              +880 1847-140000
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button type="button" onClick={() => setSelectedMetric('routes')} className="text-left bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/70 transition-colors space-y-1 cursor-pointer">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Routes
              </span>
              <div className="text-2xl font-black text-white">21 Routes</div>
              <span className="text-[10px] text-blue-400">10 Regular + 6 Shuttle + 5 Friday</span>
            </button>

            <button type="button" onClick={() => setSelectedMetric('buses')} className="text-left bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/70 transition-colors space-y-1 cursor-pointer">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Buses On Road
              </span>
              <div className="text-2xl font-black text-emerald-400">14 Live</div>
              <span className="text-[10px] text-slate-400">GPS Tracked Fleet</span>
            </button>

            <button type="button" onClick={() => setSelectedMetric('loop')} className="text-left bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/70 transition-colors space-y-1 cursor-pointer">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Campus Loop
              </span>
              <div className="text-2xl font-black text-blue-400">Every 15 min</div>
              <span className="text-[10px] text-slate-400">Main Campus ➔ DSC</span>
            </button>

            <button type="button" onClick={() => setSelectedMetric('friday')} className="text-left bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/70 transition-colors space-y-1 cursor-pointer">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Jummah Special
              </span>
              <div className="text-2xl font-black text-indigo-400">Friday Buses</div>
              <span className="text-[10px] text-slate-400">7:30 AM & 2:20 PM</span>
            </button>
          </div>

          {selectedMetric && (
            <section className="bg-slate-950 p-5 rounded-2xl border border-blue-500/40 space-y-3" aria-live="polite">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-white">{metricDetails[selectedMetric].title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{metricDetails[selectedMetric].summary}</p>
                </div>
                <button type="button" onClick={() => setSelectedMetric(null)} className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer">Close</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedMetric === 'routes'
                  ? routes.slice(0, 5).map((route) => (
                      <button
                        key={route.id}
                        type="button"
                        onClick={() => handleRouteAvailabilityClick(route)}
                        className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs text-slate-200 hover:border-blue-500 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {route.routeNo}: {route.name} - {route.availableSeats} seats available
                        <span className="block text-[10px] text-blue-400 mt-1">
                          {route.status === 'Active' ? 'Click to book a seat' : 'Click to view route status'}
                        </span>
                      </button>
                    ))
                  : metricDetails[selectedMetric].items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (selectedMetric === 'buses' || selectedMetric === 'loop') {
                            setSelectedMetric(null);
                            setActiveTab('tracking');
                          } else if (selectedMetric === 'friday') {
                            onOpenScheduleModal();
                          }
                        }}
                        className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs text-slate-200 hover:border-blue-500 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        {item}
                        <span className="block text-[10px] text-blue-400 mt-1">
                          {selectedMetric === 'friday' ? 'Click to open full schedule' : 'Click to open live tracking'}
                        </span>
                      </button>
                    ))}
              </div>
            </section>
          )}

          {/* Active Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Split Live Bus Tracking & Digital Pass Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Bus Widget */}
                <div className="lg:col-span-2 bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <h3 className="text-base font-bold text-white">
                          Live Bus Monitor: {tracking.routeName}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Bus ID: {tracking.busNumber} • Driver: {tracking.driverName} ({tracking.driverPhone})
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold">
                      Speed: {tracking.currentSpeedKm} km/h
                    </span>
                  </div>

                  {/* Route progress stops */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {tracking.stops.map((stop, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          stop.status === 'Arrived'
                            ? 'bg-blue-950/60 border-blue-600 text-blue-300'
                            : stop.status === 'Departed'
                            ? 'bg-slate-900 border-slate-700 text-slate-300'
                            : 'bg-slate-900/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase">{stop.status}</div>
                        <div className="text-xs font-bold text-white truncate mt-0.5">{stop.name}</div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {stop.actualTime || stop.scheduledTime}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400">
                      ETA to DSC Permanent Campus: <strong>{tracking.nextStopEtaMinutes} minutes</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tracking')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Open Full Screen Map
                    </button>
                  </div>
                </div>

                {/* Digital QR Pass Card */}
                <div className="bg-gradient-to-b from-blue-900/40 to-slate-950 p-5 rounded-3xl border border-blue-800/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                        Active Digital Pass
                      </span>
                      <span className="text-xs font-bold text-emerald-400">Fall 2026</span>
                    </div>

                    {upcomingTickets.length > 0 ? (
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-base font-extrabold text-white">
                            {upcomingTickets[0].routeName}
                          </h4>
                          <p className="text-xs text-blue-300 font-semibold">
                            Seat #{upcomingTickets[0].seatNumber} • Bus {upcomingTickets[0].busNumber}
                          </p>
                        </div>
                        <div className="flex justify-center py-2">
                          <QRCodeView data={upcomingTickets[0].qrData} size={110} />
                        </div>
                        <div className="text-[10px] font-mono text-center text-slate-400">
                          Booking ID: {upcomingTickets[0].bookingId}
                        </div>
                        <button
                          type="button"
                          onClick={() => onViewTicket(upcomingTickets[0])}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          View Full Boarding Pass
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-2">
                        <TicketIcon className="w-8 h-8 text-slate-500 mx-auto" />
                        <p className="text-xs text-slate-400">No active bookings for today</p>
                        <button
                          type="button"
                          onClick={() => onOpenBookingModal()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                        >
                          Book a Seat Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Popular Routes Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white">
                    Official Transit Routes (Fall 2026 Schedule)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('routes')}
                    className="text-xs text-blue-400 hover:underline font-bold"
                  >
                    View All {routes.length} Routes & Schedules →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {routes.slice(0, 6).map((route) => (
                    <div
                      key={route.id}
                      className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-blue-600/50 transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded text-[10px]">
                            {route.routeNo}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {route.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {route.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {route.routeDetails}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-emerald-400">
                          {route.availableSeats} seats left
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenBookingModal(route)}
                          className="px-3 py-1 bg-slate-800 group-hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Book Seat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Tab: Routes */}
          {activeTab === 'routes' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['All', 'City Routes', 'DIU Shuttle', 'Friday Schedule'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search route or stop..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded-md text-xs">
                          {route.routeNo}
                        </span>
                        <h4 className="text-sm font-bold text-white">{route.name}</h4>
                        <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
                          {route.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{route.routeDetails}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                        <span>
                          Morning: <strong>{route.startTimesToDSC.join(', ') || 'N/A'}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Return: <strong>{route.departureTimesFromDSC.join(', ') || 'N/A'}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenBookingModal(route)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Book Seat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Tab: GPS Tracking */}
          {activeTab === 'tracking' && (
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Bus Tracking Console
                  </h3>
                  <p className="text-xs text-slate-400">
                    Route: {selectedBus?.route.name ?? tracking.routeName} (Bus #{selectedBus?.busNumber ?? tracking.busNumber})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1.5 rounded-xl border border-amber-800/50">
                    DEMO GPS
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/50">
                    SPEED: {currentSpeed} KM/H
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-300">Available buses</h4>
                  <span className="text-[10px] text-slate-500">{availableBuses.length} buses • select to track</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                  {availableBuses.map(({ busNumber, route }) => (
                    <button
                      key={busNumber}
                      type="button"
                      aria-pressed={selectedBus?.busNumber === busNumber}
                      onClick={() => setSelectedTrackingBus(busNumber)}
                      className={`min-w-0 p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                        selectedBus?.busNumber === busNumber
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="block text-[11px] font-bold truncate">{busNumber}</span>
                      <span className="block text-[10px] text-slate-400 truncate">{route.routeNo} • {route.name}</span>
                    </button>
                  ))}
                  {availableBuses.length === 0 && (
                    <p className="col-span-full text-xs text-slate-400">No active buses are currently listed.</p>
                  )}
                </div>
              </div>

              {/* Large Map Visualizer */}
              <div className="relative w-full h-80 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <defs>
                    <linearGradient id="webRoadGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  {/* Waterway */}
                  <path
                    d="M 10 100 Q 40 70 45 40 T 70 0"
                    fill="none"
                    stroke="#0369a1"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.5"
                  />

                  {/* Corridor Path */}
                  <path
                    d="M 18 72 Q 28 55 45 42 T 82 24"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 18 72 Q 28 55 45 42 T 82 24"
                    fill="none"
                    stroke="url(#webRoadGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="100"
                    strokeDashoffset={`${100 - progressPercentage}`}
                  />

                  {/* Stops */}
                  <circle cx="18" cy="72" r="3" fill="#2563eb" stroke="#fff" strokeWidth="1" />
                  <text x="18" y="78" fontSize="2.8" fontWeight="bold" fill="#93c5fd" textAnchor="middle">
                    DIU Main Campus
                  </text>

                  <circle cx="38" cy="46" r="2.5" fill="#64748b" stroke="#fff" strokeWidth="1" />
                  <text x="38" y="52" fontSize="2.5" fill="#cbd5e1" textAnchor="middle">
                    Technical / Gabtoli
                  </text>

                  <circle cx="68" cy="32" r="3" fill="#0284c7" stroke="#fff" strokeWidth="1" />
                  <text x="68" y="38" fontSize="2.8" fontWeight="bold" fill="#38bdf8" textAnchor="middle">
                    Daffodil Smart City
                  </text>

                  <circle cx="82" cy="24" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                  <text x="82" y="18" fontSize="3" fontWeight="bold" fill="#34d399" textAnchor="middle">
                    DSC Permanent Campus
                  </text>

                  {/* Bus marker */}
                  <g
                    transform={`translate(${tracking.coordinates[currentCoordIndex]?.x || 50}, ${
                      tracking.coordinates[currentCoordIndex]?.y || 50
                    })`}
                    className="transition-transform duration-700 ease-out"
                  >
                    <circle cx="0" cy="0" r="5" fill="#3b82f6" opacity="0.4" className="animate-ping" />
                    <circle cx="0" cy="0" r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5">
                <span className="text-slate-400">Estimated location: <strong className="text-white">{currentLocation}</strong></span>
                <span className="text-amber-300">Demo position; live GPS feed is not connected</span>
              </div>

              {/* Driver & Timeline details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Driver</div>
                  <div className="font-bold text-white mt-0.5">{driverName}</div>
                  <div className="font-mono text-blue-400 mt-0.5">{driverPhone}</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Current Status</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{currentStatus}</div>
                  <div className="text-slate-400 mt-0.5">{occupiedSeats}/{selectedBus?.route.totalSeats ?? tracking.totalSeats} seats taken</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Destination ETA</div>
                  <div className="font-bold text-blue-400 mt-0.5">{destinationEta} Minutes</div>
                  <div className="text-slate-400 mt-0.5">Arriving at {selectedBus?.route.destination ?? 'destination unavailable'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Active Tab: Tickets */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white">Student Transit Passes</h3>
                <button
                  type="button"
                  onClick={() => onOpenBookingModal()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Book New Pass
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{ticket.routeName}</h4>
                        <p className="text-xs text-blue-400 font-bold">Bus: {ticket.busNumber}</p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        Seat #{ticket.seatNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 py-2 border-y border-slate-800/80">
                      <QRCodeView data={ticket.qrData} size={70} />
                      <div className="text-xs space-y-1">
                        <div className="text-slate-300">
                          <strong>From:</strong> {ticket.pickupStop} ({ticket.departureTime})
                        </div>
                        <div className="text-slate-300">
                          <strong>To:</strong> {ticket.destinationStop}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          Ref: {ticket.bookingId}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onViewTicket(ticket)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      View Digital Pass & Print
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
