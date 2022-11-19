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
    .option('-s, --sensor <port>', '1-wire sensor id')
    .parse(process.argv);

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

    // this ok, but want to readc multiple, so commenting out
    // let sensorResult = sensor_ds18b20.readSimpleC();
    // const deviceId = '28-020a924654d7';
    //const deviceId = '28-020e91770579'; // house test
    //const deviceId = '28-000002d111e1'; // Engine Room Ambient 
    // const deviceId = '28-0000069813e8'; // Hot Water Heater
    const deviceId = program.opts().sensor;
    let sensorResult = sensor_ds18b20.readC(deviceId);

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
