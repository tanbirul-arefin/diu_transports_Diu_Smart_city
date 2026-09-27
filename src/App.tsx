import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Monitor,
  Code2,
  Calendar,
  Bell,
  Bus,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import {
  INITIAL_USER,
  DIU_ROUTES,
  INITIAL_TRACKING,
  INITIAL_TICKETS,
  TRANSPORT_NOTICES,
} from './data/transportData';
import { BusRoute, BusTracking, Ticket, TransportNotice, UserProfile } from './types';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { LoginPage } from './components/LoginPage';
import { HomePage } from './components/HomePage';
import { RoutesPage } from './components/RoutesPage';
import { LiveTrackingPage } from './components/LiveTrackingPage';
import { MyTicketsPage } from './components/MyTicketsPage';
import { ProfilePage } from './components/ProfilePage';
import { WebPortalView } from './components/WebPortalView';
import { TicketDetailModal } from './components/TicketDetailModal';
import { SeatBookingModal } from './components/SeatBookingModal';
import { ScheduleTableModal } from './components/ScheduleTableModal';
import { NoticesModal } from './components/NoticesModal';
import { SpringBootModal } from './components/SpringBootModal';
import { useCurrentPasses } from './hooks/useCurrentPasses';

export default function App() {
  // Application Data States
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [routes, setRoutes] = useState<BusRoute[]>(DIU_ROUTES);
  const [tracking, setTracking] = useState<BusTracking>(INITIAL_TRACKING);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const currentPasses = useCurrentPasses(tickets);
  const [notices, setNotices] = useState<TransportNotice[]>(TRANSPORT_NOTICES);

  // Dual View Mode: 'mobile' (App mockup matching photos) | 'web' (Full desktop website)
  const [viewMode, setViewMode] = useState<'mobile' | 'web'>('mobile');

  // Mobile App active tab
  const [mobileTab, setMobileTab] = useState<'home' | 'routes' | 'tracking' | 'tickets' | 'profile'>('home');

  // Modals state
  const [activeTicketModal, setActiveTicketModal] = useState<Ticket | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState<BusRoute | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isNoticesOpen, setIsNoticesOpen] = useState(false);
  const [isSpringBootOpen, setIsSpringBootOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(async (response) => {
        if (response.ok) {
          const profile = await response.json() as UserProfile;
          setUser({ ...profile, avatarUrl: profile.avatarUrl || INITIAL_USER.avatarUrl });
          setIsLoggedIn(true);
        }
      })
      .catch(() => undefined)
      .finally(() => setIsCheckingSession(false));
  }, []);

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser({ ...loggedInUser, avatarUrl: loggedInUser.avatarUrl || INITIAL_USER.avatarUrl });
    setIsLoggedIn(true);
    setMobileTab('home');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch {
      // Clear the local view even if the session endpoint is unavailable.
    }
    setIsLoggedIn(false);
    setMobileTab('home');
  };

  // Handle Route Booking initiation
  const handleOpenBooking = (route?: BusRoute) => {
    setSelectedRouteForBooking(route || null);
    setIsBookingOpen(true);
  };

  // Confirm booking
  const handleConfirmBooking = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setIsBookingOpen(false);
    setActiveTicketModal(newTicket);
    setMobileTab('tickets');
  };

  // Cancel booking
  const handleCancelBooking = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'Cancelled', bookingType: 'Cancelled' as const }
          : t
      )
    );
  };

  // Select route from RoutesPage to inspect in live tracking
  const handleSelectRouteForTracking = (route: BusRoute) => {
    setTracking((prev) => ({
      ...prev,
      routeId: route.id,
      routeName: route.name,
      busNumber: route.activeBuses[0] || 'DIU-07-1203',
      stops: route.stops.slice(0, 4).map((s, idx) => ({
        name: s,
        scheduledTime: route.startTimesToDSC[0] || '08:30 AM',
        status: idx === 0 ? 'Departed' : idx === 1 ? 'Arrived' : 'Upcoming',
      })),
      currentStopIndex: 1,
      progressPercentage: 45,
    }));
    setMobileTab('tracking');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Universal Top Control Bar (Website + App Switcher & Spring Boot architecture toggle) */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2.5 z-40 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Brand & Dual View Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 px-2.5 py-1 rounded-xl text-blue-300 text-xs font-black">
            <Bus className="w-4 h-4 text-blue-400" />
            <span>DIU TRANSPORTS</span>
          </div>

          {/* Dual View Toggle: Mobile App vs Web Portal */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Mobile App View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('web')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'web'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>💻 Web Portal View</span>
            </button>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 text-xs">
          {isLoggedIn && (
            <>
              {/* Spring Boot Backend trigger */}
              <button
                type="button"
                onClick={() => setIsSpringBootOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Java Spring Boot & Thymeleaf</span>
              </button>

              {/* Official Fall-2026 Schedule */}
              <button
                type="button"
                onClick={() => setIsScheduleOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Fall-2026 Schedule</span>
              </button>

              <button type="button" onClick={handleLogout} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold transition-colors cursor-pointer">
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main App Canvas */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-4 overflow-x-hidden">
        {isCheckingSession ? (
          <div className="flex items-center gap-3 text-sm text-slate-300" role="status">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-blue-400" />
            Checking your session…
          </div>
        ) : viewMode === 'mobile' ? (
          /* Mobile App Frame View matching photos */
          <div className="w-full flex justify-center py-2">
            <MobileFrame>
              {!isLoggedIn ? (
                <LoginPage
                  onLoginSuccess={handleLoginSuccess}
                />
              ) : (
                <div className="relative w-full h-full flex flex-col justify-between overflow-y-auto no-scrollbar">
                  {/* Mobile Screen Router */}
                  {mobileTab === 'home' && (
                    <HomePage
                      user={user}
                      routes={routes}
                      tracking={tracking}
                      currentPasses={currentPasses}
                      notices={notices}
                      onNavigate={(tab) => setMobileTab(tab)}
                      onSelectRoute={(r) => {
                        handleOpenBooking(r);
                      }}
                      onOpenNotices={() => setIsNoticesOpen(true)}
                      onOpenSchedule={() => setIsScheduleOpen(true)}
                      onOpenSpringBoot={() => setIsSpringBootOpen(true)}
                      onOpenDrawer={() => setIsMobileDrawerOpen(true)}
                    />
                  )}

                  {mobileTab === 'routes' && (
                    <RoutesPage
                      routes={routes}
                      onBack={() => setMobileTab('home')}
                      onSelectRouteForTracking={handleSelectRouteForTracking}
                      onBookSeat={(r) => handleOpenBooking(r)}
                    />
                  )}

                  {mobileTab === 'tracking' && (
                    <LiveTrackingPage
                      tracking={tracking}
                      routes={routes}
                      onBack={() => setMobileTab('home')}
                      onUpdateTracking={(updated) => setTracking(updated)}
                    />
                  )}

                  {mobileTab === 'tickets' && (
                    <MyTicketsPage
                      currentPasses={currentPasses}
                      onBack={() => setMobileTab('home')}
                      onViewTicket={(t) => setActiveTicketModal(t)}
                      onBookNew={() => handleOpenBooking()}
                      onCancelTicket={handleCancelBooking}
                    />
                  )}

                  {mobileTab === 'profile' && (
                    <ProfilePage
                      user={user}
                      onLogout={handleLogout}
                      onNavigateTickets={() => setMobileTab('tickets')}
                      onOpenSpringBoot={() => setIsSpringBootOpen(true)}
                      onUpdateUser={async (updated) => {
                        const response = await fetch('/api/v1/auth/profile', {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: updated.name,
                            studentId: updated.studentId,
                            picture: updated.avatarUrl,
                            phone: updated.phone,
                            preferredRoute: updated.preferredRoute,
                          }),
                        });
                        const result = await response.json().catch(() => ({}));
                        if (!response.ok) throw new Error(result.error || 'Could not save your profile.');
                        setUser({
                          ...result,
                          avatarUrl: result.avatarUrl || INITIAL_USER.avatarUrl,
                          walletBalance: updated.walletBalance,
                        });
                      }}
                    />
                  )}

                  {/* Persistent Bottom Navigation Bar matching Figma */}
                  <BottomNav
                    activeTab={mobileTab}
                    onSelectTab={(tab) => setMobileTab(tab)}
                    ticketCount={currentPasses.length}
                  />

                  {/* Mobile Drawer */}
                  {isMobileDrawerOpen && (
                    <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex">
                      <div className="bg-white w-4/5 h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 text-slate-800">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                DIU
                              </div>
                              <span className="font-extrabold text-sm text-slate-900">
                                DIU Transports
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsMobileDrawerOpen(false)}
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-1 text-xs font-semibold">
                            <button
                              type="button"
                              onClick={() => {
                                setMobileTab('home');
                                setIsMobileDrawerOpen(false);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2"
                            >
                              🏠 Home Dashboard
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMobileTab('routes');
                                setIsMobileDrawerOpen(false);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2"
                            >
                              🚍 Fall 2026 Routes (21 Routes)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMobileTab('tracking');
                                setIsMobileDrawerOpen(false);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2"
                            >
                              📍 Live GPS Campus Tracking
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setMobileTab('tickets');
                                setIsMobileDrawerOpen(false);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2"
                            >
                              🎫 My Digital Bus Passes
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsScheduleOpen(true);
                                setIsMobileDrawerOpen(false);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-blue-700"
                            >
                              📅 Transport Schedule PDF
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsNoticesOpen(true);
                                setIsMobileDrawerOpen(false);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2"
                            >
                              📢 Transport Notices
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsSpringBootOpen(true);
                                setIsMobileDrawerOpen(false);
                              }}
                              className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-emerald-800 font-bold flex items-center gap-2"
                            >
                              ⚡ Spring Boot Backend
                            </button>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                          <div>Passenger: <strong>{user.name}</strong></div>
                          <div>ID: {user.studentId} • {user.department}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </MobileFrame>
          </div>
        ) : (
          /* Web Portal View (Complete desktop management dashboard) */
          !isLoggedIn ? (
            <div className="w-full max-w-2xl py-8">
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            </div>
          ) : <WebPortalView
            user={user}
            routes={routes}
            tracking={tracking}
            currentPasses={currentPasses}
            notices={notices}
            onOpenBookingModal={handleOpenBooking}
            onOpenScheduleModal={() => setIsScheduleOpen(true)}
            onOpenNoticesModal={() => setIsNoticesOpen(true)}
            onOpenSpringBootModal={() => setIsSpringBootOpen(true)}
            onViewTicket={(t) => setActiveTicketModal(t)}
            onUpdateTracking={(updated) => setTracking(updated)}
          />
        )}
      </div>

      {/* Modals */}
      {/* 1. Ticket / Digital Boarding Pass Detail Modal */}
      {activeTicketModal && (
        <TicketDetailModal
          ticket={activeTicketModal}
          onClose={() => setActiveTicketModal(null)}
          onCancelTicket={handleCancelBooking}
        />
      )}

      {/* 2. Seat Booking Modal */}
      {isBookingOpen && (
        <SeatBookingModal
          initialRoute={selectedRouteForBooking}
          routes={routes}
          tickets={tickets}
          user={user}
          onClose={() => setIsBookingOpen(false)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* 3. Official Fall-2026 Schedule Table Modal */}
      {isScheduleOpen && (
        <ScheduleTableModal
          routes={routes}
          onClose={() => setIsScheduleOpen(false)}
          onSelectRouteToBook={(r) => handleOpenBooking(r)}
        />
      )}

      {/* 4. Transport Circulars & Notices Modal */}
      {isNoticesOpen && (
        <NoticesModal
          notices={notices}
          onClose={() => setIsNoticesOpen(false)}
        />
      )}

      {/* 5. Java Spring Boot & Thymeleaf Architecture Modal */}
      {isSpringBootOpen && (
        <SpringBootModal
          onClose={() => setIsSpringBootOpen(false)}
        />
      )}
    </div>
  );
}
