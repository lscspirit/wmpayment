"use strict";

import "~/spec/test_helper";

import { factory } from "factory-girl";
import { expect } from "chai";
import config from "config";

import RedisHelper from "~/server/helpers/redis_helper";

const chance = require('chance').Chance();

describe("RedisHelper", function() {
  describe("::putCache()", function() {
    beforeEach(function() {
      this.key   = chance.guid();
      this.value = chance.sentence();
      return RedisHelper.putCache(this.key, this.value);
    });

    it("adds an entry to the key", function(done) {
      RedisHelper.client.get(this.key, (err, reply) => {
        expect(reply).to.not.be.null;
        done();
      });
    });

    it("adds the right value to the key", function(done) {
      RedisHelper.client.get(this.key, (err, reply) => {
        expect(JSON.parse(reply)).to.equal(this.value);
        done();
      });
    });

    it("set a ttl to the entry", function(done) {
      RedisHelper.client.ttl(this.key, (err, reply) => {
        expect(reply).to.equal(config.get("redis").ttl);
        done();
      });
    });
  });

  describe("::fetchCache()", function() {
    describe("when the entry exists", function() {
      beforeEach(function(done) {
        this.key   = chance.guid();
        this.value = chance.sentence();
        RedisHelper.client.set(this.key, JSON.stringify(this.value), "EX", 60, () => {
          this.result = RedisHelper.fetchCache(this.key);
          done();
        });
      });

      it("returns a value", function() {
        return this.result.then(value => {
          expect(value).to.not.be.null;
        });
      });

      it("returns the right value", function() {
        return this.result.then(value => {
          expect(value).to.equal(this.value);
        });
      });
    });

    describe("when the entry is missing", function() {
      beforeEach(function() {
        this.key    = chance.guid();
        this.result = RedisHelper.fetchCache(this.key);
      });

      it("returns null", function() {
        return this.result.then(value => {
          expect(value).to.be.null;
        });
      });
    });
  });
});