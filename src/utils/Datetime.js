'use strict';

module.exports = class Datetime {
  constructor(obj = {}) {
    let now = new Date()
    this.date = now
  }

  getYmd() {
    const year = this.year(this.date)
    const month = this.month(this.date)
    const day = this.day(this.date)
    return `${year}-${month}-${day}`
  }

  month(date) {
    return this.toDigit(parseInt(date.getMonth()) + 1)
  }

  year(date) {
    return parseInt(date.getFullYear())
  }

  day(date) {
    return this.toDigit(parseInt(date.getDate()))
  }

  toDigit(number) {
    return ('00' + number).slice(-2);
  }
}
