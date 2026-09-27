import React from 'react';
import { useBus } from '../../context/BusContext';
import { StatusBadge } from '../common/StatusBadge';
import { Star, Bus as BusIcon } from 'lucide-react';

export const BusSelectorBar: React.FC = () => {
  const { buses, selectedBusId, setSelectedBusId, favoriteBusId } = useBus();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap pr-1">
        Select Bus:
      </span>
      {buses.map((bus) => {
        const isSelected = bus.id === selectedBusId;
        const isFav = bus.id === favoriteBusId;

        return (
          <button
            key={bus.id}
            onClick={() => setSelectedBusId(bus.id)}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border shrink-0 ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <BusIcon className="w-3.5 h-3.5" />
              <span>{bus.busNumber}</span>
              {isFav && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
            </div>

            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isSelected
                  ? 'bg-blue-700 text-blue-100'
                  : bus.status === 'ON TIME'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : bus.status === 'DELAYED'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {bus.status === 'MAINTENANCE' ? 'OFF' : `${bus.etaMinutes}m`}
            </span>
          </button>
        );
      })}
    </div>
  );
};
