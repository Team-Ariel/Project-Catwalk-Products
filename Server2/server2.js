const express = require('express');
const controller = require('./controller2.js');
const app = express()
const port = 3001;
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

app.get('/loaderio-9fa3024019b84de063f423e7625ca8ba.txt', (req, res) => res.download('./Server2/public/loaderio-9fa3024019b84de063f423e7625ca8ba.txt'))
