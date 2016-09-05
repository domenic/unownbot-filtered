"use strict";
const { EventEmitter } = require("events");
const { distanceToShortenedURL } = require("./distance.js");

module.exports = (tweetStream, pokemonDesired, accountIDToFollow, locations) => {
  const emitter = new EventEmitter();

  const pokemonDesiredSet = new Set(pokemonDesired);

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

    if (!pokemonDesiredSet.has(data.pokemon)) {
      emitter.emit("undesired spawn", data);
      return;
    }

    emitter.emit("desired spawn", data);

    for (const location of locations) {
      distanceToShortenedURL(location, data.url).then(distance => {
        if (distance < location.radius) {
          const dataWithCloseness = Object.assign({ distance, closeTo: location.label }, data);
          emitter.emit("desired spawn within range", dataWithCloseness);
        }
      })
      .catch(err => emitter.emit("error", err));
    }
  });

  return emitter;
};

function isDirectlyFromTheAccount(tweet, accountIDToFollow) {
  return tweet.user.id_str === accountIDToFollow && !tweet.retweeted_status;
}

function parseTweet(tweet) {
  const [, pokemon, location, until] = /(.+) at (.+) until (.+). #PokemonGo (.*)/.exec(tweet.text);
  const url = tweet.entities.urls[0].expanded_url;

  return { pokemon, location, until, url };
}
