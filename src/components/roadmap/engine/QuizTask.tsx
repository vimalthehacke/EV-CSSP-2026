import React, { useState } from 'react';
import { Task } from '../../../types';
import { Button } from '../../ui/Button';
import { HelpCircle, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface QuizTaskProps {
  task: Task;
  onComplete: () => void;
  disabled?: boolean;
}

export const QuizTask: React.FC<QuizTaskProps> = ({ task, onComplete, disabled }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');

  const options = task.options || [];

  const handleVerify = () => {
    if (!selected) return;
    const isCorrect = selected.trim().toLowerCase() === (task.expectedAnswer || '').trim().toLowerCase();
    
    if (isCorrect) {
      setStatus('correct');
      onComplete();
    } else {
      setStatus('incorrect');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setSelected(null);
  };

  return (
    <div className="bg-black/40 border border-gray-900 rounded-lg p-4 font-mono text-xs space-y-3">
      <div className="flex items-start gap-2 text-gray-400">
        <HelpCircle className="w-4 h-4 text-[#00ff88] mt-0.5" />
        <div className="space-y-1">
          <span className="text-[10px] text-gray-500 uppercase font-black">QUIZ_QUESTION:</span>
          <p className="text-gray-200 font-sans text-sm font-medium">{task.question || task.description}</p>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        {options.map((opt, idx) => {
          const isSelected = selected === opt;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || task.completed || status === 'correct'}
              onClick={() => { setSelected(opt); setStatus('idle'); }}
              className={`w-full text-left font-sans text-xs px-3.5 py-2.5 rounded border transition-all duration-150 flex items-center justify-between
                ${task.completed || status === 'correct'
                  ? opt === task.expectedAnswer
                    ? 'bg-emerald-950/20 border-emerald-500/50 text-[#00ff88]'
                    : isSelected ? 'bg-red-950/10 border-red-900/30 text-gray-600' : 'bg-gray-950/40 border-gray-900 text-gray-500'
                  : isSelected
                    ? 'bg-[#00ff88]/5 border-[#00ff88] text-white font-bold shadow-[0_0_12px_rgba(0,255,136,0.06)]'
                    : 'bg-gray-950/40 border-gray-900 hover:border-gray-800 text-gray-400'
                }
              `}
            >
              <span>{opt}</span>
              {isSelected && <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        {status === 'incorrect' ? (
          <div className="flex items-center gap-2 text-[#ff3c5c] text-[10px] font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>ANSWER_FAILED. RETRY ALLOWED.</span>
          </div>
        ) : task.completed || status === 'correct' ? (
          <div className="flex items-center gap-2 text-[#00ff88] text-[10px] font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>TASK_RESOLVED (+20 XP GRANTED)</span>
          </div>
        ) : (
          <span className="text-[10px] text-gray-600 uppercase">Select correct parameter to solve</span>
        )}

        <div className="flex gap-2">
          {status === 'incorrect' && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="text-[10px] px-3 font-bold flex gap-1 items-center"
            >
              <RefreshCw className="w-3 h-3" />
              RETRY()
            </Button>
          )}

          {!task.completed && status !== 'correct' && (
            <Button
              type="button"
              disabled={!selected || status === 'correct'}
              onClick={handleVerify}
              variant="cyber"
              className="text-[10px] px-4 py-1.5 font-bold"
            >
              VALIDATE_ANSWER()
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
