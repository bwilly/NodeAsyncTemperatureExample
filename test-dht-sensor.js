/**
bwilly Oct 2, 2022
Proves sync and async via working examples of a DHT termperature example on a contemporary RasPi.

pi@pi4-2:~/nodejs/tempt-sensor $ node test.js 
Starting.
temp (synchronous): 19.399999618530273°C, humidity: 52.099998474121094%
Stopping.
temp (inside asyc): 19.399999618530273°C, humidity: 52.099998474121094%
 */


const dht = require("node-dht-sensor");
// const dht = require("node-dht-sensor").promises;
// let tempt = dht.read(22, 18, function (err, temperature, humidity) {
//     console.log("Temperature inside callback: " + temperature);
//     return temperature;
// });

// let tempt = dht.read(22, 18);

const program = require('commander');

program
    .requiredOption('-p, --pin <gpio>', 'DHT22 Pin GPIO Number')
    .option('-a, --async', 'Async sensor call.')
    .option('-s, --sync', 'Synchronous sensor call.')
    .option('-c, --callback', 'Callback sensor call.')
    .parse(process.argv);

let options = program.opts();
let pin = options.pin;
console.log("DHT22 on Pin " + pin);

function readTemptCallback() {
    dht.read(22, pin, function (err, temperature, humidity) {
        if (!err) {
            console.log(`temp (inside callback): ${temperature}°C, humidity: ${humidity}%`);
        } else {
            console.log(err);
        }
    });
}

function readTempt() {
    let sensorResult = dht.read(22, pin);
    let temperature = sensorResult.temperature;
    let humidity = sensorResult.humidity;
    console.log(`temp (synchronous): ${temperature}°C, humidity: ${humidity}%`);
}

async function readTemptAsync() {
    let sensorResult = await dht.read(22, pin);
    let temperature = sensorResult.temperature;
    let humidity = sensorResult.humidity;
    console.log(`temp (inside asyc): ${temperature}°C, humidity: ${humidity}%`);
}


console.log("Starting.")
if (options.callback) {
    readTemptCallback();
}
if (options.sync) {
    readTempt();
}
if (options.async) {
    readTemptAsync();
}
console.log("Stopping.")
// console.log("Temperature via await's val: " + tempt);