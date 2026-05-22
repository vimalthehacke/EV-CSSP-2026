import { create } from 'zustand';
import { Lab, LabCategory, Task, Challenge } from '../types';
import { getData, setData } from '../lib/storage';
import { useXPStore } from './xpStore';

interface ProgressData {
  completed: number[];
  unlocked: number[];
  completedTasks: Record<number, number[]>; // mapping labId -> array of completed taskIds
  completedChallenges: number[]; // array of completed labIds for challenges
}

interface ProgressState {
  labs: Lab[];
  completedLabs: number[];
  unlockedLabs: number[];
  completedTasks: Record<number, number[]>;
  completedChallenges: number[];
  completeLab: (id: number) => void;
  completeTask: (labId: number, taskId: number) => void;
  completeChallenge: (labId: number) => void;
  resetTask: (labId: number, taskId: number) => void;
  resetLab: (labId: number) => void;
  calculateProgress: () => number;
  resetProgress: () => void;
}

// Full 16-lab suite populated with multi-type interactive tasks (quiz, terminal, interactive)
export const INITIAL_LABS: (Omit<Lab, 'unlocked' | 'completed' | 'tasks'> & { tasks: Task[] })[] = [
  {
    id: 1,
    title: "Hacker Foundations",
    description: "Launch your cyber training with security fundamentals, attacker categorization taxonomies, CIA Triad principles, and ethical hacking outlines.",
    category: "Reconnaissance",
    difficulty: "Beginner",
    xpReward: 100,
    flag: "EV_FLAG{HACK_FOUND_101}",
    tasks: [
      { id: 1, title: "CIA Triad Concepts", type: "interactive", description: "Review and analyze key security pillars inside the card layout: Confidentiality (read access restriction), Integrity (data modification guard), and Availability (system runtime access).", question: "Which security pillar ensures that sensitive logs or password files are protected against unauthorized peek access?", options: ["Confidentiality", "Integrity", "Availability"], expectedAnswer: "Confidentiality", completed: false },
      { id: 2, title: "Hacker Taxonomy Quiz", type: "quiz", description: "Learn how threat groups map to motivations and permission limits.", question: "What classification is assigned to ethical cybersecurity professionals authorized to execute audit scans and patches?", options: ["Black Hat", "White Hat", "Grey Hat", "Script Kiddie"], expectedAnswer: "White Hat", completed: false },
      { id: 3, title: "Attack Scenario Triage", type: "quiz", description: "Deconstruct real incident logs. A victim is lured to click a cloned bank banking login panel.", question: "Identify this attack signature used to harvest targets' credentials via matching fake layout pages:", options: ["Phishing", "DDoS", "SQL Injection", "Buffer Overflow"], expectedAnswer: "Phishing", completed: false },
      { id: 4, title: "Ethics Boundary", type: "quiz", description: "Evaluate strict legal constraints governing active vulnerability audits.", question: "Is it legally permissible to run aggressive exploit scripts on public web servers without explicit written authorization?", options: ["Yes", "No"], expectedAnswer: "No", completed: false },
      { id: 5, title: "Cyber Laws Framework", type: "quiz", description: "Determine federal and international legal regulations governing network compromises.", question: "Which primary legislative act in the United States constructs criminal cases against unauthorized database break-ins?", options: ["CFAA (Computer Fraud and Abuse Act)", "GDPR", "HIPAA", "PCI-DSS"], expectedAnswer: "CFAA (Computer Fraud and Abuse Act)", completed: false }
    ],
    challenge: {
      question: "Experience the simulated workspace. Use your terminal panel to initialize a subdirectory chain. Build a new folder named 'myfirstlab', traverse down inside it, make a placeholder file 'day1.txt', then verify security by submitting the FLAG below:",
      flag: "EV_FLAG{HACK_FOUND_101}",
      rewardXP: 200,
      terminalPrompt: "student@cyber-academy:~$",
      hints: [
        "First, list standard workspace files utilizing 'ls' command.",
        "Create the directory path: 'mkdir myfirstlab'.",
        "Traverse inside the clean directory using: 'cd myfirstlab'.",
        "Generate the placeholder text file: 'touch day1.txt', and submit: EV_FLAG{HACK_FOUND_101}."
      ],
      filesystem: {
        "welcome.md": "Welcome to EV Cyber Academy, student. Run command: 'cat welcome.md' to retrieve guidelines.\nFLAG TOKEN: EV_FLAG{HACK_FOUND_101}"
      } as any
    }
  },
  {
    id: 2,
    title: "Linux Basics",
    description: "Operate standard Linux file structures using raw command tools. Learn relative and absolute navigation paths and files creation/deletion.",
    category: "Privilege Escalation",
    difficulty: "Beginner",
    xpReward: 100,
    flag: "EV_FLAG{LINUX_R00KIE_BASH}",
    tasks: [
      { id: 1, title: "Print Directory Context", type: "terminal", description: "Enquire about your active directory path locator in the shell.", commandRequired: "pwd", completed: false },
      { id: 2, title: "Enumerate Directory contents", type: "terminal", description: "Render names of active files and resources present inside the current system location.", commandRequired: "ls", completed: false },
      { id: 3, title: "Change Workspace Location", type: "terminal", description: "Set your path context into the system's interactive student directory using cd without args.", commandRequired: "cd", completed: false },
      { id: 4, title: "Create Workspace Folder", type: "terminal", description: "Generate a folder named 'training_room' utilizing mkdir in active root.", commandRequired: "mkdir training_room", completed: false },
      { id: 5, title: "Initialize Text Stream", type: "terminal", description: "Generate a blank file 'secrets.txt' to log flags.", commandRequired: "touch secrets.txt", completed: false },
      { id: 6, title: "Wipe Obsolete Temporary Files", type: "terminal", description: "Remove obsolete file structure 'scratch_pad.tmp' from disk using rm.", commandRequired: "rm scratch_pad.tmp", completed: false }
    ],
    challenge: {
      question: "Organize dynamic workspace directories. Create a folder named 'ev', navigate down inside it, and touch a file 'notes.txt'. To complete this lab, view the FLAG file in the root home using 'cat flag.txt' and submit its hash:",
      flag: "EV_FLAG{LINUX_R00KIE_BASH}",
      rewardXP: 200,
      terminalPrompt: "student@cyber-academy:~$",
      hints: [
        "Construct the new 'ev' directory block: 'mkdir ev'.",
        "Move into the directory: 'cd ev', and touch file: 'touch notes.txt'.",
        "Locate the flag file: 'cat flag.txt' or 'cat /home/student/flag.txt' to extract its text value."
      ],
      filesystem: {
        "flag.txt": "EV_FLAG{LINUX_R00KIE_BASH}",
        "scratch_pad.tmp": "Temporary dump. Delete this file using rm command to complete the final task."
      } as any
    }
  },
  {
    id: 3,
    title: "Linux Advanced",
    description: "Level up Linux operatorship. Gain competence handling permission grids, copying files, renaming targets, and editing system configurations.",
    category: "Privilege Escalation",
    difficulty: "Beginner",
    xpReward: 100,
    flag: "EV_FLAG{CHMOD_NANO_MASTER}",
    tasks: [
      { id: 1, title: "Copy Backup Configurations", type: "terminal", description: "Clone configuration templates 'config.bak' copy into active 'config.txt'.", commandRequired: "cp config.bak config.txt", completed: false },
      { id: 2, title: "Rename Logs Structure", type: "terminal", description: "Move 'raw_log.log' renaming root into a clean 'security.log' endpoint.", commandRequired: "mv raw_log.log security.log", completed: false },
      { id: 3, title: "Modify Execution Authority", type: "terminal", description: "Grant full permission bits (read, write, execute) to shell launcher 'exploit.sh' parameter using chmod 777.", commandRequired: "chmod 777 exploit.sh", completed: false },
      { id: 4, title: "Configure Active Firewall", type: "interactive", description: "Edit firewall policies. Inside the Nano configuration card, select and commit policy values to secure port pathways.", question: "Which parameter string shuts off public inbound payloads inside active nano configuration lists?", options: ["block_all_payloads=false", "block_all_payloads=true", "port_traffic=8080", "restrict_ips=none"], expectedAnswer: "block_all_payloads=true", completed: false }
    ],
    challenge: {
      question: "Explore Linux credentials exposure. You will notice a locked file 'flag.txt' has inaccessible permission flags ('---------'). Update its permission flags using 'chmod 777 flag.txt', view its content with cat, and submit the FLAG token:",
      flag: "EV_FLAG{CHMOD_NANO_MASTER}",
      rewardXP: 200,
      terminalPrompt: "operator@ev-academy:~$",
      hints: [
        "Enumerate active files permission codes: 'ls'. Notice the dashes on flag.txt.",
        "Overrule restrictions: 'chmod 777 flag.txt' or 'chmod rwxrwxrwx flag.txt'.",
        "Stream file data back to screen using: 'cat flag.txt' and submit the token."
      ],
      filesystem: {
        "config.bak": "port_traffic=8080\nmax_connections=128",
        "raw_log.log": "UTC 12:00:15 - Port scanning packet activity logged from 10.0.2.40.",
        "exploit.sh": "#!/bin/bash\nwhoami && echo 'Exploitation module active.'",
        "flag.txt": "EV_FLAG{CHMOD_NANO_MASTER}"
      } as any
    }
  },
  {
    id: 4,
    title: "Networking Basics",
    description: "Analyze active system networks. Diagnose default gateway interfaces, audit public ping metrics, resolve target host nameservers, and trace ports.",
    category: "Network Attack",
    difficulty: "Intermediate",
    xpReward: 100,
    flag: "EV_FLAG{NET_PING_RESOLVE}",
    tasks: [
      { id: 1, title: "Query Interfaces Map", type: "terminal", description: "Gather diagnostic addresses for your active routing interfaces.", commandRequired: "ifconfig", completed: false },
      { id: 2, title: "Ping Cloud Domains", type: "terminal", description: "Run network reachability pings targeting 'google.com' using the system ping tool.", commandRequired: "ping google.com", completed: false },
      { id: 3, title: "Resolve DNS Domain mappings", type: "terminal", description: "Query host server address metrics matching domain google.com.", commandRequired: "nslookup google.com", completed: false },
      { id: 4, title: "Standard Service Ports quiz", type: "quiz", description: "Analyze web server request ports.", question: "What is the standard port number mapped to HTTP requests globally?", options: ["80", "443", "22", "53"], expectedAnswer: "80", completed: false }
    ],
    challenge: {
      question: "Review host connection variables. Investigate netstat sockets or run dns lookups inside the console workspace to read interface stats, inspect 'subnet.info' settings, and submit the network verification FLAG:",
      flag: "EV_FLAG{NET_PING_RESOLVE}",
      rewardXP: 200,
      terminalPrompt: "packet_analyst@ev:~$",
      hints: [
        "Identify virtual gateway metrics: 'cat subnet.info'.",
        "Verify standard host resolve schemas: 'nslookup google.com'.",
        "Submit the validated challenge token: EV_FLAG{NET_PING_RESOLVE}."
      ],
      filesystem: {
        "subnet.info": "LAN scope boundaries: 10.0.2.0/24\nPrimary gateway proxy: 10.0.2.1\nFLAG: EV_FLAG{NET_PING_RESOLVE}"
      } as any
    }
  },
  {
    id: 5,
    title: "Internet Working",
    description: "Examine transport topologies. Contrast TCP stream models against UDP datagram schemas, analyze OSI stack references, trace paths, and query sockets.",
    category: "Web Exploitation",
    difficulty: "Intermediate",
    xpReward: 100,
    flag: "EV_FLAG{OSI_TRACEROUTE_NAV}",
    tasks: [
      { id: 1, title: "HTTP vs HTTPS Protocols Quiz", type: "quiz", description: "Verify safety enhancements protecting web payloads.", question: "Which encryption technology secures HTTPS sessions over plain web text?", options: ["TLS/SSL", "SCP", "SFTP", "UDP"], expectedAnswer: "TLS/SSL", completed: false },
      { id: 2, title: "Transport Classifications", type: "quiz", description: "Isolate transport system qualities.", question: "Which transport protocol guarantees ordered delivery using standard handshake packets?", options: ["UDP", "TCP", "ICMP", "ARP"], expectedAnswer: "TCP", completed: false },
      { id: 3, title: "OSI Stack Reference Map", type: "interactive", description: "Formulate layers of the Open Systems Interconnection model.", question: "At which layer of the OSI model do network routers switch packet routing headers?", options: ["Application Layer", "Transport Layer", "Network Layer", "Physical Layer"], expectedAnswer: "Network Layer", completed: false },
      { id: 4, title: "Trace Dynamic Hop Routes", type: "terminal", description: "Pinpoint intermediary gateways handling domain routes using traceroute.", commandRequired: "traceroute google.com", completed: false },
      { id: 5, title: "Audit Open Sockets State", type: "terminal", description: "List listening ports on your loopback using netstat.", commandRequired: "netstat", completed: false }
    ],
    challenge: {
      question: "Inspect routing metrics using diagnostics tools. Review 'gateways.cfg' parameters, match transport properties inside active records, and submit the network navigations FLAG:",
      flag: "EV_FLAG{OSI_TRACEROUTE_NAV}",
      rewardXP: 200,
      terminalPrompt: "net_engineer@ev:~$",
      hints: [
        "Audit socket configurations: 'netstat'.",
        "Check gateway rules mapping file content: 'cat gateways.cfg'.",
        "Submit the navigation flag: EV_FLAG{OSI_TRACEROUTE_NAV}."
      ],
      filesystem: {
        "gateways.cfg": "VIRTUAL_NAMESERVER=10.0.2.80\nFIREWALL_LOCKDOWN=true\nFLAG: EV_FLAG{OSI_TRACEROUTE_NAV}"
      } as any
    }
  },
  {
    id: 6,
    title: "Termux Tools Setup",
    description: "Launch core packaging tools inside a clean simulated Termux environment. Synchronize repository matrices and install git and nmap tools.",
    category: "Reconnaissance",
    difficulty: "Beginner",
    xpReward: 100,
    flag: "EV_FLAG{TERMUX_TOOLSMITH_6}",
    badgeName: "Toolsmith",
    tasks: [
      { id: 1, title: "Update packages", type: "terminal", description: "Initialize Termux repository lookup sync database using: pkg update", commandRequired: "pkg update", completed: false },
      { id: 2, title: "Upgrade system", type: "terminal", description: "Upgrade active packages inside system containers: pkg upgrade", commandRequired: "pkg upgrade", completed: false },
      { id: 3, title: "Install tool", type: "terminal", description: "Download git configuration and code control suite: pkg install git", commandRequired: "pkg install git", completed: false }
    ],
    challenge: {
      question: "Install the diagnostic suite 'nmap' and high-speed editing tools 'nano' inside the terminal using pkg installer triggers (pkg install nmap, pkg install nano). To secure the Toolsmith badge, solve these installations and submit the verified verification lock flag below:",
      flag: "EV_FLAG{TERMUX_TOOLSMITH_6}",
      rewardXP: 200,
      terminalPrompt: "termux@android:~$",
      hints: [
        "Run system commands 'pkg install nmap' and 'pkg install nano'.",
        "Type them into the shell to verify tool deployment, then submit EV_FLAG{TERMUX_TOOLSMITH_6}."
      ],
      filesystem: {
        "readme.txt": "Simulated Termux workspace. Practice updating or installing packages."
      } as any
    }
  },
  {
    id: 7,
    title: "Recon Basics",
    description: "Query registrar credentials of target network zones. Scan domains, inspect nameservers configurations, and identify private hidden services.",
    category: "Reconnaissance",
    difficulty: "Beginner",
    xpReward: 100,
    flag: "EV_FLAG{RECON_HUNTER_7}",
    badgeName: "Recon Hunter",
    tasks: [
      { id: 1, title: "Whois lookup", type: "terminal", description: "Query registrar records of public targets with whois example.com.", commandRequired: "whois example.com", completed: false },
      { id: 2, title: "Info gathering", type: "quiz", description: "Evaluate registered domains metadata lookup models.", question: "Which core utility gets lookup query answers matching registered administrative contacts or server registries?", options: ["whois", "grep", "cd", "rm"], expectedAnswer: "whois", completed: false },
      { id: 3, title: "Subdomain discovery", type: "interactive", description: "Classify target system subdomain records context parameters.", question: "Which corporate subdomain is typically mapped directly by administrators to access internal secure login consoles?", options: ["admin.ev-tech.com", "static.ev-tech.com", "pub.ev-tech.com", "img.ev-tech.com"], expectedAnswer: "admin.ev-tech.com", completed: false }
    ],
    challenge: {
      question: "Inquire registered parameters for 'ev-tech.com' using your terminal. Determine the administrative domain records, find the hidden subdomain 'admin.ev-tech.com', and submit: EV_FLAG{RECON_HUNTER_7}.",
      flag: "EV_FLAG{RECON_HUNTER_7}",
      rewardXP: 200,
      terminalPrompt: "recon@ev:~$",
      hints: [
        "Inquire domains info utilizing: 'whois ev-tech.com'.",
        "Verify standard administration entries: 'admin.ev-tech.com' and submit EV_FLAG{RECON_HUNTER_7}."
      ],
      filesystem: {
        "targets.txt": "Subdomain auditing database for ev-tech.com."
      } as any
    }
  },
  {
    id: 8,
    title: "Nmap Port Scanning",
    description: "Audit active system ports, diagnose listening socket services configurations, and list vulnerable open pathways.",
    category: "Network Attack",
    difficulty: "Intermediate",
    xpReward: 100,
    flag: "EV_FLAG{PORT_HUNTER_8}",
    badgeName: "Port Hunter",
    tasks: [
      { id: 1, title: "Basic scan", type: "terminal", description: "Execute basic network scanning patterns against domain targets: nmap target", commandRequired: "nmap target", completed: false },
      { id: 2, title: "Version detection", type: "terminal", description: "Scan open connection ports to capture operating software versions: nmap -sV target", commandRequired: "nmap -sV target", completed: false }
    ],
    challenge: {
      question: "Audit port configurations of target hosts. Scan target host records inside the console workspace, identify the open web service port (e.g. 80 http) and submit: EV_FLAG{PORT_HUNTER_8}.",
      flag: "EV_FLAG{PORT_HUNTER_8}",
      rewardXP: 200,
      terminalPrompt: "pentester@scanning:~$",
      hints: [
        "Execute the version command 'nmap -sV target' to discover listening ports.",
        "Verify web socket listings (80 http) and submit validation key EV_FLAG{PORT_HUNTER_8}."
      ],
      filesystem: {
        "network_notes.txt": "Scan targeting rules mapped to virtual server: 'target'."
      } as any
    }
  },
  {
    id: 9,
    title: "Web Basics",
    description: "Deconstruct client-side DOM HTML frameworks, parse web request structures, and hunt down insecure commented flags.",
    category: "Web Exploitation",
    difficulty: "Beginner",
    xpReward: 100,
    flag: "EV_FLAG{ev_hidden_123}",
    badgeName: "Web Explorer",
    tasks: [
      { id: 1, title: "Inspect HTML", type: "interactive", description: "Evaluate hidden structural comments in HTML source mockups.", question: "Which tag pattern creates unactivated code comment annotations in standard HTML files frameworks?", options: ["<!-- comment -->", "/* comment */", "// comment", "# comment"], expectedAnswer: "<!-- comment -->", completed: false },
      { id: 2, title: "Identify request", type: "quiz", description: "Identify core HTTP web request verbs operations.", question: "Which default request method sends credential values securely inside a secret request payload?", options: ["POST", "GET", "OPTIONS", "HEAD"], expectedAnswer: "POST", completed: false },
      { id: 3, title: "Find hidden text", type: "interactive", description: "Isolate client forms hidden fields.", question: "Which HTML type attribute obscures form entries from layouts but retains them in payloads?", options: ["type=\"hidden\"", "type=\"text\"", "disabled=\"true\"", "style=\"display:none\""], expectedAnswer: "type=\"hidden\"", completed: false }
    ],
    challenge: {
      question: "Audit simulated elements inside the Elements pane and retrieve the hidden comment token flag 'EV_FLAG{ev_hidden_123}' embedded in the DOM tree, then submit it below:",
      flag: "EV_FLAG{ev_hidden_123}",
      rewardXP: 200,
      terminalPrompt: "web@devtools:~$",
      hints: [
        "Search files layout or explore the simulated Chrome Elements comments.",
        "The hidden developer flag commented in HTML is: <!-- FLAG: ev_hidden_123 -->."
      ],
      filesystem: {
        "web_index.html": "<!-- FLAG: ev_hidden_123 -->"
      } as any
    }
  },
  {
    id: 10,
    title: "Web Security",
    description: "Examine browser session cookies, manage state trackers, and defend web sessions from cross-script hijacking.",
    category: "Web Exploitation",
    difficulty: "Intermediate",
    xpReward: 100,
    flag: "EV_FLAG{abc123}",
    badgeName: "Web Defender",
    tasks: [
      { id: 1, title: "Identify cookies", type: "quiz", description: "Identify storage locations for HTTP cookie parameters in web modules.", question: "Where are HTTP cookies stored by default to facilitate state management for returning clients?", options: ["Client Browser", "Server Database", "Router Sockets", "Local Subnets"], expectedAnswer: "Client Browser", completed: false },
      { id: 2, title: "Session vs auth", type: "interactive", description: "Defend browser security values utilizing cookie headers flags.", question: "Which cookie setting blocks client side scripts from accessing session tokens?", options: ["HttpOnly", "Secure", "SameSite", "Domain"], expectedAnswer: "HttpOnly", completed: false }
    ],
    challenge: {
      question: "Examine Simulated Browser Cookie jars. Extract the active session ID value ('abc123') and submit its verification tag: EV_FLAG{abc123}.",
      flag: "EV_FLAG{abc123}",
      rewardXP: 200,
      terminalPrompt: "cookie_audit@security:~$",
      hints: [
        "Inquire Simulated cookie logs values: session_id=abc123.",
        "Submit security validation tag: EV_FLAG{abc123}."
      ],
      filesystem: {
        "cookies.json": "{\"session_id\":\"abc123\",\"user\":\"admin\"}"
      } as any
    }
  },
  {
    id: 11,
    title: "Social Engineering & Phishing Defense",
    description: "Deconstruct real phishing campaigns, analyze deceptive URL domains redirection vectors, and verify password strength security barriers.",
    category: "Reconnaissance",
    difficulty: "Beginner",
    xpReward: 100,
    flag: "EV_FLAG{fake_g00gle_11}",
    badgeName: "Human Firewall",
    tasks: [
      { id: 1, title: "Identify Phishing Signatures", type: "interactive", description: "Review the simulated emails. Some use suspicious greetings, urgent threats, and mismatched sender headers.", question: "Which sender header is a clear phishing indicator?", options: ["support@g00gle.com", "service@google.com", "billing@ev-tech.com"], expectedAnswer: "support@g00gle.com", completed: false },
      { id: 2, title: "Hover Link Inspection", type: "interactive", description: "In the simulation, hover over the links inside the email body to check their actual target destination.", question: "What fake destination URL does the urgent billing link point to?", options: ["https://g00gle.com/secure_bill", "https://google.com/billing", "https://ev-tech.com/portal"], expectedAnswer: "https://g00gle.com/secure_bill", completed: false },
      { id: 3, title: "Password Strength Verification", type: "quiz", description: "Compare password composition characteristics for entropy.", question: "Which of these passwords offers the highest resistance to dictionary attacks?", options: ["admin123", "P@ssw0rd2025", "S3cure_Pr0t0c0l_#82!", "spring2026"], expectedAnswer: "S3cure_Pr0t0c0l_#82!", completed: false }
    ],
    challenge: {
      question: "Examine the social engineering sandbox email and hover elements. Identify the exact fake domain being used to trick the targeted employee, and submit the flag: EV_FLAG{fake_g00gle_11}",
      flag: "EV_FLAG{fake_g00gle_11}",
      rewardXP: 200,
      terminalPrompt: "phish_expert@ev:~$",
      hints: [
        "Read the simulated email on the right very carefully.",
        "Notice of spelling anomalies: look at spelling of g00gle.com.",
        "The flag is: EV_FLAG{fake_g00gle_11}."
      ],
      filesystem: {
        "phishing_tips.txt": "Phishing detection checklist:\n1. Check Sender Address closely (e.g. g00gle instead of google)\n2. Look for urgent call-to-actions\n3. Hover over links before clicking"
      } as any
    }
  },
  {
    id: 12,
    title: "Mobile Security & APK Analysis",
    description: "Analyze Android app package manifests, review dangerous permissions requests, and identify critical risk signatures.",
    category: "Privilege Escalation",
    difficulty: "Intermediate",
    xpReward: 100,
    flag: "EV_FLAG{SMS_READ_VIOLATION_12}",
    badgeName: "Mobile Analyst",
    tasks: [
      { id: 1, title: "Review App Registry Permissions", type: "quiz", description: "Examine common Android security permission frameworks.", question: "Which permission allows an app to intercept incoming verification codes?", options: ["RECEIVE_SMS", "READ_CALENDAR", "ACCESS_COARSE_LOCATION", "CAMERA"], expectedAnswer: "RECEIVE_SMS", completed: false },
      { id: 2, title: "Identify High-Risk Manifest Attributes", type: "interactive", description: "Evaluate app manifest requests to locate attributes that bypass standard sandboxing restrictions.", question: "Select the most lethal permission combo for a secondary keypad app:", options: ["READ_SMS + INTERNET", "RECORD_AUDIO", "VIBRATE", "SET_WALLPAPER"], expectedAnswer: "READ_SMS + INTERNET", completed: false }
    ],
    challenge: {
      question: "Analyze the uploaded 'malicious.apk' manifest in the security console analyzer. Find which high-risk background permission is requested alongside INTERNET access to log incoming messages, and enter the flag: EV_FLAG{SMS_READ_VIOLATION_12}",
      flag: "EV_FLAG{SMS_READ_VIOLATION_12}",
      rewardXP: 200,
      terminalPrompt: "mobile_analyst@ev:~$",
      hints: [
        "Open the fake APK Analyzer UI on the right.",
        "Identify standard dangerous SMS access keys: READ_SMS or RECEIVE_SMS.",
        "The verified mobile security flag is: EV_FLAG{SMS_READ_VIOLATION_12}."
      ],
      filesystem: {
        "apk_audit.log": "ANALYSIS COMPLETED // TARGET: malicious.apk\nExposed Permission: READ_SMS (High Critical Security Risk)"
      } as any
    }
  },
  {
    id: 13,
    title: "Bug Bounty Discovery Intro",
    description: "Launch reconnaissance pipelines on target sites, map active web endpoints, and identify hidden, unprotected directory paths.",
    category: "Reconnaissance",
    difficulty: "Intermediate",
    xpReward: 100,
    flag: "EV_FLAG{hidden_admin_13}",
    badgeName: "Bug Hunter",
    tasks: [
      { id: 1, title: "Recon Target Site Subdomains", type: "interactive", description: "Review subdomains indexed under the parent domain: lab.ev-site.com.", question: "What subdomain is typically scanned during passive DNS intelligence gathering?", options: ["lab.ev-site.com", "assets.ev-site.com", "static-images.ev-site.com"], expectedAnswer: "lab.ev-site.com", completed: false },
      { id: 2, title: "Discover Hidden Web Directories", type: "interactive", description: "Perform a content discovery directory scan mapping index directories.", question: "Which standard config file instructs web crawlers to ignore certain directories but often leaks path lists to scouts?", options: ["robots.txt", "index.html", "package.json", "styles.css"], expectedAnswer: "robots.txt", completed: false }
    ],
    challenge: {
      question: "Examine the simulated website portal 'lab.ev-site.com' inside the Simulator. Find the hidden administrator route and submit its access token flag: EV_FLAG{hidden_admin_13}",
      flag: "EV_FLAG{hidden_admin_13}",
      rewardXP: 200,
      terminalPrompt: "bug_bounty@ev:~$",
      hints: [
        "Inspect site routes, look for administration endpoints like /hidden-admin or search robots.txt.",
        "Submit security validation flag text: EV_FLAG{hidden_admin_13}."
      ],
      filesystem: {
        "robots.txt": "User-agent: *\nDisallow: /hidden-admin\nDisallow: /backup-configs"
      } as any
    }
  },
  {
    id: 14,
    title: "Security Reporting & Vulnerability Docs",
    description: "Document security audit findings professionally with standardized CVSS impact metrics and remediation recommendations.",
    category: "Web Exploitation",
    difficulty: "Intermediate",
    xpReward: 100,
    flag: "EV_FLAG{verified_reporter_14}",
    badgeName: "Security Reporter",
    tasks: [
      { id: 1, title: "Write Vulnerability Report Title", type: "interactive", description: "Formulate a concise and clear title highlighting the exploit vectors.", question: "Select the most professional title for a CVSS high-severity SQL Injection bug:", options: ["SQL Injection Vulnerability in login parameter allowing Authentication Bypass", "My computer hacked user table database", "Severe website exploit found on servers"], expectedAnswer: "SQL Injection Vulnerability in login parameter allowing Authentication Bypass", completed: false },
      { id: 2, title: "Define Impact Severity Metric", type: "interactive", description: "Categorize business and infrastructure impact risks using CVSS guidelines.", question: "What CVSS 3.1 score tier is assigned to an exploit that allows complete remote code execution without key restrictions?", options: ["Critical (9.0 - 10.0)", "Medium (4.0 - 6.9)", "Low (0.1 - 3.9)"], expectedAnswer: "Critical (9.0 - 10.0)", completed: false },
      { id: 3, title: "Formulate Remediation Steps", type: "quiz", description: "Suggest solid defense improvements to mitigate the identified threat.", question: "What is the best development approach to neutralize SQL injection vulnerabilities?", options: ["Parameterized queries / Prepared statements", "Hiding input forms with CSS", "Adding inline javascript filters"], expectedAnswer: "Parameterized queries / Prepared statements", completed: false }
    ],
    challenge: {
      question: "Complete the interactive security report builder on the right. Submit the finalized audit report to EV security teams to retrieve the verification flag: EV_FLAG{verified_reporter_14}",
      flag: "EV_FLAG{verified_reporter_14}",
      rewardXP: 200,
      terminalPrompt: "sec_reporter@ev:~$",
      hints: [
        "Fulfill report builder form parameters on the right.",
        "Verify your live report preview, then hit 'Submit Secure Report'.",
        "The report verification flag is: EV_FLAG{verified_reporter_14}."
      ],
      filesystem: {
        "report_template.json": "{\"title\":\"SQL Injection\",\"severity\":\"Critical\",\"mitigation\":\"Prepared Statements\"}"
      } as any
    }
  },
  {
    id: 15,
    title: "Cyberspace Career Path & Git setup",
    description: "Choose a specialism path (SOC Analyst, Pentester, or Bug Hunter), configure active development setups, and build continuous learning checklists.",
    category: "Reconnaissance",
    difficulty: "Beginner",
    xpReward: 100,
    flag: "EV_FLAG{career_builder_15}",
    badgeName: "Career Builder",
    tasks: [
      { id: 1, title: "Isolate Primary Specialism Role", type: "interactive", description: "Examine security team positions. A Pentester simulates offensive attacks, a SOC analyst defends systems, and a Bug Hunter hunts open programs.", question: "Which career role specializes in auditing active production endpoints for public rewards programs?", options: ["Bug Hunter", "SOC Analyst", "Database Admin"], expectedAnswer: "Bug Hunter", completed: false },
      { id: 2, title: "Assemble Progression Roadmap Node", type: "quiz", description: "Design a study plan mapping credentials and system utilities.", question: "Which offensive lab certification is widely recognized for hands-on, interactive penetration testing?", options: ["OSCP", "ITIL foundations", "PMP Agile", "AWS Cloud Practitioner"], expectedAnswer: "OSCP", completed: false }
    ],
    challenge: {
      question: "Deploy your professional github workspace via the Git Workspace Simulator. Choose a role and select learning pathways to create your career roadmap file, then submit: EV_FLAG{career_builder_15}",
      flag: "EV_FLAG{career_builder_15}",
      rewardXP: 200,
      terminalPrompt: "career_coach@ev:~$",
      hints: [
        "Navigate the career choices on the right.",
        "Submit the roadmap and claim your career builder flag parameters: EV_FLAG{career_builder_15}."
      ],
      filesystem: {
        "roadmap.md": "# EV Academy Study Roadmap\nTarget: Pentesting & Bug Hunting\nMilestone 1: Web Security Basics\nMilestone 2: OSCP Lab Auditing"
      } as any
    }
  },
  {
    id: 16,
    title: "The Final Capstone - Cyber Academy Graduation",
    description: "Demonstate full technical competence. Passive reconnaissance lookups, scan ports, exploit SQL injections, and lock down malicious indicators.",
    category: "Network Attack",
    difficulty: "Boss",
    xpReward: 300,
    flag: "EV_FLAG{ev_academy_graduate_2026}",
    badgeName: "EV Cyber Academy Graduate",
    tasks: [
      { id: 1, title: "Stage 1: Execute Subdomain Recon", type: "interactive", description: "Run passive subdomains enumeration loops around EV Academy's secure training site.", question: "Which target subdomain is discovered under the ev-academy.com domain?", options: ["internal-labs.ev-academy.com", "billing-temp.ev-academy.com", "restricted-static.ev-academy.com"], expectedAnswer: "internal-labs.ev-academy.com", completed: false },
      { id: 2, title: "Stage 2: Scan Open Sockets", type: "interactive", description: "Scan open ports targeting the domain 'internal-labs.ev-academy.com'.", question: "Which service port listens on the target host for administrative terminal access?", options: ["Port 22 (SSH)", "Port 21 (FTP)", "Port 23 (Telnet)"], expectedAnswer: "Port 22 (SSH)", completed: false },
      { id: 3, title: "Stage 3: Extract Exploitable Credentials", type: "quiz", description: "Analyze database error flags during mock SQL statements parsing loops.", question: "Which SQL command injects logic boundaries to bypass username authentications?", options: ["' OR '1'='1", "DROP TABLE users;", "SELECT * FROM logs"], expectedAnswer: "' OR '1'='1'", completed: false }
    ],
    challenge: {
      question: "Combine Recon, Scanning, and Exploit steps inside the Capstone Console on the right. Unlock the system database, download the core graduation credentials file, and claim your legendary final flag: EV_FLAG{ev_academy_graduate_2026}",
      flag: "EV_FLAG{ev_academy_graduate_2026}",
      rewardXP: 500,
      terminalPrompt: "graduate_candidate@ev-academy:~$",
      hints: [
        "Solve all sequential multi-step CTF requirements inside the visual terminal/web capstone simulator.",
        "Step 1: run lookup on internal-labs.ev-academy.com.\nStep 2: scan port metrics.\nStep 3: inject database payload and fetch the graduation flag.\nFlag: EV_FLAG{ev_academy_graduate_2026}."
      ],
      filesystem: {
        "graduation_guide.txt": "Congratulations on reaching the final capstone!\nComplete the dynamic simulator, submit flag: EV_FLAG{ev_academy_graduate_2026}."
      } as any
    }
  }
];

export const useProgressStore = create<ProgressState>((set, get) => {
  // Load cached progress parameters
  const cache = getData<ProgressData>('ev_progress') || {
    completed: [],
    unlocked: [1], // Lab 1 is unlocked initially
    completedTasks: {},
    completedChallenges: []
  };

  // Ensure completedTasks and completedChallenges exist in case of old schema cache loading
  if (!cache.completedTasks) { cache.completedTasks = {}; }
  if (!cache.completedChallenges) { cache.completedChallenges = []; }

  // Construct labs helper with dynamic task levels and lock status values
  const computeLabsList = (completed: number[], unlocked: number[], completedTasks: Record<number, number[]>, completedChallenges: number[]) => {
    return INITIAL_LABS.map(lab => {
      const isLabCompleted = completed.includes(lab.id);
      const isLabUnlocked = unlocked.includes(lab.id);
      
      // Update task completion statuses dynamically
      const labCompletedTasks = completedTasks[lab.id] || [];
      const updatedTasks = lab.tasks.map(task => ({
        ...task,
        completed: isLabCompleted || labCompletedTasks.includes(task.id)
      }));

      return {
        ...lab,
        completed: isLabCompleted,
        unlocked: isLabUnlocked,
        tasks: updatedTasks
      } as Lab;
    });
  };

  return {
    labs: computeLabsList(cache.completed, cache.unlocked, cache.completedTasks, cache.completedChallenges),
    completedLabs: cache.completed,
    unlockedLabs: cache.unlocked,
    completedTasks: cache.completedTasks,
    completedChallenges: cache.completedChallenges,

    calculateProgress: () => {
      const state = get();
      const totalLabs = INITIAL_LABS.length;
      if (totalLabs === 0) return 0;
      const done = state.completedLabs.length;
      return Math.round((done / totalLabs) * 100);
    },

    completeTask: (labId: number, taskId: number) => {
      set((state) => {
        const lab = state.labs.find(l => l.id === labId);
        if (!lab || !lab.unlocked || lab.completed) return {};

        const currentLabCompletedTasks = state.completedTasks[labId] || [];
        if (currentLabCompletedTasks.includes(taskId)) return {};

        const nextLabCompletedTasks = [...currentLabCompletedTasks, taskId];
        const nextCompletedTasks = {
          ...state.completedTasks,
          [labId]: nextLabCompletedTasks
        };

        // Complete task outputs +20 XP instantly
        useXPStore.getState().addXP(20);

        // Check Lab Completion condition: All tasks complete AND challenge completed
        const targetLab = INITIAL_LABS.find(l => l.id === labId);
        const allTasksCompleted = targetLab ? targetLab.tasks.every(t => nextLabCompletedTasks.includes(t.id)) : false;
        const challengeCompleted = state.completedChallenges.includes(labId);

        let nextCompletedLabs = [...state.completedLabs];
        let nextUnlockedLabs = [...state.unlockedLabs];

        if (allTasksCompleted && challengeCompleted && !nextCompletedLabs.includes(labId)) {
          nextCompletedLabs.push(labId);
          // Unlock subsequent lab
          const nextLabId = labId + 1;
          const nextLabExists = INITIAL_LABS.some(l => l.id === nextLabId);
          if (nextLabExists && !nextUnlockedLabs.includes(nextLabId)) {
            nextUnlockedLabs.push(nextLabId);
          }
          // Lab Complete triggers +100 XP
          useXPStore.getState().addXP(100);
        }

        const newData: ProgressData = {
          completed: nextCompletedLabs,
          unlocked: nextUnlockedLabs,
          completedTasks: nextCompletedTasks,
          completedChallenges: state.completedChallenges
        };
        setData('ev_progress', newData);

        return {
          completedTasks: nextCompletedTasks,
          completedLabs: nextCompletedLabs,
          unlockedLabs: nextUnlockedLabs,
          labs: computeLabsList(nextCompletedLabs, nextUnlockedLabs, nextCompletedTasks, state.completedChallenges)
        };
      });
    },

    completeChallenge: (labId: number) => {
      set((state) => {
        const lab = state.labs.find(l => l.id === labId);
        if (!lab || !lab.unlocked || lab.completed) return {};

        if (state.completedChallenges.includes(labId)) return {};

        const nextCompletedChallenges = [...state.completedChallenges, labId];

        // Challenge complete triggers +200 XP instantly
        useXPStore.getState().addXP(200);

        // Check Lab Completion condition: All tasks complete AND challenge completed
        const currentLabCompletedTasks = state.completedTasks[labId] || [];
        const targetLab = INITIAL_LABS.find(l => l.id === labId);
        const allTasksCompleted = targetLab ? targetLab.tasks.every(t => currentLabCompletedTasks.includes(t.id)) : false;

        let nextCompletedLabs = [...state.completedLabs];
        let nextUnlockedLabs = [...state.unlockedLabs];

        if (allTasksCompleted && !nextCompletedLabs.includes(labId)) {
          nextCompletedLabs.push(labId);
          // Unlock subsequent lab
          const nextLabId = labId + 1;
          const nextLabExists = INITIAL_LABS.some(l => l.id === nextLabId);
          if (nextLabExists && !nextUnlockedLabs.includes(nextLabId)) {
            nextUnlockedLabs.push(nextLabId);
          }
          // Lab Complete triggers +100 XP
          useXPStore.getState().addXP(100);
        }

        const newData: ProgressData = {
          completed: nextCompletedLabs,
          unlocked: nextUnlockedLabs,
          completedTasks: state.completedTasks,
          completedChallenges: nextCompletedChallenges
        };
        setData('ev_progress', newData);

        return {
          completedChallenges: nextCompletedChallenges,
          completedLabs: nextCompletedLabs,
          unlockedLabs: nextUnlockedLabs,
          labs: computeLabsList(nextCompletedLabs, nextUnlockedLabs, state.completedTasks, nextCompletedChallenges)
        };
      });
    },

    resetTask: (labId: number, taskId: number) => {
      set((state) => {
        const currentLabCompletedTasks = state.completedTasks[labId] || [];
        const nextLabCompletedTasks = currentLabCompletedTasks.filter(id => id !== taskId);
        const nextCompletedTasks = {
          ...state.completedTasks,
          [labId]: nextLabCompletedTasks
        };

        // If lab was completed, remove it from completed labs
        const nextCompletedLabs = state.completedLabs.filter(id => id !== labId);

        const newData: ProgressData = {
          completed: nextCompletedLabs,
          unlocked: state.unlockedLabs,
          completedTasks: nextCompletedTasks,
          completedChallenges: state.completedChallenges
        };
        setData('ev_progress', newData);

        return {
          completedTasks: nextCompletedTasks,
          completedLabs: nextCompletedLabs,
          labs: computeLabsList(nextCompletedLabs, state.unlockedLabs, nextCompletedTasks, state.completedChallenges)
        };
      });
    },

    resetLab: (labId: number) => {
      set((state) => {
        const nextCompletedTasks = {
          ...state.completedTasks,
          [labId]: []
        };
        const nextCompletedChallenges = state.completedChallenges.filter(id => id !== labId);
        const nextCompletedLabs = state.completedLabs.filter(id => id !== labId);

        const newData: ProgressData = {
          completed: nextCompletedLabs,
          unlocked: state.unlockedLabs,
          completedTasks: nextCompletedTasks,
          completedChallenges: nextCompletedChallenges
        };
        setData('ev_progress', newData);

        return {
          completedTasks: nextCompletedTasks,
          completedChallenges: nextCompletedChallenges,
          completedLabs: nextCompletedLabs,
          labs: computeLabsList(nextCompletedLabs, state.unlockedLabs, nextCompletedTasks, nextCompletedChallenges)
        };
      });
    },

    completeLab: (id: number) => {
      // Direct completion wrapper matching old triggers to keep safe backward compatibility
      const state = get();
      state.completeChallenge(id);
      
      // Auto complete tasks
      const lab = INITIAL_LABS.find(l => l.id === id);
      if (lab) {
        lab.tasks.forEach(task => {
          state.completeTask(id, task.id);
        });
      }
    },

    resetProgress: () => {
      const resetData: ProgressData = { completed: [], unlocked: [1], completedTasks: {}, completedChallenges: [] };
      setData('ev_progress', resetData);
      
      useXPStore.getState().resetXP();

      set({
        completedLabs: [],
        unlockedLabs: [1],
        completedTasks: {},
        completedChallenges: [],
        labs: computeLabsList([], [1], {}, [])
      });
    }
  };
});
