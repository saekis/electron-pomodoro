'use strict';

import Datastore from "nedb"
import Datetime from "../utils/Datetime"

module.exports = class DB {
  constructor() {
    this.db = new Datastore({ filename: "db/ne.db", autoload: true })
  }

  getCountInToday(callback) {
    const datetime = new Datetime()
    const dateYmd = datetime.getYmd()
    let count = 0;
    this.db.findOne({date: dateYmd}, callback)
  }

  find(callback) {
    this.db.find().sort({ date: -1 }).exec(callback)
  }


  updateCount(new_count) {
    const datetime = new Datetime()
    const dateYmd = datetime.getYmd()
    this.db.findOne({date: dateYmd}, (err, data) => {
      if (data) {
        this.db.remove ({_id: data._id}, {});
      }
      this.db.insert({pomodoro_count: new_count, date: dateYmd}, () => {
      })
    })
  }

  resetTodayCount() {
    this.updateCount(0)
  }
}
