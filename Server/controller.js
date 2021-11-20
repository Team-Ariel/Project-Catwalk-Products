const routeMethods = require('../DB/routes.js');



const getProductsAndFormat = (params, callback) => {
  routeMethods.getProducts(params)
  .then((result) => {
    callback(null, result.rows);
  })
  .catch((err) => {
    callback(err, null)
  })
}

const getSingleProductAndFeatures = (productId, callback) => {
  routeMethods.getProduct(productId)
  .then((result) => {

     let response = result.rows[0]
     if (response === undefined) {
       callback('No matching product', null);
       return;
     }
     routeMethods.getFeatures(productId)
     .then((result) => {

         response.features = result.rows;

       callback(null, response);
     })
     .catch((err) => {
       callback(err, null);
     })
  })
  .catch((err) => {
    callback(err, null);
  })
}

const getStyles = (productId, callback) => {
  routeMethods.getStyles(productId)
  .then((result) => {
    result.rows[0].product_id = productId
    callback(null, result.rows[0])
  })
  .catch((err) => {
    callback(err, null);
  })

}

const getRelated = (productId, callback) => {
  routeMethods.getRelated(productId)
  .then((result) => {
    let data = [];
    result.rows.forEach(related => data.push(related.related_product_id))
    callback(null, data);

  })
  .catch((err) => {
    console.log(err);
    callback(err, null);
  })
}


module.exports = {
  getProductsAndFormat: getProductsAndFormat,
  getSingleProductAndFeatures: getSingleProductAndFeatures,
  getStyles: getStyles,
  getRelated: getRelated
}