@echo off
echo ==========================================
echo  BUILD CASINO ERP - Application Desktop
echo ==========================================
echo.

echo [1/4] Build de l'application web...
cd ..
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Build web echoue
    pause
    exit /b 1
)

echo.
echo [2/4] Copie des fichiers dans Electron...
if not exist "electron-erp-app\resources" mkdir "electron-erp-app\resources"
xcopy /E /I /Y "dist" "electron-erp-app\resources\dist"
if %errorlevel% neq 0 (
    echo ERREUR: Copie echouee
    pause
    exit /b 1
)

echo.
echo [3/4] Installation des dependances Electron...
cd electron-erp-app
call npm install
if %errorlevel% neq 0 (
    echo ERREUR: Installation echouee
    pause
    exit /b 1
)

echo.
echo [4/4] Creation de l'installeur Windows...
call npm run build-win
if %errorlevel% neq 0 (
    echo ERREUR: Build echoue
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  BUILD TERMINE AVEC SUCCES !
echo ==========================================
echo.
echo L'installeur est disponible dans :
echo   electron-erp-app\dist\CasinoERP Setup 1.0.5.exe
echo.
echo PROCHAINES ETAPES :
echo 1. Copier cet installeur sur tes 3 PCs
echo 2. Installer sur chaque PC
echo 3. L'app demarrera directement avec l'ERP integre !
echo.
pause
