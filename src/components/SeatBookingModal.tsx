import React, { useState } from 'react';
import { X, Bus, Check, ArrowRight, ShieldCheck, Clock, MapPin, AlertCircle } from 'lucide-react';
import { BusRoute, Ticket, UserProfile } from '../types';

interface SeatBookingModalProps {
  initialRoute?: BusRoute | null;
  routes: BusRoute[];
  tickets: Ticket[];
  user: UserProfile;
  onClose: () => void;
  onConfirmBooking: (ticket: Ticket) => void;
}

export const SeatBookingModal: React.FC<SeatBookingModalProps> = ({
  initialRoute,
  routes,
  tickets,
  user,
  onClose,
  onConfirmBooking,
}) => {
  const activeRoutes = routes.filter((r) => r.status === 'Active');
  const [selectedRouteId, setSelectedRouteId] = useState(
    initialRoute?.id || activeRoutes[0]?.id || ''
  );

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || activeRoutes[0];

  const [direction, setDirection] = useState<'toDsc' | 'fromDsc'>('toDsc');
  const getTimes = (route: BusRoute | undefined, selectedDirection: 'toDsc' | 'fromDsc') =>
    selectedDirection === 'toDsc' ? route?.startTimesToDSC : route?.departureTimesFromDSC;
  const availableTimes = getTimes(currentRoute, direction) ?? [];
  const [selectedTime, setSelectedTime] = useState(availableTimes[0] || '07:30 AM');
  const orderedStops = direction === 'toDsc'
    ? currentRoute?.stops ?? []
    : [...(currentRoute?.stops ?? [])].reverse();
  const [selectedStop, setSelectedStop] = useState(orderedStops[0] || 'DIU Main Campus');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedBusNumber, setSelectedBusNumber] = useState(initialRoute?.activeBuses[0] || '');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const departureDate = new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const busAvailability = (currentRoute?.activeBuses ?? []).map((busNumber, busIndex) => {
    const capacity = currentRoute?.totalSeats ?? 0;
    const initialFreeSeats = busIndex === 0
      ? Math.min(currentRoute?.availableSeats ?? capacity, capacity)
      : capacity;
    const bookedSeatNumbers = new Set<number>(
      Array.from({ length: capacity - initialFreeSeats }, (_, index) => index + 1)
    );
    tickets
      .filter((ticket) =>
        ticket.routeId === currentRoute?.id &&
        ticket.busNumber === busNumber &&
        ticket.departureDate === departureDate &&
        ticket.departureTime === selectedTime &&
        ticket.status !== 'Cancelled' &&
        ticket.destinationStop === (direction === 'toDsc' ? currentRoute.destination : currentRoute.startPoint)
      )
      .forEach((ticket) => bookedSeatNumbers.add(ticket.seatNumber));
    const availableSeatNumbers = Array.from(
      { length: currentRoute?.totalSeats ?? 0 },
      (_, index) => index + 1
    ).filter((seatNumber) => !bookedSeatNumbers.has(seatNumber));
    return { busNumber, bookedSeatNumbers, availableSeatNumbers };
  });
  const selectedBus = busAvailability.find(
    (bus) => bus.busNumber === selectedBusNumber && bus.availableSeatNumbers.length > 0
  ) ?? busAvailability.find((bus) => bus.availableSeatNumbers.length > 0);
  const effectiveSeat = selectedBus?.availableSeatNumbers.includes(selectedSeat ?? -1)
    ? selectedSeat
    : selectedBus?.availableSeatNumbers[0] ?? null;
  const allBusesFull = busAvailability.length > 0 && busAvailability.every(
    (bus) => bus.availableSeatNumbers.length === 0
  );

  const handleDirectionSelect = (nextDirection: 'toDsc' | 'fromDsc') => {
    setDirection(nextDirection);
    const stops = nextDirection === 'toDsc'
      ? currentRoute?.stops ?? []
      : [...(currentRoute?.stops ?? [])].reverse();
    setSelectedStop(stops[0] || 'DIU Main Campus');
    setSelectedTime(getTimes(currentRoute, nextDirection)?.[0] || '07:30 AM');
    setSelectedBusNumber('');
    setSelectedSeat(null);
  };

  const handleRouteSelect = (routeId: string) => {
    setSelectedRouteId(routeId);
    const r = routes.find((x) => x.id === routeId);
    if (r) {
      setSelectedTime(getTimes(r, direction)?.[0] || '07:30 AM');
      const stops = direction === 'toDsc' ? r.stops : [...r.stops].reverse();
      setSelectedStop(stops[0] || 'DIU Main Campus');
      setSelectedBusNumber('');
      setSelectedSeat(null);
    }
  };

  const handleConfirm = () => {
    if (!currentRoute || !selectedBus || !effectiveSeat) return;

    const bookingId = `DIUT${Date.now().toString().slice(-8)}`;
    const newTicket: Ticket = {
      id: `tkt_${Date.now()}`,
      bookingId,
      studentId: user.studentId,
      studentName: user.name,
      studentDepartment: user.department,
      routeId: currentRoute.id,
      routeName: currentRoute.name,
      busNumber: selectedBus.busNumber,
      seatNumber: effectiveSeat,
      departureDate,
      departureTime: selectedTime,
      arrivalTime: 'Estimated 45 min',
      pickupStop: selectedStop,
      destinationStop: direction === 'toDsc' ? currentRoute.destination : currentRoute.startPoint,
      status: 'Confirmed',
      bookingType: 'Upcoming',
      qrData: `DIU-TRANS-TKT:${bookingId}|${user.studentId}|BUS:${selectedBus.busNumber}|SEAT:${effectiveSeat}`,
      fare: 0,
      paymentMethod: 'Semester Transport Pass (Prepaid)',
    };

    onConfirmBooking(newTicket);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight">Reserve Bus Seat</h3>
              <span className="text-[10px] text-blue-100">Fall 2026 Transit Pass</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* 1. Choose Route */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              1. Select Bus Route
            </label>
            <select
              value={selectedRouteId}
              onChange={(e) => handleRouteSelect(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {activeRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.routeNo}] {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Direction
            </label>
            <select
              value={direction}
              onChange={(event) => handleDirectionSelect(event.target.value as 'toDsc' | 'fromDsc')}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="toDsc">Campus to {currentRoute?.destination}</option>
              <option value="fromDsc">{currentRoute?.destination} to Campus</option>
            </select>
          </div>

          {/* 2. Choose Time & Pickup Stop */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Departure Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  setSelectedBusNumber('');
                  setSelectedSeat(null);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableTimes.map((t, idx) => (
                  <option key={idx} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Pickup Stop
              </label>
              <select
                value={selectedStop}
                onChange={(e) => setSelectedStop(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
              >
                {orderedStops.map((stop, idx) => (
                  <option key={idx} value={stop}>
                    {stop}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="departure-date" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Travel Date
              </label>
              <input
                id="departure-date"
                type="date"
                value={selectedDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setSelectedBusNumber('');
                  setSelectedSeat(null);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end text-[10px] text-slate-500 pb-2">
              Seats are checked for this trip.
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Available buses</h4>
              <span className="text-[10px] text-slate-500">
                {busAvailability.filter((bus) => bus.availableSeatNumbers.length > 0).length} available
              </span>
            </div>
            <div className="space-y-2">
              {busAvailability.map((bus) => {
                const isFull = bus.availableSeatNumbers.length === 0;
                const isSelected = selectedBus?.busNumber === bus.busNumber;
                return (
                  <button
                    key={bus.busNumber}
                    type="button"
                    disabled={isFull}
                    onClick={() => {
                      setSelectedBusNumber(bus.busNumber);
                      setSelectedSeat(bus.availableSeatNumbers[0] ?? null);
                    }}
                    className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-colors ${
                      isFull
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-blue-400 cursor-pointer'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block text-xs font-bold">{bus.busNumber}</span>
                      <span className="block text-[10px] text-slate-500 truncate">{currentRoute?.name}</span>
                    </span>
                    <span className={`shrink-0 text-[10px] font-bold ${isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {isFull ? 'Full' : `${bus.availableSeatNumbers.length}/${currentRoute?.totalSeats} seats left`}
                    </span>
                  </button>
                );
              })}
            </div>
            {allBusesFull && (
              <p role="status" className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                All buses are full for this departure. Choose another time or date.
              </p>
            )}
          </div>

          {/* 3. Interactive Bus Seat Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Seat (Bus {selectedBus?.busNumber || 'No bus available'})
              </label>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Selected: {effectiveSeat ? `#${effectiveSeat}` : 'None'}
              </span>
            </div>

            {/* Seat Legend */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 mb-2.5">
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded bg-blue-600 border border-blue-600" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded bg-white border border-slate-300" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 rounded bg-slate-300 border border-slate-400" />
                <span>Booked</span>
              </div>
            </div>

            {/* Bus Cabin Visual Layout */}
            <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200/80 max-h-52 overflow-y-auto">
              {/* Driver Cab Front */}
              <div className="flex items-center justify-between px-4 pb-2 mb-2 border-b border-slate-200 text-slate-500 font-bold text-[10px]">
                <span>ENTRY DOOR</span>
                <span className="flex items-center gap-1 text-slate-700">
                  <span className="text-base">🧑‍✈️</span> DRIVER CAB
                </span>
              </div>

              {/* 10 Rows x 4 Seats (2-2 layout with aisle) */}
              <div className="space-y-1.5">
                {Array.from({ length: Math.ceil((currentRoute?.totalSeats ?? 0) / 4) }, (_, rowIndex) => {
                  const s1 = rowIndex * 4 + 1;
                  const s2 = rowIndex * 4 + 2;
                  const s3 = rowIndex * 4 + 3;
                  const s4 = rowIndex * 4 + 4;

                  const renderSeat = (num: number) => {
                    const isBooked = selectedBus?.bookedSeatNumbers.has(num) ?? true;
                    const isSelected = effectiveSeat === num;

                    return (
                      <button
                        key={num}
                        type="button"
                        disabled={isBooked || !selectedBus || num > (currentRoute?.totalSeats ?? 0)}
                        onClick={() => setSelectedSeat(num)}
                        className={`w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs scale-105 ring-2 ring-blue-300'
                            : isBooked || !selectedBus || num > (currentRoute?.totalSeats ?? 0)
                            ? 'bg-slate-300 text-slate-500 border border-slate-400 cursor-not-allowed opacity-60'
                            : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  };

                  return (
                    <div key={rowIndex} className="flex items-center justify-between px-2">
                      <div className="flex gap-1.5">
                        {renderSeat(s1)}
                        {renderSeat(s2)}
                      </div>
                      <span className="text-[9px] text-slate-300 font-mono">||</span>
                      <div className="flex gap-1.5">
                        {renderSeat(s3)}
                        {renderSeat(s4)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Student ID & Verification pill */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 block">
                Passenger: {user.name}
              </span>
              <span className="text-[10px] text-emerald-700">
                DIU ID #{user.studentId} • {user.department}
              </span>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              Free Pass
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedBus || !effectiveSeat || allBusesFull}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>{selectedBus ? `Confirm ${selectedBus.busNumber} Seat #${effectiveSeat}` : 'No buses available'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
