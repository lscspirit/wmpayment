"use strict";

import mongoose from "mongoose";

import Transaction from "~/models/transaction";
import TransactionSchema from "./schemas/transaction";
import RedisHelper from "~/server/helpers/redis_helper";

class TransactionRecordClass {
  static search(id, name) {
    // search redis cache first
    return RedisHelper.fetchCache(cacheKey(id))
      .then(cached => {
        // cache hit
        if (cached) return new Transaction(cached);

        // cache miss; fetch from database
        return TransactionRecord.findOne({ id: id }).exec()
          .then(doc => doc ? new Transaction(doc) : null);
      })
      .then(t => {
        // compare name; only return the transaction if matches
        return t && compareName(t.customerName, name) ? t : null;
      });
  }

  toModel() {
    return new Transaction(this);
  }
}

TransactionSchema.loadClass(TransactionRecordClass);

//
// Hooks
//

TransactionSchema.post("save", function(doc) {
  return RedisHelper.putCache(cacheKey(doc.id), doc.toModel().toJSON());
});

const TransactionRecord = mongoose.model("Transaction", TransactionSchema);
export default TransactionRecord;

//
// Helper Methods
//

function cacheKey(id) {
  return `t:${id}`;
}

function compareName(name1, name2) {
  return name1.trim().replace(/\s+/g, " ") === name2.trim().replace(/\s+/g, " ");
}