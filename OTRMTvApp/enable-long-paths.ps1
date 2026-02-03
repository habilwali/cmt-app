# PowerShell script to enable Windows Long Path Support
# Run this script as Administrator

$registryPath = "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem"
$propertyName = "LongPathsEnabled"
$propertyValue = 1

try {
    # Check if running as Administrator
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    
    if (-not $isAdmin) {
        Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
        Write-Host "Right-click PowerShell and select 'Run as Administrator', then run this script again." -ForegroundColor Yellow
        exit 1
    }
    
    # Check if the property already exists
    $existingValue = Get-ItemProperty -Path $registryPath -Name $propertyName -ErrorAction SilentlyContinue
    
    if ($existingValue -and $existingValue.LongPathsEnabled -eq 1) {
        Write-Host "Long Path Support is already enabled!" -ForegroundColor Green
    } else {
        # Set the registry value
        New-ItemProperty -Path $registryPath -Name $propertyName -Value $propertyValue -PropertyType DWORD -Force | Out-Null
        Write-Host "Long Path Support has been enabled successfully!" -ForegroundColor Green
        Write-Host "You need to restart your computer for the changes to take effect." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
