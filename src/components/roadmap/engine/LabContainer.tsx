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
    <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden text-gray-100">
      
      {/* LEFT COLUMN: Educational Manual and Checklist */}
      <div className="flex-1 lg:max-w-[450px] lg:w-[450px] flex-shrink-0 flex flex-col justify-between overflow-y-auto space-y-5 pr-1 font-mono text-xs max-h-[40vh] lg:max-h-none custom-scrollbar">
        <div className="space-y-4">
          
          {/* Difficulty and Title Header summary with Reset Lab option */}
          <div className="flex items-center gap-2 justify-between border-b border-gray-900 pb-2 select-none">
            <span className="text-[#00ff88] font-bold tracking-wider">LAB_SECURITY_TIER_0x{lab.id.toString(16).toUpperCase()}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetLabClick}
                className="flex items-center gap-1.5 px-2 py-1 select-none text-[10px] text-gray-400 hover:text-red-400 border border-gray-900 hover:border-red-950 bg-gray-950/20 active:bg-red-950/20 rounded font-mono font-bold transition-all"
                title="Reset active lab files & tasks"
              >
                <RotateCcw className="w-3 h-3 text-red-500 animate-spin-hover" />
                RESET_LAB
              </button>
              <Badge variant={lab.difficulty === 'Beginner' ? 'slate' : 'blue'}>
                {lab.difficulty}
              </Badge>
            </div>
          </div>

          {/* Syllabus context */}
          <div className="space-y-1.5 bg-gray-950/25 p-3 rounded border border-gray-900">
            <span className="text-[9.5px] uppercase text-gray-500 font-bold block flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#00ff88]" />
              SYLLABUS TARGET CONTEXT:
            </span>
            <p className="text-gray-300 font-sans text-xs leading-relaxed">
              {lab.description}
            </p>
          </div>

          {/* Tasks Step-by-Step checklist list */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase text-gray-500 font-bold block select-none">
              REQUIRED STEPS CHECKLIST ({activeTasks.filter(t => t.completed).length}/{activeTasks.length}):
            </span>
            
            <div className="space-y-3">
              {activeTasks.map((task) => {
                const isHintExpanded = activeHintTaskId === task.id;
                const { hint, step } = getTaskHintAndSolution(lab.id, task.id, task);

                return (
                  <div key={task.id} className="space-y-2 border border-gray-950 bg-gray-950/10 rounded-md p-2">
                    
                    {/* Task label */}
                    <div className="flex items-center justify-between gap-1 text-white">
                      <div className="flex items-center gap-2 truncate">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 text-[10px]
                          ${task.completed 
                            ? 'bg-emerald-950/40 border-[#00ff88]/50 text-[#00ff88]' 
                            : 'bg-gray-950 border-gray-800 text-gray-500 font-mono'
                          }
                        `}>
                          {task.completed ? '✓' : task.id}
                        </div>
                        <span className="font-bold text-[11px] font-sans truncate">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => toggleHintDrawer(task.id)}
                          className={`flex items-center gap-0.5 px-1.5 py-0.5 border text-[9px] font-bold rounded hover:bg-cyan-950/15 transition-all
                            ${isHintExpanded 
                              ? 'border-cyan-500/50 text-cyan-400 bg-cyan-950/20' 
                              : 'border-gray-900 text-gray-400 hover:text-white'}`}
                        >
                          <HelpCircle className="w-2.5 h-2.5" />
                          HINT
                        </button>
                        {task.completed && (
                          <button
                            onClick={() => handleResetTaskClick(task.id, task.title)}
                            className="p-1 border border-gray-950 text-gray-500 hover:text-red-400 rounded hover:bg-red-950/10 hover:border-red-900/20 transition-all"
                            title="Reset this task state"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                          </button>
                        )}
                        <Badge variant="outline" className="text-[8.5px] font-mono px-1 py-0">
                          {task.type.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Collapsible Hints & Step-by-Step Solution help */}
                    {isHintExpanded && (
                      <div className="bg-cyan-950/5 border border-cyan-500/10 p-2.5 rounded font-sans text-xs space-y-2 mt-1">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-cyan-400 font-mono block uppercase">// INSTANT_ACADEMY_CS_HINT:</span>
                          <p className="text-gray-300 leading-relaxed text-[11px]">{hint}</p>
                        </div>
                        <div className="border-t border-cyan-500/10 pt-1.5 space-y-0.5">
                          <span className="text-[9px] font-bold text-[#00ff88] font-mono block uppercase">// STEP_BY_STEP_SOLUTION_HELP:</span>
                          <p className="text-gray-400 leading-normal text-[10.5px] font-mono bg-black/40 p-1.5 rounded">{step}</p>
                        </div>
                      </div>
                    )}

                    {/* Task presentation card body */}
                    {task.completed ? (
                      <div className="bg-emerald-950/5 border border-emerald-900/10 p-3 rounded text-gray-400 font-sans text-xs flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9.5px] font-bold text-[#00ff88] font-mono block uppercase">// TASK_RESOLVED</span>
                          <p className="text-gray-500 text-[11px] leading-relaxed">{task.description}</p>
                        </div>
                        <span className="text-[#00ff88] font-bold font-mono text-[9px]">+20 XP</span>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <TaskRenderer 
                          task={task} 
                          onComplete={() => handleTaskSolved(task.id)} 
                          disabled={isLabFullyCompleted}
                        />

                        {/* Interactive structured step guidance companion sidebar layout */}
                        <div className="bg-gray-900/80 border border-[#00ff88]/10 hover:border-[#00ff88]/20 p-2.5 rounded text-xs space-y-2.5 transition-all">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              <span className="text-[9px] font-mono font-black text-cyan-400 uppercase tracking-widest">GUIDE_EXPLANATION</span>
                            </div>
                            <p className="text-gray-300 text-[10.5px] font-sans leading-relaxed">{hint}</p>
                          </div>

                          <div className="border-t border-gray-800 pt-1.5 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                              <span className="text-[9px] font-mono font-black text-[#00ff88] uppercase tracking-widest">STEP_BY_STEP_INSTRUCTIONS</span>
                            </div>
                            <p className="text-gray-400 text-[10px] font-mono leading-relaxed bg-black/45 p-1.5 rounded">
                              {step}
                            </p>
                          </div>

                          {(() => {
                            const rawCmd = task.commandRequired || (() => {
                              const match = step.match(/'([^']+)'/);
                              return match && match[1] ? match[1] : '';
                            })();

                            if (rawCmd) {
                              return (
                                <div className="bg-black/60 p-2 rounded border border-gray-950 flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[8.5px] text-gray-500 font-mono uppercase tracking-tight">Active Core Target Payload:</span>
                                    <span className="text-[8.5px] text-[#00ff88] font-mono uppercase tracking-widest font-black">READY_TO_COPY</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-2.5 bg-gray-950/40 px-2 py-1.5 rounded border border-gray-950">
                                    <code className="text-[#00ff88] text-[10.5px] font-mono select-all truncate flex-1 leading-none font-bold">
                                      {task.type === 'terminal' ? `$ ${rawCmd}` : `Answer: ${rawCmd}`}
                                    </code>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(rawCmd);
                                        toast.success(`SYSTEM_CLIPBOARD: Copied "${rawCmd}" to clipboard!`);
                                      }}
                                      className="cursor-pointer text-[9px] font-mono font-black text-gray-400 hover:text-white bg-gray-955 border border-gray-800 hover:border-[#00ff88]/40 px-2 py-1 rounded select-none hover:bg-emerald-950/10 active:scale-95 transition-all outline-none"
                                      title="Copy solution payload/command parameter"
                                    >
                                      COPY
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Terminal Command simulator and Challenge Box */}
      <div className="flex-1 flex flex-col space-y-4 h-full min-h-[45vh] lg:min-h-none overflow-hidden pb-4 lg:pb-0">
        
        {/* Tab Toggle Header for Labs 9 to 16 */}
        {(lab.id >= 9) && (
          <div className="flex bg-black/40 p-1.5 rounded-lg border border-gray-900 gap-1.5 shrink-0 select-none">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex-1 py-1.5 px-3 rounded-md font-mono text-[10px] font-bold uppercase transition-all duration-150 flex items-center justify-center gap-1.5
                ${activeTab === 'simulation'
                  ? 'bg-emerald-950/40 border border-[#00ff88]/30 text-[#00ff88]'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>🌐 Web View Simulation</span>
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex-1 py-1.5 px-3 rounded-md font-mono text-[10px] font-bold uppercase transition-all duration-150 flex items-center justify-center gap-1.5
                ${activeTab === 'terminal'
                  ? 'bg-emerald-950/40 border border-[#00ff88]/30 text-[#00ff88]'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>🔒 Sandbox Console</span>
            </button>
          </div>
        )}

        {/* Dynamic Display area containing either terminal or web simulator pane */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-[300px]">
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

        {/* Global challenge Flag submitting form */}
        <div className="flex-shrink-0">
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
