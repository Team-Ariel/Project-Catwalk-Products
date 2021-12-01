const express = require('express');
const controller = require('./controller.js');
const app = express()
const port = 3000;
const db = require('../DB/routes.js')
const cluster = require('cluster');
const mcache = require('memory-cache');



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

const cache = (duration) => {
  return (req, res, next) => {
    let key = '_express_' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return;
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next();
    }
  }
}




app.get('/products', cache(60), (req, res) => {
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

// app.get('/products/:product_id/styles', cache(60), (req, res) => {
//   controller.getStyles((req.params.product_id), (err, data) => {
//     if (err) {
//       res.status(err).send(`Error: ${err}`);
//     }
//     if (data) {
//       res.status(200).send(data);
//     }
//   })

// })

app.get('/products/:product_id/styles', cache(60), (req, res) => {
  db.getStyles(req.params.product_id)
  .then((result) => {
    res.status(200).send(result.rows[0])
  })
  .catch((err) => {
    res.status(404).send(`Error: ${err}`)
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

app.get('/loaderio-7bf4d5f38ce86532dc53d085672f654b.txt', (req, res) => res.send('loaderio-7bf4d5f38ce86532dc53d085672f654b'))
