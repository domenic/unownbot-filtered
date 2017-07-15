#!/usr/bin/env node
"use strict";
const { EventEmitter } = require("events");
const unownbotFiltered = require("..");
const createLogger = require("../lib/logger.js");
const getConfig = require("../lib/config.js");
const fakeTweets = require("../test/fixtures/tweets.json");

const stream = new EventEmitter();
const config = getConfig();
const logger = createLogger(console);
unownbotFiltered(stream, logger, config);

stream.emit("connected");

let delay = 0;
for (const tweet of fakeTweets) {
  setTimeout(() => stream.emit("tweet", tweet), delay);
  delay += 1000;
}
