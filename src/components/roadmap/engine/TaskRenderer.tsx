import React from 'react';
import { Task } from '../../../types';
import { QuizTask } from './QuizTask';
import { TerminalTask } from './TerminalTask';
import { InteractiveTask } from './InteractiveTask';

interface TaskRendererProps {
  task: Task;
  onComplete: () => void;
  disabled?: boolean;
}

export const TaskRenderer: React.FC<TaskRendererProps> = ({ task, onComplete, disabled }) => {
  switch (task.type) {
    case 'quiz':
      return <QuizTask task={task} onComplete={onComplete} disabled={disabled} />;
    case 'terminal':
      return <TerminalTask task={task} disabled={disabled} />;
    case 'interactive':
      return <InteractiveTask task={task} onComplete={onComplete} disabled={disabled} />;
    default:
      return <div className="text-xs text-[#ff3c5c] font-mono">Unknown task execution class.</div>;
  }
};
