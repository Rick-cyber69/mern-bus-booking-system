import React, { useEffect, useState } from 'react';
import { SeatConfig } from '../types';
import { getSocket } from '../services/socket';
import { Lock, UserCheck, Sparkles } from 'lucide-react';

interface SeatMapProps {
  scheduleId: string;
  seatLayout: SeatConfig[];
  bookedSeats: string[];
  initialLockedSeats: string[];
  baseFare: number;
  onSeatSelectionChange: (selectedSeats: string[]) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  scheduleId,
  seatLayout,
  bookedSeats,
  initialLockedSeats,
  baseFare,
  onSeatSelectionChange
}) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [lockedSeats, setLockedSeats] = useState<string[]>(initialLockedSeats);
  const [activeDeck, setActiveDeck] = useState<'LOWER' | 'UPPER'>('LOWER');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const hasUpperDeck = seatLayout.some((s) => s.deck === 'UPPER');

  useEffect(() => {
    const socket = getSocket();

    socket.emit('join_schedule', scheduleId);

    socket.on('seats_locked', (data: { scheduleId: string; seatNumbers: string[] }) => {
      if (data.scheduleId === scheduleId) {
        setLockedSeats((prev) => Array.from(new Set([...prev, ...data.seatNumbers])));
        setToastMessage(`Seat [${data.seatNumbers.join(', ')}] held by another user.`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    });

    socket.on('seats_booked', (data: { scheduleId: string; seatNumbers: string[] }) => {
      if (data.scheduleId === scheduleId) {
        setLockedSeats((prev) => prev.filter((s) => !data.seatNumbers.includes(s)));
      }
    });

    socket.on('seats_freed', (data: { scheduleId: string; seatNumbers: string[] }) => {
      if (data.scheduleId === scheduleId) {
        setLockedSeats((prev) => prev.filter((s) => !data.seatNumbers.includes(s)));
        setToastMessage(`Seat [${data.seatNumbers.join(', ')}] unlocked & available.`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    });

    return () => {
      socket.emit('leave_schedule', scheduleId);
      socket.off('seats_locked');
      socket.off('seats_booked');
      socket.off('seats_freed');
    };
  }, [scheduleId]);

  const handleSeatClick = (seatNumber: string) => {
    if (bookedSeats.includes(seatNumber) || lockedSeats.includes(seatNumber)) {
      return;
    }

    let updated: string[];
    if (selectedSeats.includes(seatNumber)) {
      updated = selectedSeats.filter((s) => s !== seatNumber);
    } else {
      if (selectedSeats.length >= 6) {
        alert('Maximum of 6 seats can be selected per booking session.');
        return;
      }
      updated = [...selectedSeats, seatNumber];
    }
    setSelectedSeats(updated);
    onSeatSelectionChange(updated);
  };

  const deckSeats = seatLayout.filter((s) => s.deck === activeDeck);
  const maxRow = Math.max(...deckSeats.map((s) => s.row), 1);
  const maxCol = Math.max(...deckSeats.map((s) => s.column), 4);

  return (
    <div className="card p-6 space-y-5 relative">
      {/* Real-time Socket Toast Alert */}
      {toastMessage && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg z-20 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Legend & Deck Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded border border-emerald-500 bg-emerald-50"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-red-600 border border-red-700"></span>
            <span className="text-red-700 font-semibold">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-amber-50 border border-amber-400 flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-amber-600" />
            </span>
            <span>Held (Redis)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-slate-200 border border-slate-300"></span>
            <span className="text-slate-400">Booked</span>
          </div>
        </div>

        {hasUpperDeck && (
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveDeck('LOWER')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeDeck === 'LOWER'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Lower Berth
            </button>
            <button
              type="button"
              onClick={() => setActiveDeck('UPPER')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeDeck === 'UPPER'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Upper Berth
            </button>
          </div>
        )}
      </div>

      {/* Driver Cabin Visualizer */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>DRIVER CABIN &middot; FRONT</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ENTRY DOOR &rarr;</span>
      </div>

      {/* Interactive Seat Matrix */}
      <div className="py-2 flex justify-center overflow-x-auto">
        <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${maxCol}, minmax(0, 1fr))` }}>
          {Array.from({ length: maxRow }).map((_, rIdx) => {
            const rowNum = rIdx + 1;
            return (
              <React.Fragment key={`row-${rowNum}`}>
                {Array.from({ length: maxCol }).map((_, cIdx) => {
                  const colNum = cIdx + 1;
                  const seat = deckSeats.find((s) => s.row === rowNum && s.column === colNum);

                  if (!seat) {
                    return <div key={`empty-${rowNum}-${colNum}`} className="w-12 h-12" />;
                  }

                  const isBooked = bookedSeats.includes(seat.seatNumber);
                  const isLocked = lockedSeats.includes(seat.seatNumber);
                  const isSelected = selectedSeats.includes(seat.seatNumber);
                  const isSleeper = seat.type === 'SLEEPER';

                  let statusClasses = 'bg-white border-emerald-400 text-slate-800 hover:border-emerald-600 hover:bg-emerald-50 cursor-pointer shadow-sm';

                  if (isBooked) {
                    statusClasses = 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed';
                  } else if (isLocked) {
                    statusClasses = 'bg-amber-50 border-amber-400 text-amber-700 cursor-not-allowed animate-pulse';
                  } else if (isSelected) {
                    statusClasses = 'bg-red-600 border-red-700 text-white font-bold shadow-md shadow-red-600/30 scale-105';
                  }

                  return (
                    <button
                      key={seat.seatNumber}
                      type="button"
                      disabled={isBooked || isLocked}
                      onClick={() => handleSeatClick(seat.seatNumber)}
                      className={`relative flex flex-col items-center justify-center rounded-xl border transition-all duration-150 ${
                        isSleeper ? 'w-20 h-12' : 'w-12 h-12'
                      } ${statusClasses}`}
                      title={`${seat.seatNumber} (${seat.type}) - ₹${baseFare}`}
                    >
                      <span className="text-xs font-bold">{seat.seatNumber}</span>
                      <span className="text-[9px] font-medium opacity-80 mt-0.5">
                        {isBooked ? 'SOLD' : isLocked ? 'HELD' : isSelected ? 'CHOSEN' : `₹${baseFare}`}
                      </span>

                      {isLocked && <Lock className="w-2.5 h-2.5 text-amber-600 absolute top-1 right-1" />}
                      {isSelected && <UserCheck className="w-2.5 h-2.5 text-white absolute top-1 right-1" />}
                    </button>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
