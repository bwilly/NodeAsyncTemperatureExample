/**
 * A prometheus client metric that responds to requests from a running prometheus instance:
 * static_configs:
  - targets:
    - localhost:8080
 * 
pi@pi4-2:~/nodejs/tempt-sensor $ node server.js 
Tempt: 19.5 

 * Above is the local metric console log.
 */


const http = require('http')
const url = require('url')
const client = require('prom-client')
const sensor_ds18b20 = require('ds18b20-raspi');

// Create a Registry which registers the metrics
const register = new client.Registry()

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'sensor-temperature-app'
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

    try {
      let sensorResult = sensor_ds18b20.readSimpleC();


      console.log("Tempt: " + sensorResult);
      this.set({ location: 'Pi4-2' }, sensorResult);




    } catch (e) {
      console.log("Catch error: " + e);
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
    // res.end("hello bwilly")
  }

})

// Start the HTTP server which exposes the metrics on http://localhost:8080/metrics
server.listen(8080)