$ErrorActionPreference = 'Stop'

# Only 64-bit Windows is supported for the pre-compiled binary
$is64Bit = [System.Environment]::Is64BitOperatingSystem
if (!$is64Bit) {
    Write-Error "dsmt only supports 64-bit Windows environments."
    exit 1
}

# Detect OS Architecture
$osArch = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture
if ($osArch -eq 'Arm64') {
    $binaryName = "dsmt-windows-arm64.exe"
} elseif ($osArch -eq 'X64') {
    $binaryName = "dsmt-windows-x64.exe"
} else {
    Write-Error "dsmt only supports x64 and ARM64 Windows environments (detected: $osArch)."
    exit 1
}

$downloadUrl = "https://github.com/itskdhere/dsmt/releases/latest/download/$binaryName"
$installDir = Join-Path $HOME ".dsmt\bin"
$targetPath = Join-Path $installDir "dsmt.exe"

# Create install directory if it doesn't exist
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Force -Path $installDir | Out-Null
}

Write-Host "Downloading dsmt.exe from latest release..."
# Ensure TLS 1.2 is enabled for secure download
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $downloadUrl -OutFile $targetPath -UseBasicParsing

Write-Host "Adding dsmt to user PATH..."
# Retrieve user-level Environment PATH variable
$userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$cleanPath = if ($userPath) { $userPath.TrimEnd(';') } else { "" }

# Add directory to environment path if not already present
if ($cleanPath -split ';' -notcontains $installDir) {
    if ($cleanPath) {
        $newPath = "$cleanPath;$installDir"
    } else {
        $newPath = $installDir
    }
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    
    # Update current session PATH env variable
    $env:Path = "$env:Path;$installDir"
    Write-Host "Added $installDir to User PATH."
} else {
    Write-Host "$installDir is already in User PATH."
}

Write-Host ""
Write-Host "Successfully installed dsmt!" -ForegroundColor Green
Write-Host "You may need to restart your terminal session to use the 'dsmt' command." -ForegroundColor Yellow
