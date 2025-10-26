const { app, BrowserWindow, ipcMain, Menu, Tray, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Store = require('electron-store');
const extract = require('extract-zip');

const store = new Store();
let mainWindow;
let tray;
let updateWindow;

const APP_DIR = path.join(app.getPath('userData'), 'app');
const UPDATE_URL = process.env.UPDATE_URL || 'https://salimmazkour.github.io/casino-erp';
const VERSION_CHECK_URL = `${UPDATE_URL}/dist/version.json`;

// Configuration de l'auto-updater pour GitHub
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

autoUpdater.on('update-available', (info) => {
  console.log('Mise à jour disponible:', info.version);
  if (mainWindow) {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Mise à jour disponible',
      message: `Une nouvelle version (${info.version}) est disponible !`,
      buttons: ['Télécharger', 'Plus tard']
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  }
});

autoUpdater.on('update-not-available', () => {
  console.log('Application à jour');
});

autoUpdater.on('download-progress', (progress) => {
  const percent = Math.round(progress.percent);
  console.log(`Téléchargement: ${percent}%`);
  sendUpdateStatus(`Téléchargement... ${percent}%`, percent);
});

autoUpdater.on('update-downloaded', () => {
  console.log('Mise à jour téléchargée');
  if (mainWindow) {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Mise à jour prête',
      message: 'La mise à jour sera installée au prochain redémarrage.',
      buttons: ['Redémarrer maintenant', 'Plus tard']
    }).then(result => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  }
});

autoUpdater.on('error', (error) => {
  console.error('Erreur auto-update:', error);
});

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'resources/icon.png'),
    show: false
  });

  const indexPath = path.join(APP_DIR, 'dist', 'index.html');

  if (fs.existsSync(indexPath)) {
    mainWindow.loadFile(indexPath);
  } else {
    mainWindow.loadURL(`${UPDATE_URL}/index.html`);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-fail-load', () => {
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    }
  });
}

function createUpdateWindow() {
  updateWindow = new BrowserWindow({
    width: 500,
    height: 300,
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  updateWindow.loadFile(path.join(__dirname, 'update.html'));
}

function createTray() {
  const iconPath = path.join(__dirname, 'resources/icon.png');

  if (fs.existsSync(iconPath)) {
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Ouvrir ERP Casino',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          } else {
            createMainWindow();
          }
        }
      },
      {
        label: 'Vérifier les mises à jour',
        click: () => {
          autoUpdater.checkForUpdates();
          checkForUpdates(true);
        }
      },
      { type: 'separator' },
      {
        label: 'Quitter',
        click: () => {
          app.isQuitting = true;
          app.quit();
        }
      }
    ]);

    tray.setToolTip('Casino ERP');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  }
}

async function checkForUpdates(manual = false) {
  try {
    console.log('Vérification des mises à jour...');
    sendUpdateStatus('Vérification des mises à jour...', 10);

    const response = await axios.get(VERSION_CHECK_URL, {
      timeout: 10000,
      headers: { 'Cache-Control': 'no-cache' }
    });

    const remoteVersion = response.data.version;
    const localVersion = store.get('appVersion', '0.0.0');

    console.log(`Version locale: ${localVersion}, Version distante: ${remoteVersion}`);

    if (remoteVersion !== localVersion || manual) {
      sendUpdateStatus('Nouvelle version disponible !', 20);
      console.log('Téléchargement de la nouvelle version...');

      const success = await downloadAndExtractApp();

      if (success) {
        store.set('appVersion', remoteVersion);
        store.set('lastUpdate', new Date().toISOString());
        sendUpdateStatus('Mise à jour terminée !', 100);

        if (manual && mainWindow) {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Mise à jour',
            message: 'L\'application a été mise à jour avec succès !',
            buttons: ['Redémarrer maintenant', 'Plus tard']
          }).then(result => {
            if (result.response === 0) {
              app.relaunch();
              app.quit();
            }
          });
        }

        return true;
      } else {
        throw new Error('Échec du téléchargement');
      }
    } else {
      console.log('Application déjà à jour');
      sendUpdateStatus('Application à jour', 100);

      if (manual && mainWindow) {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Mise à jour',
          message: 'Vous utilisez déjà la dernière version !',
          buttons: ['OK']
        });
      }

      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la vérification:', error.message);
    sendUpdateStatus(`Erreur: ${error.message}`, 0);

    if (manual && mainWindow) {
      dialog.showMessageBox(mainWindow, {
        type: 'error',
        title: 'Erreur',
        message: `Impossible de vérifier les mises à jour:\n${error.message}`,
        buttons: ['OK']
      });
    }

    return false;
  }
}

async function downloadAndExtractApp() {
  try {
    sendUpdateStatus('Téléchargement de l\'application...', 30);

    const distUrl = `${UPDATE_URL}/dist.zip`;
    console.log(`Téléchargement depuis: ${distUrl}`);

    const response = await axios.get(distUrl, {
      responseType: 'arraybuffer',
      timeout: 60000,
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 50) / progressEvent.total) + 30;
          sendUpdateStatus(`Téléchargement... ${percent}%`, percent);
        }
      }
    });

    if (!fs.existsSync(APP_DIR)) {
      fs.mkdirSync(APP_DIR, { recursive: true });
    }

    const zipPath = path.join(APP_DIR, 'app.zip');
    fs.writeFileSync(zipPath, Buffer.from(response.data));

    sendUpdateStatus('Extraction des fichiers...', 80);

    if (fs.existsSync(path.join(APP_DIR, 'dist'))) {
      fs.rmSync(path.join(APP_DIR, 'dist'), { recursive: true, force: true });
    }

    await extract(zipPath, { dir: APP_DIR });

    fs.unlinkSync(zipPath);

    sendUpdateStatus('Installation terminée !', 100);
    console.log('Mise à jour terminée avec succès');

    return true;
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error.message);
    sendUpdateStatus(`Erreur: ${error.message}`, 0);
    return false;
  }
}

function sendUpdateStatus(message, progress) {
  if (updateWindow) {
    updateWindow.webContents.send('update-status', { message, progress });
  }
  console.log(`[${progress}%] ${message}`);
}

ipcMain.on('check-updates', () => checkForUpdates(true));

app.whenReady().then(async () => {
  createTray();

  app.setLoginItemSettings({
    openAtLogin: store.get('autoStart', true),
    openAsHidden: false
  });

  createUpdateWindow();

  const hasUpdate = await checkForUpdates(false);

  setTimeout(() => {
    if (updateWindow) {
      updateWindow.close();
      updateWindow = null;
    }
    createMainWindow();

    // Vérifier les mises à jour GitHub après le démarrage
    setTimeout(() => {
      autoUpdater.checkForUpdates();
    }, 3000);
  }, hasUpdate ? 2000 : 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !app.isQuitting) {
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on('before-quit', () => {
  app.isQuitting = true;
});
