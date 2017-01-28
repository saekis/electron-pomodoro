'use strict';

const { BrowserWindow } = require('electron')
const path = require('path')

module.exports = class Window {
  constructor(tray) {
    this.tray = tray
    this.window = null
    this.toggle = this.toggle.bind(this)
  }

  create() {
    const htmlPath = `file://${path.join(__dirname, '../index.html')}`
    this.window = new BrowserWindow({
      width: 300,
      height: 450,
      show: false,
      frame: false,
      fullscreenable: false,
      resizable: false,
      transparent: true,
      webPreferences: {
        backgroundThrottling: false
      }
    })
    this.window.loadURL(htmlPath)
    this.window.openDevTools({mode: 'undocked'})

    // Hide the window when it loses focus
    this.window.on('blur', () => {
      if (!this.window.webContents.isDevToolsOpened()) {
        this.toggle()
      }
    })
  }

  toggle() {
    if (this.window.isVisible()) {
      this.window.hide()
      this.tray.setHighlightMode('never')
    } else {
      this.show()
      this.tray.setHighlightMode('always')
    }
  }

  show() {
    const position = this.position()
    this.window.setPosition(position.x, position.y, false)
    this.window.show()
    this.window.focus()
  }

  position() {
    const windowBounds = this.window.getBounds()
    const trayBounds = this.tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return {x, y}
  }

  sendToOtherProcess(key, val) {
    this.window.webContents.send(key, val);
  }
}
