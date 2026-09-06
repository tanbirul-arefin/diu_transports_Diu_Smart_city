import React, { useState } from 'react';
import { ArrowLeft, Ticket as TicketIcon, Calendar, Clock, MapPin, Plus, CheckCircle2, QrCode, AlertCircle, XCircle } from 'lucide-react';
import { Ticket } from '../types';
import { QRCodeView } from './QRCodeView';

interface MyTicketsPageProps {
  tickets: Ticket[];
  onBack: () => void;
  onViewTicket: (ticket: Ticket) => void;
  onBookNew: () => void;
  onCancelTicket: (ticketId: string) => void;
}

export const MyTicketsPage: React.FC<MyTicketsPageProps> = ({
  tickets,
  onBack,
  onViewTicket,
  onBookNew,
  onCancelTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'History' | 'Cancelled'>('Upcoming');

  const filteredTickets = tickets.filter((t) => t.bookingType === activeTab);

  return (
    <div className="min-h-full bg-slate-50 text-slate-800 pb-20">
      {/* Top Header matching Figma Screen 5 */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-slate-900">My Tickets</h1>
        </div>

        <button
          type="button"
          onClick={onBookNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Seat</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Tab Switcher matching Figma Screen 5: Upcoming | History | Cancelled */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 rounded-2xl">
          {(['Upcoming', 'History', 'Cancelled'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tickets List matching Figma Screen 5 */}
        <div className="space-y-3.5">
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <TicketIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                No {activeTab} Tickets Found
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {activeTab === 'Upcoming'
                  ? 'You do not have any active upcoming bus passes. Reserve your seat for regular DSC trips.'
                  : `You have no ${activeTab.toLowerCase()} transport records.`}
              </p>
              {activeTab === 'Upcoming' && (
                <button
                  type="button"
                  onClick={onBookNew}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Book Now
                </button>
              )}
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:border-blue-300 transition-all"
              >
                {/* Header of Ticket Card */}
                <div className="p-3.5 border-b border-slate-100 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {ticket.routeName}
                    </h3>
                    <p className="text-xs text-blue-600 font-bold mt-0.5">
                      Bus No: {ticket.busNumber}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      ticket.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ticket.status === 'Completed'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                {/* Route Departure & Arrival Timeline matching Figma Screen 5 */}
                <div className="p-3.5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{ticket.pickupStop}</div>
                      <div className="text-[11px] text-slate-500">{ticket.departureTime}</div>
                      <div className="text-[10px] text-slate-400">{ticket.departureDate}</div>
                    </div>

                    <div className="flex flex-col items-center px-3">
                      <span className="text-slate-300 text-base">➔</span>
                      <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        Express
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-800">{ticket.destinationStop}</div>
                      <div className="text-[11px] text-slate-500">{ticket.arrivalTime}</div>
                      <div className="text-[10px] text-slate-400">{ticket.departureDate}</div>
                    </div>
                  </div>

                  {/* QR Code & Pass Meta Grid */}
                  <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between gap-3">
                    <div className="shrink-0 cursor-pointer" onClick={() => onViewTicket(ticket)}>
                      <QRCodeView data={ticket.qrData} size={70} />
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-2 text-left">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Booking ID
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-800 break-all">
                          {ticket.bookingId}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Seat No.
                        </span>
                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block">
                          #{ticket.seatNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Status
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          {ticket.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Student ID
                        </span>
                        <span className="text-xs font-mono text-slate-600">
                          {ticket.studentId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onViewTicket(ticket)}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-center"
                    >
                      View Ticket
                    </button>
                    {ticket.status === 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => onCancelTicket(ticket.id)}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        title="Cancel Booking"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
