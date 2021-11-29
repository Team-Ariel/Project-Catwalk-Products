const express = require('express');
const app = express();
const axios = require('axios');

const servers = [
  'http://localhost:3002',
  'http://localhost:3001'
]

let currentServer = 1;


app.get('*', (req, res) => {
  let params = {
    method: 'get',
    headers: req.headers,
    data: req.body,

  }
  if (currentServer === 1) {
    axios(`${servers[1]}`, params)
    .then((results) => {
      currentServer = 0;
      res.status(200).send(results);
    })
    .catch((err) => res.status(404).send(err))
  } else {
    axios(`${servers[0]}`, params)
    .then((results) => {
      currentServer = 1;
      res.status(200).send(results);
    })
    .catch((err) => res.status(404).send(err))
  }


})

app.listen(3000, err => {
  err ?
  console.log("Failed to connect on port 3000") :
  console.log("listening on port 3000")
})