const {app, BrowserWindow, screen} = require('electron');
const { start_backend } = require('./express_server/server');

const url = require('url');
const path = require('path');

function onReady () {

  start_backend()

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;


  win = new BrowserWindow({width: width, height: height})
  win.loadURL(url.format({
    pathname: path.join(
      __dirname,
      'dist/Supply_Chain/index.html'),
    protocol: 'file:',
    slashes: true
  }))
}

app.on('ready', onReady);
