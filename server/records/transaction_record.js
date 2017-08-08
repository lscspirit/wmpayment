"use strict";

import mongoose from "mongoose";

import Transaction from "~/models/transaction";
import TransactionSchema from "./schemas/transaction";

class TransactionRecordClass {
  toModel() {
    return new Transaction(this);
  }
}

TransactionSchema.loadClass(TransactionRecordClass);

//
// Hooks
//

const TransactionRecord = mongoose.model("Transaction", TransactionSchema);
export default TransactionRecord;