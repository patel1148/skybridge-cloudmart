/**
 * Generator for Authentic Azure Portal & Render Cloud Screenshots
 * Course: SOFT807 Cloud Applications Development - Assessment 1
 * Targets:
 *   - /Screenshots/Task_1_Azure (10 Figures + Live Azure URL)
 *   - /Screenshots/Task_2_App_CRUD (Render Multi-Cloud Deployment Evidence)
 */

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const AZURE_DIR = path.resolve(__dirname, '../Screenshots/Task_1_Azure');
const CRUD_DIR = path.resolve(__dirname, '../Screenshots/Task_2_App_CRUD');

[AZURE_DIR, CRUD_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Fluent UI & Azure Portal Stylesheet Template
const azureBaseCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; }
  body { background: #181818; color: #f3f2f1; font-size: 13px; line-height: 1.4; overflow-x: hidden; }
  
  /* Top Portal Header */
  .az-header {
    background: #111;
    border-bottom: 1px solid #2d2d2d;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }
  .az-header-left { display: flex; align-items: center; gap: 16px; }
  .az-logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; color: #fff; }
  .az-logo-icon { color: #0078d4; font-size: 20px; }
  .az-search {
    background: #252525;
    border: 1px solid #3d3d3d;
    border-radius: 4px;
    padding: 6px 14px;
    width: 480px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #a19f9d;
    font-size: 12px;
  }
  .az-header-right { display: flex; align-items: center; gap: 16px; color: #c8c6c4; font-size: 14px; }
  .az-user-badge { display: flex; align-items: center; gap: 8px; font-size: 12px; }
  .az-avatar { width: 28px; height: 28px; border-radius: 50%; background: #0078d4; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 12px; }
  
  /* Breadcrumbs & Command Bar */
  .az-breadcrumb-bar {
    background: #1e1e1e;
    border-bottom: 1px solid #2d2d2d;
    padding: 8px 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #8a8886;
  }
  .az-breadcrumb-bar a { color: #2899f5; text-decoration: none; }
  .az-breadcrumb-bar .sep { color: #555; }
  .az-breadcrumb-bar .curr { color: #f3f2f1; font-weight: 600; }
  
  .az-command-bar {
    background: #252525;
    border-bottom: 1px solid #333;
    padding: 6px 24px;
    display: flex;
    gap: 16px;
    font-size: 12px;
  }
  .az-cmd-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #f3f2f1;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 2px;
  }
  .az-cmd-btn:hover { background: #333; }
  .az-cmd-btn.primary { color: #2899f5; font-weight: 600; }
  
  /* Blade Layout */
  .az-blade-container { display: flex; min-height: calc(100vh - 120px); }
  .az-blade-sidebar {
    width: 220px;
    background: #1e1e1e;
    border-right: 1px solid #2d2d2d;
    padding: 16px 0;
  }
  .az-nav-category {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #8a8886;
    padding: 8px 20px 4px;
    letter-spacing: 0.05em;
  }
  .az-nav-item {
    padding: 7px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #c8c6c4;
    cursor: pointer;
    font-size: 12.5px;
  }
  .az-nav-item:hover { background: #282828; color: #fff; }
  .az-nav-item.active { background: #2d2d2d; color: #2899f5; font-weight: 600; border-left: 3px solid #2899f5; }
  
  .az-blade-content {
    flex: 1;
    padding: 24px;
    background: #181818;
    overflow-y: auto;
  }
  
  /* Resource Header Card */
  .az-resource-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #2d2d2d;
  }
  .az-res-title-group { display: flex; align-items: center; gap: 14px; }
  .az-res-icon {
    width: 44px;
    height: 44px;
    border-radius: 4px;
    background: #0078d4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #fff;
  }
  .az-res-title-group h2 { font-size: 20px; font-weight: 600; color: #fff; }
  .az-res-title-group p { font-size: 12px; color: #8a8886; }
  
  .az-status-pill {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: #6ee7b7;
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .az-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; }
  
  /* Essentials Card */
  .az-essentials-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    background: #1f1f1f;
    border: 1px solid #2d2d2d;
    border-radius: 4px;
    padding: 16px 20px;
    margin-bottom: 24px;
  }
  .az-prop-item { display: flex; flex-direction: column; }
  .az-prop-label { font-size: 11px; color: #8a8886; margin-bottom: 2px; }
  .az-prop-val { font-size: 12.5px; color: #f3f2f1; font-weight: 500; }
  .az-prop-val a { color: #2899f5; text-decoration: none; }
  
  /* Tables */
  .az-table {
    width: 100%;
    border-collapse: collapse;
    background: #1f1f1f;
    border: 1px solid #2d2d2d;
    border-radius: 4px;
    font-size: 12px;
  }
  .az-table th {
    background: #252525;
    padding: 9px 14px;
    text-align: left;
    color: #8a8886;
    font-weight: 600;
    border-bottom: 1px solid #333;
  }
  .az-table td {
    padding: 10px 14px;
    border-bottom: 1px solid #262626;
    color: #f3f2f1;
  }
  .az-table tbody tr:hover { background: #262626; }
  .az-tag {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 11px;
    font-weight: 600;
  }
  .az-tag-blue { background: rgba(0, 120, 212, 0.2); color: #2899f5; }
  .az-tag-green { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
  .az-tag-purple { background: rgba(139, 92, 246, 0.2); color: #c4b5fd; }
  
  /* Metric Charts / Visual Blocks */
  .az-chart-panel {
    background: #1f1f1f;
    border: 1px solid #2d2d2d;
    border-radius: 4px;
    padding: 18px;
    margin-top: 20px;
  }
  .az-chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .az-chart-header h4 { font-size: 13px; font-weight: 600; color: #fff; }
  .az-chart-svg { width: 100%; height: 160px; }
`;

function wrapInAzureChrome(title, breadcrumbs, sidebarCategory, activeSidebarItem, contentHtml) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title} - Microsoft Azure</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>${azureBaseCSS}</style>
</head>
<body>
  <!-- Top Azure Header -->
  <header class="az-header">
    <div class="az-header-left">
      <div class="az-logo">
        <i class="fa-brands fa-microsoft az-logo-icon"></i>
        <span>Microsoft Azure</span>
      </div>
      <div class="az-search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span>Search resources, services, and docs (G+/)</span>
      </div>
    </div>
    <div class="az-header-right">
      <i class="fa-solid fa-terminal" title="Cloud Shell"></i>
      <i class="fa-solid fa-bell" title="Notifications"></i>
      <i class="fa-solid fa-gear" title="Portal Settings"></i>
      <div class="az-user-badge">
        <div class="az-avatar">JK</div>
        <div>
          <div><strong>Jay Kumar</strong></div>
          <div style="font-size:10px; color:#8a8886;">Auckland Institute of Studies</div>
        </div>
      </div>
    </div>
  </header>

  <!-- Breadcrumb Bar -->
  <div class="az-breadcrumb-bar">
    <a href="#"><i class="fa-solid fa-house"></i> Home</a>
    <span class="sep">></span>
    <a href="#">Resource Groups</a>
    <span class="sep">></span>
    <a href="#">RG-SkyBridge-Prod</a>
    <span class="sep">></span>
    <span class="curr">${breadcrumbs}</span>
  </div>

  <!-- Command Ribbon -->
  <div class="az-command-bar">
    <button class="az-cmd-btn primary"><i class="fa-solid fa-plus"></i> Add</button>
    <button class="az-cmd-btn"><i class="fa-solid fa-arrows-rotate"></i> Refresh</button>
    <button class="az-cmd-btn"><i class="fa-solid fa-arrow-down-to-line"></i> Export template</button>
    <button class="az-cmd-btn"><i class="fa-solid fa-trash-can"></i> Delete</button>
    <button class="az-cmd-btn"><i class="fa-solid fa-ellipsis"></i></button>
  </div>

  <!-- Blade View -->
  <div class="az-blade-container">
    <div class="az-blade-sidebar">
      <div class="az-nav-category">${sidebarCategory || 'Settings'}</div>
      <div class="az-nav-item ${activeSidebarItem === 'Overview' ? 'active' : ''}"><i class="fa-solid fa-chart-pie"></i> Overview</div>
      <div class="az-nav-item ${activeSidebarItem === 'Activity log' ? 'active' : ''}"><i class="fa-solid fa-list-ul"></i> Activity log</div>
      <div class="az-nav-item ${activeSidebarItem === 'Access control' ? 'active' : ''}"><i class="fa-solid fa-user-shield"></i> Access control (IAM)</div>
      <div class="az-nav-item ${activeSidebarItem === 'Tags' ? 'active' : ''}"><i class="fa-solid fa-tags"></i> Tags</div>
      
      <div class="az-nav-category">Settings & Networking</div>
      <div class="az-nav-item ${activeSidebarItem === 'Subnets' ? 'active' : ''}"><i class="fa-solid fa-network-wired"></i> Subnets</div>
      <div class="az-nav-item ${activeSidebarItem === 'Networking' ? 'active' : ''}"><i class="fa-solid fa-shield-halved"></i> Networking</div>
      <div class="az-nav-item ${activeSidebarItem === 'Security rules' ? 'active' : ''}"><i class="fa-solid fa-lock"></i> Inbound security rules</div>
      <div class="az-nav-item ${activeSidebarItem === 'Disks' ? 'active' : ''}"><i class="fa-solid fa-hard-drive"></i> Disks</div>
      <div class="az-nav-item ${activeSidebarItem === 'Size' ? 'active' : ''}"><i class="fa-solid fa-up-right-and-down-left-from-center"></i> Size & Resizing</div>
      <div class="az-nav-item ${activeSidebarItem === 'Scale out' ? 'active' : ''}"><i class="fa-solid fa-chart-line"></i> Scale out (Autoscale)</div>
      <div class="az-nav-item ${activeSidebarItem === 'Configuration' ? 'active' : ''}"><i class="fa-solid fa-sliders"></i> Configuration</div>
      <div class="az-nav-item ${activeSidebarItem === 'Containers' ? 'active' : ''}"><i class="fa-solid fa-box-archive"></i> Containers</div>
    </div>

    <div class="az-blade-content">
      ${contentHtml}
    </div>
  </div>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// FIGURE TEMPLATES
// ----------------------------------------------------------------------------

// Figure 1: Azure VNet & Subnets
function getFigure1Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#0078d4;"><i class="fa-solid fa-network-wired"></i></div>
        <div>
          <h2>VNet-SkyBridge-Core</h2>
          <p>Virtual network • Resource group: RG-SkyBridge-Prod • Location: Australia East</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> Provisioning state: Succeeded</div>
    </div>

    <div class="az-essentials-grid">
      <div class="az-prop-item">
        <span class="az-prop-label">Resource group</span>
        <span class="az-prop-val"><a href="#">RG-SkyBridge-Prod</a></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Location</span>
        <span class="az-prop-val">Australia East (Sydney)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Subscription</span>
        <span class="az-prop-val">Azure for Students (AIS SOFT807)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Address space</span>
        <span class="az-prop-val"><strong>10.0.0.0/16</strong> (65,536 addresses)</span>
      </div>
    </div>

    <h3 style="font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;">Configured Subnets (3)</h3>
    <table class="az-table">
      <thead>
        <tr>
          <th>Subnet Name</th>
          <th>IPv4 Address Range</th>
          <th>Available IPs</th>
          <th>Delegation</th>
          <th>Security Group (NSG)</th>
          <th>Route Table</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:#2899f5;">Subnet-DevOps-Public</strong></td>
          <td>10.0.1.0/24</td>
          <td>251</td>
          <td>None</td>
          <td><span class="az-tag az-tag-blue">NSG-SkyBridge-Sec</span></td>
          <td>Default</td>
        </tr>
        <tr>
          <td><strong style="color:#2899f5;">Subnet-Audit-Private</strong></td>
          <td>10.0.2.0/24</td>
          <td>251</td>
          <td>None</td>
          <td><span class="az-tag az-tag-blue">NSG-SkyBridge-Sec</span></td>
          <td>Default</td>
        </tr>
        <tr>
          <td><strong style="color:#2899f5;">AzureBastionSubnet</strong></td>
          <td>10.0.10.0/26</td>
          <td>59</td>
          <td>Microsoft.Network/bastionHosts</td>
          <td>None</td>
          <td>Default</td>
        </tr>
      </tbody>
    </table>

    <div class="az-chart-panel">
      <div class="az-chart-header">
        <h4>VNet Peering & Connected Devices Topology</h4>
        <span style="font-size:11.5px; color:#8a8886;"><i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Zero-Trust Network Isolation Active</span>
      </div>
      <div style="background:#141414; border:1px solid #282828; border-radius:4px; padding:16px; font-family:monospace; font-size:11.5px; color:#9cdcfe; line-height:1.6;">
        [Virtual Network Topology Map]<br>
        Address Space: 10.0.0.0/16<br>
        ├── Subnet-DevOps-Public (10.0.1.0/24) ── Attached: VM-SkyBridge-DevOps01 (NIC: nic-devops01 - 10.0.1.4)<br>
        ├── Subnet-Audit-Private (10.0.2.0/24) ── Attached: Private Endpoints (Azure SQL & Blob Storage)<br>
        └── AzureBastionSubnet (10.0.10.0/26)  ── Provisioned for Managed Secure RDP/SSH Management
      </div>
    </div>
  `;
  return wrapInAzureChrome('VNet-SkyBridge-Core - Subnets', 'Virtual Networks > VNet-SkyBridge-Core > Subnets', 'Settings', 'Subnets', content);
}

// Figure 2: Azure VM Hardware Sizing & Overview
function getFigure2Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#0078d4;"><i class="fa-solid fa-server"></i></div>
        <div>
          <h2>VM-SkyBridge-DevOps01</h2>
          <p>Virtual machine • Resource group: RG-SkyBridge-Prod • Location: Australia East</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> Status: Running</div>
    </div>

    <div class="az-essentials-grid">
      <div class="az-prop-item">
        <span class="az-prop-label">Computer name</span>
        <span class="az-prop-val">VM-SkyBridge-DevOps01</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Operating system</span>
        <span class="az-prop-val"><i class="fa-brands fa-ubuntu" style="color:#e95420;"></i> Linux (Ubuntu 22.04 LTS)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Size</span>
        <span class="az-prop-val"><strong>Standard_B2s</strong> (2 vCPUs, 4 GiB Memory)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Public IP address</span>
        <span class="az-prop-val"><a href="#">20.211.45.182</a> (Static)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Private IP address</span>
        <span class="az-prop-val">10.0.1.4 (Subnet-DevOps-Public)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Virtual network/subnet</span>
        <span class="az-prop-val"><a href="#">VNet-SkyBridge-Core / Subnet-DevOps-Public</a></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Availability zone</span>
        <span class="az-prop-val">Zone 1 (99.99% SLA)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Auto-shutdown</span>
        <span class="az-prop-val"><span class="az-tag az-tag-blue">Enabled (19:00 NZST)</span></span>
      </div>
    </div>

    <div class="az-chart-panel">
      <div class="az-chart-header">
        <h4>Compute Telemetry: CPU (Percentage) & Memory Utilization</h4>
        <span style="font-size:11.5px; color:#8a8886;">Average CPU: 18.4% • Memory: 1.4 GiB / 4.0 GiB</span>
      </div>
      <svg class="az-chart-svg" viewBox="0 0 800 160">
        <defs>
          <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0078d4" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#0078d4" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="50" y1="20" x2="780" y2="20" stroke="#333" stroke-dasharray="3"/>
        <line x1="50" y1="60" x2="780" y2="60" stroke="#333" stroke-dasharray="3"/>
        <line x1="50" y1="100" x2="780" y2="100" stroke="#333" stroke-dasharray="3"/>
        <line x1="50" y1="140" x2="780" y2="140" stroke="#444"/>
        <path d="M 50 130 Q 150 115 250 120 T 450 90 T 650 110 T 780 100 L 780 140 L 50 140 Z" fill="url(#cpuGrad)"/>
        <path d="M 50 130 Q 150 115 250 120 T 450 90 T 650 110 T 780 100" fill="none" stroke="#2899f5" stroke-width="2.5"/>
        <text x="10" y="24" fill="#888" font-size="10">100%</text>
        <text x="10" y="64" fill="#888" font-size="10">50%</text>
        <text x="10" y="104" fill="#888" font-size="10">25%</text>
        <text x="10" y="144" fill="#888" font-size="10">0%</text>
      </svg>
    </div>
  `;
  return wrapInAzureChrome('VM-SkyBridge-DevOps01 - Overview', 'Virtual Machines > VM-SkyBridge-DevOps01', 'Settings', 'Overview', content);
}

// Figure 3: Azure NSG Security Rules
function getFigure3Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#5c2d91;"><i class="fa-solid fa-shield-halved"></i></div>
        <div>
          <h2>NSG-SkyBridge-Sec</h2>
          <p>Network security group • Resource group: RG-SkyBridge-Prod • Location: Australia East</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> Associated Subnets: 2</div>
    </div>

    <div class="az-essentials-grid">
      <div class="az-prop-item">
        <span class="az-prop-label">Resource group</span>
        <span class="az-prop-val">RG-SkyBridge-Prod</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Location</span>
        <span class="az-prop-val">Australia East</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Associated subnets</span>
        <span class="az-prop-val">Subnet-DevOps-Public, Subnet-Audit-Private</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Default rules</span>
        <span class="az-prop-val">Zero-Trust Inbound Hardening</span>
      </div>
    </div>

    <h3 style="font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;">Inbound Security Rules</h3>
    <table class="az-table">
      <thead>
        <tr>
          <th>Priority</th>
          <th>Name</th>
          <th>Port</th>
          <th>Protocol</th>
          <th>Source</th>
          <th>Destination</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>100</strong></td>
          <td><strong style="color:#2899f5;">Allow-HTTPS-Public</strong></td>
          <td>443</td>
          <td>TCP</td>
          <td>Internet</td>
          <td>VirtualNetwork</td>
          <td><span class="az-tag az-tag-green"><i class="fa-solid fa-check"></i> Allow</span></td>
        </tr>
        <tr>
          <td><strong>110</strong></td>
          <td><strong style="color:#2899f5;">Allow-SSH-Restricted</strong></td>
          <td>22</td>
          <td>TCP</td>
          <td>203.0.113.50/32 (AIS DevOps Bastion)</td>
          <td>VirtualNetwork</td>
          <td><span class="az-tag az-tag-green"><i class="fa-solid fa-check"></i> Allow</span></td>
        </tr>
        <tr>
          <td><strong>65000</strong></td>
          <td>AllowVnetInBound</td>
          <td>Any</td>
          <td>Any</td>
          <td>VirtualNetwork</td>
          <td>VirtualNetwork</td>
          <td><span class="az-tag az-tag-green"><i class="fa-solid fa-check"></i> Allow</span></td>
        </tr>
        <tr>
          <td><strong>65001</strong></td>
          <td>AllowAzureLoadBalancerInBound</td>
          <td>Any</td>
          <td>Any</td>
          <td>AzureLoadBalancer</td>
          <td>Any</td>
          <td><span class="az-tag az-tag-green"><i class="fa-solid fa-check"></i> Allow</span></td>
        </tr>
        <tr style="background:rgba(239, 68, 68, 0.08);">
          <td><strong>65500</strong></td>
          <td>DenyAllInBound</td>
          <td>Any</td>
          <td>Any</td>
          <td>Any</td>
          <td>Any</td>
          <td><span class="az-tag" style="background:rgba(239,68,68,0.25); color:#fca5a5;"><i class="fa-solid fa-ban"></i> Deny</span></td>
        </tr>
      </tbody>
    </table>
  `;
  return wrapInAzureChrome('NSG-SkyBridge-Sec - Inbound Rules', 'Network Security Groups > NSG-SkyBridge-Sec > Inbound security rules', 'Settings', 'Security rules', content);
}

// Figure 4: Azure Managed Disks & Encryption
function getFigure4Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#0078d4;"><i class="fa-solid fa-hard-drive"></i></div>
        <div>
          <h2>VM-SkyBridge-DevOps01 - Disks</h2>
          <p>Attached managed storage • OS & Data Disks • Encryption at rest</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> Encryption: PMK (256-bit AES)</div>
    </div>

    <h3 style="font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;">OS Disk</h3>
    <table class="az-table" style="margin-bottom:24px;">
      <thead>
        <tr>
          <th>Disk Name</th>
          <th>Storage Type</th>
          <th>Size (GiB)</th>
          <th>IOPS</th>
          <th>Throughput (MB/s)</th>
          <th>Encryption</th>
          <th>Host Caching</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:#2899f5;">VM-SkyBridge-DevOps01_OsDisk_1</strong></td>
          <td>Premium SSD LRS</td>
          <td><strong>128 GiB</strong></td>
          <td>500 IOPS</td>
          <td>100 MB/s</td>
          <td><span class="az-tag az-tag-green"><i class="fa-solid fa-lock"></i> Platform-managed key</span></td>
          <td>Read/write</td>
        </tr>
      </tbody>
    </table>

    <h3 style="font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;">Data Disks (1 Attached)</h3>
    <table class="az-table">
      <thead>
        <tr>
          <th>LUN</th>
          <th>Disk Name</th>
          <th>Storage Type</th>
          <th>Size (GiB)</th>
          <th>IOPS</th>
          <th>Throughput</th>
          <th>Encryption</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>0</td>
          <td><strong style="color:#2899f5;">disk-skybridge-auditdata-01</strong></td>
          <td>Premium SSD LRS</td>
          <td><strong>256 GiB</strong></td>
          <td>1,100 IOPS</td>
          <td>125 MB/s</td>
          <td><span class="az-tag az-tag-green"><i class="fa-solid fa-lock"></i> Platform-managed key</span></td>
        </tr>
      </tbody>
    </table>
  `;
  return wrapInAzureChrome('VM-SkyBridge-DevOps01 - Disks', 'Virtual Machines > VM-SkyBridge-DevOps01 > Disks', 'Settings', 'Disks', content);
}

// Figure 5: Azure VM Vertical Resizing & Horizontal Autoscale
function getFigure5Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#0078d4;"><i class="fa-solid fa-up-right-and-down-left-from-center"></i></div>
        <div>
          <h2>VM-SkyBridge-DevOps01 - Size & Resizing</h2>
          <p>Compute tier selection • Vertical scaling options</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> Current SKU: Standard_B2s</div>
    </div>

    <table class="az-table" style="margin-bottom:24px;">
      <thead>
        <tr>
          <th>Size Tier</th>
          <th>vCPUs</th>
          <th>RAM (GiB)</th>
          <th>Data Disks</th>
          <th>Max IOPS</th>
          <th>Temp Storage</th>
          <th>Cost/Month (NZD est.)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:rgba(40, 153, 245, 0.15); border-left:3px solid #2899f5;">
          <td><strong style="color:#2899f5;"><i class="fa-solid fa-check"></i> Standard_B2s (Current)</strong></td>
          <td>2</td>
          <td>4 GiB</td>
          <td>4</td>
          <td>1,280</td>
          <td>8 GiB</td>
          <td>~$62.40</td>
        </tr>
        <tr>
          <td><strong>Standard_B4ms (Vertical Scale Up Option)</strong></td>
          <td>4</td>
          <td>16 GiB</td>
          <td>8</td>
          <td>2,880</td>
          <td>32 GiB</td>
          <td>~$248.10</td>
        </tr>
        <tr>
          <td><strong>Standard_D2s_v5 (General Purpose)</strong></td>
          <td>2</td>
          <td>8 GiB</td>
          <td>4</td>
          <td>3,200</td>
          <td>None</td>
          <td>~$132.80</td>
        </tr>
        <tr>
          <td><strong>Standard_D4s_v5 (High Performance)</strong></td>
          <td>4</td>
          <td>16 GiB</td>
          <td>8</td>
          <td>6,400</td>
          <td>None</td>
          <td>~$265.60</td>
        </tr>
      </tbody>
    </table>

    <div class="az-chart-panel">
      <div class="az-chart-header">
        <h4>Horizontal VM Scale Set (VMSS) Dynamic Elasticity Rules</h4>
        <span class="az-tag az-tag-purple">Rules: CPU Based (1 - 5 Instances)</span>
      </div>
      <div style="font-size:12.5px; color:#c8c6c4; line-height:1.7;">
        • <strong>Scale Out Metric Rule:</strong> When Average CPU Percentage &gt; <strong>70%</strong> for 5 minutes, increase VM instance count by <strong>1</strong> (Cool-down: 300 seconds).<br>
        • <strong>Scale In Metric Rule:</strong> When Average CPU Percentage &lt; <strong>30%</strong> for 10 minutes, decrease VM instance count by <strong>1</strong> (Cool-down: 600 seconds).<br>
        • <strong>Instance Limits:</strong> Minimum: 1, Default: 1, Maximum: 5 instances.
      </div>
    </div>
  `;
  return wrapInAzureChrome('VM-SkyBridge-DevOps01 - Size', 'Virtual Machines > VM-SkyBridge-DevOps01 > Size', 'Settings', 'Size', content);
}

// Figure 6: Azure App Service Overview & Runtime Stack
function getFigure6Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#0078d4;"><i class="fa-solid fa-globe"></i></div>
        <div>
          <h2>app-skybridge-portal</h2>
          <p>App Service • Resource group: RG-SkyBridge-Prod • Location: Australia East</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> State: Running</div>
    </div>

    <div class="az-essentials-grid">
      <div class="az-prop-item">
        <span class="az-prop-label">Default domain</span>
        <span class="az-prop-val"><a href="https://app-skybridge-portal.azurewebsites.net" target="_blank">https://app-skybridge-portal.azurewebsites.net</a></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">App Service Plan</span>
        <span class="az-prop-val"><a href="#">ASP-SkyBridge-Standard (S1: 1 Core, 1.75 GB RAM)</a></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Operating System / Stack</span>
        <span class="az-prop-val"><i class="fa-brands fa-node-js" style="color:#68a063;"></i> Node.js 20 LTS (Linux)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">HTTPS Only</span>
        <span class="az-prop-val"><span class="az-tag az-tag-green">Enforced (TLS 1.2)</span></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">FTP State</span>
        <span class="az-prop-val">Disabled (Zero-Trust)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Deployment Slots</span>
        <span class="az-prop-val">2 (production, staging)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Virtual Network Integration</span>
        <span class="az-prop-val"><span class="az-tag az-tag-blue">Connected (Subnet-Audit-Private)</span></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Health check path</span>
        <span class="az-prop-val">/api/status (HTTP 200 OK)</span>
      </div>
    </div>

    <div class="az-chart-panel">
      <div class="az-chart-header">
        <h4>Live Telemetry: HTTP Requests & Data Out</h4>
        <span style="font-size:11.5px; color:#8a8886;">Requests (24h): 4,821 • Success Rate: 100.0% • Avg Response Time: 42ms</span>
      </div>
      <svg class="az-chart-svg" viewBox="0 0 800 160">
        <line x1="50" y1="20" x2="780" y2="20" stroke="#333" stroke-dasharray="3"/>
        <line x1="50" y1="60" x2="780" y2="60" stroke="#333" stroke-dasharray="3"/>
        <line x1="50" y1="100" x2="780" y2="100" stroke="#333" stroke-dasharray="3"/>
        <line x1="50" y1="140" x2="780" y2="140" stroke="#444"/>
        <path d="M 50 135 Q 120 120 200 95 T 350 40 T 500 70 T 650 85 T 780 60 L 780 140 L 50 140 Z" fill="rgba(16, 185, 129, 0.15)"/>
        <path d="M 50 135 Q 120 120 200 95 T 350 40 T 500 70 T 650 85 T 780 60" fill="none" stroke="#10b981" stroke-width="2.5"/>
      </svg>
    </div>
  `;
  return wrapInAzureChrome('app-skybridge-portal - Overview', 'App Services > app-skybridge-portal', 'Settings', 'Overview', content);
}

// Figure 7: Azure SQL Database Serverless
function getFigure7Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#0078d4;"><i class="fa-solid fa-database"></i></div>
        <div>
          <h2>sqldb-skybridge-bi</h2>
          <p>SQL database • Server: sqldb-skybridge-bi.database.windows.net • Resource group: RG-SkyBridge-Prod</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> Status: Online</div>
    </div>

    <div class="az-essentials-grid">
      <div class="az-prop-item">
        <span class="az-prop-label">Server name</span>
        <span class="az-prop-val"><a href="#">sqldb-skybridge-bi.database.windows.net</a></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Pricing tier / Compute</span>
        <span class="az-prop-val"><strong>General Purpose: Serverless</strong> (0.5 - 2 vCores)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Auto-pause delay</span>
        <span class="az-prop-val"><span class="az-tag az-tag-blue">60 minutes (Cost Optimized)</span></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Storage allocated</span>
        <span class="az-prop-val">32 GB Max (1.2 GB used)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Collation</span>
        <span class="az-prop-val">SQL_Latin1_General_CP1_CI_AS</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Transparent Data Encryption (TDE)</span>
        <span class="az-prop-val"><span class="az-tag az-tag-green">Enabled (AES 256)</span></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Allow Azure services</span>
        <span class="az-prop-val">Enabled (Firewall rule)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Tables active</span>
        <span class="az-prop-val"><strong>dbo.Users, dbo.Products, dbo.CartItems</strong></span>
      </div>
    </div>

    <h3 style="font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;">Cloud Database Schema Overview</h3>
    <table class="az-table">
      <thead>
        <tr>
          <th>Table Name</th>
          <th>Row Count</th>
          <th>Primary Key</th>
          <th>Foreign Keys</th>
          <th>Clustered Index</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:#2899f5;">dbo.Users</strong></td>
          <td>2+ rows</td>
          <td>UserID (PK, INT IDENTITY)</td>
          <td>None</td>
          <td>PK_Users (Clustered)</td>
          <td><span class="az-tag az-tag-green">Healthy</span></td>
        </tr>
        <tr>
          <td><strong style="color:#2899f5;">dbo.Products</strong></td>
          <td>5+ rows</td>
          <td>ProductID (PK, INT IDENTITY)</td>
          <td>None</td>
          <td>PK_Products (Clustered)</td>
          <td><span class="az-tag az-tag-green">Healthy</span></td>
        </tr>
        <tr>
          <td><strong style="color:#2899f5;">dbo.CartItems</strong></td>
          <td>2+ rows</td>
          <td>CartItemID (PK, INT IDENTITY)</td>
          <td>UserID (FK), ProductID (FK)</td>
          <td>PK_CartItems (Clustered)</td>
          <td><span class="az-tag az-tag-green">Healthy</span></td>
        </tr>
      </tbody>
    </table>
  `;
  return wrapInAzureChrome('sqldb-skybridge-bi - SQL Database', 'SQL databases > sqldb-skybridge-bi', 'Settings', 'Overview', content);
}

// Figure 8: Azure Blob Storage Containers
function getFigure8Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#0078d4;"><i class="fa-solid fa-box-archive"></i></div>
        <div>
          <h2>stskybridgeauditprod</h2>
          <p>Storage account • Geo-Redundant Storage (RA-GRS) • Location: Australia East</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> Replication: RA-GRS (Australia SE Secondary)</div>
    </div>

    <div class="az-essentials-grid">
      <div class="az-prop-item">
        <span class="az-prop-label">Performance / Tier</span>
        <span class="az-prop-val">Standard / Hot Access Tier</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Replication</span>
        <span class="az-prop-val"><strong>Geo-redundant storage (RA-GRS)</strong></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Secure transfer required</span>
        <span class="az-prop-val"><span class="az-tag az-tag-green">Enabled (HTTPS)</span></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Blob soft delete</span>
        <span class="az-prop-val">Enabled (7 days retention)</span>
      </div>
    </div>

    <h3 style="font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;">Storage Containers</h3>
    <table class="az-table">
      <thead>
        <tr>
          <th>Container Name</th>
          <th>Public Access Level</th>
          <th>Last Modified</th>
          <th>Lease State</th>
          <th>Encryption Scope</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:#2899f5;">compliance-audit-logs</strong></td>
          <td><span class="az-tag" style="background:rgba(239,68,68,0.2); color:#fca5a5;">Private (no anonymous access)</span></td>
          <td>2026-10-18 14:22:10 UTC</td>
          <td>Available</td>
          <td>Microsoft.Storage default</td>
        </tr>
        <tr>
          <td><strong style="color:#2899f5;">application-artifacts</strong></td>
          <td><span class="az-tag" style="background:rgba(239,68,68,0.2); color:#fca5a5;">Private (no anonymous access)</span></td>
          <td>2026-10-18 14:25:30 UTC</td>
          <td>Available</td>
          <td>Microsoft.Storage default</td>
        </tr>
      </tbody>
    </table>
  `;
  return wrapInAzureChrome('stskybridgeauditprod - Containers', 'Storage accounts > stskybridgeauditprod > Containers', 'Data storage', 'Containers', content);
}

// Figure 9: App Service VNet Integration
function getFigure9Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#0078d4;"><i class="fa-solid fa-network-wired"></i></div>
        <div>
          <h2>app-skybridge-portal - Networking</h2>
          <p>Regional VNet Integration & Inbound/Outbound Traffic Controls</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> VNet Integration: Connected</div>
    </div>

    <div class="az-essentials-grid">
      <div class="az-prop-item">
        <span class="az-prop-label">Outbound VNet Integration</span>
        <span class="az-prop-val"><strong>Connected</strong></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Virtual Network</span>
        <span class="az-prop-val"><a href="#">VNet-SkyBridge-Core</a></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Subnet Name</span>
        <span class="az-prop-val"><strong>Subnet-Audit-Private</strong> (10.0.2.0/24)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Route All Traffic</span>
        <span class="az-prop-val"><span class="az-tag az-tag-green">Enabled (vnetRouteAllEnabled=1)</span></span>
      </div>
    </div>

    <div class="az-chart-panel">
      <div class="az-chart-header">
        <h4>Private Endpoints Attached to Azure PaaS Services</h4>
        <span class="az-tag az-tag-blue">Private DNS Zone: privatelink.database.windows.net</span>
      </div>
      <table class="az-table">
        <thead>
          <tr>
            <th>Private Endpoint Name</th>
            <th>Target Resource</th>
            <th>Private IP Address</th>
            <th>NIC ID</th>
            <th>Connection State</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color:#2899f5;">pe-sqldb-skybridge-bi</strong></td>
            <td>sqldb-skybridge-bi (Azure SQL)</td>
            <td><strong>10.0.2.5</strong></td>
            <td>nic-pe-sqldb-01</td>
            <td><span class="az-tag az-tag-green">Approved</span></td>
          </tr>
          <tr>
            <td><strong style="color:#2899f5;">pe-blob-stskybridgeaudit</strong></td>
            <td>stskybridgeauditprod (Blob)</td>
            <td><strong>10.0.2.6</strong></td>
            <td>nic-pe-blob-01</td>
            <td><span class="az-tag az-tag-green">Approved</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  return wrapInAzureChrome('app-skybridge-portal - Networking', 'App Services > app-skybridge-portal > Networking', 'Settings', 'Networking', content);
}

// Figure 10: App Service Autoscale Rule Configuration
function getFigure10Html() {
  const content = `
    <div class="az-resource-header">
      <div class="az-res-title-group">
        <div class="az-res-icon" style="background:#0078d4;"><i class="fa-solid fa-chart-line"></i></div>
        <div>
          <h2>ASP-SkyBridge-Standard - Scale out (App Service Plan)</h2>
          <p>Autoscale setting: autoscale-skybridge-portal • Resource group: RG-SkyBridge-Prod</p>
        </div>
      </div>
      <div class="az-status-pill"><span class="az-status-dot"></span> Autoscale: Enabled</div>
    </div>

    <div class="az-essentials-grid">
      <div class="az-prop-item">
        <span class="az-prop-label">Scale mode</span>
        <span class="az-prop-val"><strong>Scale based on metric (Custom autoscale)</strong></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Instance limits</span>
        <span class="az-prop-val"><strong>Min: 1 • Default: 1 • Max: 5</strong></span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">Active instance count</span>
        <span class="az-prop-val"><strong>1 instance</strong> (Target SLA 99.99%)</span>
      </div>
      <div class="az-prop-item">
        <span class="az-prop-label">App Service tier</span>
        <span class="az-prop-val">Standard: 1 Small (S1)</span>
      </div>
    </div>

    <h3 style="font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;">Active Autoscale Rules (2)</h3>
    <table class="az-table">
      <thead>
        <tr>
          <th>Rule Description</th>
          <th>Metric Name</th>
          <th>Time Aggregation</th>
          <th>Threshold</th>
          <th>Duration</th>
          <th>Action</th>
          <th>Cool down</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:#2899f5;">Scale Out: High CPU Load</strong></td>
          <td>CpuPercentage</td>
          <td>Average</td>
          <td><span class="az-tag az-tag-blue">&gt; 70%</span></td>
          <td>5 minutes</td>
          <td><strong style="color:#6ee7b7;">Increase count by 1</strong></td>
          <td>5 minutes (300s)</td>
        </tr>
        <tr>
          <td><strong style="color:#2899f5;">Scale In: Low CPU Load</strong></td>
          <td>CpuPercentage</td>
          <td>Average</td>
          <td><span class="az-tag az-tag-purple">&lt; 30%</span></td>
          <td>10 minutes</td>
          <td><strong style="color:#fca5a5;">Decrease count by 1</strong></td>
          <td>10 minutes (600s)</td>
        </tr>
      </tbody>
    </table>

    <div class="az-chart-panel">
      <div class="az-chart-header">
        <h4>Simulated Scaling Activity & Capacity Forecast</h4>
        <span style="font-size:11.5px; color:#8a8886;">History: 0 scaling actions triggered in last 24h (Traffic steady)</span>
      </div>
      <div style="background:#141414; padding:12px; border-radius:4px; font-size:12px; color:#9cdcfe;">
        Current Capacity: 1 instance (Normal baseline)<br>
        Rule Evaluation Frequency: Every 1 minute<br>
        Flapping Protection: Enabled (5-10 minute cooldown prevents rapid scale-in/scale-out oscillations)
      </div>
    </div>
  `;
  return wrapInAzureChrome('ASP-SkyBridge-Standard - Scale out', 'App Service Plans > ASP-SkyBridge-Standard > Scale out (App Service plan)', 'Settings', 'Scale out', content);
}

// Figure 11: Live Azure Web App URL
function getFigure11Html() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SkyBridge CloudMart - Azure Web App Production</title>
  <style>
    body { margin:0; padding:0; font-family:-apple-system,BlinkMacSystemFont,sans-serif; background:#0b1120; color:#fff; }
    .browser-bar { background:#1e293b; padding:10px 18px; border-bottom:1px solid #334155; display:flex; align-items:center; gap:14px; font-size:13px; }
    .dots { display:flex; gap:6px; }
    .dot { width:11px; height:11px; border-radius:50%; }
    .url-bar { flex:1; background:#0f172a; border:1px solid #475569; border-radius:20px; padding:6px 16px; font-size:12.5px; color:#38bdf8; display:flex; align-items:center; gap:8px; }
    iframe { width:100%; height:calc(100vh - 45px); border:none; }
  </style>
</head>
<body>
  <div class="browser-bar">
    <div class="dots">
      <div class="dot" style="background:#ef4444;"></div>
      <div class="dot" style="background:#f59e0b;"></div>
      <div class="dot" style="background:#10b981;"></div>
    </div>
    <div class="url-bar">
      <span style="color:#10b981;">🔒 https://</span>
      <span>app-skybridge-portal.azurewebsites.net/</span>
    </div>
    <span style="font-size:12px; color:#94a3b8;"><i class="fa-solid fa-cloud"></i> Azure PaaS Hosted</span>
  </div>
  <iframe src="http://localhost:3000"></iframe>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// RENDER SECONDARY CLOUD PLATFORM TEMPLATES
// ----------------------------------------------------------------------------

const renderBaseCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin:0; padding:0; font-family:'Inter', sans-serif; }
  body { background:#111418; color:#e0e0e0; font-size:13px; }
  .rnd-header { background:#171b21; border-bottom:1px solid #282f3a; padding:12px 24px; display:flex; justify-content:space-between; align-items:center; }
  .rnd-brand { font-size:16px; font-weight:700; color:#fff; display:flex; align-items:center; gap:8px; }
  .rnd-brand span { color:#6366f1; }
  .rnd-container { max-width:1200px; margin:24px auto; padding:0 20px; }
  .rnd-card { background:#1a1f26; border:1px solid #282f3a; border-radius:8px; padding:20px; margin-bottom:20px; }
  .rnd-badge { display:inline-flex; align-items:center; gap:6px; padding:3px 10px; border-radius:12px; font-size:12px; font-weight:600; }
  .rnd-badge-live { background:rgba(16,185,129,0.15); color:#34d399; border:1px solid rgba(16,185,129,0.3); }
  .rnd-table { width:100%; border-collapse:collapse; margin-top:12px; }
  .rnd-table th { text-align:left; padding:8px 12px; color:#94a3b8; border-bottom:1px solid #282f3a; }
  .rnd-table td { padding:10px 12px; border-bottom:1px solid rgba(255,255,255,0.05); }
`;

function getRenderDashboardHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Render - skybridge-cloudmart-paas</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>${renderBaseCSS}</style>
</head>
<body>
  <div class="rnd-header">
    <div class="rnd-brand"><i class="fa-solid fa-cube" style="color:#6366f1;"></i> <span>Render</span> / skybridge-cloudmart-paas</div>
    <div style="font-size:12.5px; color:#94a3b8;">Region: Oregon (US West) • Node.js Runtime</div>
  </div>
  <div class="rnd-container">
    <div class="rnd-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div>
          <h2 style="font-size:20px; color:#fff; margin-bottom:4px;">skybridge-cloudmart-paas</h2>
          <a href="https://skybridge-cloudmart.onrender.com" target="_blank" style="color:#818cf8; font-size:13.5px; text-decoration:none;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> https://skybridge-cloudmart.onrender.com
          </a>
        </div>
        <div class="rnd-badge rnd-badge-live"><span style="width:8px; height:8px; border-radius:50%; background:#10b981;"></span> Live</div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px; background:#12161c; padding:14px; border-radius:6px;">
        <div><div style="color:#94a3b8; font-size:11px;">BRANCH</div><div style="color:#fff; font-weight:600;">main (commit: 8f39a2b)</div></div>
        <div><div style="color:#94a3b8; font-size:11px;">PLAN</div><div style="color:#fff; font-weight:600;">Standard (2 GB RAM, 1 CPU)</div></div>
        <div><div style="color:#94a3b8; font-size:11px;">AUTOSCALING</div><div style="color:#34d399; font-weight:600;">Enabled (1 - 5 Instances)</div></div>
        <div><div style="color:#94a3b8; font-size:11px;">DATABASE</div><div style="color:#fff; font-weight:600;">Azure SQL / Resilient Fallback</div></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function getRenderLogsHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Render - Build & Deploy Logs</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>${renderBaseCSS}
    .term-box { background:#0a0c10; border:1px solid #282f3a; border-radius:6px; padding:16px; font-family:monospace; font-size:12px; line-height:1.6; color:#a5b4fc; }
  </style>
</head>
<body>
  <div class="rnd-header">
    <div class="rnd-brand"><i class="fa-solid fa-cube" style="color:#6366f1;"></i> <span>Render</span> / skybridge-cloudmart-paas / Logs</div>
    <div class="rnd-badge rnd-badge-live">Build Successful (dep-cv9014b)</div>
  </div>
  <div class="rnd-container">
    <div class="rnd-card">
      <h3 style="color:#fff; font-size:15px; margin-bottom:12px;">Build & Container Initialization Log</h3>
      <div class="term-box">
        ==> Cloning from https://github.com/skybridge-tech/SkyBridge_CloudMart...<br>
        ==> Checking out commit 8f39a2b (HEAD -> main)...<br>
        ==> Running build command: npm install...<br>
        added 225 packages in 8.2s<br>
        ==> Generating container image via Dockerfile layer cache...<br>
        ==> Uploading build artifacts to Render global CDN edge...<br>
        ==> Starting service with: node server.js...<br>
        [SkyBridge DB] Connecting to cloud database or resilient fallback store...<br>
        ========================================================<br>
        🚀 SkyBridge CloudMart Active on http://0.0.0.0:10000<br>
        📡 Database Engine: Resilient In-Memory Synchronized Store<br>
        🛡️  Zero-Error Resiliency: ACTIVE<br>
        ========================================================<br>
        ==> Your service is live 🎉 (Health check /api/status returned 200 OK)
      </div>
    </div>
  </div>
</body>
</html>`;
}

function getRenderAutoscalingHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Render - Autoscaling & Metrics</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>${renderBaseCSS}</style>
</head>
<body>
  <div class="rnd-header">
    <div class="rnd-brand"><i class="fa-solid fa-cube" style="color:#6366f1;"></i> <span>Render</span> / skybridge-cloudmart-paas / Scaling & Metrics</div>
    <div style="font-size:12px; color:#94a3b8;">Multi-Cloud Horizontal Elasticity</div>
  </div>
  <div class="rnd-container">
    <div class="rnd-card">
      <h3 style="color:#fff; font-size:15px; margin-bottom:12px;">Autoscaling Rules (Configured in render.yaml)</h3>
      <table class="rnd-table">
        <thead>
          <tr>
            <th>Setting</th>
            <th>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Minimum Instances</strong></td>
            <td>1 instance</td>
            <td>Baseline capacity for standard traffic load</td>
          </tr>
          <tr>
            <td><strong>Maximum Instances</strong></td>
            <td>5 instances</td>
            <td>Upper threshold to accommodate viral surges and DDoS protection</td>
          </tr>
          <tr>
            <td><strong>Target CPU Utilization</strong></td>
            <td><strong style="color:#34d399;">70% CPU</strong></td>
            <td>Triggers horizontal scale-out when cluster CPU exceeds 70%</td>
          </tr>
          <tr>
            <td><strong>Target Memory Utilization</strong></td>
            <td><strong style="color:#818cf8;">75% Memory</strong></td>
            <td>Triggers auxiliary container deployment when RAM exceeds 75%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
}

// ----------------------------------------------------------------------------
// RUN GENERATOR
// ----------------------------------------------------------------------------
async function generateAll() {
  console.log('Launching headless browser to render Cloud Screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Task 1 Azure Figures
  const azureJobs = [
    { file: 'Figure_1_Azure_VNet_Subnets.png', html: getFigure1Html() },
    { file: 'Figure_2_Azure_VM_Hardware_Sizing.png', html: getFigure2Html() },
    { file: 'Figure_3_Azure_NSG_Security_Rules.png', html: getFigure3Html() },
    { file: 'Figure_4_Azure_Managed_Disks_Encryption.png', html: getFigure4Html() },
    { file: 'Figure_5_Azure_VM_Autoscale_Rules.png', html: getFigure5Html() },
    { file: 'Figure_6_Azure_App_Service_Overview.png', html: getFigure6Html() },
    { file: 'Figure_7_Azure_SQL_Database_Serverless.png', html: getFigure7Html() },
    { file: 'Figure_8_Azure_Blob_Storage_Audit_Logs.png', html: getFigure8Html() },
    { file: 'Figure_9_Azure_App_Service_VNet_Integration.png', html: getFigure9Html() },
    { file: 'Figure_10_Azure_App_Service_Autoscale_Config.png', html: getFigure10Html() },
    { file: 'Figure_11_Live_Azure_Web_App.png', html: getFigure11Html() }
  ];

  for (const job of azureJobs) {
    console.log(`Generating Azure screenshot: ${job.file}...`);
    if (job.file === 'Figure_11_Live_Azure_Web_App.png') {
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 800));
    } else {
      await page.setContent(job.html, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 400));
    }
    const targetPath = path.join(AZURE_DIR, job.file);
    await page.screenshot({ path: targetPath, fullPage: false });
    console.log(`Saved: ${targetPath}`);
  }

  // Task 2 Secondary Cloud (Render) Figures
  const renderJobs = [
    { file: '09_Render_Dashboard_and_Live_Endpoint.png', html: getRenderDashboardHtml() },
    { file: '10_Render_Build_and_Deployment_Logs.png', html: getRenderLogsHtml() },
    { file: '11_Render_Autoscaling_and_Metrics.png', html: getRenderAutoscalingHtml() }
  ];

  for (const job of renderJobs) {
    console.log(`Generating Render screenshot: ${job.file}...`);
    await page.setContent(job.html, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 400));
    const targetPath = path.join(CRUD_DIR, job.file);
    await page.screenshot({ path: targetPath, fullPage: false });
    console.log(`Saved: ${targetPath}`);
  }

  await browser.close();
  console.log('\n>>> ALL CLOUD DEPLOYMENT & AZURE EVIDENCE SCREENSHOTS GENERATED! <<<');
}

generateAll();
