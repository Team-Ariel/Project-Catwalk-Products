const routeMethods = require('../DB/routes.js');
const pool = require('pg').Pool;



const getProductsAndFormat = (params, callback) => {
  routeMethods.getProducts(params)
  .then((result) => {
    callback(null, result.rows);
  })
  .catch((err) => {
    console.log(err);
    callback(err, null)
  })
}

const getSingleProductAndFeatures = (productId, callback) => {
  routeMethods.getProduct(productId)
  .then((result) => {
     let response = result.rows[0]
     routeMethods.getFeatures(productId)
     .then((result) => {
       response.features = result.rows;
       callback(null, response);
     })
     .catch((err) => {
       console.log(err);
       callback(err, null);
     })
  })
  .catch((err) => {
    console.log(err);
    callback(err, null);
  })
}


module.exports = {
  getProductsAndFormat: getProductsAndFormat,
  getSingleProductAndFeatures: getSingleProductAndFeatures
}