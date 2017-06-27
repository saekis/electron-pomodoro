'use strict';

import { BrowserWindow } from 'electron'
import path from 'path'
import { ROOT_PATH } from '../constants'

module.exports = class Window {
  constructor(tray) {
    this.tray = tray
    this.window = null
    this.toggle = this.toggle.bind(this)
  }

  create() {
    const htmlPath = `file:///${__dirname}/build/renderer/index.html`
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
      // this.toggle()
    })
  }

  toggle() {
    if (this.window.isVisible()) {
      this.window.hide()
    } else {
      this.show()
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
    const y = Math.round(trayBounds.y + trayBounds.height)

    return {x, y}
  }

  setTime(time) {
    this.sendToOtherProcess('time', time)
  }

  sendToOtherProcess(key, val) {
    this.window.webContents.send(key, val);
  }
}
