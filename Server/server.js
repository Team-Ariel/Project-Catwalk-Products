const express = require('express');
const controller = require('./controller.js');
const app = express()
const port = 3000
const db = require('../DB/routes.js')


app.listen(port, () => {
  console.log(`Listening on ${port}`)
})


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

app.get('/loaderio-9fa3024019b84de063f423e7625ca8ba.txt', (req, res) => res.download('./Server/public/loaderio-9fa3024019b84de063f423e7625ca8ba.txt'))
