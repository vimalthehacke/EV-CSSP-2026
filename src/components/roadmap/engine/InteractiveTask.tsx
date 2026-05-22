import React, { useState } from 'react';
import { Task } from '../../../types';
import { Button } from '../../ui/Button';
import { Sparkles, CheckCircle, AlertOctagon, HelpCircle } from 'lucide-react';

interface InteractiveTaskProps {
  task: Task;
  onComplete: () => void;
  disabled?: boolean;
}

export const InteractiveTask: React.FC<InteractiveTaskProps> = ({ task, onComplete, disabled }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const options = task.options || ["ACCEPT", "DROP", "FORWARD", "REJECT"];

  const handleApply = () => {
    if (!selected) return;
    const isCorrect = selected.trim().toLowerCase() === (task.expectedAnswer || '').trim().toLowerCase();

    if (isCorrect) {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
    }
  };

  return (
    <div className="bg-black/40 border border-gray-900 rounded-lg p-4 font-mono text-xs space-y-4">
      <div className="flex items-start gap-2 text-gray-400">
        <Sparkles className="w-4 h-4 text-[#00ff88] mt-0.5" />
        <div className="space-y-1">
          <span className="text-[10px] text-gray-500 uppercase font-black">INTERACTIVE_SIMULATION_DECISION:</span>
          <p className="text-gray-200 font-sans text-sm font-medium">{task.question || task.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, idx) => {
          const isSelected = selected === opt;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || task.completed || status === 'correct'}
              onClick={() => { setSelected(opt); setStatus('idle'); }}
              className={`text-center font-sans text-xs px-3 py-2.5 rounded border transition-all duration-150 flex items-center justify-center gap-1.5
                ${task.completed || status === 'correct'
                  ? opt === task.expectedAnswer
                    ? 'bg-emerald-950/20 border-emerald-500/50 text-[#00ff88] font-bold'
                    : isSelected ? 'bg-red-950/10 border-red-900/40 text-gray-600' : 'bg-gray-950/40 border-gray-900 text-gray-500'
                  : isSelected
                    ? 'bg-[#00ff88]/5 border-[#00ff88] text-white font-black hover:bg-[#00ff88]/10'
                    : 'bg-gray-950/40 border-gray-900 hover:border-gray-800 text-gray-400'
                }
              `}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-950">
        {status === 'incorrect' ? (
          <div className="flex items-center gap-1.5 text-[#ff3c5c] text-[10px] font-bold">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>OVERRIDE REJECTED. TRY AGAIN.</span>
          </div>
        ) : task.completed || status === 'correct' ? (
          <div className="flex items-center gap-1.5 text-[#00ff88] text-[10px] font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>SIMULATION_RESOLVED (+20 XP GRANTED)</span>
          </div>
        ) : (
          <span className="text-[10px] text-gray-500 uppercase">Select setting override value</span>
        )}

        {!task.completed && status !== 'correct' && (
          <Button
            type="button"
            disabled={!selected}
            onClick={handleApply}
            variant="cyber"
            className="text-[9.5px] px-3.5 py-1.5 font-bold font-mono"
          >
            COMMIT_OVERRIDE()
          </Button>
        )}
      </div>
    </div>
  );
};
