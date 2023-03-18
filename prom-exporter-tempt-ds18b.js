/**
 * A prometheus client metric that responds to requests from a running prometheus instance:
 * static_configs:
  - targets:
    - localhost:8080
 * 

Nov 29, 2022

Start server (normally run as service): 
node prom-exporter-tempt-ds18b.js -i28-000002d105bb -h8081 -llab

Run CURL test. Normally, it will be called from a prometheus server: 
DEV-BWLLY-MBP:~ bwilly$ curl http://pi4-2.local:8081/metrics

# HELP ambient_tempt_celcius Temperature Sensor
# TYPE ambient_tempt_celcius gauge
ambient_tempt_celcius{location="lab",app="sensor-temperature-app"} 18.94

* CLI Usage with mDNS Module
* node prom-exporter-tempt-ds18b.js -h8082 -i28-000002d105bb -l "TestA" -n "rpi-climate-sensor-test" -t "climate-http"
*
*


*/


const http = require('http')
const url = require('url')
const client = require('prom-client')
const sensor_ds18b20 = require('ds18b20-raspi');

const program = require('commander');

const mDnsService = require('mdns-module');

program
  .requiredOption('-i, --sensor <uuid>', '1-wire sensor id')
  .requiredOption('-l, --location <location>', 'location to report where the sensor is located')
  .requiredOption('-h, --port <httpport>', 'listen port for http server')
  .requiredOption('-t, --type <mDnsService>', 'mDNS Service Type Name')
  .requiredOption('-n, --name <mDnsInstance>', 'mDNS Service Instance Name')
  .parse(process.argv);

let options = program.opts();

// Create a Registry which registers the metrics
const register = new client.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'prom-exporter-tempt-ds18b'
})


// Register the histogram
// register.registerMetric(httpRequestDurationMicroseconds)

const temptMetric = new client.Gauge({
  name: 'ambient_tempt_celcius',
  labelNames: ['location'],
  help: 'Temperature Sensor',
  // async collect() {
  collect() {
    // Invoked when the registry collects its metrics' values.
    // This can be synchronous or it can return a promise/be an async function.
    // this.set(7);

    const deviceId = options.sensor;
    const location = options.location;
    try {
      let sensorResult = sensor_ds18b20.readC(deviceId, 2);

      console.log("Tempt: " + sensorResult);
      this.set({ location: location }, sensorResult);
    } catch (e) {
      console.log("Catch error: " + e);
      sensorResult = null; // otherwise, metric will quietly report the last good result (it seems or was)
    }
  },
})
register.registerMetric(temptMetric);

// Define the HTTP server
const server = http.createServer(async (req, res) => {

  // Retrieve route from request object
  const route = url.parse(req.url).pathname

  if (route === '/metrics') {
    // Return all metrics the Prometheus exposition format
    res.setHeader('Content-Type', register.contentType)
    res.end(await register.metrics())
  }

})

// Start the HTTP server which exposes the metrics on http://localhost:8080/metrics
server.listen(options.port)
console.log("HTTP listening on port " + options.port);

// Register Service w/ mDNS
const instanceName = `${options.name}-${options.location}`;
const mDns = mDnsService(instanceName, options.type, options.port);
console.log(`mDNS advertised ${instanceName}, ${options.type}, ${options.port}`);