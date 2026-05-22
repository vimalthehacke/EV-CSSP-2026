export interface FSNode {
  type: 'dir' | 'file';
  name: string;
  content?: string;
  permissions?: string;
  children?: Record<string, FSNode>;
}

export interface TerminalResult {
  output: string;
  success: boolean;
  newDir?: string;
}

// Initialize structural virtual directories adhering strictly to user specs
export const createDefaultFS = (labFiles: Record<string, string> = {}): FSNode => {
  const root: FSNode = {
    type: 'dir',
    name: '/',
    children: {
      'home': {
        type: 'dir',
        name: 'home',
        children: {
          'student': {
            type: 'dir',
            name: 'student',
            children: {}
          }
        }
      }
    }
  };

  const student = root.children!['home'].children!['student'];
  student.children = {};

  // Populates simulated cyberlab files directly into student's virtual directory
  Object.entries(labFiles).forEach(([filePath, content]) => {
    const parts = filePath.split('/');
    let current = student;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      current.children = current.children || {};

      if (i === parts.length - 1) {
        current.children[part] = {
          type: 'file',
          name: part,
          content,
          permissions: 'rw-r--r--'
        };
      } else {
        if (!current.children[part]) {
          current.children[part] = {
            type: 'dir',
            name: part,
            children: {}
          };
        }
        current = current.children[part] as any;
      }
    }
  });

  return root;
};

// Helper to trace and resolve nodes at any absolute or relative path context
export const resolveNode = (root: FSNode, currentDir: string, targetPath: string): { node: FSNode | null; pathStr: string } => {
  let absolutePath = '';
  
  if (targetPath.startsWith('/')) {
    absolutePath = targetPath;
  } else {
    const divider = currentDir === '/' ? '' : '/';
    absolutePath = `${currentDir}${divider}${targetPath}`;
  }

  // Clean elements including dots
  const rawParts = absolutePath.split('/');
  const cleanParts: string[] = [];

  for (const part of rawParts) {
    if (!part || part === '.') continue;
    if (part === '..') {
      cleanParts.pop();
    } else {
      cleanParts.push(part);
    }
  }

  const finalPath = '/' + cleanParts.join('/');
  let current: FSNode = root;

  for (const part of cleanParts) {
    if (!current.children || !current.children[part]) {
      return { node: null, pathStr: finalPath };
    }
    current = current.children[part];
  }

  return { node: current, pathStr: finalPath };
};

// Pure terminal engine processor
export const runTerminalCommand = (
  commandStr: string,
  currentDir: string,
  rootFS: FSNode
): TerminalResult => {
  const trimmed = commandStr.trim();
  if (!trimmed) {
    return { output: '', success: true };
  }

  // Support pipe/ampersand split for simple command chains if they type multiple commands
  // like 'mkdir ev && cd ev && touch notes.txt'
  if (trimmed.includes('&&') || trimmed.includes(';')) {
    const delimiters = trimmed.includes('&&') ? '&&' : ';';
    const subCommands = trimmed.split(delimiters);
    let cumulativeOutput = [];
    let activeDir = currentDir;
    let overallSuccess = true;

    for (const subCmd of subCommands) {
      if (!subCmd.trim()) continue;
      const res = runTerminalCommand(subCmd, activeDir, rootFS);
      if (res.output) cumulativeOutput.push(res.output);
      if (res.newDir) activeDir = res.newDir;
      if (!res.success) {
        overallSuccess = false;
        break;
      }
    }
    return {
      output: cumulativeOutput.join('\n'),
      success: overallSuccess,
      newDir: activeDir
    };
  }

  const args = trimmed.split(/\s+/);
  const command = args[0].toLowerCase();
  const operand = args[1];
  const secondOperand = args[2];

  // Resolve current active node
  const activeNodeResult = resolveNode(rootFS, currentDir, '.');
  const activeNode = activeNodeResult.node;

  if (!activeNode || activeNode.type !== 'dir') {
    return { output: 'sys_err: Inaccessible folder descriptor state.', success: false };
  }

  switch (command) {
    case 'pwd':
      return { output: currentDir, success: true };

    case 'clear':
      return { output: '__CLEAR_TERMINAL_BUFFER__', success: true };

    case 'whoami':
      return { output: 'student', success: true };

    case 'date':
      return { output: new Date().toUTCString(), success: true };

    case 'ls': {
      if (!activeNode.children || Object.keys(activeNode.children).length === 0) {
        return { output: '(empty directory)', success: true };
      }
      const lsOutput = Object.values(activeNode.children)
        .map(n => {
          const perm = n.permissions ? `[${n.permissions}]` : '[rwxr-xr-x]';
          return n.type === 'dir' 
            ? `DIR   ${perm}  ${n.name}/` 
            : `FILE  ${perm}  ${n.name}`;
        })
        .join('\n');
      return { output: lsOutput, success: true };
    }

    case 'cd': {
      if (!operand) {
        // Default go to home
        return { output: '', success: true, newDir: '/home/student' };
      }
      const { node, pathStr } = resolveNode(rootFS, currentDir, operand);
      if (!node) {
        return { output: `cd: no such file or directory: ${operand}`, success: false };
      }
      if (node.type !== 'dir') {
        return { output: `cd: not a directory: ${operand}`, success: false };
      }
      return { output: '', success: true, newDir: pathStr };
    }

    case 'mkdir': {
      if (!operand) {
        return { output: 'mkdir: missing operand directory name', success: false };
      }
      const parts = operand.split('/');
      const newDirName = parts.pop()!;
      const parentPath = parts.join('/') || '.';

      const { node: parentNode } = resolveNode(rootFS, currentDir, parentPath);
      if (!parentNode || parentNode.type !== 'dir') {
        return { output: `mkdir: cannot create directory '${operand}': Parent path not found`, success: false };
      }

      parentNode.children = parentNode.children || {};
      if (parentNode.children[newDirName]) {
        return { output: `mkdir: cannot create directory '${operand}': File or directory already exists`, success: false };
      }

      parentNode.children[newDirName] = {
        type: 'dir',
        name: newDirName,
        children: {},
        permissions: 'rwxr-xr-x'
      };
      return { output: `Folder created: ${newDirName}`, success: true };
    }

    case 'touch': {
      if (!operand) {
        return { output: 'touch: missing operand file name', success: false };
      }
      const parts = operand.split('/');
      const newFileName = parts.pop()!;
      const parentPath = parts.join('/') || '.';

      const { node: parentNode } = resolveNode(rootFS, currentDir, parentPath);
      if (!parentNode || parentNode.type !== 'dir') {
        return { output: `touch: cannot create file '${operand}': Parent directory not found`, success: false };
      }

      parentNode.children = parentNode.children || {};
      if (parentNode.children[newFileName]) {
        // update timestamp only
        return { output: `touch: timestamp refreshed for ${newFileName}`, success: true };
      }

      parentNode.children[newFileName] = {
        type: 'file',
        name: newFileName,
        content: '',
        permissions: 'rw-r--r--'
      };
      return { output: `File created: ${newFileName}`, success: true };
    }

    case 'cat': {
      if (!operand) {
        return { output: 'cat: missing operand file name', success: false };
      }
      const { node } = resolveNode(rootFS, currentDir, operand);
      if (!node) {
        return { output: `cat: ${operand}: No such file or directory`, success: false };
      }
      if (node.type === 'dir') {
        return { output: `cat: ${operand}: Is a directory`, success: false };
      }
      if (node.permissions && node.permissions.startsWith('---')) {
        return { output: `cat: ${operand}: Permission denied`, success: false };
      }
      return { output: node.content || '(empty file)', success: true };
    }

    case 'rm': {
      if (!operand) {
        return { output: 'rm: missing operand target name', success: false };
      }
      const parts = operand.split('/');
      const targetName = parts.pop()!;
      const parentPath = parts.join('/') || '.';

      const { node: parentNode } = resolveNode(rootFS, currentDir, parentPath);
      if (!parentNode || parentNode.type !== 'dir' || !parentNode.children || !parentNode.children[targetName]) {
        return { output: `rm: ${operand}: No such file or directory`, success: false };
      }

      delete parentNode.children[targetName];
      return { output: `Removed target successfully: ${targetName}`, success: true };
    }

    case 'cp': {
      if (!operand || !secondOperand) {
        return { output: 'cp: usage: cp [source_file] [dest_file_or_path]', success: false };
      }
      const { node: srcNode } = resolveNode(rootFS, currentDir, operand);
      if (!srcNode) {
        return { output: `cp: cannot stat '${operand}': No such file or directory`, success: false };
      }
      if (srcNode.type === 'dir') {
        return { output: `cp: -r not specified, omitting directory '${operand}'`, success: false };
      }

      const destParts = secondOperand.split('/');
      const destName = destParts.pop()!;
      const destParentPath = destParts.join('/') || '.';
      const { node: destParentNode } = resolveNode(rootFS, currentDir, destParentPath);

      if (!destParentNode || destParentNode.type !== 'dir') {
        return { output: `cp: cannot copy to '${secondOperand}': Path not found`, success: false };
      }

      destParentNode.children = destParentNode.children || {};
      destParentNode.children[destName] = {
        type: 'file',
        name: destName,
        content: srcNode.content || '',
        permissions: srcNode.permissions || 'rw-r--r--'
      };

      return { output: `File copied: '${operand}' -> '${secondOperand}'`, success: true };
    }

    case 'mv': {
      if (!operand || !secondOperand) {
        return { output: 'mv: usage: mv [source] [destination]', success: false };
      }
      const { node: srcNode } = resolveNode(rootFS, currentDir, operand);
      if (!srcNode) {
        return { output: `mv: cannot stat '${operand}': No such file or directory`, success: false };
      }

      const srcParts = operand.split('/');
      const srcName = srcParts.pop()!;
      const srcParentPath = srcParts.join('/') || '.';
      const { node: srcParentNode } = resolveNode(rootFS, currentDir, srcParentPath);

      const destParts = secondOperand.split('/');
      const destName = destParts.pop()!;
      const destParentPath = destParts.join('/') || '.';
      const { node: destParentNode } = resolveNode(rootFS, currentDir, destParentPath);

      if (!destParentNode || destParentNode.type !== 'dir') {
        return { output: `mv: cannot move to '${secondOperand}': Path not found`, success: false };
      }

      // Remove from source map
      if (srcParentNode && srcParentNode.children) {
        delete srcParentNode.children[srcName];
      }

      // Add to destination map
      destParentNode.children = destParentNode.children || {};
      destParentNode.children[destName] = {
        ...srcNode,
        name: destName
      };

      return { output: `Moved '${operand}' to '${secondOperand}'`, success: true };
    }

    case 'chmod': {
      if (!operand || !secondOperand) {
        return { output: 'chmod: usage: chmod 777 [file] or chmod 000 [file]', success: false };
      }
      const { node } = resolveNode(rootFS, currentDir, secondOperand);
      if (!node) {
        return { output: `chmod: ${secondOperand}: No such file or directory`, success: false };
      }
      
      let perm = 'rw-r--r--';
      if (operand === '777' || operand === 'rwxrwxrwx' || operand.includes('+x')) {
        perm = 'rwxrwxrwx';
      } else if (operand === '755' || operand === 'rwxr-xr-x') {
        perm = 'rwxr-xr-x';
      } else if (operand === '644' || operand === 'rw-r--r--') {
        perm = 'rw-r--r--';
      } else if (operand === '000' || operand === '---------') {
        perm = '---------';
      } else {
        perm = operand;
      }

      node.permissions = perm;
      return { output: `Permissions updated: ${node.name} mode changed to ${perm}`, success: true };
    }

    case 'ping': {
      if (!operand) {
        return { output: 'ping: missing host operand\nusage: ping [host]', success: false };
      }
      const cleanHost = operand.replace(/https?:\/\//g, '').split('/')[0];
      const isGoogle = cleanHost.includes('google.com');
      const isIP = cleanHost === '10.0.1.25';
      
      const ipAddr = isGoogle ? '142.250.190.46' : isIP ? '10.0.1.25' : '10.0.2.22';

      return {
        output: `PING ${cleanHost} (${ipAddr}) 56(84) bytes of data.
64 bytes from ${ipAddr}: icmp_seq=1 ttl=64 time=12.4 ms
64 bytes from ${ipAddr}: icmp_seq=2 ttl=64 time=11.1 ms
64 bytes from ${ipAddr}: icmp_seq=3 ttl=64 time=13.0 ms

--- ${cleanHost} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2004ms
rtt min/avg/max/mdev = 11.121/12.176/13.023/0.791 ms`,
        success: true
      };
    }

    case 'ifconfig': {
      return {
        output: `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255
        inet6 fe80::a00:27ff:fe8f:ecce  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:8f:ec:ce  txqueuelen 1000  (Ethernet)
        RX packets 14032  bytes 10563452 (10.5 MB)
        TX packets 8543  bytes 1290321 (1.2 MB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)`,
        success: true
      };
    }

    case 'nslookup': {
      if (!operand) {
        return { output: 'nslookup: usage: nslookup [host]', success: false };
      }
      const cleanHost = operand.replace(/https?:\/\//g, '').split('/')[0];
      const address = cleanHost === 'google.com' ? '142.250.190.46' : '10.0.2.80';
      return {
        output: `Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
Name:	${cleanHost}
Address: ${address}`,
        success: true
      };
    }

    case 'traceroute': {
      if (!operand) {
        return { output: 'traceroute: usage: traceroute [host]', success: false };
      }
      const cleanHost = operand.replace(/https?:\/\//g, '').split('/')[0];
      return {
        output: `traceroute to ${cleanHost} (142.250.190.46), 30 hops max, 60 byte packets
 1  gateway (10.0.2.2)  0.221 ms  0.198 ms  0.187 ms
 2  local-firewall (192.168.1.1)  1.102 ms  1.054 ms  1.011 ms
 3  isp-router (172.16.0.4)  8.402 ms  8.312 ms  8.291 ms
 4  cloud-ingress (142.250.190.46)  12.511 ms  12.392 ms  12.441 ms`,
        success: true
      };
    }

    case 'netstat': {
      return {
        output: `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      812/sshd
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN      904/postgres
tcp        0      0 10.0.2.15:443           10.0.2.20:41202         ESTABLISHED 1124/nginx-ssl
tcp        0      0 10.0.2.15:80            10.0.2.40:51302         TIME_WAIT   -`,
        success: true
      };
    }

    case 'pkg': {
      if (!operand) {
        return { output: 'pkg: usage: pkg [update | upgrade | install] [package_name]', success: false };
      }
      const op = operand.toLowerCase();
      if (op === 'update') {
        return {
          output: `Get:1 https://packages.termux.org/apt/termux-main stable InRelease [14.0 kB]
Get:2 https://packages.termux.org/apt/termux-main stable/main all Packages [8,410 B]
Get:3 https://packages.termux.org/apt/termux-main stable/main aarch64 Packages [345 kB]
Fetched 367 kB in 1s (241 kB/s)
Reading package lists... Done
Building dependency tree... Done
All packages are up to date!`,
          success: true
        };
      } else if (op === 'upgrade') {
        return {
          output: `Reading package lists... Done
Building dependency tree... Done
Calculating upgrade... Done
The following packages will be upgraded:
  bash curl openssl termux-tools tar
5 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
Need to get 1,421 kB of archives.
After this operation, 102 kB of additional disk space will be used.
Do you want to continue? [Y/n] y
Get:1 https://packages.termux.org/apt/termux-main stable/main aarch64 bash [611 kB]
Get:2 https://packages.termux.org/apt/termux-main stable/main aarch64 curl [240 kB]
[========================================] 100%
Upgrading system configurations... Done!
Upgrade sequence complete!`,
          success: true
        };
      } else if (op === 'install') {
        const pkgName = (secondOperand || '').toLowerCase();
        if (!pkgName) {
          return { output: 'pkg install: missing package name operand', success: false };
        }
        if (pkgName === 'git') {
          return {
            output: `Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  git
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 4,210 kB of archives.
After this operation, 18.4 MB of additional disk space will be used.
Get:1 https://packages.termux.org/apt/termux-main stable/main aarch64 git [4,210 kB]
[========================================] 100%
Selecting previously unselected package git.
Preparing to unpack git ...
Unpacking git (2.39.1) ...
Setting up git ...
git tool successfully registered!`,
            success: true
          };
        } else if (pkgName === 'nmap') {
          return {
            output: `Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  nmap
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 5,102 kB of archives.
After this operation, 24.1 MB of additional disk space will be used.
Get:1 https://packages.termux.org/apt/termux-main stable/main aarch64 nmap [5,102 kB]
[========================================] 100%
Selecting previously unselected package nmap.
Unpacking nmap (7.93) ...
Setting up nmap ...
nmap security scanner registered successfully!`,
            success: true
          };
        } else if (pkgName === 'nano') {
          return {
            output: `Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  nano
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 420 kB of archives.
Get:1 https://packages.termux.org/apt/termux-main stable/main aarch64 nano [420 kB]
[========================================] 100%
Selecting previously unselected package nano.
Unpacking nano ...
Setting up nano ...
nano terminal text editor registered successfully!
*** FLAG VERIFIED: EV_FLAG{TERMUX_TOOLSMITH_6} ***`,
            success: true
          };
        } else {
          return {
            output: `Reading package lists... Done
Building dependency tree... Done
Selecting previously unselected package ${pkgName}.
Unpacking ${pkgName} ...
Setting up ${pkgName} ...
${pkgName} deployment complete!`,
            success: true
          };
        }
      }
      return { output: `pkg: unknown operation: ${operand}`, success: false };
    }

    case 'whois': {
      if (!operand) {
        return { output: 'whois: missing domain name operand\nusage: whois [domain_name]', success: false };
      }
      const dom = operand.toLowerCase();
      if (dom === 'example.com') {
        return {
          output: `Domain Name: EXAMPLE.COM
Registry Domain ID: 2336797_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.iana.org
Registrar: IANA Reserves
Updated Date: 2025-08-14T00:00:00Z
Creation Date: 1995-08-14T00:00:00Z
Registry Expiry Date: 2026-08-14T00:00:00Z
Registrar Abuse Contact Email: abuse@iana.org
Domain Status: active
Name Server: A.IANA-SERVERS.NET
Name Server: B.IANA-SERVERS.NET

>>> Last update of WHOIS database: 2026-05-22T08:11:00Z <<<`,
          success: true
        };
      } else if (dom === 'ev-tech.com') {
        return {
          output: `Domain Name: EV-TECH.COM
Registry Domain ID: 98172461_DOMAIN_COM-INTERNAL
Registrar WHOIS Server: whois.ev-cyber-academy.com
Registrar: VIMAL SECURE HOSTING CO.
Updated Date: 2026-01-10T12:00:15Z
Creation Date: 2021-04-18T08:30:00Z
Registry Expiry Date: 2030-04-18T08:30:00Z
Registrant Name: Vimal Mentor
Registrant Organization: EV Cyber Academy
Registrant Email: admin@ev-tech.com
Domain Status: locked
Name Server: NS1.EV-TECH.COM
Name Server: NS2.EV-TECH.COM

ADMIN_CONSOLE_SUBDOMAIN: admin.ev-tech.com
VERIFICATION_FLAG: EV_FLAG{RECON_HUNTER_7}

>>> Last update of WHOIS database: 2026-05-22T08:11:00Z <<<`,
          success: true
        };
      } else {
        return {
          output: `Domain Name: ${dom.toUpperCase()}
No registrar whois records detected. Ensure you query supported targets.`,
          success: true
        };
      }
    }

    case 'nmap': {
      if (args.length < 2) {
        return { output: 'nmap: missing target host operand\nusage: nmap [-sV] [host]', success: false };
      }
      const hasSV = args.some(a => a.toLowerCase() === '-sv');
      const targetArg = args.find(a => a.toLowerCase() !== 'nmap' && a.toLowerCase() !== '-sv');
      if (!targetArg) {
        return { output: 'nmap: missing target host', success: false };
      }
      if (hasSV) {
        return {
          output: `Starting Nmap 7.93 ( https://nmap.org ) at 2026-05-22 08:11 UTC
Nmap scan report for ${targetArg} (10.0.2.80)
Host is up (0.0042s latency).
rDNS record for 10.0.2.80: internal-vapps.ev-tech.com
Not shown: 998 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.52 ((Ubuntu))
443/tcp  open  ssl/http Apache httpd 2.4.52 ((Ubuntu))

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 2.15 seconds
*** VERIFICATION CHALLENGE TOKEN: EV_FLAG{PORT_HUNTER_8} ***`,
          success: true
        };
      } else {
        return {
          output: `Starting Nmap 7.93 ( https://nmap.org ) at 2026-05-22 08:11 UTC
Nmap scan report for ${targetArg} (10.0.2.80)
Host is up (0.0051s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https

Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds`,
          success: true
        };
      }
    }

    default:
      return { output: `command not found: ${command}. Supported tools: ls, cd, pwd, cat, touch, mkdir, rm, chmod, cp, mv, ping, ifconfig, nslookup, traceroute, netstat, pkg, whois, nmap, clear, whoami, date`, success: false };
  }
};
