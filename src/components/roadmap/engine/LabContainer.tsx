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
import { 
  BookOpen, 
  CheckCircle, 
  Award, 
  Target, 
  HelpCircle, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Terminal as TerminalIcon,
  Play,
  Cpu,
  Shield,
  Layers,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
  List,
  Compass
} from 'lucide-react';
import { toast } from 'sonner';
import { playCpsClick, playCpsHover, playCpsSuccessFanfare, playCpsError } from '../../../lib/audioEngine';

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

  // Sidebar Tabs state: 'qa' (Checklist & Flag) or 'guide' (Step-by-step Solutions)
  const [activeSidebarTab, setActiveSidebarTab] = useState<'qa' | 'guide'>('qa');

  // Realistic Kali Linux VM deployment simulator state
  const [isDeploying, setIsDeploying] = useState(true);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);

  // Ticker system for booting logs
  const triggerInstanceDeployment = () => {
    setIsDeploying(true);
    setDeploymentProgress(0);
    setDeploymentLogs([]);
    
    const logs = [
      `[sys/boot] ⚡ PREPARING SECURE CONTAINER FOR LAB TARGET 0x${lab.id.toString(16).toUpperCase()}`,
      `[sys/sandbox] 🔒 CONTAINMENT: Injecting virtual machine isolated sandbox profiles...`,
      `[sys/network] 🌐 NETWORK: Binding interface node ev_node_0${lab.id} @ tunnel vlan: 10.0.99.${20 + lab.id}`,
      `[sys/disk] 💾 MOUNT: Attaching ephemeral virtual disk target /dev/loop_${lab.id}...`,
      `[sys/kali] 🐉 OS: Spawning high-tech Kali Linux simulation daemon instance...`,
      `[sys/tools] 🛠️ DEP: Injecting defensive analysis packages & command-line shells...`,
      `[sys/env] 📦 SERVICES: Forwarding virtual GUI dashboard simulation client proxy to node port...`,
      `[sys/ready] ✅ CONNECTION STACK ESTABLISHED! Deployed successfully. Welcome to Cyber Academy Range.`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDeploying(false);
            try {
              playCpsSuccessFanfare();
            } catch (err) {}
          }, 300);
          return 100;
        }

        const nextLogTriggerPercent = Math.floor((currentLogIndex / logs.length) * 100);
        if (prev >= nextLogTriggerPercent && currentLogIndex < logs.length) {
          setDeploymentLogs(curr => [...curr, logs[currentLogIndex]]);
          currentLogIndex++;
        }

        // Random increment for booting animation feel
        return prev + Math.floor(Math.random() * 8) + 6;
      });
    }, 60);

    return () => clearInterval(interval);
  };

  // Run deployment sequence whenever the lab ID changes
  useEffect(() => {
    const cancelDeploy = triggerInstanceDeployment();
    return () => {
      cancelDeploy?.();
    };
  }, [lab.id]);

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
    activeTasks.forEach(task => {
      if (task.type === 'terminal' && task.commandRequired && !task.completed) {
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
      setActiveSidebarTab('qa');
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

  // For copy-paste solutions walkthrough
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const handleCopyCommandText = (commandText: string, idx: number) => {
    navigator.clipboard.writeText(commandText);
    setCopiedIndex(idx);
    playCpsClick(true);
    toast.success("COMMAND_CLIPBOARD: Solutions command copied!");
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Filesystem defaults structure placeholder if not initialized
  const fsFiles = (lab as any).challenge.filesystem || {
    "note.txt": "Cyber Range Simulator active sandbox file boundaries. Read standard cues."
  };

  const termPrompt = (lab as any).challenge.terminalPrompt || "operator@ev-cyber-range:~$";

  return (
    <div className="flex flex-col gap-4 h-full min-h-0 text-gray-100 font-sans relative">
      
      {/* 💬 WHATSAPP COMMUNITY HELPLINE RIBBON */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-emerald-950/45 to-teal-950/25 border border-emerald-500/20 rounded-lg p-3 px-4 shadow-[0_0_15px_rgba(0,255,136,0.03)] select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shrink-0 shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
          <p className="font-mono text-xs text-emerald-400 font-bold tracking-tight text-center sm:text-left">
            💡 DOUBT IRUKA ? COMMUNITY LA KELUNGA PAH !
          </p>
        </div>
        <a 
          href="https://chat.whatsapp.com/FfWQeWUeqwb2EcSfksPfk9" 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={() => playCpsClick(true)}
          className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-black font-sans text-[11px] font-black tracking-wide p-1.5 px-3.5 rounded-full transition-all shadow-[0_3px_10px_rgba(37,211,102,0.15)] shrink-0 cursor-pointer"
        >
          <span className="shrink-0 uppercase">JOIN WHATSAPP COMMUNITY GROUP 💬</span>
        </a>
      </div>

      {/* ⚠️ HIGH TECH VM INSTANCE BOOT DEPLOYMENT SCREEN */}
      {isDeploying ? (
        <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center bg-[#070b13] border border-emerald-500/30 rounded-xl p-8 relative overflow-hidden select-none shadow-2xl">
          {/* Cyber scanline decorations */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-emerald-500/25 animate-scan" />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          
          <div className="max-w-xl w-full text-center space-y-6 z-10">
            {/* Pulsing high tech indicator */}
            <div className="relative inline-flex items-center justify-center p-4 bg-emerald-950/40 border border-[#00ff88]/40 rounded-full animate-pulse shadow-md mb-2">
              <Cpu className="w-8 h-8 text-[#00ff88]" />
              <div className="absolute inset-0 border border-dotted border-emerald-400/20 rounded-full animate-spin-slow" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-mono font-black uppercase text-[#00ff88] tracking-widest flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                DEPLOYING LAB INSTANCE...
              </h2>
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
                KALI LINUX CYBER RANGE CORE HYPERVISOR PROVISIONING // PORT: 3000
              </p>
            </div>

            {/* Neon Ticker Progress indicator bar */}
            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between items-center text-xs text-emerald-400">
                <span>TUNNEL_ALLOCATION_PROGRESS</span>
                <span className="font-bold">{deploymentProgress}%</span>
              </div>
              <div className="w-full bg-gray-950 rounded border border-emerald-950 h-3.5 p-0.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-[#00ff88] h-full rounded transition-all duration-100 ease-out shadow-[0_0_8px_rgba(0,255,136,0.5)]"
                  style={{ width: `${deploymentProgress}%` }}
                />
              </div>
            </div>

            {/* Scrolling boot execution logs */}
            <div className="bg-black/90 rounded border border-gray-900 p-4 font-mono text-left text-[10.5px] text-emerald-500 h-[180px] overflow-y-auto space-y-1.5 custom-scrollbar shadow-inner select-text">
              {deploymentLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 animate-fade-in">
                  <span className="text-emerald-700 font-bold shrink-0">&gt;&gt;&gt;</span>
                  <span className="leading-relaxed font-semibold">{log}</span>
                </div>
              ))}
              <div className="animate-pulse text-emerald-400 inline-block font-black">█</div>
            </div>

            <p className="text-[10px] text-gray-500 font-mono italic">
              Deploying secure sandboxed network loopback container safely. Please wait.
            </p>
          </div>
        </div>
      ) : (
        
        /* 💻 DEPLOYED LAB INTERACTIVE WORKSPACE GRID */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0 min-w-0 h-full" id="installed-sandbox-grid">
          
          {/* LEFT 65% PANEL: High-fidelity Linux operating system console / graphical viewport */}
          <div className="xl:col-span-8 flex flex-col bg-[#080d15] border border-gray-800 rounded-xl overflow-hidden shadow-2xl min-h-[400px] xl:min-h-0 h-full">
            
            {/* Custom Kali OS Desktop Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0c1221] border-b border-gray-900/80 shrink-0 select-none">
              
              {/* Window Controls Dots */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 border border-red-600/30 transition-all cursor-pointer" title="Close Workspace" onClick={() => { playCpsClick(false); onClose(); }} />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/30" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/30" />
                
                {/* Simulated connection LED */}
                <span className="ml-3 inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold tracking-wider bg-emerald-950/40 p-1 px-1.5 rounded border border-emerald-900/30">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping shrink-0" />
                  ONLINE: ev_node_0{lab.id}
                </span>
              </div>

              {/* Window Address Bar Info representing connection routes */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-black/50 border border-gray-850 rounded text-[10.5px] font-mono text-gray-400 w-1/3 max-w-sm overflow-hidden select-text text-center justify-center shrink-0">
                <span className="text-[#00ff88]/70 font-semibold shrink-0">ev-kali://root@sandbox</span>
                <span className="truncate opacity-60">10.0.99.{20+lab.id}</span>
              </div>

              {/* Option Selector controls to Switch Active Terminals */}
              <div className="flex items-center gap-2 font-mono shrink-0">
                
                {/* Re-deploy target instance button */}
                <button
                  onClick={triggerInstanceDeployment}
                  className="flex items-center gap-1 border border-emerald-900/50 hover:bg-emerald-950/20 text-[10px] px-2 py-1 text-emerald-400 hover:text-[#00ff88] font-bold rounded transition-all"
                  title="Force redeployment of Kali sandboxed logs"
                >
                  <RefreshCw className="w-3 h-3 animate-spin-hover" />
                  REDEPLOY
                </button>

                <button
                  onClick={handleResetLabClick}
                  className="hidden sm:flex items-center gap-1 border border-red-950 text-gray-400 hover:text-red-400 hover:bg-red-950/15 text-[10px] px-2 py-1 font-bold rounded transition-all"
                  title="Wipe files & progress resets"
                >
                  <RotateCcw className="w-3 h-3" />
                  RESET
                </button>
              </div>
            </div>

            {/* Inner Environment Toolbar (Switch Desktop Visual View) */}
            <div className="bg-[#0a0f1b] p-2 border-b border-gray-900 flex items-center justify-between text-xs font-mono shrink-0 select-none">
              <span className="text-gray-500 text-[10px] tracking-widest font-black uppercase flex items-center gap-1.5 ml-1">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                ENVIRONMENT DISPLAY RENDERER
              </span>

              {lab.id >= 9 ? (
                <div className="flex bg-black/60 p-1 rounded border border-gray-850 gap-1">
                  <button
                    onClick={() => { setActiveTab('simulation'); playCpsClick(false); }}
                    className={`p-1 px-3 text-[10.5px] font-bold rounded transition-colors flex items-center gap-1.5
                      ${activeTab === 'simulation'
                        ? 'bg-emerald-950/50 border border-[#00ff88]/30 text-[#00ff88]'
                        : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    GUI Simulated Browser
                  </button>
                  <button
                    onClick={() => { setActiveTab('terminal'); playCpsClick(false); }}
                    className={`p-1 px-3 text-[10.5px] font-bold rounded transition-colors flex items-center gap-1.5
                      ${activeTab === 'terminal'
                        ? 'bg-emerald-950/50 border border-[#00ff88]/30 text-[#00ff88]'
                        : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                    <TerminalIcon className="w-3.5 h-3.5" />
                    Kali Shell Console
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-black/30 p-1 px-2.5 border border-gray-850 rounded text-gray-400 text-[10.5px]">
                  <TerminalIcon className="w-3.5 h-3.5 text-[#00ff88]" />
                  <span>Interactive Terminal Emulator Only (No Graphics Required)</span>
                </div>
              )}
            </div>

            {/* Sandbox Container GUI Workspace viewport - scrollable and highly elastic */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0 bg-black/25">
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

          {/* RIGHT 35% SIDEBAR: Collapsible multi-tab training console Q&A and guide solutions */}
          <div className="xl:col-span-4 flex flex-col bg-[#0a0f19]/90 border border-gray-850 rounded-xl overflow-hidden shadow-2xl min-h-[400px] xl:min-h-0 h-full">
            
            {/* Sidebar high tech neon navigation tabs trigger row */}
            <div className="grid grid-cols-2 bg-[#0c1221] border-b border-gray-900/80 shrink-0 select-none">
              
              <button
                onClick={() => { playCpsClick(false); setActiveSidebarTab('qa'); }}
                className={`py-3 px-2 border-r border-gray-900 font-mono text-[11px] font-bold tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-1.5
                  ${activeSidebarTab === 'qa'
                    ? 'bg-emerald-950/30 text-white border-b-2 border-b-[#00ff88]'
                    : 'text-gray-500 hover:text-gray-300 bg-black/10'
                  }`}
              >
                <List className="w-4 h-4 text-[#00ff88]" />
                QA CHALLENGES
              </button>

              <button
                onClick={() => { playCpsClick(false); setActiveSidebarTab('guide'); }}
                className={`py-3 px-2 font-mono text-[11px] font-bold tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-1.5
                  ${activeSidebarTab === 'guide'
                    ? 'bg-emerald-950/30 text-white border-b-2 border-b-[#00ff88]'
                    : 'text-gray-500 hover:text-gray-300 bg-black/10'
                  }`}
              >
                <Compass className="w-4 h-4 text-[#00ff88]" />
                SOLUTIONS GUIDE 📖
              </button>
            </div>

            {/* Sidebar content scroll container */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5 flex flex-col justify-between" id="sidebar-tab-content">
              
              {/* TAB 1: QA AND STEP CHECKLISTS */}
              {activeSidebarTab === 'qa' && (
                <div className="space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-emerald-950/10 p-2.5 rounded border border-emerald-950/30 font-mono">
                      <span className="text-[10.5px] font-black text-[#00ff88] uppercase tracking-wider flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        CHECKPOINT MILSTONES
                      </span>
                      <span className="text-gray-400 text-[10px] font-bold">
                        {activeTasks.filter(t => t.completed).length} / {activeTasks.length} PASSED
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {activeTasks.map((task) => {
                        const isHintExpanded = activeHintTaskId === task.id;
                        const { hint, step } = getTaskHintAndSolution(lab.id, task.id, task);

                        return (
                          <div 
                            key={task.id} 
                            className={`border rounded-lg p-3 transition-all duration-200 bg-gray-950/30
                              ${task.completed 
                                ? 'border-emerald-500/20 bg-emerald-950/5' 
                                : 'border-gray-900 hover:border-gray-800'
                              }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-mono text-[10.5px] font-bold
                                  ${task.completed
                                    ? 'bg-emerald-950 border-[#00ff88] text-[#00ff88]'
                                    : 'bg-black/40 border-gray-800 text-gray-500'
                                  }`}
                                >
                                  {task.completed ? '✓' : task.id}
                                </div>
                                <h4 className="font-semibold text-xs text-white leading-tight font-sans truncate">{task.title}</h4>
                              </div>
                              
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => { playCpsClick(false); toggleHintDrawer(task.id); }}
                                  className={`p-1 px-2 border rounded text-[9.5px] font-mono leading-none tracking-tight font-bold transition-all
                                    ${isHintExpanded
                                      ? 'border-blue-500/40 text-blue-400 bg-blue-950/20'
                                      : 'border-gray-850 text-gray-500 hover:text-white'
                                    }`}
                                >
                                  HINT
                                </button>
                                {task.completed && (
                                  <button
                                    onClick={() => handleResetTaskClick(task.id, task.title)}
                                    className="p-1 border border-gray-900 text-gray-500 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/30 rounded transition-all"
                                    title="Reset checkpoint state"
                                  >
                                    <RotateCcw className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Collapsible Hints drawer */}
                            {isHintExpanded && (
                              <div className="mt-2.5 bg-blue-950/10 border border-blue-500/15 p-2.5 rounded font-sans text-xs space-y-2 animate-fade-in text-[11px] leading-relaxed">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-bold text-blue-400 font-mono block uppercase tracking-wider">// CYBER SEC RANGE CUE:</span>
                                  <p className="text-gray-300">{hint}</p>
                                </div>
                                <div className="border-t border-blue-500/10 pt-1.5 space-y-1">
                                  <span className="text-[9px] font-bold text-[#00ff88] font-mono block uppercase tracking-wider">// EXPLICIT NEXT COMMAND:</span>
                                  <code className="text-gray-400 bg-black/60 p-1 px-1.5 rounded block select-text font-mono text-[10px] border border-gray-900">
                                    {step}
                                  </code>
                                </div>
                              </div>
                            )}

                            {/* Task Renderer Component */}
                            <div className="mt-3">
                              {task.completed ? (
                                <div className="text-[11px] font-mono text-gray-500 bg-emerald-950/5 p-2 rounded border border-emerald-950/10 leading-relaxed font-sans">
                                  <span className="text-emerald-400 uppercase font-black text-[9px] block mb-0.5">// STEP COMPLETED</span>
                                  {task.description}
                                </div>
                              ) : (
                                <TaskRenderer 
                                  task={task} 
                                  onComplete={() => handleTaskSolved(task.id)} 
                                  disabled={isLabFullyCompleted}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Redundant Submit Sandbox Level Flags */}
                  <div className="pt-4 border-t border-gray-900 mt-6 bg-gray-950/40 p-3 rounded-lg border border-gray-900/50">
                    <ChallengeBox
                      challenge={lab.challenge}
                      onChallengeSolved={handleChallengeSolved}
                      completed={isChallengeCompleted}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: STEP-BY-STEP SOLUTION & WALKTHROUGH GUIDE (Tab requested by user) */}
              {activeSidebarTab === 'guide' && (
                <div className="space-y-4">
                  
                  {/* High level contextual brief description */}
                  <div className="bg-emerald-950/10 p-3.5 rounded-lg border border-emerald-500/20 font-mono text-[11px]">
                    <span className="text-[9.5px] uppercase font-black text-[#00ff88] block mb-1 tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      ACADEMY RANGE LAB MANUAL:
                    </span>
                    <p className="text-gray-300 font-sans leading-relaxed text-[11.5px]">
                      {lab.description}
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <h3 className="font-mono text-[10PX] uppercase text-[#00ff88] font-bold block select-none tracking-wider">
                      WALKTHROUGH STEP-BY-STEP SOLUTION GUIDE:
                    </h3>

                    {activeTasks.map((t, idx) => {
                      const { hint, step } = getTaskHintAndSolution(lab.id, t.id, t);
                      const isFirstUnsolved = !t.completed && (idx === 0 || activeTasks[idx-1].completed);

                      return (
                        <div 
                          key={t.id} 
                          className={`relative rounded-lg p-3 bg-black/40 border transition-all
                            ${t.completed 
                              ? 'border-emerald-500/20 opacity-70 bg-emerald-950/5' 
                              : isFirstUnsolved 
                                ? 'border-[#00ff88] ring-1 ring-[#00ff88]/30 shadow-md shadow-[#00ff88]/5 bg-emerald-950/5' 
                                : 'border-gray-900 opacity-80'
                            }`}
                        >
                          
                          {/* Flag indicating next step inline */}
                          {isFirstUnsolved && (
                            <span className="absolute -top-2 right-3 px-2 py-0.5 bg-[#00ff88] text-black font-mono font-black text-[8px] rounded uppercase tracking-widest leading-none shadow shadow-[#00ff88]/30">
                              NEXT ACTION ITEM
                            </span>
                          )}

                          <div className="flex items-center gap-1.5 font-mono mb-2">
                            <span className="text-[#00ff88] font-bold text-xs font-mono">STEP_0{t.id}:</span>
                            <span className="text-gray-400 font-bold text-[11px] truncate">{t.title}</span>
                          </div>

                          <div className="space-y-3 font-sans text-xs">
                            <div className="text-gray-300 leading-relaxed text-[11px]">
                              {t.description}
                            </div>

                            {/* Objective target command box with Instant Load action */}
                            <div className="bg-black/70 p-2.5 rounded border border-gray-950 font-mono text-[11px] space-y-1.5 relative">
                              <span className="text-[8.5px] text-gray-500 font-black block uppercase tracking-wider">// COPY_COMMAND & RUN IN KALI COSOLE:</span>
                              <div className="flex items-center justify-between gap-1.5 bg-black/40 p-1.5 px-2 rounded border border-gray-900">
                                <code className="text-[#00ff88] select-all truncate text-[10.5px] font-mono leading-none py-0.5">{step}</code>
                                <button
                                  onClick={() => handleCopyCommandText(step, t.id)}
                                  className="text-gray-400 hover:text-white shrink-0 p-1 hover:bg-gray-850 rounded border border-gray-900 hover:border-gray-850 transition-colors"
                                  title="Copy text code payload to clipboard"
                                >
                                  {copiedIndex === t.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Solution walkthrough summary list */}
                            <div className="bg-emerald-950/5 p-2 rounded border border-emerald-900/10 py-2 font-sans space-y-1">
                              <span className="text-[8.5px] font-bold text-blue-400 font-mono block uppercase tracking-wider">// EXPLAINER & OBJECTIVE SOLUTION:</span>
                              <p className="text-gray-400 text-[10.5px] leading-relaxed">
                                {hint}
                              </p>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

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

