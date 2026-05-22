import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Flag, CheckCircle, AlertTriangle } from 'lucide-react';

interface FlagInputProps {
  correctFlag: string;
  onSuccess: () => void;
  completed?: boolean;
}

// Global flag validation business rules logic
export const validateFlag = (input: string, correctFlag: string): boolean => {
  if (!input || !correctFlag) return false;
  return input.trim().toLowerCase() === correctFlag.trim().toLowerCase();
};

export const FlagInput: React.FC<FlagInputProps> = ({ correctFlag, onSuccess, completed }) => {
  const [inputVal, setInputVal] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (completed) return;

    if (validateFlag(inputVal, correctFlag)) {
      setErrorStatus(false);
      onSuccess();
    } else {
      setErrorStatus(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
      <div className="space-y-1 w-full">
        <label className="text-[10px] uppercase text-gray-500 tracking-wider font-bold block flex items-center gap-1.5 select-none">
          <Flag className="w-3.5 h-3.5 text-[#00ff88]" />
          INPUT LABORATORY VERIFICATION DECRYPTION flag
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            disabled={completed}
            value={completed ? correctFlag : inputVal}
            onChange={(e) => { setInputVal(e.target.value); setErrorStatus(false); }}
            placeholder="EV_FLAG{...}"
            className={`w-full bg-black border rounded px-3 py-2.5 text-xs font-mono focus:outline-none transition-colors
              ${completed 
                ? 'border-emerald-500/30 text-emerald-400 font-bold bg-emerald-950/5'
                : errorStatus 
                  ? 'border-red-500 focus:border-red-500 text-white' 
                  : 'border-gray-800 focus:border-[#00ff88] text-white'
              }
            `}
          />
          {!completed && (
            <Button
              type="submit"
              variant="cyber"
              className="font-mono text-[10px] px-5 py-2 whitespace-nowrap"
            >
              VERIFY_KEY()
            </Button>
          )}
        </div>
      </div>

      {errorStatus && (
        <div className="flex items-center gap-2 text-[#ff3c5c] text-[10px] font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>VERIFICATION_FAILED: Flag signatures do not match correct decrypt codes.</span>
        </div>
      )}

      {completed && (
        <div className="flex items-center gap-2 text-[#00ff88] text-[10px] font-bold">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>DECRYPTION_SUCCESSFUL: Target challenge solved (+200 XP GRANTED)</span>
        </div>
      )}
    </form>
  );
};
