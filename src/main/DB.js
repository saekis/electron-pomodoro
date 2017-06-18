'use strict';

import Datastore from "nedb"

module.exports = class DB {
  constructor() {
    let db = new Datastore({ filename: "db/ne.db", autoload: true });
    db.insert({ foo: "foo", poyo: "poyo" }); // 適当なオブジェクトを保存
    db.findOne({ foo: "foo" }, (err, document) => {
        console.log(document); // 保存したオブジェクトが取り出せる
    });
  }
}
