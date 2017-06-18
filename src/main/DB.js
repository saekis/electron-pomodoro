'use strict';

import Datastore from "nedb"
import Datetime from "../utils/Datetime"

module.exports = class DB {
  constructor() {
    this.db = new Datastore({ filename: "db/ne.db", autoload: true })
  }

  updateCount(new_count) {
    const datetime = new Datetime()
    const dateYm = datetime.getYm()
    this.db.findOne({date: dateYm}, (err, data) => {
      if (data) {
        this.db.remove ({_id: data._id}, {});
      }
      this.db.insert({pomodoro_count: new_count, date: dateYm}, () => {
      })
    })
  }
}
