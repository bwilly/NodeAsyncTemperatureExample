Sep28-22
NodeRed has been a big time saver but I am blocked me thinks with 	prometheus-exporter, as I don't know how to send the data sensor vals into it, as the prom node only has an input.

Instead, going to build an metric endpoint that responds to Prometheus scrapes. It will return the tempareate and humidity from a dht22.

Express
node-dht-sensor
Prometheus client for node.js
