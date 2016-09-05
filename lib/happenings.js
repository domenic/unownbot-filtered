"use strict";
const { EventEmitter } = require("events");
const config = require("../config.json");

const pokemonDesired = new Set(config.pokemonDesired);

module.exports = tweetStream => {
  const emitter = new EventEmitter();

  tweetStream.on("connected", () => emitter.emit("connected"));

  tweetStream.on("error", err => emitter.emit("error", err));

  tweetStream.on("tweet", tweet => {
    if (!isDirectlyFromTheAccount(tweet)) {
      // From https://dev.twitter.com/streaming/overview/request-parameters#follow, we only want
      // "Tweets created by the user", but the stream gives us a lot of other tweets (mostly when
      // somebody retweets the account).
      return;
    }

    const data = parseTweet(tweet);

    if (pokemonDesired.has(data.pokemon)) {
      emitter.emit("desired spawn", data);
    } else {
      emitter.emit("undesired spawn", data);
    }
  });

  return emitter;
};

function isDirectlyFromTheAccount(tweet) {
  return tweet.user.id_str === config.accountIDToFollow;
}

function parseTweet(tweet) {
  const [, pokemon, location, time, url] = /(.+) at (.+) until (.+). #PokemonGo (.*)/.exec(tweet.text);

  return { pokemon, location, time, url };
}
