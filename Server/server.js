const express = require('express');
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
  db.getProducts(req.query)
  .then((results) => {
     res.status(200).send(results.rows);
  })
})

app.get('/products/:product_id', cache(60), (req, res) => {
  db.getProduct(req.params.product_id)
  .then((results) => {
    let response = results.rows[0]
     if (response === undefined) {
       res.send('No match')
       return;
     }
     res.status(200).send(response);
  })
})

app.get('/products/:product_id/styles', cache(60), (req, res) => {
  db.getStyles(req.params.product_id)
  .then((result) => {
    result.rows[0].product_id = req.params.product_id
    res.status(200).send(result.rows[0])
  })
  .catch((err) => {
    res.status(404).send(`Error: ${err}`)
  })

})

app.get('/products/:product_id/related', cache(60), (req, res) => {
  db.getRelated(req.params.product_id)
  .then((results) => {
    let data = [];
    result.rows.forEach(related => data.push(related.related_product_id))
    res.status(200).send(data)
  })
  .catch((err) => {
    res.status(404).send(`Error: ${err}`)
  })
})

app.get('/loaderio-7bf4d5f38ce86532dc53d085672f654b.txt', (req, res) => res.send('loaderio-7bf4d5f38ce86532dc53d085672f654b'))
