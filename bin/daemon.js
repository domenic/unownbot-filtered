#!/usr/bin/env node
"use strict";
const Twit = require("twit");
const config = require("../config.json");
const nycpokespawnFiltered = require("..");

const stream = createTweetStream(config.twitter, config.accountIDToFollow);
nycpokespawnFiltered(stream, config);

function createTweetStream(twitterConfig, accountIDToFollow) {
  const t = new Twit({
    consumer_key: twitterConfig.consumerKey,
    consumer_secret: twitterConfig.consumerSecret,
    access_token: twitterConfig.accessToken,
    access_token_secret: twitterConfig.accessTokenSecret
  });

  return t.stream("statuses/filter", { follow: accountIDToFollow });
}
