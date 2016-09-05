"use strict";
const { EventEmitter } = require("events");

module.exports = (tweetStream, pokemonDesired, accountIDToFollow) => {
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

    const data = parseTweet(tweet);

    if (pokemonDesiredSet.has(data.pokemon)) {
      emitter.emit("desired spawn", data);
    } else {
      emitter.emit("undesired spawn", data);
    }
  });

  return emitter;
};

function isDirectlyFromTheAccount(tweet, accountIDToFollow) {
  return tweet.user.id_str === accountIDToFollow;
}

function parseTweet(tweet) {
  const [, pokemon, location, until] = /(.+) at (.+) until (.+). #PokemonGo (.*)/.exec(tweet.text);
  const url = tweet.entities.urls[0].expanded_url;

  return { pokemon, location, until, url };
}
