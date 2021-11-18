const routeMethods = require('../DB/routes.js');



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

const getStyles = (productId, callback) => {
  routeMethods.getStyles(productId)
  .then((result) => {
    let rows = result.rows
    let dataObject = {
      product_id: productId,
      results: []

    }
    result.rows.forEach((style, index) => {
      routeMethods.getPhotos(style.style_id)
      .then((result) => {
        style.photos = result.rows;
        routeMethods.getSkus(style.style_id)
        .then((result) => {
          let skus = {}
          result.rows.forEach((sku) => {
            skus[sku.styleid] = {
              quantity: sku.quantity,
              size: sku.size
            }
          })
          style.skus = skus;
          dataObject.results.push(style);
           if (index === rows.length -1) {
             callback(null, dataObject);
           }
        })
        .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    })
  })
  .catch((err) => {
    console.log(err);
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