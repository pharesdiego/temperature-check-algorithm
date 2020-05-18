#!/usr/bin/env node
/**
 * AT: Ambient Temperature
 * FH: Forehead Temperature
 */

process.argv.slice(2).length < 2 && process.exit();

const fetch = require("node-fetch");
const { table } = require("table");
const { say } = require("cowsay");

const [foreheadTemperature, city] = process.argv.slice(2);

const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=91f0c1168a43d953d36187844439b308&units=metric`;

const FHIncreaseRateForEachOneDegreeIncreaseInAT = 0.5;

const hardwareAccuracyRange = 1.5;

const maxATAtWhichFTStopsIncreasing = 40;

const foreheadTemperatureAtFreezingTemperature = 24.9;

const getPercentage = (x, y, z) => (x * y) / z;

const isInRange = (min, tested, max) => min <= tested && tested <= max;

const getResult = (deceleration, at) =>
  ((FHIncreaseRateForEachOneDegreeIncreaseInAT - deceleration) * at) + foreheadTemperatureAtFreezingTemperature;

(async () => {
  const data = await (await fetch(url)).json();
  const at = Math.round(data.main.feels_like < 0 ? 0 : data.main.feels_like);
  const expectedFTBasedOnAT =
    Math.round(getResult(getPercentage(getPercentage(at, 100, maxATAtWhichFTStopsIncreasing), 0.199, 100), at) * 10) / 10;

  const [minExpectedFT, maxExpectedFT] = [expectedFTBasedOnAT - hardwareAccuracyRange * 2, expectedFTBasedOnAT + hardwareAccuracyRange];

  console.log(
    table(Object.entries(data.main)),
    `\nForehead temperature should be between ${minExpectedFT} and ${maxExpectedFT}\n`,
    say({
      text: isInRange(minExpectedFT, +foreheadTemperature, maxExpectedFT)
        ? `Your forehead temperature (${foreheadTemperature}°) is between normal range`
        : `Your forehead temperature (${foreheadTemperature}°) is not in the normal range`,
    })
  );
})();

