/**
 * AT: Ambient Temperature
 * FH: Forehead Temperature
 */

const fetch = require("node-fetch");
const readline = require("readline")
  .createInterface({
    input: process.stdin,
    output: process.stdout,
  });

const url = "http://api.openweathermap.org/data/2.5/weather?q=medellin,co&APPID=91f0c1168a43d953d36187844439b308&units=metric";

const FHIncreaseRateForEachOneDegreeIncreaseInAT = 0.5;

const hardwareAccuracyRange = 1.5;

const maxATAtWhichFTStopsIncreasing = 40;

const foreheadTemperatureAtFreezingTemperature = 24.9;

const getPercentage = (x, y, z) => (x * y) / z;

const isInRange = (min, tested, max) => min <= tested && tested <= max;

const getResult = (sum, at) =>
  ((FHIncreaseRateForEachOneDegreeIncreaseInAT - sum) * at) + foreheadTemperatureAtFreezingTemperature;

(async () => {
  const data = await (await fetch(url)).json();
  const at = Math.round(data.main.feels_like < 0 ? 0 : data.main.feels_like);
  const expectedFTBasedOnAT =
    Math.round(getResult(getPercentage(getPercentage(at, 100, maxATAtWhichFTStopsIncreasing), 0.199, 100), at) * 10) / 10;

  const foreheadTemperature = await new Promise((resolve) => {
    readline.question("Sensor's detected temperature:", (detectedTemperature) => {
      resolve(detectedTemperature);
      readline.close();
    });
  });

  const [minExpectedFT, maxExpectedFT] = [expectedFTBasedOnAT - hardwareAccuracyRange * 2, expectedFTBasedOnAT + hardwareAccuracyRange];

  console.log(
    `Forehead temperature should be between ${minExpectedFT} and ${maxExpectedFT}\n`,
    isInRange(minExpectedFT, +foreheadTemperature, maxExpectedFT)
      ? `Your forehead temperature (${foreheadTemperature}°) is between normal range`
      : `Your forehead temperature (${foreheadTemperature}°) is not in the normal range`
  );
})();

