"use strict";

import { factory } from "factory-girl";
import Transaction from "~/models/transaction";

const chance = require("chance").Chance();

factory.define("transaction", Transaction, buildOptions => {
  const order_prom = buildOptions.order ?
    Promise.resolve(buildOptions.order) : factory.build("order");

  return order_prom.then(order => {
    const attrs = {};

    attrs.id = chance.hash();
    attrs.cust_name   = order.name;
    attrs.cust_phone  = order.phone;
    attrs.payment_ref = chance.hash();
    attrs.payment_gateway = chance.pickone(["paypal", "braintree"]);
    attrs.currency = order.currency;
    attrs.amount   = order.amount;

    return attrs;
  });
});