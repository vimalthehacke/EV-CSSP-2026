import React, { useState, useEffect } from 'react';
import { Lab, Task } from '../../../types';
import { useProgressStore } from '../../../store/progressStore';
import { TaskRenderer } from './TaskRenderer';
import { TerminalComponent } from './TerminalComponent';
import { ChallengeBox } from './ChallengeBox';
import { CompletionModal } from './CompletionModal';
import { WebSimulator } from './WebSimulator';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { BookOpen, CheckCircle, Award, Target, HelpCircle, RotateCcw, ChevronDown, ChevronUp, Globe, Terminal as TerminalIcon } from 'lucide-react';
import { toast } from 'sonner';

interface LabContainerProps {
  lab: Lab;
  onClose: () => void;
}

// Custom specialized hint provider for Labs 1 to 10
const getTaskHintAndSolution = (labId: number, taskId: number, task: Task) => {
  switch (labId) {
    case 1:
      if (taskId === 1) return { hint: "Read the available CIA card summary on Confidentiality, Integrity, and Availability.", step: "Select 'Confidentiality' from the choices and validate. Confidentiality ensures sensitive files are hidden from unauthorized snooping." };
      if (taskId === 2) return { hint: "Contrast the motives of Black Hat (malicious) vs White Hat (authorized defense) actors.", step: "Select 'White Hat' as the ethical class of hackers and validate." };
      if (taskId === 3) return { hint: "An attack that uses lookalike web forms to deceive users is a credential harvesting attempt.", step: "Select 'Phishing' to resolve the attack log." };
      if (taskId === 4) return { hint: "Ethical hacking always demands explicit, prior written consent before executing any intrusive testing.", step: "Select 'No' to indicate written intent constraints are absolute." };
      if (taskId === 5) return { hint: "Look for the primary federal statute prosecuting computer system fraud in the US.", step: "Select 'CFAA (Computer Fraud and Abuse Act)' to finish." };
      break;
    case 2:
      if (taskId === 1) return { hint: "The 'Print Working Directory' command displays the active path context.", step: "Type: 'pwd' in the command box and press Enter." };
      if (taskId === 2) return { hint: "List directory files with the standard Unix LS utility.", step: "Type: 'ls' in the interactive shell." };
      if (taskId === 3) return { hint: "Transition paths. Running the 'cd' command without target directories takes you home.", step: "Type: 'cd' in the terminal console." };
      if (taskId === 4) return { hint: "Formatting directories uses the mkdir utility.", step: "Type: 'mkdir training_room' to create the folder." };
      if (taskId === 5) return { hint: "Initialize files with touch parameter commands.", step: "Type: 'touch secrets.txt' inside terminal." };
      if (taskId === 6) return { hint: "Permanently erase file records using standard Unix remove command.", step: "Type: 'rm scratch_pad.tmp' list to complete." };
      break;
    case 3:
      if (taskId === 1) return { hint: "Cloning files uses the standard CP file copier tool.", step: "Type: 'cp config.bak config.txt' in the console." };
      if (taskId === 2) return { hint: "Renaming files in bash uses the MV command.", step: "Type: 'mv raw_log.log security.log' on the command line." };
      if (taskId === 3) return { hint: "Elevating file levels globally to full read-write-execute uses mode numeric 777.", step: "Type: 'chmod 777 exploit.sh' to update privileges." };
      if (taskId === 4) return { hint: "Inspect configuration targets. We want firewall active states.", step: "Select the 'block_all_payloads=true' option to filter incoming inputs." };
      break;
    case 4:
      if (taskId === 1) return { hint: "Isolate interface hardware details using ifconfig.", step: "Type: 'ifconfig' and execute inside terminal." };
      if (taskId === 2) return { hint: "A ping checks raw network host accessibility.", step: "Type: 'ping google.com' to observe connection parameters." };
      if (taskId === 3) return { hint: "Nameserver lookups are performed using the nslookup command.", step: "Type: 'nslookup google.com' to resolve namespaces." };
      if (taskId === 4) return { hint: "Default ports context: standard unencrypted HTTP web nodes listen on port 80.", step: "Select '80' from the parameters list and validate." };
      break;
    case 5:
      if (taskId === 1) return { hint: "Security certificates (TLS/SSL) supply encryption layers over HTTP protocols.", step: "Select 'TLS/SSL' as security provider." };
      if (taskId === 2) return { hint: "TCP ensures in-order delivery checks using standard syn handshakes.", step: "Select 'TCP' from options." };
      if (taskId === 3) return { hint: "Network routers and packet headers are managed at Layer 3 of the OSI stack.", step: "Select 'Network Layer' as the OSI layer." };
      if (taskId === 4) return { hint: "Traceroute registers logical routing hop sequences.", step: "Type: 'traceroute google.com' in the terminal." };
      if (taskId === 5) return { hint: "Netstat lists open local sockets and ports.", step: "Type: 'netstat' on the command line." };
      break;
    case 6:
      if (taskId === 1) return { hint: "Initialize repositories caches to fetch mirror listings index.", step: "Type: 'pkg update' in the active console zone." };
      if (taskId === 2) return { hint: "Perform major updates upgrading installed toolsets.", step: "Type: 'pkg upgrade' and commit." };
      if (taskId === 3) return { hint: "Deploy versioning suites with git installer keywords.", step: "Type: 'pkg install git' to register git binaries." };
      break;
    case 7:
      if (taskId === 1) return { hint: "Run registries domain lookups to audit network registrations.", step: "Type: 'whois example.com' to search registrar metadata." };
      if (taskId === 2) return { hint: "Select the core registration database tool identifier.", step: "Select option 'whois' to solve the quiz." };
      if (taskId === 3) return { hint: "Check DNS mapping naming for corporate management nodes.", step: "Select 'admin.ev-tech.com' as corporate administration entrance." };
      break;
    case 8:
      if (taskId === 1) return { hint: "Scan target hostname properties using nmap parameters.", step: "Type: 'nmap target' inside the security console." };
      if (taskId === 2) return { hint: "Query network socket listeners programs and versions.", step: "Type: 'nmap -sV target' to analyze listening ports versions." };
      break;
    case 9:
      if (taskId === 1) return { hint: "Inspect DOM tag comments formats in html sources.", step: "Select option '<!-- comment -->' to solve the comment syntax step." };
      if (taskId === 2) return { hint: "Identify HTTP verbs designed to securely transmit credentials payloads.", step: "Select 'POST' from the response options." };
      if (taskId === 3) return { hint: "Form variables can be hidden from layout renders using type properties.", step: "Select 'type=\"hidden\"' as the target form option to complete." };
      break;
    case 10:
      if (taskId === 1) return { hint: "Analyze persistent state storage nodes inside web models.", step: "Select 'Client Browser' as the storage container." };
      if (taskId === 2) return { hint: "Identify cookie security attributes that block cross-script values theft.", step: "Select the 'HttpOnly' flag attribute to resolve the task." };
      break;
    case 11:
      if (taskId === 1) return { hint: "Look for spelling modifications in suspicious addresses.", step: "Select option 'support@g00gle.com' to identify the phishing sender header." };
      if (taskId === 2) return { hint: "Examine the destination of the hovered link.", step: "Select 'https://g00gle.com/secure_bill' as the target." };
      if (taskId === 3) return { hint: "Verify password character complexity.", step: "Select option 'S3cure_Pr0t0c0l_#82!' to submit the password." };
      break;
    case 12:
      if (taskId === 1) return { hint: "Locate the permission designed to intercept SMS streams.", step: "Select 'RECEIVE_SMS' to resolve standard permission." };
      if (taskId === 2) return { hint: "Determine the combo that can extract verification codes off network subnets.", step: "Select 'READ_SMS + INTERNET' to identify the risk combo." };
      break;
    case 13:
      if (taskId === 1) return { hint: "Check the main training site subdomains domain layout.", step: "Select 'lab.ev-site.com' to finish." };
      if (taskId === 2) return { hint: "Search search engines crawler directive instructions file.", step: "Select 'robots.txt' to identify the ignored paths file." };
      break;
    case 14:
      if (taskId === 1) return { hint: "Choose a highly detailed and technical title style.", step: "Select 'SQL Injection Vulnerability in login parameter...'." };
      if (taskId === 2) return { hint: "What ranking describes a complete server takeover risk?", step: "Select 'Critical (9.0 - 10.0)' severity rating." };
      if (taskId === 3) return { hint: "How is raw user query characters parsing prevented from database injection?", step: "Select 'Parameterized queries / Prepared statements'." };
      break;
    case 15:
      if (taskId === 1) return { hint: "Which offensive role captures system bugs and flaws for monetary rewards?", step: "Select 'Bug Hunter' to choose the role." };
      if (taskId === 2) return { hint: "Pick the gold-standard hands-on penetration testing certification.", step: "Select the 'OSCP' certification option." };
      break;
    case 16:
      if (taskId === 1) return { hint: "Examine subdomains of ev-academy.com in passive recon.", step: "Select 'internal-labs.ev-academy.com' as your target subdomain." };
      if (taskId === 2) return { hint: "Review SSH terminal socket defaults metrics.", step: "Select 'Port 22 (SSH)' as standard console port." };
      if (taskId === 3) return { hint: "Bypass user logins checking parameter assertions.", step: "Select '' OR '1'='1' to complete standard injection." };
      break;
  }
  return {
    hint: "Fulfill instructions in task manually or use command prompt.",
    step: task.commandRequired ? `Type: '${task.commandRequired}' inside the terminal` : "Select correct selection options and validate."
  };
};

export const LabContainer: React.FC<LabContainerProps> = ({ lab, onClose }) => {
  const { labs, completedChallenges, completedTasks, completeTask, completeChallenge, resetTask, resetLab } = useProgressStore();

  // Find live updated state of this lab from the progress store
  const activeLab = labs.find(l => l.id === lab.id) || lab;
  const activeTasks = activeLab.tasks;
  
  const isChallengeCompleted = completedChallenges.includes(lab.id);
  const isLabFullyCompleted = activeLab.completed;

  // Track state for completion popups
  const [showCompletion, setShowCompletion] = useState(false);

  // States to handle hints collapsible drawers of each task
  const [activeHintTaskId, setActiveHintTaskId] = useState<number | null>(null);

  // Keep a terminal reset counter to force shell reload on resets
  const [terminalResetCounter, setTerminalResetCounter] = useState(0);

  // Switch between Terminal and Web Browser Simulation tabs for web labs
  const [activeTab, setActiveTab] = useState<'terminal' | 'simulation'>(() => {
    return (lab.id >= 9) ? 'simulation' : 'terminal';
  });

  // Re-sync active tab when changing labs
  useEffect(() => {
    setActiveTab((lab.id >= 9) ? 'simulation' : 'terminal');
  }, [lab.id]);

  // Trigger CompletionModal overlay instantly on active complete changes
  useEffect(() => {
    if (activeLab.completed) {
      setShowCompletion(true);
    }
  }, [activeLab.completed]);

  const handleCommandExecution = (cmdStr: string) => {
    // Check if entered command fulfills requirements of any inactive terminal tasks
    activeTasks.forEach(task => {
      if (task.type === 'terminal' && task.commandRequired && !task.completed) {
        // Match exact or nested prefix
        if (cmdStr.trim().toLowerCase() === task.commandRequired.trim().toLowerCase()) {
          completeTask(lab.id, task.id);
          toast.success(`TASK_STATUS_UPDATE: solved "${task.title}" (+20 XP GRANTED)!`);
        }
      }
    });
  };

  const handleTaskSolved = (taskId: number) => {
    completeTask(lab.id, taskId);
    toast.success(`TASK_STATUS_UPDATE: Solved task step (+20 XP GRANTED)!`);
  };

  const handleChallengeSolved = () => {
    completeChallenge(lab.id);
    toast.success(`CHALLENGE_SOLVED: Correct flag submitted (+200 XP GRANTED)!`);
  };

  // Trigger full lab restart safely
  const handleResetLabClick = () => {
    if (confirm("Reset current Lab? This will clear all completed task steps, file modifications, and challenge states.")) {
      resetLab(lab.id);
      setTerminalResetCounter(prev => prev + 1);
      toast.info("LAB_RESET: Reset completed. Fresh terminal environment mounted.");
    }
  };

  // Trigger step-level reset safely
  const handleResetTaskClick = (taskId: number, taskTitle: string) => {
    resetTask(lab.id, taskId);
    toast.info(`STEP_RESET: Cleared completions for steps "${taskTitle}".`);
  };

  const toggleHintDrawer = (taskId: number) => {
    setActiveHintTaskId(prev => prev === taskId ? null : taskId);
  };

  // Filesystem defaults structure placeholder if not initialized
  const fsFiles = (lab as any).challenge.filesystem || {
    "note.txt": "Cyber Range Simulator active sandbox file boundaries. Read standard cues."
  };

  const termPrompt = (lab as any).challenge.terminalPrompt || "operator@ev-cyber-range:~$";

  return (
    <div className="flex flex-row gap-4 w-full h-full overflow-hidden text-gray-100 bg-[#050816]/30">
      
      {/* COLUMN 1: NAVIGATION / ROADMAP (Weighted Left Sidebar) */}
      <div className="basis-[18%] min-w-[180px] max-w-[240px] flex-shrink-0 flex flex-col border-r border-gray-900 bg-[#0b0f19]/80 overflow-hidden font-mono text-[10px]">
        <div className="p-3 border-b border-gray-900 bg-gray-950/40">
          <span className="text-gray-500 font-bold block mb-1">SYSTEM_HIERARCHY</span>
          <div className="text-[#00ff88] font-black truncate">EV_CYBER_RANGE_V1.0.4</div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          <div className="text-gray-500 font-bold px-2 py-1 uppercase tracking-tight mb-2 border-b border-gray-900/50">CURRICULUM_NODES</div>
          {labs.map(l => (
            <div 
              key={l.id} 
              className={`px-3 py-2 rounded border transition-all flex items-center justify-between gap-2
                ${l.id === lab.id 
                  ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]' 
                  : l.unlocked 
                    ? 'border-transparent text-gray-400 hover:bg-gray-900/50 hover:text-gray-200' 
                    : 'border-transparent text-gray-700 opacity-50'
                }
              `}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-1.5 h-1.5 rounded-full ${l.completed ? 'bg-[#00ff88]' : l.id === lab.id ? 'bg-[#00c3ff]' : 'bg-gray-700'}`} />
                <span className="truncate">LAB_{l.id.toString().padStart(2, '0')}</span>
              </div>
              {l.completed && <CheckCircle className="w-3 h-3 text-[#00ff88]" />}
            </div>
          ))}
        </div>

        <div className="p-3 bg-gray-950/60 border-t border-gray-900 space-y-2">
          <div className="flex justify-between items-center text-gray-500">
            <span>UPTIME:</span>
            <span className="text-white">12:44:02</span>
          </div>
          <div className="flex justify-between items-center text-gray-500">
            <span>PACKETS:</span>
            <span className="text-white animate-pulse">RX/TX_4K</span>
          </div>
        </div>
      </div>

      {/* COLUMN 2: CENTER WORKSPACE (Terminal / Simulator) */}
      <div className="flex-1 min-w-0 flex flex-col space-y-3 h-full overflow-hidden py-2 px-1">
        
        {/* Tab Toggle Header for Labs 9 to 16 */}
        {(lab.id >= 9) && (
          <div className="flex bg-black/40 p-1 rounded-lg border border-gray-900 gap-1 shrink-0 select-none max-w-[400px]">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex-1 py-1.5 px-3 rounded-md font-mono text-[9px] font-bold uppercase transition-all duration-150 flex items-center justify-center gap-1.5
                ${activeTab === 'simulation'
                  ? 'bg-emerald-950/40 border border-[#00ff88]/30 text-[#00ff88]'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
            >
              <Globe className="w-3 h-3" />
              <span>Web Simulation</span>
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex-1 py-1.5 px-3 rounded-md font-mono text-[9px] font-bold uppercase transition-all duration-150 flex items-center justify-center gap-1.5
                ${activeTab === 'terminal'
                  ? 'bg-emerald-950/40 border border-[#00ff88]/30 text-[#00ff88]'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
            >
              <TerminalIcon className="w-3 h-3" />
              <span>Sandboxed Console</span>
            </button>
          </div>
        )}

        {/* Dynamic Display area containing terminal or web simulator */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black/20 rounded-lg border border-gray-900/50 shadow-inner">
          {activeTab === 'simulation' ? (
            <WebSimulator labId={lab.id} />
          ) : (
            <TerminalComponent
              labId={lab.id}
              labFiles={fsFiles}
              terminalPrompt={termPrompt}
              activeTasks={activeTasks}
              onCommandRun={handleCommandExecution}
              resetCounter={terminalResetCounter}
            />
          )}
        </div>
      </div>

      {/* COLUMN 3: RIGHT PANEL (Instructions, Tasks, Challenge Box) */}
      <div className="basis-[18%] min-w-[200px] max-w-[260px] flex-shrink-0 flex flex-col border-l border-gray-900 bg-[#0b0f19]/80 overflow-hidden py-2 px-3 space-y-4">
        
        {/* Lab Header Summary */}
        <div className="space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[#00ff88] font-mono font-bold text-[10px] tracking-[0.2em]">MISSION_PARAMETERS</span>
            <button
              onClick={handleResetLabClick}
              className="text-[9px] font-mono text-red-500/70 hover:text-red-400 bg-red-950/5 border border-red-900/20 px-2 py-0.5 rounded flex items-center gap-1"
            >
              <RotateCcw className="w-2.5 h-2.5" /> REBOOT
            </button>
          </div>
          
          <div className="bg-gray-950/50 p-3 rounded-lg border border-gray-900 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={lab.difficulty === 'Beginner' ? 'slate' : 'blue'} size="sm">
                {lab.difficulty}
              </Badge>
              <h4 className="text-white font-display font-medium text-sm leading-tight line-clamp-1">{lab.title}</h4>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed font-sans line-clamp-2">
              {lab.description}
            </p>
          </div>
        </div>

        {/* Scrollable Tasks and Instructions Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          <div className="space-y-3">
            {activeTasks.map((task) => {
              const isHintExpanded = activeHintTaskId === task.id;
              const { hint, step } = getTaskHintAndSolution(lab.id, task.id, task);

              return (
                <div key={task.id} className="space-y-2 border border-gray-900 bg-gray-950/20 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 text-[10px]
                        ${task.completed ? 'bg-emerald-500 border-emerald-400 text-black' : 'bg-gray-950 border-gray-800 text-gray-500'}
                      `}>
                        {task.completed ? '✓' : ''}
                      </div>
                      <span className={`font-bold text-[11px] truncate ${task.completed ? 'text-gray-500' : 'text-white'}`}>{task.title}</span>
                    </div>
                    <button
                      onClick={() => toggleHintDrawer(task.id)}
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border rounded cursor-pointer ${isHintExpanded ? 'bg-cyan-950 border-cyan-500 text-cyan-400' : 'border-gray-800 text-gray-500 hover:text-white'}`}
                    >
                      HINT
                    </button>
                  </div>

                  {!task.completed && (
                    <div className="space-y-3 bg-gray-900/40 p-2.5 rounded border border-gray-900">
                      <div className="space-y-1">
                        <span className="text-[9px] text-[#00ff88] font-mono font-bold uppercase tracking-widest block">Instruction</span>
                        <p className="text-gray-300 text-[11px] font-sans leading-relaxed">{hint}</p>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-850 space-y-1.5">
                        <span className="text-[9px] text-cyan-400 font-mono font-bold uppercase tracking-widest block">Action Loop</span>
                        <div className="bg-black/60 p-2 rounded font-mono text-[10px] text-gray-400 border border-gray-950 group">
                          {step}
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={() => {
                                const rawMatch = step.match(/'([^']+)'/);
                                if (rawMatch?.[1]) {
                                  navigator.clipboard.writeText(rawMatch[1]);
                                  toast.success(`Copied: ${rawMatch[1]}`);
                                }
                              }}
                              className="text-[8px] bg-gray-900 hover:bg-gray-800 px-2 py-1 rounded text-gray-400 hover:text-white border border-gray-800"
                            >
                              COPY_CMD
                            </button>
                          </div>
                        </div>
                      </div>

                      <TaskRenderer 
                        task={task} 
                        onComplete={() => handleTaskSolved(task.id)} 
                        disabled={isLabFullyCompleted}
                      />
                    </div>
                  )}

                  {isHintExpanded && (
                    <div className="bg-cyan-950/20 border border-cyan-500/20 p-2 rounded font-mono text-[10px] text-cyan-200">
                      // {hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Global challenge Flag submitting form (Bottom Fixed) */}
        <div className="shrink-0 pt-4 border-t border-gray-900">
          <ChallengeBox
            challenge={lab.challenge}
            onChallengeSolved={handleChallengeSolved}
            completed={isChallengeCompleted}
          />
        </div>
      </div>

      {/* Interactive celebratory success screen popup */}
      <CompletionModal
        isOpen={showCompletion}
        onClose={() => { setShowCompletion(false); onClose(); }}
        title={lab.title}
        category={lab.category}
        baseXP={100}
        tasksCount={lab.tasks.length}
        challengeXP={activeLab.challenge?.rewardXP || lab.challenge?.rewardXP || 200}
        badgeName={activeLab.badgeName || lab.badgeName}
      />
    </div>
  );
};
