#!/usr/bin/env pwsh
# SamaLang Installer for Windows (PowerShell)
# Usage: irm https://raw.githubusercontent.com/Samawa-Language/samawa-language/main/install.ps1 | iex

$ErrorActionPreference = 'Stop'

$Repo      = "Samawa-Language/samawa-language"
$BinName   = "sl.exe"
$InstallDir = Join-Path $env:USERPROFILE ".samalang"

function Write-Step   { param([string]$Msg) Write-Host "▸ $Msg" -ForegroundColor Cyan }
function Write-Ok     { param([string]$Msg) Write-Host "✓ $Msg" -ForegroundColor Green }
function Write-Fail   { param([string]$Msg) Write-Host "✗ $Msg" -ForegroundColor Red; exit 1 }

function Get-LatestVersion {
    $resp = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest" -UseBasicParsing
    return $resp.tag_name -replace '^v',''
}

function Get-Platform {
    $arch = if ([Environment]::Is64BitOperatingSystem) {
        if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' }
    } else {
        Write-Fail "32-bit Windows is not supported."
    }
    return "sl-win32-${arch}.exe"
}

function Add-ToPath {
    $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
    if ($currentPath -notlike "*$InstallDir*") {
        [Environment]::SetEnvironmentVariable('Path', "$currentPath;$InstallDir", 'User')
        $env:Path = "$env:Path;$InstallDir"
        Write-Ok "Added $InstallDir to user PATH"
    }
}

function Install-SamaLang {
    $version = Get-LatestVersion
    $target  = Get-Platform
    $url     = "https://github.com/$Repo/releases/download/v$version/$target"

    Write-Step "Detected platform: $target"

    if (-not (Test-Path $InstallDir)) {
        New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
    }

    $dest = Join-Path $InstallDir $BinName

    Write-Step "Downloading v$version..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
    } catch {
        Write-Fail "Download failed. Check if v$version exists for your platform."
    }

    Add-ToPath
    Write-Ok "Installed sl v$version to $dest"
    Write-Host ""
    Write-Step "Run 'sl --help' to get started"
}

function Uninstall-SamaLang {
    $dest = Join-Path $InstallDir $BinName
    if (Test-Path $dest) {
        Remove-Item $dest -Force
        Write-Ok "Removed $dest"
        $currentPath = [Environment]::GetEnvironmentVariable('Path', 'User')
        $newPath = ($currentPath -split ';' | Where-Object { $_ -ne $InstallDir }) -join ';'
        [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
        Write-Ok "Removed $InstallDir from user PATH"
    } else {
        Write-Fail "sl is not installed."
    }
}

# Main
$action = if ($args.Count -gt 0) { $args[0] } else { "install" }

switch ($action) {
    "install"   { Install-SamaLang }
    "uninstall" { Uninstall-SamaLang }
    "version"   {
        $dest = Join-Path $InstallDir $BinName
        if (Test-Path $dest) {
            & $dest --version
        } else {
            Write-Host "Not installed"
        }
    }
    default {
        Write-Host "SamaLang Compiler — Windows Installer"
        Write-Host ""
        Write-Host "Usage:"
        Write-Host "  irm https://raw.githubusercontent.com/$Repo/main/install.ps1 | iex"
        Write-Host ""
        Write-Host "Options:"
        Write-Host "  (no args)    Install latest version"
        Write-Host "  uninstall    Remove sl"
        Write-Host "  version      Show installed version"
    }
}
