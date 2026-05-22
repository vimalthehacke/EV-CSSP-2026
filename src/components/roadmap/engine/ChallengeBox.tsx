import React, { useState } from 'react';
import { Challenge } from '../../../types';
import { FlagInput } from './FlagInput';
import { BookOpen, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';

interface ChallengeBoxProps {
  challenge: Challenge;
  onChallengeSolved: () => void;
  completed: boolean;
}

export const ChallengeBox: React.FC<ChallengeBoxProps> = ({ challenge, onChallengeSolved, completed }) => {
  const [showHint, setShowHint] = useState(false);

  const hints = challenge.hints || [];

  return (
    <div className="bg-gray-950/40 p-4 border border-gray-900 rounded-lg space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-gray-900 pb-2">
        <span className="text-[#00ff88] font-black uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#00ff88]" />
          LAB_CHALLENGE_OBJECTIVE
        </span>
        <span className="text-[#00ff88] font-bold bg-[#00ff88]/5 border border-[#00ff88]/20 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#00ff88]" />
          +{challenge.rewardXP} XP
        </span>
      </div>

      <div className="space-y-1.5 leading-relaxed bg-black/30 p-3 rounded border border-gray-950">
        <span className="text-[9px] uppercase text-gray-500 font-bold block">SCENARIO BACKGROUND:</span>
        <p className="text-gray-300 font-sans text-xs leading-normal">
          {challenge.question}
        </p>
      </div>

      {hints.length > 0 && (
        <div className="pt-1">
          <details className="bg-black/25 border border-gray-900/60 rounded p-2.5 text-[11px] cursor-pointer group">
            <summary className="text-gray-400 hover:text-white flex items-center justify-between font-bold select-none list-none">
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                SECURITY MENTOR GUIDANCE
              </span>
              <span className="text-[#00ff88] font-bold group-open:rotate-180 transition-transform">&darr;</span>
            </summary>
            <div className="text-gray-500 mt-2 leading-relaxed space-y-1.5 pt-1.5 border-t border-gray-950">
              {hints.map((hint, idx) => (
                <p key={idx} className="font-sans text-xs text-gray-400">
                  <span className="text-[#00ff88] font-bold mr-1">&bull; TIP_{idx + 1}:</span> {hint}
                </p>
              ))}
              <div className="mt-2.5 p-1.5 bg-black rounded border border-gray-950 select-all font-mono text-center">
                <span className="text-gray-600 text-[9px] uppercase block mb-0.5">Verification Override Token:</span>
                <code className="text-[#00ff88] font-bold text-xs">{challenge.flag}</code>
              </div>
            </div>
          </details>
        </div>
      )}

      <div className="pt-2 border-t border-gray-950">
        <FlagInput
          correctFlag={challenge.flag}
          onSuccess={onChallengeSolved}
          completed={completed}
        />
      </div>
    </div>
  );
};
