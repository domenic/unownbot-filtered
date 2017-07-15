"use strict";
const { EventEmitter } = require("events");
const { distanceToURL } = require("./distance.js");

module.exports = (tweetStream, accountIDToFollow, locations) => {
  const emitter = new EventEmitter();

  tweetStream.on("connected", () => emitter.emit("connected"));

  tweetStream.on("error", err => emitter.emit("error", err));

  tweetStream.on("tweet", tweet => {
    if (!isDirectlyFromTheAccount(tweet, accountIDToFollow)) {
      // From https://dev.twitter.com/streaming/overview/request-parameters#follow, we only want
      // "Tweets created by the user", but the stream gives us a lot of other tweets (mostly when
      // somebody retweets the account).
      return;
    }

    let data;
    try {
      data = parseTweet(tweet);
    } catch (err) {
      emitter.emit("error", new Error(`Could not parse tweet with text '${tweet.text}'`));
      return;
    }

    emitter.emit("spawn", data);

    for (const location of locations) {
      try {
        const distance = distanceToURL(location, data.url);
        if (distance < location.radius) {
          const dataWithCloseness = Object.assign({ distance, closeTo: location.label }, data);
          emitter.emit("spawn within range", dataWithCloseness);
        }
      } catch (e) {
        e.message = `Could not determine location for tweet with text '${tweet.text}'. Original error:\n\n${e.message}`;
        emitter.emit("error", e);
      }
    }
  });

  return emitter;
};

function isDirectlyFromTheAccount(tweet, accountIDToFollow) {
  return tweet.user.id_str === accountIDToFollow && !tweet.retweeted_status;
}

function parseTweet(tweet) {
  const [, rawLetter, rawIV, rawTTL] = /Unown ((?:\([A-Z]\) )?)\(IV: (.+), TTL: (.+)\)/.exec(tweet.text);
  const url = tweet.entities.urls[0].expanded_url;
  const letter = rawLetter === "" ? "unknown" : rawLetter[1];
  const iv = rawIV === "-" ? "unknown" : rawIV;
  const ttl = rawTTL.replace(/&lt;/g, "<"); // selective HTML decoding

  return { iv, letter, ttl, url };
}
