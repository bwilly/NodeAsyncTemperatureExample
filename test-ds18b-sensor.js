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

// const dht = require("node-dht-sensor").promises;
// let tempt = dht.read(22, 18, function (err, temperature, humidity) {
//     console.log("Temperature inside callback: " + temperature);
//     return temperature;
// });

// let tempt = dht.read(22, 18);


// function readTemptCallback() {    
//     dht.read(22, 18, function (err, temperature, humidity) {
//         if (!err) {
//             console.log(`temp (inside callback): ${temperature}°C, humidity: ${humidity}%`);
//         } else {
//             console.log(err);
//         }
//     });
// }

function readTempt() {

    let sensorResult = sensor_ds18b20.readAllC();
    const temperature = sensorResult;


    console.log(`temp (synchronous): ${temperature}°C`);
}

// async function readTemptAsync() {
//     let sensorResult = await dht.read(22, 18);
//     let temperature = sensorResult.temperature;
//     let humidity = sensorResult.humidity;
//     console.log(`temp (inside asyc): ${temperature}°C, humidity: ${humidity}%`);
// }


console.log("Starting.")
// readTemptCallback();
readTempt();
// readTemptAsync();
console.log("Stopping.")
// console.log("Temperature via await's val: " + tempt);