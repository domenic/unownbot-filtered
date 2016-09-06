#!/usr/bin/env node
"use strict";
const config = require("../config.json");
const nycpokespawnFiltered = require("..");
const createTweetStream = require("../lib/twitter.js");
const createLogger = require("../lib/logger.js");

const tweetStream = createTweetStream(config.twitter, config.accountIDToFollow);
const logger = createLogger(console);
nycpokespawnFiltered(tweetStream, logger, config);
