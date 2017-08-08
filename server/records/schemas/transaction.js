"use strict";

import { Schema } from "mongoose";
import { UniqueShortIdPlugin } from '~/server/helpers/mongoose_helper';

const schema = new Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },

  cust_name: {
    type: String,
    required: true
  },

  cust_phone: {
    type: String,
    required: true
  },

  payment_ref: {
    type: String,
    required: true
  },

  payment_gateway: {
    type: String,
    required: true
  },

  currency: {
    type: String,
    minlength: 3,
    maxlength: 3
  },

  amount: {
    type: Number,
    min: [0, "Must be positive"]
  }
});
schema.plugin(UniqueShortIdPlugin, {
  field: 'id'
});

export default schema;