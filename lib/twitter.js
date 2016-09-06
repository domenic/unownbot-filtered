"use strict";
const Twit = require("twit");

module.exports = (twitterConfig, accountIDToFollow) => {
  const t = new Twit({
    consumer_key: twitterConfig.consumerKey,
    consumer_secret: twitterConfig.consumerSecret,
    access_token: twitterConfig.accessToken,
    access_token_secret: twitterConfig.accessTokenSecret
  });

  return t.stream("statuses/filter", { follow: accountIDToFollow });
};
