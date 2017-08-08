"use strict";

import config from "config";
import redis from "redis";
import bluebird from "bluebird";

bluebird.promisifyAll(redis.RedisClient.prototype);

const redis_config = config.get("redis");
const cache_ttl    = redis_config.ttl;

let client;

export default class RedisHelper {
  static init() {
    client = redis.createClient({
      host: redis_config.host,
      port: redis_config.port,
      db:   redis_config.db
    });
    console.log("redis connection established");
  }

  static get client() {
    return client;
  }

  static putCache(key, value) {
    const json = JSON.stringify(value);
    return client.setAsync(key, json, "EX", cache_ttl);
  }

  static fetchCache(key) {
    return client.getAsync(key).then(json => {
      return json ? JSON.parse(json) : null;
    });
  }
}