import React from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Bus,
  CheckCircle2,
} from 'lucide-react';
import { Ticket } from '../types';
import { QRCodeView } from './QRCodeView';

interface TicketDetailModalProps {
  ticket: Ticket;
  onClose: () => void;
  onCancelTicket?: (ticketId: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  onCancelTicket,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `DIU Transit Pass - ${ticket.bookingId}`,
        text: `My DIU Digital Bus Pass for ${ticket.routeName} (Seat #${ticket.seatNumber})`,
      });
    } else {
      alert(`Pass details copied: ${ticket.bookingId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
              DIU
            </div>
            <div>
              <h3 className="font-extrabold text-sm leading-tight">Digital Bus Pass</h3>
              <span className="text-[10px] text-blue-200">Daffodil Smart City Transit</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Status and Route Info */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Route
              </span>
              <h4 className="text-base font-black text-slate-900">{ticket.routeName}</h4>
              <p className="text-xs font-bold text-blue-600">Bus: {ticket.busNumber}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Seat
              </span>
              <span className="text-lg font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200 inline-block">
                #{ticket.seatNumber}
              </span>
            </div>
          </div>

          {/* Departure & Arrival Cards */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Boarding Point</span>
                <span className="font-bold text-slate-800 text-xs">{ticket.pickupStop}</span>
                <span className="text-[11px] text-blue-600 font-bold block mt-0.5">{ticket.departureTime}</span>
              </div>
              <span className="text-slate-300 text-base">➔</span>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold block">Destination</span>
                <span className="font-bold text-slate-800 text-xs">{ticket.destinationStop}</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">{ticket.arrivalTime}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {ticket.departureDate}
              </span>
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Student
              </span>
            </div>
          </div>

          {/* Passenger Identity */}
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">Passenger</span>
              <span className="font-bold text-slate-800">{ticket.studentName}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">Student ID</span>
              <span className="font-mono font-bold text-slate-800">{ticket.studentId}</span>
            </div>
          </div>

          {/* QR Code Center for Gate Scanning */}
          <div className="flex flex-col items-center py-2 text-center">
            <QRCodeView data={ticket.qrData} size={130} />
            <span className="text-[10px] font-mono text-slate-500 mt-2">
              Booking Ref: {ticket.bookingId}
            </span>
            <span className="text-[10px] text-slate-400">
              Show this QR code to the bus conductor or DSC terminal scanner
            </span>
          </div>

          {/* Action Row */}
          <div className="pt-1 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {ticket.status === 'Confirmed' && onCancelTicket && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this booking?')) {
                    onCancelTicket(ticket.id);
                    onClose();
                  }
                }}
                className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel Pass
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
