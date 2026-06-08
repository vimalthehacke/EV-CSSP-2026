import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../../../types';
import { runTerminalCommand, createDefaultFS, resolveNode, FSNode } from '../../../lib/terminalEngine';
import { Terminal as TerminalIcon, CheckCircle, Loader2 } from 'lucide-react';

interface TerminalComponentProps {
  labId: number;
  labFiles: Record<string, string>;
  terminalPrompt: string;
  activeTasks: Task[];
  onCommandRun: (cmdStr: string) => void;
  resetCounter?: number;
}

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

export const TerminalComponent: React.FC<TerminalComponentProps> = ({
  labId,
  labFiles,
  terminalPrompt,
  activeTasks,
  onCommandRun,
  resetCounter = 0
}) => {
  // Setup persistent Virtual Filesystem (VFS) node parameters
  const [rootFS, setRootFS] = useState<FSNode>(() => createDefaultFS(labFiles));
  const [currentDir, setCurrentDir] = useState('/home/student');
  const [terminalInput, setTerminalInput] = useState('');
  
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: `Secure terminal session linked for target console: ev-labs-0${labId}`, type: 'system' },
    { text: `Connected to cyber range virtual node: ${terminalPrompt.replace('$', '')}`, type: 'system' },
    { text: `Type 'help' to review basic Unix cyber training utilities list.`, type: 'output' }
  ]);
  
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Re-initialize VFS when lab shifts or reset occurs
  useEffect(() => {
    setRootFS(createDefaultFS(labFiles));
    setCurrentDir('/home/student');
    setHistory([
      { text: `Secure terminal session linked for target console: ev-labs-0${labId}`, type: 'system' },
      { text: `Connected to cyber range virtual node: ${terminalPrompt.replace('$', '')}`, type: 'system' },
      { text: `Type 'help' to review basic Unix cyber training utilities list.`, type: 'output' }
    ]);
    setCommandHistory([]);
    setHistoryIndex(-1);
  }, [labId, labFiles, terminalPrompt, resetCounter]);

  // Auto scroll terminal window
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const focusTerminalInput = () => {
    terminalInputRef.current?.focus();
  };

  const addLine = (text: string, type: 'input' | 'output' | 'error' | 'success' | 'system' = 'output') => {
    setHistory(prev => [...prev, { text, type }]);
  };

  const parseCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    // Output command string echo in terminal history
    addLine(`${terminalPrompt.replace('$', '')}:${currentDir}$ ${trimmed}`, 'input');

    // Run command inside the pure VFS Engine
    const result = runTerminalCommand(trimmed, currentDir, rootFS);

    // Render results
    if (result.output) {
      if (result.output === '__CLEAR_TERMINAL_BUFFER__') {
        setHistory([]);
      } else {
        addLine(result.output, result.success ? 'output' : 'error');
      }
    }

    if (result.newDir) {
      setCurrentDir(result.newDir);
    }

    // Trigger parent callback to validate completed commands lists
    onCommandRun(trimmed);

    // Push command to history logs stack
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    parseCommand(terminalInput);
    setTerminalInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setTerminalInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setTerminalInput('');
        } else {
          setHistoryIndex(nextIndex);
          setTerminalInput(commandHistory[nextIndex]);
        }
      }
    }
  };

  return (
    <div 
      onClick={focusTerminalInput}
      className="flex-1 bg-black border border-gray-900 rounded-lg p-4 font-mono text-[11px] flex flex-col justify-between overflow-hidden relative cursor-text group h-full shadow-inner"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1.5 text-gray-600 bg-black/60 px-2.5 py-1 rounded border border-gray-950 font-mono text-[9px] select-none z-10">
        <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
        ACTIVE CONSOLE // SHELL_OK
      </div>

      {/* Logs output console buffer */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 mb-3">
        {history.map((line, idx) => {
          let colorClass = 'text-gray-300';
          if (line.type === 'input') {
            colorClass = 'text-white font-bold';
          } else if (line.type === 'error') {
            colorClass = 'text-[#ff3c5c] font-bold';
          } else if (line.type === 'success') {
            colorClass = 'text-[#00ff88] font-bold';
          } else if (line.type === 'system') {
            colorClass = 'text-gray-500 italic';
          } else if (line.type === 'output') {
            colorClass = 'text-gray-400 font-sans leading-relaxed text-[11.5px] whitespace-pre-wrap';
          }
          return (
            <div key={idx} className={colorClass}>
              {line.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Command Prompt Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-2 border-t border-gray-950">
        <span className="text-[#00ff88] font-black whitespace-nowrap select-none">
          {terminalPrompt.replace('$', '')}:{currentDir}$
        </span>
        <input 
          ref={terminalInputRef}
          type="text"
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white border-none focus:outline-none focus:ring-0 p-0 text-xs caret-[#00ff88] font-bold font-mono"
          autoComplete="off"
          autoFocus
          placeholder="type command lines (ls, cd, pwd, touch, mkdir)..."
        />
      </form>
    </div>
  );
};
