"use strict";

import config from "config";
import mongoose from "mongoose";
import urljoin from "url-join";

import generateShortId from '~/server/utils/short_id';

//
// Initialization
//

export default class MongooseHelper {
  static init() {
    const mongodb_config = config.get("mongodb");
    const url = urljoin(`mongodb://${mongodb_config.host}`, mongodb_config.db);

    mongoose.Promise = global.Promise;
    mongoose.connect(url, { useMongoClient: true }).then(() => {
      console.log("database connection established");
    }, err => {
      console.error("unable to connect to database");
      console.error(err.message);
    });
  }
}

//
// Unique ShortId Plugin
//

function _findUniqueShortId(klass, fieldName) {
  const shortId = generateShortId();
  return klass.findOne({ [fieldName]: shortId }).exec().then(match => {
    if (match) return _findUniqueShortId(klass, fieldName);
    else return shortId;
  });
}

export function UniqueShortIdPlugin(schema, options) {
  const fieldName = options.field;

  // generates a short id and assigns it to the field
  schema.pre('validate', function(next) {
    return _findUniqueShortId(this.constructor, fieldName).then(shortId => {
      this[fieldName] = shortId;
      next();
    });
  });
}