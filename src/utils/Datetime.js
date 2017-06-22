'use strict';

module.exports = class Datetime {
  constructor(obj = {}) {
    let now = new Date()
    this.date = now
  }

  getYmd() {
    const year = this.year()
    const month = this.toDigit(this.month())
    const day = this.toDigit(this.day())
    return `${year}-${month}-${day}`
  }

  month() {
    return parseInt(this.date.getMonth()) + 1
  }

  year() {
    return parseInt(this.date.getFullYear())
  }

  day() {
    return parseInt(this.date.getDate())
  }

  toDigit(number) {
    return ('00' + number).slice(-2)
  }
}
