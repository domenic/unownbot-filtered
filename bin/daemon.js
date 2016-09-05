#!/usr/bin/env node
"use strict";
const Twit = require("twit");
const config = require("../config.json");
const nycpokespawnFiltered = require("..");

const stream = createTweetStream(config);
nycpokespawnFiltered(stream, config);

function createTweetStream(config) {
  const t = new Twit({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token: config.accessToken,
    access_token_secret: config.accessTokenSecret
  });

  return t.stream("statuses/filter", { follow: config.accountIDToFollow });
}
