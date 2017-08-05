"use strict";

import { factory } from "factory-girl";
import OrderItem from "~/models/order_item";

const chance = require('chance').Chance();

factory.define("order_item", OrderItem, {
  amount:   () => chance.floating({ min: 0.01, max: 10000, fixed: 2 }),
  currency: () => chance.pickone(Object.keys(OrderItem.Currencies))
});