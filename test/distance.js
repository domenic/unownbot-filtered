"use strict";
const test = require("ava");
const distance = require("../lib/distance.js");

test("positionFromURL parses Google Maps URLs appropriate the appropriate answer", t => {
  const position = distance.positionFromURL(
    "https://maps.google.com/?q=35.41025,139.93000"
  );

  t.deepEqual(position, { latitude: 35.41025, longitude: 139.93000 });
});

test("distanceToURL gives the correct answer", t => {
  const dist = distance.distanceToURL(
    { latitude: 40.80, longitude: -73.96 },
    "https://maps.google.com/?q=35.41025,139.93000"
  );

  t.is(dist, 10860.892487711779);
});
