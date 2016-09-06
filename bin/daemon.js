#!/usr/bin/env node
"use strict";
const nycpokespawnFiltered = require("..");
const createTweetStream = require("../lib/twitter.js");
const createLogger = require("../lib/logger.js");
const getConfig = require("../lib/config.js");

const config = getConfig();

if (config) {
  const tweetStream = createTweetStream(config.twitter, config.accountIDToFollow);
  const logger = createLogger(console);
  nycpokespawnFiltered(tweetStream, logger, config);
}
