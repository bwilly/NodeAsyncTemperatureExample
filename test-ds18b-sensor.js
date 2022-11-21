/**
bwilly Oct 2, 2022
Proves sync and async via working examples of a DHT termperature example on a contemporary RasPi.

pi@pi4-2:~/nodejs/tempt-sensor $ node test.js 
Starting.
temp (synchronous): 19.399999618530273°C, humidity: 52.099998474121094%
Stopping.
temp (inside asyc): 19.399999618530273°C, humidity: 52.099998474121094%
 */


// const dht = require("node-dht-sensor");

const sensor_ds18b20 = require('ds18b20-raspi');
const program = require('commander');

program
    .requiredOption('-i, --sensor <port>', '1-wire sensor id')
    .option('-a, --async', 'Async sensor call.')
    .option('-s, --sync', 'Synchronous sensor call.')
    .option('-c, --callback', 'Callback sensor call.')
    .parse(process.argv);

let options = program.opts();

const deviceId = options.sensor;
// const deviceId = '28-020a924654d7';
//const deviceId = '28-020e91770579'; // house test
//const deviceId = '28-000002d111e1'; // Engine Room Ambient 
// const deviceId = '28-0000069813e8'; // Hot Water Heater

function temptCallback(error, readings) {
    console.log(`temp (callback): ${readings}°C`);
    console.log("error: " + error);
}

function readTemptAsCallback() {
    let sensorResult = sensor_ds18b20.readC(deviceId, 2, temptCallback);
}

function readTempt() {
    let sensorResult = sensor_ds18b20.readC(deviceId, 2);
    const temperature = sensorResult;
    console.log(`temp (synchronous): ${temperature}°C`);
}





console.log("Starting.")
if (options.sync) {
    readTempt();
}
if (options.callback) {
    readTemptAsCallback();
}
if (options.async) {
    console.log("Async keyword not yet impl by bwilly. Nov21-22")
}
console.log("Stopping.")
// console.log("Temperature via await's val: " + tempt);
