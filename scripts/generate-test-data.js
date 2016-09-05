"use strict";
const Twit = require("twit");
const config = require("../config.json");
const fs = require("fs");
const path = require("path");

const destFilename = path.resolve(__dirname, "../test/fixtures/tweets.json");

const t = new Twit({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  access_token: config.accessToken,
  access_token_secret: config.accessTokenSecret
});

t.get("statuses/user_timeline", {
  user_id: config.accountIDToFollow,
  trim_user: true,
  exclude_replies: true,
  include_rts: false
})
.then(({ data }) => {
  fs.writeFileSync(destFilename, JSON.stringify(data, undefined, 2));
})
.catch(e => {
  console.error(e.stack);
  process.exit(1);
});
