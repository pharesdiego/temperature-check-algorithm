/**
 * AT: Ambient Temperature
 * FH: Forehead Temperature
 */

const fetch = require("node-fetch");
// const readline = require("readline")
//   .createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });


const url = "http://api.openweathermap.org/data/2.5/weather?q=medellin,co&APPID=91f0c1168a43d953d36187844439b308&units=metric";
const FHIncreaseRateForEachOneDegreeIncreaseInAT = 0.5;
const hardwareAccuracyRange = 1.5;
const maxATAtWhichFTStopsIncreasing = 40;
const foreheadTemperatureAtFreezingTemperature = 24.9;
const isInRange = (baseNumber, range) => (testedNumber) => {
  return testedNumber < (baseNumber + range);
};

const getPercentage = (x, y, z) => (x * y) / z;

const getResult = (sum, at) =>
  ((FHIncreaseRateForEachOneDegreeIncreaseInAT - sum) * at) + foreheadTemperatureAtFreezingTemperature;

// ((0.3 + (0.2 - 0.2)) * 40) + 24.9
// ((0.5 - 0.2 or R2) * 40) + 24.9
// ((0.5) * 2) + 24.9 => for 2 degree
(async () => {
  const data = await (await fetch(url)).json();
  // const at = Math.round(data.main.feels_like < 0 ? 0 : data.main.feels_like);
  const at = 20.5;

  // const temperatures = Array.from({ length: 21 }, (x, i) => i + i);
  // console.log(
  //  JSON.stringify( temperatures.map(t => ({ t, result: Math.round(getResult(getPercentage(getPercentage(t, 100, maxATAtWhichFTStopsIncreasing), 0.199, 100), t) * 10) / 10 })), null, 2)
  // )

  const result = Math.round(getResult(getPercentage(getPercentage(at, 100, maxATAtWhichFTStopsIncreasing), 0.199, 100), at) * 10) / 10;
// 33.8 - 2.5
  console.log(
    "your ft should be between: ",
    `${(result - hardwareAccuracyRange).toFixed(1)} - ${(result + hardwareAccuracyRange).toFixed(1)}`,
    "\n because the AT is: ",
    at,
  );


  // const isInNormalForeheadTemperature = isInRange(maxNormalForeheadTemperature, 2.5);
  // const foreheadTemperature = await new Promise((resolve) => {
  //   readline.question("Sensor's detected temperature:", (detectedTemperature) => {
  //     resolve(detectedTemperature);
  //     readline.close();
  //   });
  // });

})();

