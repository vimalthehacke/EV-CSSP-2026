import React, { useState } from 'react';
import { 
  Eye, 
  ShieldAlert, 
  Wifi, 
  Globe, 
  Terminal as TerminalIcon, 
  Settings, 
  Mail, 
  User, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  FileText, 
  Award, 
  Sparkles, 
  Smartphone, 
  Bug, 
  ArrowRight, 
  Database,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface WebSimulatorProps {
  labId: number;
}

export const WebSimulator: React.FC<WebSimulatorProps> = ({ labId }) => {
  const [devToolsOpen, setDevToolsOpen] = useState(true);
  const [devToolsTab, setDevToolsTab] = useState<'elements' | 'network'>('elements');
  const [htmlExpanded, setHtmlExpanded] = useState(true);
  const [bodyExpanded, setBodyExpanded] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginSubmitted, setLoginSubmitted] = useState(false);

  // --- LAB 11 (Social Engineering) State ---
  const [activeMailIndex, setActiveMailIndex] = useState(0);
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const [passwordTest, setPasswordTest] = useState('');
  const [detectedClue, setDetectedClue] = useState(false);

  // --- LAB 12 (Mobile Security) State ---
  const [apkActiveTab, setApkActiveTab] = useState<'manifest' | 'permissions' | 'scanner'>('manifest');
  const [selectedDangerousPermission, setSelectedDangerousPermission] = useState<string | null>(null);
  const [scannerRiskScore, setScannerRiskScore] = useState<number | null>(null);

  // --- LAB 13 (Bug Bounty Intro) State ---
  const [reconSearchUrl, setReconSearchUrl] = useState('');
  const [reconUrls, setReconUrls] = useState<string[]>(['/index.html', '/about.html', '/contact.html']);
  const [bountyHiddenFound, setBountyHiddenFound] = useState(false);

  // --- LAB 14 (Reporting) State ---
  const [reportTitle, setReportTitle] = useState('');
  const [reportSeverity, setReportSeverity] = useState('Critical');
  const [reportDescription, setReportDescription] = useState('');
  const [reportMitigation, setReportMitigation] = useState('');
  const [activeReportStep, setActiveReportStep] = useState(1);
  const [submittedReport, setSubmittedReport] = useState<any | null>(null);

  // --- LAB 15 (Career Path) State ---
  const [chosenRole, setChosenRole] = useState<'Pentester' | 'SOC Analyst' | 'Bug Hunter' | null>(null);
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [gitTerminalStep, setGitTerminalStep] = useState(0);

  // --- LAB 16 (Capstone) State ---
  const [capstoneStep, setCapstoneStep] = useState<1 | 2 | 3 | 4>(1);
  const [capstoneSubdomainSearch, setCapstoneSubdomainSearch] = useState('');
  const [capstonePortsScanned, setCapstonePortsScanned] = useState<number[]>([]);
  const [capstoneSqlInput, setCapstoneSqlInput] = useState('');
  const [capstoneExploited, setCapstoneExploited] = useState(false);

  // Lab 11 Emails Data
  const sampleEmails = [
    {
      sender: "support@g00gle.com",
      subject: "URGENT: Re-authorize Your EV Account Credentials Now",
      body: "An unauthorized logon attempt from Beijing was detected on your EV gateway core server. Please update and re-sync your login password details securely within 2 hours or your account access is terminated.",
      linkText: "Authorize Your Credentials Matrix (Secure Link)",
      linkTarget: "https://g00gle.com/secure_bill"
    },
    {
      sender: "vimal@ev-cyber-academy.com",
      subject: "Lab Engine Progress & Graduation Updates",
      body: "Welcome to Phase 3 core security auditing. Keep up-to-date with your checklist progression and prepare for the final capstone testing. Complete all tasks manually to claim your badge.",
      linkText: "View My Progress (ev-cyber-academy.com)",
      linkTarget: "https://ev-cyber-academy.com/progress"
    }
  ];

  // Helper validation for Password Strength (Lab 11)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: "None", color: "text-gray-500", bar: "w-0 bg-gray-900" };
    if (pass === "S3cure_Pr0t0c0l_#82!") return { score: "Legendary Strength (Entropy Complete)", color: "text-[#00ff88]", bar: "w-full bg-[#00ff88]" };
    if (pass.length > 10 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
      return { score: "Strong Entropy", color: "text-emerald-400", bar: "w-4/5 bg-emerald-400" };
    }
    if (pass.length > 6 && (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass))) {
      return { score: "Moderate Entropy", color: "text-yellow-400", bar: "w-1/2 bg-yellow-400" };
    }
    return { score: "Critical Weakness (Dictionary Vulnerable)", color: "text-red-500", bar: "w-1/4 bg-red-500" };
  };

  const currentStrength = getPasswordStrength(passwordTest);

  // Trigger submission of security report (Lab 14)
  const handleSubmitReport = () => {
    if (!reportTitle || !reportDescription || !reportMitigation) {
      toast.error("VULNERABILITY_REPORT: Fulfill all report fields to submit.");
      return;
    }
    setSubmittedReport({
      title: reportTitle,
      severity: reportSeverity,
      description: reportDescription,
      mitigation: reportMitigation,
      timestamp: new Date().toISOString()
    });
    toast.success("VULNERABILITY_REPORT: Secure report submitted! Verification Flag generated.");
  };

  // Milestones for Career Path (Lab 15)
  const availableMilestones = [
    { id: "linux", title: "Master Linux Tools Command Line (Bash/Termux)" },
    { id: "recon", title: "Passive Intel Reconnaissance (WHOIS/DNS/Robots)" },
    { id: "web_expl", title: "Web Application Hijacking (SQLi/XSS/Cookies Security)" },
    { id: "android", title: "Reverse Engineer Mobile Manifests (APK Analysis)" },
    { id: "report", title: "Audit Reporting & CVSS Metric Estimations" }
  ];

  const handleToggleMilestone = (id: string) => {
    setSelectedMilestones(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <div id="cyber_web_simulator" className="flex-1 bg-slate-950 border border-gray-900 rounded-lg overflow-hidden flex flex-col font-sans h-full min-h-[440px]">
      
      {/* 🎯 BROWSER WINDOW HEAD */}
      <div className="bg-[#0b0f19] px-4 py-2 border-b border-gray-950 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
        </div>
        
        {/* Fake URL Bar */}
        <div className="flex-1 max-w-[55%] mx-auto bg-black/60 border border-gray-900/60 rounded px-3 py-1 flex items-center gap-2 text-gray-500 text-[10px] font-mono justify-center">
          <Wifi className="w-3 h-3 text-[#00ff88]" />
          <span className="text-gray-300">
            {labId === 9 && "https://login.ev-tech.com/auth_gateway"}
            {labId === 10 && "https://login.ev-tech.com/auth_gateway"}
            {labId === 11 && "https://mail-sandbox.ev-cyber.academy/inbox"}
            {labId === 12 && "https://apk-analyzer.ev-cyber.academy/home"}
            {labId === 13 && "https://recon-crawler.ev-cyber.academy/"}
            {labId === 14 && "https://vulnerability-reporter.ev-cyber.academy/"}
            {labId === 15 && "https://career-plan.ev-cyber.academy/"}
            {labId === 16 && "https://capstone-ctf.ev-cyber-academy.com"}
          </span>
        </div>

        {/* F12 Toggle */}
        <button 
          onClick={() => setDevToolsOpen(p => !p)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] uppercase font-black transition-all border
            ${devToolsOpen 
              ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/20' 
              : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
            }`}
        >
          <Settings className="w-3 h-3 animate-spin duration-1000" />
          <span>F12 DEV_TOOLS</span>
        </button>
      </div>

      {/* 🔮 MAIN WRAPPER CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        
        {/* 💻 LEFT WEB VIEWPORT */}
        <div className="flex-1 bg-slate-900 overflow-y-auto p-4 flex flex-col justify-start min-h-[220px] custom-scrollbar">
          
          {/* LAB 9 — WEB BASICS */}
          {labId === 9 && (
            <div id="lab9_view" className="max-w-xs mx-auto w-full my-auto bg-[#050811] border border-gray-800/80 rounded-lg p-5 shadow-2xl font-mono text-center space-y-4">
              <div className="w-10 h-10 bg-emerald-950/40 border border-[#00ff88]/40 text-[#00ff88] rounded-full flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(0,255,136,0.1)]">
                <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-white text-[13px] font-sans font-bold uppercase tracking-tight">EV-Tech Corporate Portal</h3>
                <p className="text-[10px] text-gray-400 font-sans leading-relaxed">System Core Secure Authentication Gateway</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setLoginSubmitted(true); }} className="space-y-3 pt-2 text-left">
                <div className="space-y-1">
                  <span className="text-[8px] text-gray-500 uppercase block font-extrabold tracking-wider">LOGIN_USER:</span>
                  <input 
                    type="text" 
                    placeholder="Username" 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full bg-black border border-gray-900 rounded p-1.5 text-[11px] text-white focus:outline-none focus:border-[#00ff88]/50"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] text-gray-500 uppercase block font-extrabold tracking-wider">LOG_PASS:</span>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-black border border-gray-900 rounded p-1.5 text-[11px] text-white focus:outline-none focus:border-[#00ff88]/50"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-900 border border-[#00ff88]/40 rounded py-1.5 text-[10px] font-bold text-white uppercase hover:bg-emerald-800 transition-all">
                  AUTHORIZE_SESSION()
                </button>
              </form>

              {loginSubmitted && (
                <div className="text-[9.5px] bg-red-950/20 border border-red-900/30 text-red-400 py-1.5 rounded uppercase font-sans font-bold flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Invalid Server Key variables!</span>
                </div>
              )}
            </div>
          )}

          {/* LAB 10 — COOKIE SECURITY */}
          {labId === 10 && (
            <div id="lab10_view" className="max-w-sm mx-auto w-full my-auto bg-[#050811] border border-gray-800/80 rounded-lg p-5 shadow-2xl font-mono space-y-4">
              <div className="flex items-center gap-2.5 border-b border-gray-950 pb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-pulse"></span>
                <div className="text-left font-sans">
                  <h3 className="text-white text-xs font-bold uppercase tracking-tight">Active session state</h3>
                  <p className="text-[9px] text-gray-500 font-bold">STATE: LOGGED_IN  //  ROLE: ADMINISTRATOR</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-emerald-950/5 border border-emerald-920/20 p-3 rounded text-left space-y-2">
                  <span className="text-[9.5px] text-[#00ff88] uppercase block tracking-wider font-extrabold">🍪 Cookie Auditor:</span>
                  <div className="space-y-1.5 overflow-x-auto text-[10px]">
                    <table className="w-full text-left font-mono">
                      <thead>
                        <tr className="border-b border-gray-950 text-[8.5px] text-gray-500 font-black uppercase">
                          <th className="pb-1">Name</th>
                          <th className="pb-1">Value</th>
                          <th className="pb-1 text-center font-bold">HttpOnly</th>
                          <th className="pb-1 text-center font-bold">Secure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-white border-b border-gray-950/50">
                          <td className="py-1 text-amber-400 font-bold font-mono">session_id</td>
                          <td className="py-1 text-emerald-400 font-bold font-mono">abc123</td>
                          <td className="py-1 text-center font-mono"><span className="text-emerald-500 font-black">✔</span></td>
                          <td className="py-1 text-center font-mono"><span className="text-emerald-500 font-black">✔</span></td>
                        </tr>
                        <tr className="text-gray-400">
                          <td className="py-1 text-gray-400 font-bold font-mono">user_role</td>
                          <td className="py-1 text-gray-300 font-semibold font-mono font-mono">admin</td>
                          <td className="py-1 text-center font-mono"><span className="text-gray-600">✖</span></td>
                          <td className="py-1 text-center font-mono"><span className="text-gray-600">✖</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-black/40 border border-gray-900 rounded p-2.5 text-left text-[9.5px] text-gray-400 font-sans leading-relaxed">
                  <span className="text-[9px] text-amber-500 font-bold uppercase block tracking-wider font-mono mb-1">// COOKIE_SECURITY_NOTE:</span>
                  Notice the <span className="text-white font-bold font-mono">session_id</span> cookie is guarded by the <span className="text-[#00ff88] font-bold font-mono">HttpOnly</span> parameter check flag, which blocks unearned local scripts from fetching session variables.
                </div>
              </div>
            </div>
          )}

          {/* LAB 11 — SOCIAL ENGINEERING */}
          {labId === 11 && (
            <div id="lab11_view" className="space-y-4 max-w-lg mx-auto w-full">
              {/* Mailbox Header */}
              <div className="bg-[#0b0f19] border border-gray-800 p-3 rounded-lg flex items-center justify-between font-mono">
                <span className="text-white font-bold text-xs flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400 animate-pulse" />
                  ACADEMY_SECURE_MAILER (INBOX)
                </span>
                <span className="text-[9px] text-cyan-400 font-bold bg-cyan-900/10 px-2 py-0.5 border border-cyan-800/30 rounded">
                  2 MESSAGES RECEIVED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Mail List */}
                <div className="md:col-span-1 space-y-2 font-mono">
                  {sampleEmails.map((email, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setActiveMailIndex(idx); setDetectedClue(false); }}
                      className={`w-full p-2.5 text-left border rounded text-[10px] transition-all flex flex-col gap-1
                        ${activeMailIndex === idx 
                          ? 'bg-cyan-950/20 border-cyan-500/50 text-white' 
                          : 'bg-black/40 border-gray-900 text-gray-400 hover:border-gray-800'}`}
                    >
                      <span className="font-bold truncate text-cyan-400">{email.sender}</span>
                      <span className="truncate leading-tight text-white font-sans">{email.subject}</span>
                    </button>
                  ))}
                </div>

                {/* Mail Detail Pane */}
                <div className="md:col-span-2 bg-[#050811] border border-gray-800 rounded-lg p-3 flex flex-col justify-between font-sans text-xs">
                  <div className="space-y-3">
                    <div className="border-b border-gray-950 pb-2 space-y-1">
                      <div className="text-[9px] font-mono text-gray-500">FROM: <span className="text-cyan-400 font-bold">{sampleEmails[activeMailIndex].sender}</span></div>
                      <div className="text-[9px] font-mono text-gray-500">SUBJECT: <span className="text-white font-bold">{sampleEmails[activeMailIndex].subject}</span></div>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {sampleEmails[activeMailIndex].body}
                    </p>
                    <div className="pt-2">
                      <a
                        href="#"
                        onMouseEnter={() => setHoveredUrl(sampleEmails[activeMailIndex].linkTarget)}
                        onMouseLeave={() => setHoveredUrl(null)}
                        onClick={(e) => { e.preventDefault(); if(activeMailIndex === 0) setDetectedClue(true); }}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-cyan-950/15 border border-cyan-500/30 text-cyan-400 rounded-md font-mono text-[10px] font-bold uppercase transition-all hover:bg-cyan-950/40"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {sampleEmails[activeMailIndex].linkText}
                      </a>
                    </div>
                  </div>

                  {/* Link Hover Info Bar */}
                  <div className="mt-4 pt-1.5 border-t border-gray-950 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-gray-500 uppercase tracking-tight text-[8px] font-black font-mono">// HOVER_LINK_STATUS:</span>
                    <span className={`font-bold py-0.5 px-1.5 rounded truncate max-w-[70%]
                      ${hoveredUrl 
                        ? hoveredUrl.includes('g00gle.com') 
                          ? 'bg-red-950/20 text-red-400 border border-red-900/30' 
                          : 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30'
                        : 'text-gray-605 italic'
                      }`}>
                      {hoveredUrl || "No Link Hovered (Hover browser links to inspect target URL redirections!)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password Tester Tool */}
              <div className="bg-[#050811] border border-gray-800 p-3.5 rounded-lg space-y-3 font-sans">
                <div className="flex items-center gap-1.5 text-white font-semibold text-xs leading-none">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  PASSWORD STRENGTH COMPLIANCE AUDITOR (ENTROPY LABS)
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-gray-500 uppercase block font-mono font-extrabold tracking-wider">INPUT CREDENTIALS TO ESTIMATE BIT ENTROPY:</span>
                  <input
                    type="text"
                    placeholder="E.g. S3cure_Pr0t0c0l_#82!"
                    value={passwordTest}
                    onChange={(e) => setPasswordTest(e.target.value)}
                    className="w-full bg-black border border-gray-900 rounded p-1.5 text-[11px] text-white focus:outline-none focus:border-cyan-500/50 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                  <div className="space-y-1 bg-black/40 p-2 border border-gray-950 rounded">
                    <span className="text-gray-500 text-[8px] block font-extrabold uppercase">// AUDIT LEVEL:</span>
                    <span className={`font-black uppercase text-[9.5px] ${currentStrength.color}`}>{currentStrength.score}</span>
                  </div>
                  <div className="space-y-1 bg-black/40 p-2 border border-gray-950 rounded">
                    <span className="text-gray-500 text-[8px] block font-extrabold uppercase">// PROGRESS MATRIX BAR:</span>
                    <div className="w-full bg-gray-950 h-2 border border-gray-900 rounded-full overflow-hidden mt-1">
                      <div className={`h-full transition-all duration-300 ${currentStrength.bar}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LAB 12 — MOBILE SECURITY */}
          {labId === 12 && (
            <div id="lab12_view" className="space-y-4 max-w-md mx-auto w-full font-mono text-[10px]">
              {/* Android Mock Header */}
              <div className="bg-[#0b0f19] border border-gray-800 p-3 rounded-lg flex items-center justify-between">
                <span className="text-white font-bold text-xs flex items-center gap-2 uppercase tracking-wide">
                  <Smartphone className="w-4 h-4 text-[#00ff88] animate-pulse" />
                  MOCK_APK PERMISSION ANALYZER (v1.8)
                </span>
                <span className="text-[#00ff88] font-bold text-[8.5px] bg-[#00ff88]/5 py-0.5 px-1.5 border border-[#00ff88]/20 rounded">
                  MALICIOUS.APK LOADED
                </span>
              </div>

              {/* APK Tabs */}
              <div className="flex bg-black/55 p-1 rounded-md border border-gray-950 gap-1 select-none">
                {['manifest', 'permissions', 'scanner'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setApkActiveTab(tab as any)}
                    className={`flex-1 py-1 px-2 rounded font-bold uppercase tracking-tight text-[8.5px] transition-all
                      ${apkActiveTab === tab 
                        ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30' 
                        : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Display Area */}
              <div className="bg-[#050811] border border-gray-800 rounded-lg p-3 min-h-[160px] text-left leading-normal selection:bg-emerald-950 select-text">
                {apkActiveTab === 'manifest' && (
                  <div className="space-y-1 text-gray-300">
                    <span className="text-gray-500 font-bold block uppercase select-none">// MOCK ANDROIDMANIFEST.XML HIGHLIGHTS</span>
                    <div className="text-purple-400 font-bold">&lt;manifest <span className="text-amber-400">package</span>=<span className="text-emerald-400">"com.evil.payload"</span>&gt;</div>
                    <div className="pl-3 text-emerald-500">&lt;uses-permission <span className="text-amber-400">android:name</span>=<span className="text-white">"android.permission.INTERNET"</span> /&gt;</div>
                    <div className="pl-3 text-[#00ff88] font-bold bg-[#00ff88]/5 py-0.5 px-1 border-l border-[#00ff88]/40 my-1">
                      &lt;uses-permission <span className="text-amber-400">android:name</span>=<span className="text-white uppercase font-bold">"android.permission.READ_SMS"</span> /&gt;
                    </div>
                    <div className="pl-3 text-red-500">&lt;uses-permission <span className="text-amber-400">android:name</span>=<span className="text-white">"android.permission.RECEIVE_SMS"</span> /&gt;</div>
                    <div className="pl-3 text-gray-500">&lt;uses-permission <span className="text-amber-400">android:name</span>=<span className="text-white">"android.permission.VIBRATE"</span> /&gt;</div>
                    <div className="pl-3 text-blue-400">&lt;application <span className="text-amber-400">android:allowBackup</span>=<span className="text-[#00ff88]">"true"</span>&gt;</div>
                    <div className="pl-6 text-gray-400">&lt;service <span className="text-amber-400">android:name</span>=<span className="text-white">".BackgroundCollector"</span> /&gt;</div>
                    <div className="pl-3 text-blue-400">&lt;/application&gt;</div>
                    <div className="text-purple-400 font-bold">&lt;/manifest&gt;</div>
                  </div>
                )}

                {apkActiveTab === 'permissions' && (
                  <div className="space-y-3 text-gray-300">
                    <span className="text-gray-500 font-bold block uppercase select-none">// AUDIT SPECIFIC EXPOSED PERMISSION COMBO</span>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { perm: "READ_SMS", desc: "Access and extract incoming SMS logs (Critical hazard combo with network INTERNET permissions!)", threat: "CRITICAL" },
                        { perm: "SET_WALLPAPER", desc: "Modify wallpaper dimensions (Negligible server threat)", threat: "LOW" },
                        { perm: "INTERNET", desc: "Establish network requests to transport cached records to remote terminals", threat: "MEDIUM" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedDangerousPermission(item.perm)}
                          className={`p-2 border rounded text-left transition-all flex justify-between items-center
                            ${selectedDangerousPermission === item.perm 
                              ? 'bg-emerald-950/20 border-emerald-500/50' 
                              : 'bg-black/45 border-gray-900 hover:border-gray-800'}`}
                        >
                          <div className="space-y-0.5 max-w-[80%]">
                            <span className="text-white font-bold block">{item.perm}</span>
                            <span className="text-gray-500 text-[9px] font-sans leading-normal block">{item.desc}</span>
                          </div>
                          <span className={`text-[8.5px] font-bold py-0.5 px-1 border rounded uppercase font-mono
                            ${item.threat === 'CRITICAL' ? 'bg-red-950/25 border-red-500/20 text-red-500' : 
                              item.threat === 'MEDIUM' ? 'bg-amber-950/25 border-amber-500/20 text-amber-500' :
                              'bg-slate-900 border-gray-800 text-gray-550'}`}>
                            {item.threat}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {apkActiveTab === 'scanner' && (
                  <div className="text-center py-5 space-y-3 font-sans">
                    <CheckCircle className="w-8 h-8 text-[#00ff88] mx-auto animate-bounce" />
                    <div className="space-y-1 leading-normal">
                      <h4 className="text-white font-bold text-xs uppercase font-mono">AUTOMATED_SANDBOX_FLOW SCAN COMPLETED</h4>
                      <p className="text-gray-400 text-[10.5px]">Decompiled APK: Malicious properties detected. READ_SMS background hijack attempts found.</p>
                    </div>
                    <div className="inline-block bg-[#00ff88]/5 border border-[#00ff88]/20 px-3 py-1.5 rounded text-[11px] font-mono font-bold text-[#00ff88]">
                      THREAT ESTIMATION LEVEL: 9.8 / 10 (CRITICAL RISK)
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LAB 13 — BUG BOUNTY INTRO */}
          {labId === 13 && (
            <div id="lab13_view" className="space-y-4 max-w-md mx-auto w-full font-mono text-[10px] text-left">
              {/* Target Website Container */}
              <div className="bg-[#050811] border border-gray-800 rounded-lg overflow-hidden shadow-2xl flex flex-col h-full min-h-[220px]">
                {/* Simulated Target Header */}
                <div className="bg-slate-950 px-3 py-2 border-b border-gray-950 flex items-center justify-between select-none">
                  <span className="text-white font-bold text-xs font-sans tracking-wide uppercase flex items-center gap-1.5">
                    <Bug className="w-4 h-4 text-emerald-400 animate-spin-hover" />
                    TARGET_SCOPE // lab.ev-site.com
                  </span>
                  <span className="text-emerald-400 font-bold text-[8.5px] bg-emerald-950/25 border border-emerald-900/40 rounded px-1.5 py-0.5">
                    PORT 443 ACTIVE
                  </span>
                </div>

                {/* Scope UI Area representation */}
                <div className="p-3 space-y-3 flex-1 flex flex-col justify-between bg-[#040710]">
                  <div className="space-y-2.5">
                    <div className="space-y-1 leading-normal font-sans text-xs">
                      <h4 className="text-white font-bold text-[11.5px]">// EV-Site Corporate Beta Systems Portal</h4>
                      <p className="text-gray-400 text-[10px]">Warning: Intrusive queries outside targets scope lists are strictly prohibited.</p>
                    </div>

                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Scan directory route... (e.g. robots.txt)" 
                        value={reconSearchUrl}
                        onChange={(e) => setReconSearchUrl(e.target.value)}
                        className="flex-1 bg-black border border-gray-900 rounded px-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 font-mono"
                      />
                      <button 
                        onClick={() => {
                          const normalized = reconSearchUrl.trim().toLowerCase();
                          if (normalized === 'robots.txt') {
                            setReconUrls(prev => prev.includes('robots.txt') ? prev : [...prev, 'robots.txt']);
                            toast.success("RECON_CRAWLER: robots.txt file uncovered! Disallow directory discovered.");
                          } else if (normalized === '/hidden-admin' || normalized === 'hidden-admin') {
                            setBountyHiddenFound(true);
                            toast.success("CHALLENGE_PROGRESS: Hidden administrator endpoint discovered! Claim flag.");
                          } else {
                            toast.error("RECON_CRAWLER: Route request query returned 404 NOT FOUND.");
                          }
                        }}
                        className="bg-emerald-950/30 border border-emerald-500/30 text-[#00ff88] rounded px-3 py-1.5 font-bold hover:bg-emerald-950/50 transition-all text-[10px] select-none uppercase font-mono"
                      >
                        CRAWL
                      </button>
                    </div>

                    {/* Crawler Discovered routes */}
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] text-gray-500 font-bold block uppercase tracking-wide select-none">Discovered Crawl Nodes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {reconUrls.map((url, i) => (
                          <span key={i} className="bg-black/50 border border-gray-950 rounded px-2 py-1 text-gray-300 font-mono text-[9px] hover:text-[#00ff88] cursor-pointer">
                            {url}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {bountyHiddenFound && (
                    <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 p-2.5 rounded text-white font-sans text-xs space-y-1 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#00ff88] shrink-0" />
                      <div className="space-y-0.5">
                        <span className="text-[9.5px] font-bold text-[#00ff88] font-mono block uppercase">// EXPOSED_ADMINISTRATIVE_FLAW_IDENTIFIED</span>
                        <p className="text-gray-300 text-[10.5px]">Target verified successfully. Grab the Flag: <span className="font-bold font-mono text-[#00ff88]">{"EV_FLAG{hidden_admin_13}"}</span></p>
                      </div>
                    </div>
                  )}

                  {!bountyHiddenFound && (
                    <div className="text-[9px] text-amber-500 italic flex items-center gap-1 font-sans">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Tip: Search 'robots.txt' first to audit restricted paths, then enter the excluded administrator folder pathway!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LAB 14 — REPORTING */}
          {labId === 14 && (
            <div id="lab14_view" className="space-y-4 max-w-md mx-auto w-full font-sans text-xs text-left">
              {/* Report Editor Wizard Header */}
              <div className="bg-[#0b0f19] border border-gray-800 p-3 rounded-lg flex items-center justify-between font-mono text-[10px]">
                <span className="text-white font-bold text-xs flex items-center gap-2 uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  VULNERABILITY REPORT BUILDER SYSTEM
                </span>
                <span className="text-emerald-400 font-bold text-[8.5px] bg-[#00ff88]/5 py-0.5 px-1.5 border border-emerald-990/20 rounded">
                  {submittedReport ? 'COMPLETED' : 'DRAFT'}
                </span>
              </div>

              {!submittedReport ? (
                <div className="bg-[#050811] border border-gray-800 rounded-lg p-3.5 space-y-3">
                  <div className="space-y-1 leading-normal select-none">
                    <h4 className="text-white font-bold text-[11px]">// Secure Report drafting system</h4>
                    <p className="text-gray-400 text-[10px]">Submit precise records matching audited vulnerabilities to trigger flag confirmations.</p>
                  </div>

                  <div className="space-y-3 font-sans">
                    {/* Report title input */}
                    <div className="space-y-1">
                      <span className="text-[8.5px] text-gray-500 uppercase block font-extrabold tracking-wider font-mono">Report Title:</span>
                      <input 
                        type="text" 
                        placeholder="SQL Injection Vulnerability in login parameter allowing Authentication Bypass" 
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        className="w-full bg-black border border-gray-900 rounded p-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    {/* Report severity selection */}
                    <div className="space-y-1">
                      <span className="text-[8.5px] text-gray-500 uppercase block font-extrabold tracking-wider font-mono">CVSS Threat Classification:</span>
                      <select 
                        value={reportSeverity}
                        onChange={(e) => setReportSeverity(e.target.value)}
                        className="w-full bg-black border border-gray-900 rounded p-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 font-mono"
                      >
                        <option value="Critical">Critical (9.0 - 10.0)</option>
                        <option value="High">High (7.0 - 8.9)</option>
                        <option value="Medium">Medium (4.0 - 6.9)</option>
                        <option value="Low">Low (0.1 - 3.9)</option>
                      </select>
                    </div>

                    {/* Report detail description */}
                    <div className="space-y-1">
                      <span className="text-[8.5px] text-gray-500 uppercase block font-extrabold tracking-wider font-mono">Bug Description & Impact:</span>
                      <textarea 
                        rows={2}
                        placeholder="Describe the vulnerability in detail..." 
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        className="w-full bg-black border border-gray-900 rounded p-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                      />
                    </div>

                    {/* Report remediation steps */}
                    <div className="space-y-1">
                      <span className="text-[8.5px] text-gray-500 uppercase block font-extrabold tracking-wider font-mono">Mitigation & Patch Code Recommendations:</span>
                      <textarea 
                        rows={2}
                        placeholder="How can developers defend this parameter? (e.g. prepared statements)" 
                        value={reportMitigation}
                        onChange={(e) => setReportMitigation(e.target.value)}
                        className="w-full bg-black border border-gray-900 rounded p-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500/50 resize-none font-mono"
                      />
                    </div>

                    <button 
                      onClick={handleSubmitReport}
                      type="button" 
                      className="w-full py-2 bg-emerald-950/40 border border-[#00ff88]/40 hover:bg-emerald-950/60 rounded text-[10.5px] font-bold text-[#00ff88] uppercase transition-all select-none"
                    >
                      SUBMIT SECURE AUDIT REPORT
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#050811] border border-gray-800 rounded-lg p-3.5 space-y-3 font-mono">
                  <div className="flex items-center gap-2 bg-[#00ff88]/5 border border-[#00ff88]/20 p-2.5 rounded text-[11px]">
                    <Sparkles className="w-5 h-5 text-[#00ff88] shrink-0" />
                    <div>
                      <span className="text-[#00ff88] font-bold block uppercase tracking-wide">REPORT AUDITED SUCCESSFULLY!</span>
                      <span className="text-gray-300 font-sans text-[10.5px]">Claim training flag: <span className="font-bold text-[#00ff88] font-mono">{"EV_FLAG{verified_reporter_14}"}</span></span>
                    </div>
                  </div>

                  {/* Live Report Markdown Preview Box */}
                  <div className="bg-black/40 border border-gray-900 rounded p-3 text-[10px] space-y-2 text-gray-300">
                    <span className="text-gray-500 text-[8.5px] font-extrabold uppercase block select-none">// SECURITY_REPORT_LIVE_PREVIEW</span>
                    <div className="text-[#00ff88] font-bold text-[11px]"># {submittedReport.title}</div>
                    <div className="text-gray-400 font-bold uppercase text-[8px] tracking-tight bg-slate-900 px-1 py-0.5 rounded inline-block">
                      SEVERITY: {submittedReport.severity}
                    </div>
                    <div>
                      <div className="text-gray-400 font-extrabold uppercase text-[8.5px]">## Description:</div>
                      <p className="pl-2 font-sans text-gray-305 leading-relaxed text-[10px]">{submittedReport.description}</p>
                    </div>
                    <div>
                      <div className="text-gray-400 font-extrabold uppercase text-[8.5px]">## Mitigation Solution:</div>
                      <p className="pl-2 text-emerald-400">{submittedReport.mitigation}</p>
                    </div>
                    <button 
                      onClick={() => setSubmittedReport(null)}
                      className="text-[8.5px] text-red-400 hover:underline pt-2 select-none"
                    >
                      [ EDIT REPORT CORE DATA ]
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LAB 15 — CAREER PATH */}
          {labId === 15 && (
            <div id="lab15_view" className="space-y-4 max-w-lg mx-auto w-full text-xs text-left">
              {/* Career Planner Header */}
              <div className="bg-[#0b0f19] border border-gray-800 p-3 rounded-lg flex items-center justify-between font-mono text-[10px]">
                <span className="text-white font-bold text-xs flex items-center gap-2 uppercase tracking-wide">
                  <Award className="w-4 h-4 text-emerald-400 animate-pulse" />
                  CYBER_CAREER ROADMAP DESIGNER (PHASE 3)
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                  {chosenRole ? chosenRole.toUpperCase() : "NO ROLE SELECTION"}
                </span>
              </div>

              {/* Roles Selector Choice Grid */}
              {!chosenRole ? (
                <div className="bg-[#050811] border border-gray-800 rounded-lg p-3.5 space-y-3">
                  <span className="text-gray-500 font-bold block uppercase font-mono text-[8.5px] select-none">// SELECT CORE CYBER-SECURITY SPECIALISM PATH:</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {[
                      { role: "Pentester", desc: "Offensive system security assessment, code reviews, and mock exploit development.", icon: Bug },
                      { role: "SOC Analyst", desc: "Defensive endpoint surveillance, network infrastructure monitoring, and threat triage.", icon: ShieldAlert },
                      { role: "Bug Hunter", desc: "Public audits, continuous target reconnaissance, and vulnerability logging programs.", icon: Globe }
                    ].map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setChosenRole(item.role as any);
                            toast.success(`ROADMAP: Specialism path registered: ${item.role}!`);
                          }}
                          className="bg-black/55 border border-gray-900 hover:border-emerald-500/40 p-3 rounded-lg text-left transition-all hover:bg-emerald-950/5 flex flex-col justify-between h-28"
                        >
                          <IconComponent className="w-6 h-6 text-emerald-400 shrink-0" />
                          <div className="space-y-0.5">
                            <span className="text-white font-bold block text-[10px]">{item.role}</span>
                            <p className="text-gray-500 text-[8.5px] leading-snug">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-[#050811] border border-gray-800 rounded-lg p-3.5 space-y-3.5">
                  <div className="flex justify-between items-center select-none pb-1.5 border-b border-gray-950">
                    <span className="text-white font-extrabold font-mono text-[10px] tracking-wide">// {chosenRole.toUpperCase()} ROADMAP CHECKLIST</span>
                    <button 
                      onClick={() => { setChosenRole(null); setSelectedMilestones([]); }}
                      className="text-[9px] text-red-400 hover:underline font-mono"
                    >
                      [ RESET SELECTION ]
                    </button>
                  </div>

                  <p className="text-gray-300 font-sans text-xs leading-normal">
                    Fulfill study nodes by checking essential milestones that unlock certification readiness:
                  </p>

                  <div className="space-y-2 font-mono text-[9px]">
                    {availableMilestones.map((node) => {
                      const selected = selectedMilestones.includes(node.id);
                      return (
                        <button
                          key={node.id}
                          onClick={() => handleToggleMilestone(node.id)}
                          className={`w-full p-2 border rounded-md text-left transition-all duration-150 flex items-center justify-between
                            ${selected 
                              ? 'bg-emerald-950/20 border-emerald-500/50 text-white' 
                              : 'bg-black/45 border-gray-900 text-gray-500 hover:border-gray-800 hover:text-gray-350'}`}
                        >
                          <span>{node.title}</span>
                          <span className={`text-[8.5px] font-black uppercase
                            ${selected ? 'text-[#00ff88]' : 'text-gray-600'}`}>
                            {selected ? "[UNLOCKED]" : "[LOCKED]"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Git setup simulation triggers */}
                  <div className="border-t border-gray-950 pt-3 space-y-2">
                    <span className="text-gray-500 font-bold block uppercase font-mono text-[8.5px] select-none">// MOCK GITHUB WORKSPACE DEPLOYMENT:</span>
                    <div className="bg-black/60 border border-gray-950 rounded p-2.5 font-mono text-[10px] space-y-2">
                      <div className="text-gray-400">
                        {gitTerminalStep === 0 && "$ git init --bare academy-workspace"}
                        {gitTerminalStep === 1 && "$ git add roadmap.md && git commit -m 'Release initial syllabus path'"}
                        {gitTerminalStep >= 2 && "$ git push origin production --complete"}
                      </div>
                      <button
                        onClick={() => {
                          setGitTerminalStep(prev => prev + 1);
                          if(gitTerminalStep === 1) {
                            toast.success("MOCK_GIT: Committed changes successfully!");
                          }
                        }}
                        className="bg-emerald-950/30 border border-emerald-500/30 text-[#00ff88] text-[8.5px] px-2 py-1 rounded font-bold uppercase hover:bg-emerald-900/10 transition-all font-mono"
                      >
                        {gitTerminalStep === 0 && "INITIALIZE WORKSPACE"}
                        {gitTerminalStep === 1 && "COMMIT SYLLABUS ROADMAP"}
                        {gitTerminalStep >= 2 && "DEPLOY TO PRODUCTION ORIGIN (SUCCESS)"}
                      </button>
                    </div>
                  </div>

                  {selectedMilestones.length >= 3 && gitTerminalStep >= 2 && (
                    <div className="bg-emerald-950/10 border border-[#00ff88]/30 p-2.5 rounded font-mono text-[10px] text-white flex items-center gap-2">
                      <Award className="text-[#00ff88] w-5 h-5 shrink-0" />
                      <div>
                        <span className="text-[#00ff88] font-bold block uppercase">CYBER ROADMAP SUBMITTED!</span>
                        <span className="font-sans text-[10.5px]">Claim badge validation key Flag: <span className="font-bold text-[#00ff88] font-mono">{"EV_FLAG{career_builder_15}"}</span></span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* LAB 16 — FINAL CAPSTONE */}
          {labId === 16 && (
            <div id="lab16_view" className="space-y-4 max-w-lg mx-auto w-full text-xs text-left">
              {/* Capstone Header */}
              <div className="bg-[#0b0f19] border border-gray-800 p-3 rounded-lg flex items-center justify-between font-mono text-[10px]">
                <span className="text-white font-bold text-xs flex items-center gap-2 uppercase tracking-wide animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#00ff88]" />
                  🎓 EV ACADEMY FINAL CAPSTONE WORKSPACE
                </span>
                <span className="text-[#00ff88] font-bold bg-[#00ff88]/5 px-2 py-0.5 rounded border border-[#00ff88]/30">
                  STAGE {capstoneStep} / 4
                </span>
              </div>

              {/* Capstone Progress Stages */}
              <div className="flex gap-1.5 font-mono text-[9px] select-none uppercase font-black text-center">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 py-1 rounded border
                      ${capstoneStep === step 
                        ? 'bg-[#00ff88]/10 border-[#00ff88]/50 text-[#00ff88]' 
                        : capstoneStep > step 
                          ? 'bg-emerald-950/20 border-emerald-900/30 text-[#00ff88]/70' 
                          : 'bg-black/45 border-gray-900 text-gray-550'}`}
                  >
                    STG {step}
                  </div>
                ))}
              </div>

              {/* Step Contents */}
              <div className="bg-[#050811] border border-gray-800 rounded-lg p-3.5 space-y-3.5 font-mono text-[10px]">
                
                {/* Stage 1: Passive Recon */}
                {capstoneStep === 1 && (
                  <div className="space-y-3">
                    <span className="text-gray-500 font-bold block uppercase text-[8.5px] select-none">// STAGE 1: SUBDOMAINS passive Intelligence RECONN</span>
                    <p className="text-gray-300 leading-normal font-sans text-xs">
                      Search and discover subdomains to find where high-security services are hosted. Explore targets under `ev-academy.com`:
                    </p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Search subdomains directory... e.g. internal-labs.ev-academy.com" 
                        value={capstoneSubdomainSearch}
                        onChange={(e) => setCapstoneSubdomainSearch(e.target.value)}
                        className="flex-1 bg-black border border-gray-900 rounded p-1.5 text-white focus:outline-none focus:border-emerald-500/50"
                      />
                      <button
                        onClick={() => {
                          const val = capstoneSubdomainSearch.trim().toLowerCase();
                          if (val === 'internal-labs.ev-academy.com' || val === 'internal-labs') {
                            toast.success("CAPSTONE: Active target node located! SSH listening active.");
                            setCapstoneStep(2);
                          } else {
                            toast.error("CAPSTONE: Query returned no active network elements.");
                          }
                        }}
                        className="bg-emerald-950/30 border border-emerald-500/30 text-[#00ff88] rounded px-3.5 py-1.5 font-bold hover:bg-emerald-900/15"
                      >
                        SEARCH
                      </button>
                    </div>
                    <div className="text-[9px] text-amber-500 font-sans italic">
                      💡 Tip: Try passive query matching 'internal-labs.ev-academy.com' as described in required tasks list!
                    </div>
                  </div>
                )}

                {/* Stage 2: Port Scanning */}
                {capstoneStep === 2 && (
                  <div className="space-y-3">
                    <span className="text-gray-500 font-bold block uppercase text-[8.5px] select-none">// STAGE 2: port SOCKET scan: internal-labs.ev-academy.com</span>
                    <p className="text-gray-300 leading-normal font-sans text-xs">
                      Determine which ports and running services are exposed on the host drives:
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { port: 21, label: "Port 21 (FTP)" },
                        { port: 22, label: "Port 22 (SSH)" },
                        { port: 80, label: "Port 80 (HTTP)" },
                        { port: 443, label: "Port 443 (HTTPS)" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!capstonePortsScanned.includes(item.port)) {
                              setCapstonePortsScanned(prev => [...prev, item.port]);
                              if (item.port === 22) {
                                toast.success("CAPSTONE: Port 22 SSH audit completed. Security loopholes uncovered!");
                                setTimeout(() => setCapstoneStep(3), 1000);
                              } else {
                                toast.error(`CAPSTONE: Port ${item.port} returned CLOSED / SHIELDED status.`);
                              }
                            }
                          }}
                          className={`p-2 border rounded text-center transition-all hover:bg-emerald-950/20
                            ${capstonePortsScanned.includes(item.port) 
                              ? item.port === 22 
                                ? 'bg-emerald-950/20 border-[#00ff88]/50 text-[#00ff88] font-bold' 
                                : 'bg-red-950/20 border-red-900/30 text-red-400'
                              : 'bg-black/55 border-gray-900 text-gray-400'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stage 3: Logical SQL Injection */}
                {capstoneStep === 3 && (
                  <div className="space-y-3">
                    <span className="text-gray-500 font-bold block uppercase text-[8.5px] select-none">// STAGE 3: database authentication logic bypass injection</span>
                    <p className="text-gray-300 leading-normal font-sans text-xs">
                      The final secure user portal requires SQL input validation audits. Break login logic using characters bypass parameters:
                    </p>

                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <span className="text-gray-500 uppercase block tracking-wider font-extrabold text-[8px]">// INJECT SQL LOGIC PAYLOAD:</span>
                        <input
                          type="text"
                          placeholder="Place bypass script here... e.g. ' OR '1'='1"
                          value={capstoneSqlInput}
                          onChange={(e) => setCapstoneSqlInput(e.target.value)}
                          className="w-full bg-black border border-gray-900 rounded p-1.5 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const normal = capstoneSqlInput.trim();
                          if (normal === "' OR '1'='1" || normal.includes("' OR '1'='1") || normal.includes("1=1")) {
                            setCapstoneExploited(true);
                            setCapstoneStep(4);
                            toast.success("CAPSTONE_CTF: Logic bypass active! Graduation keys parsed!");
                          } else {
                            toast.error("CAPSTONE_CTF: Server syntax failed: Login credentials unrecognized.");
                          }
                        }}
                        className="w-full py-1.5 bg-emerald-950/30 border border-[#00ff88]/40 text-[#00ff88] font-bold rounded hover:bg-emerald-[#00ff88]/15"
                      >
                        DEPLOY SQL INJECTION
                      </button>
                    </div>
                  </div>
                )}

                {/* Stage 4: Congratulations */}
                {capstoneStep === 4 && (
                  <div className="text-center py-4 space-y-3 font-sans">
                    <Award className="w-9 h-9 text-[#00ff88] mx-auto animate-bounce" />
                    <div className="space-y-1">
                      <h4 className="text-white font-extrabold text-xs tracking-wider font-mono">CONGRATULATIONS, GRADUATE!</h4>
                      <p className="text-gray-450 text-[10.5px]">You completed the EV Cyber Academy Capstone CTF testing sequence.</p>
                    </div>
                    <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 p-2.5 rounded font-mono text-[10px] text-white">
                      <span>GRADUATION VERIFIED FINAL FLAG:</span>
                      <div className="text-[#00ff88] font-bold text-xs mt-1 block select-all">{"EV_FLAG{ev_academy_graduate_2026}"}</div>
                    </div>
                    <button 
                      onClick={() => {
                        setCapstoneStep(1);
                        setCapstonePortsScanned([]);
                        setCapstoneSqlInput('');
                        setCapstoneExploited(false);
                      }}
                      className="text-[9px] text-gray-500 hover:text-white uppercase font-mono tracking-wider select-none block mx-auto pt-2"
                    >
                      [ RESET CAPSTONE TO REPLAY ]
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* 💻 RIGHT INSPECTOR FRAME (Mock Chrome DevTools Split) */}
        {devToolsOpen && (
          <div id="inspector_panel" className="w-full md:w-[48%] border-t md:border-t-0 md:border-l border-gray-950 bg-[#060a13] flex flex-col overflow-hidden min-h-[220px]">
            {/* DevTools Menu Tab Switchers */}
            <div className="bg-[#090e1b] border-b border-gray-950 flex select-none text-[9.5px] uppercase font-black tracking-wider text-gray-450 font-mono shrink-0">
              <button 
                onClick={() => setDevToolsTab('elements')}
                className={`py-2 px-3 border-r border-gray-950 flex items-center gap-1
                  ${devToolsTab === 'elements' 
                    ? 'bg-[#030611] text-[#00ff88] border-b border-b-[#00ff88]' 
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                <span>&lt;&gt; Elements</span>
              </button>
              <button 
                onClick={() => setDevToolsTab('network')}
                className={`py-2 px-3 border-r border-gray-950 flex items-center gap-1
                  ${devToolsTab === 'network' 
                    ? 'bg-[#030611] text-[#00ff88] border-b border-b-[#00ff88]' 
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                <span>⇄ Network</span>
              </button>
              <div className="flex-1 flex justify-end items-center pr-3 text-[8.5px] text-gray-600 font-mono select-none font-bold">
                MOCK_DEV_TOOLS // ACTIVE_PORT
              </div>
            </div>

            {/* DevTools Tab View contents */}
            <div className="flex-1 overflow-y-auto p-3 font-mono text-[9px] text-gray-300 leading-relaxed text-left custom-scrollbar">
              {devToolsTab === 'elements' ? (
                <div className="space-y-1.5 selection:bg-emerald-950 select-text">
                  <div className="text-gray-500 italic font-bold select-none">// HTML Source tree inspector (Click elements to copy flags)</div>
                  
                  {/* ROOT HTML TAG */}
                  <div>
                    <button 
                      onClick={() => setHtmlExpanded(p => !p)}
                      className="text-[#569cd6] font-bold hover:underline select-none"
                    >
                      {htmlExpanded ? '▼' : '▶'} &lt;<span className="text-[#e06c75]">html</span> <span className="text-[#d19a66]">lang</span>=<span className="text-[#98c379]">"en"</span>&gt;
                    </button>
                    
                    {htmlExpanded && (
                      <div className="pl-3 border-l border-gray-950/60 ml-1.5 space-y-1">
                        {/* HEAD */}
                        <div className="text-gray-500">&lt;<span className="text-[#e06c75]">head</span>&gt;&lt;<span className="text-[#e06c75]">title</span>&gt;EV Training Sandbox&lt;/<span className="text-[#e06c75]">title</span>&gt;&lt;/<span className="text-[#e06c75]">head</span>&gt;</div>
                        
                        {/* BODY */}
                        <div>
                          <button 
                            onClick={() => setBodyExpanded(p => !p)}
                            className="text-[#569cd6] font-bold hover:underline select-none"
                          >
                            {bodyExpanded ? '▼' : '▶'} &lt;<span className="text-[#e06c75]">body</span>&gt;
                          </button>

                          {bodyExpanded && (
                            <div className="pl-4 border-l border-gray-950/60 ml-2 space-y-1.5">
                              <div className="text-gray-400">&lt;<span className="text-[#e06c75]">div</span> <span className="text-[#d19a66]">id</span>=<span className="text-[#98c379]">"app-root"</span>&gt;</div>
                              
                              {/* Content dependent headers based on active lab context */}
                              <div className="pl-3 space-y-1 border-l border-gray-900 ml-1">
                                <div className="text-gray-450">&lt;<span className="text-[#e06c75]">main</span> <span className="text-[#d19a66]">class</span>=<span className="text-[#98c379]">"cyber-view-pane"</span>&gt;</div>
                                
                                {labId === 9 && (
                                  <div className="pl-3 font-bold text-[#00ff88]/90 bg-[#00ff88]/5 py-0.5 px-1 italic whitespace-nowrap select-all inline-block">
                                    &lt;!-- MOCK_HIDDEN_PAYLOAD: {"EV_FLAG{web_basics_resolved_9}"} --&gt;
                                  </div>
                                )}

                                {labId === 10 && (
                                  <div className="pl-3 text-gray-400">
                                    &lt;<span className="text-[#e06c75]">cookie-auditor</span> <span className="text-[#d19a66]">secure</span>=<span className="text-[#98c379]">"true"</span> /&gt;
                                  </div>
                                )}

                                {labId === 11 && (
                                  <div className="pl-3 space-y-1 text-gray-400">
                                    <div className="text-gray-500">&lt;!-- SENDER: support@g00gle.com --&gt;</div>
                                    <div className="text-gray-500">&lt;!-- TARGET URL HOVERED REDIRECT: https://g00gle.com/secure_bill --&gt;</div>
                                    {detectedClue && (
                                      <div className="font-bold text-[#00ff88] bg-[#00ff88]/5 py-0.5 px-1 whitespace-nowrap select-all block">
                                        &lt;!-- CLUE_LOCATED_FLAG: {"EV_FLAG{fake_g00gle_11}"} --&gt;
                                      </div>
                                    )}
                                  </div>
                                )}

                                {labId === 12 && (
                                  <div className="pl-3 text-gray-400 space-y-1">
                                    <div className="text-gray-500">&lt;!-- APK PERMISSION CLUE FOR THREATS SEARCH --&gt;</div>
                                    <div className="text-red-500 font-bold bg-red-950/20 py-0.5 px-1">&lt;uses-permission android:name="android.permission.READ_SMS" /&gt;</div>
                                    {selectedDangerousPermission === 'READ_SMS' && (
                                      <div className="font-bold text-[#00ff88] bg-[#00ff88]/5 py-0.5 px-1 select-all block">
                                        &lt;!-- FLAG_IDENTIFIED: {"EV_FLAG{SMS_READ_VIOLATION_12}"} --&gt;
                                      </div>
                                    )}
                                  </div>
                                )}

                                {labId === 13 && (
                                  <div className="pl-3 text-gray-400 space-y-1">
                                    <div className="text-gray-500">&lt;!-- robots Disallow check endpoints values list --&gt;</div>
                                    <div className="text-[#98c379]">&lt;a href="/hidden-admin"&gt;ADMIN LINK&lt;/a&gt;</div>
                                    {bountyHiddenFound && (
                                      <div className="font-bold text-[#00ff88] bg-[#00ff88]/5 py-0.5 px-1 select-all block">
                                        &lt;!-- CRAWL_FLAG_SUCCESS: {"EV_FLAG{hidden_admin_13}"} --&gt;
                                      </div>
                                    )}
                                  </div>
                                )}

                                {labId === 14 && (
                                  <div className="pl-3 text-gray-400 space-y-1">
                                    <div className="text-gray-500">&lt;!-- live security report properties generator xml --&gt;</div>
                                    {submittedReport && (
                                      <div className="font-bold text-[#00ff88] bg-[#00ff88]/5 py-0.5 px-1 select-all block">
                                        &lt;!-- SECURE_REPORT_FLAG: {"EV_FLAG{verified_reporter_14}"} --&gt;
                                      </div>
                                    )}
                                  </div>
                                )}

                                {labId === 15 && (
                                  <div className="pl-3 text-gray-400 space-y-1">
                                    <div className="text-indigo-400">&lt;chosen-path specialism="{chosenRole || 'unselected'}" /&gt;</div>
                                    {selectedMilestones.length >= 3 && gitTerminalStep >= 2 && (
                                      <div className="font-bold text-[#00ff88] bg-[#00ff88]/5 py-0.5 px-1 select-all block">
                                        &lt;!-- CAREER_FLAG_VERIFIED: {"EV_FLAG{career_builder_15}"} --&gt;
                                      </div>
                                    )}
                                  </div>
                                )}

                                {labId === 16 && (
                                  <div className="pl-3 text-gray-400 space-y-1">
                                    <div className="text-gray-550">&lt;!-- CAPSTONE PROGRESS STEP SUMMARY {capstoneStep} --&gt;</div>
                                    {capstoneExploited && (
                                      <div className="font-bold text-[#00ff88] bg-[#00ff88]/5 py-0.5 px-1 select-all block">
                                        &lt;!-- CAPSTONE_FLAG: {"EV_FLAG{ev_academy_graduate_2026}"} --&gt;
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="text-gray-450">&lt;/<span className="text-[#e06c75]">main</span>&gt;</div>
                              </div>

                              <div className="text-gray-400">&lt;/<span className="text-[#e06c75]">div</span>&gt;</div>
                            </div>
                          )}

                          <div className="text-[#569cd6]">&lt;/<span className="text-[#e06c75]">body</span>&gt;</div>
                        </div>
                      </div>
                    )}

                    <div className="text-[#569cd6]">&lt;/<span className="text-[#e06c75]">html</span>&gt;</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 font-mono select-text text-[9.5px]">
                  <div className="text-gray-500 italic font-bold select-none">// Active Network Request logs analysis</div>
                  
                  <div className="border border-gray-950 bg-black/50 rounded overflow-hidden">
                    <div className="bg-[#090f1d] px-2.5 py-1.5 flex items-center font-bold border-b border-gray-950 justify-between select-none">
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>api/system/audit</span>
                      </div>
                      <span className="text-[8px] bg-[#00ff88]/5 border border-[#00ff88]/20 text-[#00ff88] px-1 py-0.5 rounded font-bold font-mono">200 OK</span>
                    </div>
                    
                    <div className="p-2 text-[9px] space-y-2 text-gray-400 font-mono">
                      <div>
                        <span className="text-emerald-400 font-extrabold uppercase block text-[8px] tracking-wider">// SYSTEM ENDPOINT VERIFIED:</span>
                        <div className="font-sans text-[10px] pl-1.5 text-gray-300 mt-1">
                          <span className="text-gray-500">Host Domain:</span> ev-cyber-academy.com <br />
                          <span className="text-gray-500">HTTP Status:</span> <span className="text-[#00ff88] font-bold font-mono">200 SUCCESS</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-950/60 pt-2 selection:bg-indigo-950">
                        <span className="text-amber-500 font-extrabold block text-[8px] tracking-wider">// LOCAL COOKIE SYSTEM DATA:</span>
                        <div className="bg-black/60 font-mono p-1.5 rounded mt-1.5 text-[9px] text-gray-300 border border-gray-950">
                          session=active&amp;academic_track=phase_3&amp;mentor=vimal&amp;student=certified
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
