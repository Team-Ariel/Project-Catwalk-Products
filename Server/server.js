const express = require('express');
const controller = require('./controller.js');
const app = express()
const port = 3000;
const db = require('../DB/routes.js')
const cluster = require('cluster');

const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.listen(port, err => {
    err ?
    console.log("error in server setup") :
    console.log(`Worker ${process.pid} started`);
  })
}




app.get('/products', (req, res) => {
  controller.getProductsAndFormat(req.query, (err, data) => {
    if (err) {
      res.status(err).send(`Error: ${err}`);
    }
    if (data) {
      res.status(200).send(data);
    }

  })
})

app.get('/products/:product_id', (req, res) => {
  controller.getSingleProductAndFeatures(req.params.product_id, (err, data) => {
    if (err) {
      res.status(404).send(`Error: ${err}`);
    }
    if (data) {
      res.status(200).send(data);
    }

  })
})

app.get('/products/:product_id/styles', (req, res) => {
  controller.getStyles((req.params.product_id), (err, data) => {
    if (err) {
      res.status(err).send(`Error: ${err}`);
    }
    if (data) {
      res.status(200).send(data);
    }
  })

})

app.get('/products/:product_id/related', (req, res) => {
  controller.getRelated((req.params.product_id), (err, data) => {
    if (err) {
      res.status(err.send(`Error: ${err}`));
    }
    if (data) {
      res.status(200).send(data);
    }
  })

})

app.get('/loaderio-7bf4d5f38ce86532dc53d085672f654b.txt', (req, res) => res.send('/loaderio-7bf4d5f38ce86532dc53d085672f654b'))
