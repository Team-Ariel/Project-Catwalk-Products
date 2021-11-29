const express = require('express');
const app = express();
const axios = require('axios');

const servers = [
  'http://13.59.91.177:3000',
  'http://18.191.185.80:3000'
]

let currentServer = 0;


app.get('*', (req, res) => {
  // let params = {
  //   url: `${servers[currentServer]}${req.url}`,
  //   method: 'get',
  //   headers: req.headers,
  //   data: req.body,
  // }
  // if (currentServer === 1) {
  //   axios(params)
  //   .then((results) => {
  //     currentServer = 0;
  //     res.status(200).send(results.data);
  //   })
  //   .catch((err) => res.status(404).send(err))
  // } else {
  //   axios(params)
  //   .then((results) => {
  //     currentServer = 1;
  //     res.status(200).send(results.data);
  //   })
  //   .catch((err) => res.status(404).send(err))
  // }
  req.pipe(request({url servers[currentServer] + req.url})).pipe(res);
  cur = (cur + 1) % servers.length;


})

app.listen(3000, err => {
  err ?
  console.log("Failed to connect on port 3000") :
  console.log("listening on port 3000")
})