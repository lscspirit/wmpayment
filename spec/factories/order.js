"use strict";

import { factory } from "factory-girl";
import Order from "~/models/order";

const chance = require('chance').Chance();

factory.define("order", Order, buildOptions => {
  const attrs = {};

  attrs.name  = chance.name();
  attrs.phone = chance.phone();

  if (buildOptions.currencies) {
    attrs.currency = chance.pickone(buildOptions.currencies);
  } else {
    attrs.currency = chance.pickone(Object.keys(Order.Currencies));
  }

  if (attrs.currency === Order.Currencies.JPY) {
    attrs.amount = chance.integer({ min: 1, max: 10000 });
  } else {
    attrs.amount = chance.floating({ min: 0.01, max: 10000, fixed: 2 })
  }

  return attrs;
});