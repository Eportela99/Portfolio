===============================================================
  WinToolkit v2.0 - System Administration Toolkit
  Created By Enrique_P.F
===============================================================

OVERVIEW
--------
WinToolkit v2.0 is a Windows system administration toolkit built
with PowerShell and WinForms. It provides 20 modules covering
hardware diagnostics, network tools, user management, system
repair, security baselines, fleet management, compliance
monitoring, and more — all in a single unified interface.

The app requires Administrator privileges and supports Windows
10/11 with PowerShell 5.1 or later. It features a fully
dark-themed UI with DPI awareness for high-resolution displays.


REQUIREMENTS
------------
- Windows 10 / 11
- PowerShell 5.1 or later
- Administrator privileges (auto-elevates on launch)
- For the EXE version: the "modules" folder must be in the
  same directory as WinToolkit.exe


HOW TO RUN
----------
Option 1: Run Main.ps1 directly
  Right-click Main.ps1 > "Run with PowerShell"
  (or run from an admin PowerShell prompt)

Option 2: Compile to EXE
  Run Build-Exe.ps1 on Windows to compile into WinToolkit.exe
  Requires the ps2exe PowerShell module (auto-installed)

Option 3: Portable version
  Run Build-Portable.ps1 to compile WinToolkit_v1.0_Portable.ps1
  into a standalone WinToolkit_Portable.exe (no modules folder needed)


PASSWORD PROTECTION
-------------------
You can set an app password from the Home Screen (bottom-left).
Once set, the password is required every time the app opens.
Passwords are stored as SHA256 hashes in:
  %APPDATA%\WinToolkit_v2\settings.json


===============================================================
  MODULES
===============================================================

1. DETAILS VIEW
   Hardware and software inventory for the local machine.
   - CPU: name, cores, threads, speed, cache
   - GPU: name, VRAM, driver version
   - RAM: total, speed, slots, form factor
   - Storage: drives, capacity, free space, health
   - Motherboard: manufacturer, model, BIOS version
   - Operating System: version, build, install date, uptime
   - Network adapters: IP, MAC, speed, status
   - Display output as formatted text with export option

2. NETWORK TOOLS
   Network diagnostics and remote management.
   - IP Scanner: scan subnet ranges, detect active hosts
   - Port Scanner: scan common or custom ports on a target
   - Ping: continuous or count-based ping with statistics
   - Traceroute: trace network path to a destination
   - DNS Lookup: resolve hostnames and IP addresses
   - Wake-on-LAN: send magic packets to wake remote PCs
   - Remote Desktop: launch RDP sessions to remote machines
   - Network adapter info and configuration

3. PRINTER TOOLS
   Printer management and troubleshooting.
   - List all installed printers with status
   - View and manage print queues
   - Add/remove printers
   - Manage printer drivers and ports
   - Restart print spooler service
   - Set default printer
   - Test page printing

4. RUNNING APPS (PROCESS MANAGER)
   Real-time process monitoring and management.
   - List all running processes with CPU/memory usage
   - End task (kill process) with confirmation
   - Set process priority (real-time, high, normal, etc.)
   - Open file location of any process
   - Search and filter processes by name
   - Refresh with auto-update capability

5. STARTUP PROGRAMS
   Manage applications that run at Windows startup.
   - List startup entries from Registry and shell folders
   - Enable/disable startup items
   - View startup entry details (command, location)
   - Add new startup entries
   - Remove startup entries
   - Registry paths: HKLM and HKCU Run/RunOnce keys

6. SERVICES
   Windows services management.
   - List all services with status (running/stopped/disabled)
   - Start, stop, restart, pause services
   - Change startup type (automatic, manual, disabled)
   - Search and filter services by name or status
   - View service details (path, description, dependencies)
   - Color-coded status indicators

7. EVENT VIEWER
   Windows event log browser and analyzer.
   - Browse System, Application, and Security logs
   - Filter by date range (last hour, today, last 7 days, etc.)
   - Filter by level (Critical, Error, Warning, Information)
   - Search events by keyword
   - View full event details and messages
   - Export filtered results to CSV

8. CREDENTIAL MANAGER
   Windows Credential Manager interface.
   - List all stored credentials (domain and generic)
   - Add new credentials (target, username, password)
   - Remove stored credentials
   - View credential details
   - Supports Windows (domain) and Generic credential types

9. USER MANAGEMENT
   Local user and group administration.
   - List all local user accounts with status
   - Create new local users
   - Delete user accounts
   - Change user passwords
   - Enable/disable user accounts
   - Manage group memberships (Administrators, Users, etc.)
   - Configure auto-logon settings

10. SHARED FOLDERS
    SMB file sharing management.
    - List all network shares with paths and permissions
    - Create new shares with custom permissions
    - Remove existing shares
    - View active sessions connected to shares
    - Manage share permissions (read, change, full control)
    - View open files on shares

11. TASK SCHEDULER
    Windows Task Scheduler management.
    - List scheduled tasks with status and triggers
    - Create new scheduled tasks
    - Enable/disable tasks
    - Delete tasks
    - Run tasks on demand
    - Export task configurations
    - View task history and last run results

12. PC REPAIR & DIAGNOSTICS
    System repair and maintenance tools with live output.
    - DISM: Check Health, Scan Health, Restore Health,
      Component Cleanup, Analyze Component Store
    - SFC: Scan Now, Verify Only (with CBS.log parsing)
    - Disk: Check Disk, Drive Health, Defrag Analysis, Disk Info
    - Battery: Battery Report, Energy Report, Sleep Study,
      Power Plans
    - Network Reset: Flush DNS, Reset Winsock, Reset TCP/IP,
      Release/Renew IP
    - System: System Info, Clear Temp Files, Reset Windows
      Update, Repair WMI Repository
    - All commands show live output with elapsed time
    - Stop button to cancel running commands
    - Export log to file
    (See pc_repair_commands.txt for full command details)

13. INSTALLED SOFTWARE
    Software inventory and uninstall manager.
    - List all installed programs from Registry
      (HKLM, WOW6432Node, HKCU Uninstall paths)
    - Shows name, version, publisher, install date, size
    - Normal uninstall via program's uninstaller
    - Deep Clean: scans for leftover registry entries and
      folders after uninstall (HKLM/HKCU SOFTWARE keys,
      Run keys, ProgramFiles, AppData, ProgramData, Temp)
    - Select which leftovers to delete with checkbox list
    - Export software list to CSV

14. WINDOWS UPDATE
    Windows Update management and history.
    - Tab 1 - Installed Updates: list hotfixes, search,
      uninstall updates via wusa.exe, export to CSV
    - Tab 2 - Update History: full history via COM object
      (Microsoft.Update.Session), color-coded results
    - Tab 3 - Actions & Settings:
      * Check for Updates (opens Windows Update)
      * Open Windows Update settings
      * Pause updates for 7 days (registry-based)
      * Resume updates
      * View Windows Update log
      * Reset Windows Update components
      * Delivery Optimization settings
    - Status bar showing pause state and service status

15. NETWORK TRANSFER
    File and folder transfer to remote computers via SMB.
    - Target Computers: add manually or auto-detect from
      stored credentials (cmdkey /list)
    - Test connectivity to individual or all targets
    - File Mappings: add files (multi-select) or entire folders
    - Editable destination path per file/folder
    - Authentication: tries no-auth first, then stored
      credentials, then prompts for username/password
    - Transfer engine: Copy-Item for files, robocopy for
      folders (with Copy-Item fallback)
    - Destination resolution: tries specified share path,
      falls back to C$\Transferred Files
    - Color-coded live transfer log with progress bar
    - Export transfer log

16. WINDOWS SHORTCUTS
    Quick access launcher for common Windows tools.
    - 28 built-in system shortcuts organized in a grid:
      Device Manager, Disk Management, Task Manager,
      Control Panel, Computer Management, Event Viewer,
      Disk Cleanup, Resource Monitor, Performance Monitor,
      System Configuration, System Info, DirectX Diag,
      PowerShell (Admin), Command Prompt (Admin),
      Startup Folder, Temp Folders, Devices & Printers,
      Network Center, Services, Windows Features,
      System Properties, Firewall Settings,
      Programs & Features, Registry Editor, Group Policy,
      Remote Desktop, Windows Update, Installed Apps
    - Custom Shortcuts: add your own shortcuts to files,
      folders, or programs with a friendly name
    - Custom shortcuts persist across sessions via settings

17. HEALTH SNAPSHOT
    Local machine health assessment and reporting.
    - Collects comprehensive system health data:
      OS version, uptime, disk usage, top CPU/memory processes,
      critical/error events (last 24h), stale auto-start services,
      Defender status, last update info, network adapters
    - Results displayed in a DataGridView with color-coded status
      (OK, Warning, Critical, Info)
    - Summary panel with full text report
    - Export snapshot to HTML or JSON
    - Data collection scriptblock reusable by Fleet Manager

18. SECURITY BASELINE
    7-point security baseline scanner and enforcement.
    - Checks: SMBv1 disabled, Firewall enabled (all profiles),
      Defender Real-Time Protection, Password Policy (min length
      8, max age 90 days), Audit Logon, Guest account disabled,
      UAC enabled
    - Scan Only mode to assess current state
    - Apply Full Baseline or Apply Selected checks
    - Rollback snapshot system: auto-saves previous values before
      changes, allowing full restoration
    - Manage snapshots: restore, delete, export
    - Per-check PASS/FAIL status with color coding

19. FLEET MANAGER
    Remote multi-computer management via WinRM/Invoke-Command.
    - Computer inventory: add manually, import from CSV, or
      auto-detect from Active Directory
    - Test connectivity to all or selected computers
    - Execute actions remotely with configurable throttle limit:
      * Health Snapshot (full system health scan)
      * Security Baseline Scan (7-point security check)
      * Installed Software (registry-based app inventory)
      * Update Status (hotfix history and last update date)
    - Credential management for remote authentication
    - Progress bar with live execution status
    - Results grid with per-computer success/failure tracking
    - Export results to CSV or HTML report

20. COMPLIANCE DASHBOARD
    Fleet-wide compliance monitoring and reporting.
    - Aggregates Fleet Manager results into compliance view
    - Summary cards: Total Machines, Fully Compliant, Baseline
      Issues, Firewall Issues, Defender Issues, Disk Critical
    - Per-machine compliance grid with PASS/FAIL per category:
      Baseline, WinBuild, Firewall, Defender, DiskSpace, Updates
    - Overall status: Compliant, Partial, or Non-Compliant
    - Auto-refreshes when navigating to the dashboard
    - Export compliance report to HTML or CSV


===============================================================
  PROJECT STRUCTURE
===============================================================

WinToolkit_v2.0/
  Main.ps1                  - Entry point, form setup, wiring
  Build-Exe.ps1             - Compile Main.ps1 to EXE
  Build-Portable.ps1        - Compile portable version to EXE
  Icon.png                  - Original icon (1024x1024)
  Icon.ico                  - Windows icon (multi-size)
  README.txt                - This file
  pc_repair_commands.txt    - PC Repair command reference
  WinToolkit_v1.0_Portable.ps1 - Standalone portable version
  modules/
    SplashScreen.ps1        - Animated splash screen
    HomeScreen.ps1          - Home screen with module grid
    Logging.ps1             - Centralized logging utility
    DetailsView.ps1         - Hardware/software inventory
    NetworkTools.ps1        - Network diagnostics
    PrinterTools.ps1        - Printer management
    RunningApps.ps1         - Process manager
    StartupPrograms.ps1     - Startup programs manager
    Services.ps1            - Windows services manager
    EventViewer.ps1         - Event log browser
    CredentialManager.ps1   - Credential manager
    UserManagement.ps1      - Local user/group admin
    SharedFolders.ps1       - SMB share management
    TaskScheduler.ps1       - Task scheduler manager
    PCRepair.ps1            - System repair tools
    InstalledSoftware.ps1   - Software uninstall manager
    WindowsUpdate.ps1       - Windows Update manager
    NetworkTransfer.ps1     - File transfer to remote PCs
    WindowsShortcuts.ps1    - Quick access shortcuts
    HealthSnapshot.ps1      - System health assessment
    SecurityBaseline.ps1    - Security baseline scanner
    FleetManager.ps1        - Remote fleet management
    ComplianceDashboard.ps1 - Fleet compliance monitoring


===============================================================
  Created By Enrique_P.F | Version 2.0 | Modular Architecture
===============================================================
