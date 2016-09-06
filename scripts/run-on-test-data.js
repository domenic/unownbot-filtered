"use strict";
const { EventEmitter } = require("events");
const config = require("../config.json");
const fakeTweets = require("../test/fixtures/tweets.json");
const createLogger = require("../lib/logger.js");
const nycpokespawnFiltered = require("..");

const stream = new EventEmitter();
const logger = createLogger(console);
nycpokespawnFiltered(stream, logger, config);

stream.emit("connected");

let delay = 0;
for (const tweet of fakeTweets) {
  setTimeout(() => stream.emit("tweet", tweet), delay);
  delay += 1000;
}
