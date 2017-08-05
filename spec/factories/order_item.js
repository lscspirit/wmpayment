"use strict";

import { factory } from "factory-girl";
import OrderItem from "~/models/order_item";

const chance = require('chance').Chance();

factory.define("order_item", OrderItem, buildOptions => {
  const attrs = {};

  if (buildOptions.currencies) {
    attrs.currency = chance.pickone(buildOptions.currencies);
  } else {
    attrs.currency = chance.pickone(Object.keys(OrderItem.Currencies));
  }

  if (attrs.currency === OrderItem.Currencies.JPY) {
    attrs.amount = chance.integer({ min: 1, max: 10000 });
  } else {
    attrs.amount = chance.floating({ min: 0.01, max: 10000, fixed: 2 })
  }

  return attrs;
});