"use strict";
const test = require("ava");
const distance = require("../lib/distance.js");

test("followRedirects follows a Google maps shortened URL appropriately", t => {
  return distance.followRedirects("https://goo.gl/LhphUu").then(finalURL => {
    t.is(finalURL, "https://www.google.com/maps/place/40.8053786841,-73.9689989085/?dg=dbrw&newdg=1");
  });
});

test("positionFromURL parses Google Maps URLs appropriate the appropriate answer", t => {
  const position = distance.positionFromURL(
    "https://www.google.com/maps/place/40.8053786841,-73.9689989085/?dg=dbrw&newdg=1"
  );

  t.deepEqual(position, { latitude: 40.8053786841, longitude: -73.9689989085 });
});

test("distanceToShortenedURL gives the correct answer", t => {
  return distance.distanceToShortenedURL({ latitude: 40.80, longitude: -73.96 }, "https://goo.gl/LhphUu").then(dist => {
    t.is(dist, 0.9651027009170235);
  });
});
