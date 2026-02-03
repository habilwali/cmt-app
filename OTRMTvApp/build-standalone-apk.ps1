# Build Standalone APK Script (Debug or Release)
# This script creates an APK that doesn't require Metro bundler

param(
    [string]$BuildType = "debug"  # "debug" or "release"
)

Write-Host "Building Standalone $BuildType APK..." -ForegroundColor Green

# Step 1: Create assets directory if it doesn't exist
Write-Host "`nStep 1: Creating assets directory..." -ForegroundColor Yellow
if (-not (Test-Path android\app\src\main\assets)) {
    New-Item -ItemType Directory -Path android\app\src\main\assets -Force | Out-Null
    Write-Host "Assets directory created" -ForegroundColor Green
} else {
    Write-Host "Assets directory already exists" -ForegroundColor Green
}

# Step 2: Remove old bundle if exists
Write-Host "`nStep 2: Cleaning old bundle..." -ForegroundColor Yellow
if (Test-Path android\app\src\main\assets\index.android.bundle) {
    Remove-Item android\app\src\main\assets\index.android.bundle -Force
    Write-Host "Old bundle removed" -ForegroundColor Green
}

# Step 3: Create JavaScript bundle
Write-Host "`nStep 3: Creating JavaScript bundle..." -ForegroundColor Yellow
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to create bundle" -ForegroundColor Red
    exit 1
}
Write-Host "Bundle created successfully" -ForegroundColor Green

# Step 4: Clean Android build
Write-Host "`nStep 4: Cleaning Android build..." -ForegroundColor Yellow
cd android
.\gradlew clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to clean build" -ForegroundColor Red
    cd ..
    exit 1
}
cd ..
Write-Host "Build cleaned successfully" -ForegroundColor Green

# Step 5: Build APK (Debug or Release)
Write-Host "`nStep 5: Building $BuildType APK..." -ForegroundColor Yellow
cd android
if ($BuildType -eq "release") {
    .\gradlew assembleRelease
} else {
    .\gradlew assembleDebug
}
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to build APK" -ForegroundColor Red
    cd ..
    exit 1
}
cd ..
Write-Host "APK built successfully!" -ForegroundColor Green

# Step 6: Show APK location
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "APK Location:" -ForegroundColor Cyan
if ($BuildType -eq "release") {
    Write-Host "android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor White
    Write-Host "`nInstall with: adb install -r android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Yellow
} else {
    Write-Host "android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
    Write-Host "`nInstall with: adb install -r android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nBuild completed successfully!" -ForegroundColor Green
