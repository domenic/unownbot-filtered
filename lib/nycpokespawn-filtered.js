"use strict";
const { EventEmitter } = require("events");
const Twit = require("twit");
const config = require("../config.json");
const logger = require("./logger.js");

const pokemonDesired = new Set(config.pokemonDesired);

const stream = createTweetStream();
const happenings = createHappeningsEmitter(stream);

happenings.on("error", err => {
  logger.error(`${err.message}
- statusCode: ${err.statusCode}
- code: ${err.code}
- twitterReply: ${err.twitterReply}`);
});

happenings.on("undesired spawn", data => {
  logger.info(`${data.pokemon} spawned, but we're not interested.`);
});

happenings.on("desired spawn", data => {
  logger.info(`${data.pokemon} spawned (${data.location} until ${data.time}). Determining distance...`);
});


function createTweetStream() {
  const t = new Twit({
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret,
    access_token: config.accessToken,
    access_token_secret: config.accessTokenSecret
  });

  return t.stream("statuses/filter", { follow: config.accountToFollow });
}

function parseTweet(tweet) {
  const [, pokemon, location, time, url] = /(.+) at (.+) until (.+). #PokemonGo (.*)/.exec(tweet.text);

  return { pokemon, location, time, url };
}

function createHappeningsEmitter(tweetStream) {
  const emitter = new EventEmitter();

  tweetStream.on("error", err => emitter.emit("error", err));

  tweetStream.on("tweet", tweet => {
    const data = parseTweet(tweet);

    if (pokemonDesired.has(data.pokemon)) {
      emitter.emit("desired spawn", data);
    } else {
      emitter.emit("undesired spawn", data);
    }
  });
}
