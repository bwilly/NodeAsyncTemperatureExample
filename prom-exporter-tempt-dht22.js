/**
 * A prometheus client metric that responds to requests from a running prometheus instance:
 * static_configs:
  - targets:
    - localhost:8080
 * 
 * pi@pi4-2:~/nodejs/tempt-sensor $ node server.js 
 * Tempt: 19.5 

 * Above is the local metric console log.

* CLI Usage with mDNS Module
* node prom-exporter-tempt-dht22.js -h8081 -p18 -l "PromLocationTest" -n "rpi-climate-sensor-test" -t "climate-http"
*
*

 */


const http = require('http')
const url = require('url')
const client = require('prom-client')
const dht = require("node-dht-sensor").promises;
const program = require('commander');

const mDnsService = require('mdns-module');

program
  .requiredOption('-l, --location <location>', 'location to report where the sensor is located')
  .requiredOption('-p, --pin <gpio>', 'DHT22 Pin GPIO Number')
  .requiredOption('-h, --port <httpport>', 'listen port for http server')
  .requiredOption('-t, --type <mDnsService>', 'mDNS Service Type Name')
  .requiredOption('-n, --name <mDnsInstancePrefix>', 'mDNS Service Instance Name Prefix')
  .parse(process.argv);

let options = program.opts();
let pin = options.pin;
console.log("DHT22 on Pin " + pin);


// Create a Registry which registers the metrics
const register = new client.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'prom-exporter-tempt-dht22'
})

// Enable the collection of default metrics
// client.collectDefaultMetrics({ register })

// Create a histogram metric
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
})

// Register the histogram
// register.registerMetric(httpRequestDurationMicroseconds)

const temptMetric = new client.Gauge({
  name: 'ambient_tempt_celcius',
  labelNames: ['location'],
  help: 'Temperature Sensor',
  async collect() {
    // Invoked when the registry collects its metrics' values.
    // This can be synchronous or it can return a promise/be an async function.
    // this.set(7);

    try {
      // await dht.read(22, 18, function (err, temperature, humidity) {
      //   if (!err) {
      //     console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
      //     // return temperature.toFixed(2);
      //   } else {
      //     console.log(err);
      //   }
      let tempt = (await dht.read(22, options.pin)).temperature;
      console.log("Tempt: " + tempt);
      this.set({ location: options.location }, tempt);




    } catch (e) {
      console.log("Catch error: " + e);
    }



  },
})
register.registerMetric(temptMetric);


// Define the HTTP server
const server = http.createServer(async (req, res) => {
  // Start the timer
  const end = httpRequestDurationMicroseconds.startTimer()

  // Retrieve route from request object
  const route = url.parse(req.url).pathname

  if (route === '/metrics') {
    // Return all metrics the Prometheus exposition format
    res.setHeader('Content-Type', register.contentType)
    res.end(await register.metrics())
    // res.end("hello bwilly")
  }

  // End timer and add labels
  end({ route, code: res.statusCode, method: req.method })
})

// Start the HTTP server which exposes the metrics on http://localhost:8080/metrics
server.listen(options.port)

// Register Service w/ mDNS
const instanceName = `${options.name}-${options.location}`;
const mDns = mDnsService(instanceName, options.type, options.port);
console.log(`mDNS advertised ${instanceName}, ${options.type}, ${options.port}`);