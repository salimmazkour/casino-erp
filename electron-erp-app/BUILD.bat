@echo off
echo ==========================================
echo  BUILD CASINO ERP - Application Desktop
echo ==========================================
echo.

echo [1/3] Installation des dependances Electron...
call npm install
if %errorlevel% neq 0 (
    echo ERREUR: Installation echouee
    pause
    exit /b 1
)

echo.
echo [2/3] Creation de l'installeur Windows...
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
echo   dist\CasinoERP Setup 1.0.0.exe
echo.
echo PROCHAINES ETAPES :
echo 1. Copier cet installeur sur tes 3 PCs
echo 2. Installer sur chaque PC
echo 3. L'app telechargera automatiquement l'ERP depuis ce projet
echo.
pause
