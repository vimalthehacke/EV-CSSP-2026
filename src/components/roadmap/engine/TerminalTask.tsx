import React from 'react';
import { Task } from '../../../types';
import { Terminal, CheckCircle2, Loader2 } from 'lucide-react';

interface TerminalTaskProps {
  task: Task;
  disabled?: boolean;
}

export const TerminalTask: React.FC<TerminalTaskProps> = ({ task }) => {
  return (
    <div className="bg-black/40 border border-gray-900 rounded-lg p-4 font-mono text-xs space-y-3">
      <div className="flex items-start gap-2.5">
        <Terminal className="w-4 h-4 text-[#00ff88] mt-0.5" />
        <div className="space-y-1 w-full">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 uppercase font-black">SHELL_INSTRUCTION:</span>
            {task.completed ? (
              <span className="text-[#00ff88] text-[9.5px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                DONE (+20 XP)
              </span>
            ) : (
              <span className="text-[#00c3ff] text-[9.5px] font-bold flex items-center gap-1.5 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                WAIT_CONSOLE_SUBMISSION
              </span>
            )}
          </div>
          <p className="text-gray-200 font-sans text-sm font-medium leading-relaxed">
            {task.description}
          </p>
        </div>
      </div>

      {task.commandRequired && !task.completed && (
        <div className="bg-black p-2.5 rounded border border-gray-950 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] text-gray-600 uppercase block font-bold">REQUIRED COMMAND CORE:</span>
            <code className="text-[#00ff88] text-xs font-semibold font-mono">
              $ {task.commandRequired}
            </code>
          </div>
          <span className="text-[9px] text-gray-500 italic">Type in cyber console</span>
        </div>
      )}

      {task.completed && (
        <div className="bg-emerald-950/10 border border-emerald-900/30 p-2.5 rounded text-[#00ff88] text-[10px] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>CMD_VERIFIED: Automated monitor verified correct output variables.</span>
        </div>
      )}
    </div>
  );
};
