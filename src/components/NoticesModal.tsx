import React from 'react';
import { X, Bell, AlertTriangle, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { TransportNotice } from '../types';

interface NoticesModalProps {
  notices: TransportNotice[];
  onClose: () => void;
}

export const NoticesModal: React.FC<NoticesModalProps> = ({ notices, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">Transport Notices & Updates</h3>
              <span className="text-[10px] text-blue-200">DIU Transport Section • DSC</span>
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

        <div className="p-4 overflow-y-auto space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                notice.important
                  ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    notice.category === 'Emergency'
                      ? 'bg-rose-100 text-rose-800'
                      : notice.category === 'Schedule'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {notice.category}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{notice.date}</span>
              </div>

              <h4 className="text-xs font-bold leading-snug mb-1">{notice.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-2">{notice.summary}</p>
              <div className="text-[10px] text-slate-500 bg-white/70 p-2 rounded-xl border border-slate-200/60 leading-normal">
                {notice.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
