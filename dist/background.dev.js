"use strict";

chrome.webRequest.onBeforeRequest.addListener(function (details) {
  if (details.method == "POST") {
    console.log(details.requestBody.formData);
  }
}, {
  urls: ["<all_urls>"]
}, ["requestBody"]);

function beerAlcoholContent(originalGravity, finalGravity) {
  // https://www.brewersfriend.com/2011/06/16/alcohol-by-volume-calculator-updated/
  return 76.08 * (originalGravity - finalGravity) / (1.775 - originalGravity) * (finalGravity / 0.794);
}

function beerGrainColor() {}

function beerApparentAttenuation(originalGravity, finalGravity) {
  return (originalGravity - finalGravity) / originalGravity;
}

function beerPitchingRate(k, wortVolume, originalGravity) {
  return k * wortVolume * (originalGravity / 4);
}