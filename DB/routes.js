const Pool = require('pg').Pool;

const postgresRole = 'jamesplier';

const pool = new Pool({
  user: postgresRole,
  host: 'localhost',
  database: 'SDCOverview',
  password: null,
  port: 5432,
})



const getProducts = (params) => {
  let page = params.page
  let count = params.count
  let results = page * count
  let query = `SELECT * FROM myschema.product LIMIT ${results}`
  return pool.query(query)
}

const getProduct = (productId) => {
  return pool.query(`SELECT * FROM myschema.product WHERE id=${productId}`)
}

const getFeatures = (productId) => {
  return pool.query(`SELECT feature.value, feature.feature FROM myschema.feature WHERE product_id=${productId}`)
}

const getStyles = (productId) => {
  // return pool.query(`SELECT * FROM myschema.styles INNER JOIN myschema.sku ON sku.styleid=styles.style_id INNER JOIN myschema.photo ON photo.styleid=styles.style_id WHERE styles.id=${productId};`)
  return pool.query(`SELECT * FROM myschema.styles WHERE id=${productId}`);
}

const getPhotos = (styleId) => {
  return pool.query(`SELECT * FROM myschema.photo WHERE styleid=${styleId}`)
}

const getSkus = (styleId) => {
  return pool.query(`SELECT * FROM myschema.sku WHERE id=${styleId}`)
}



module.exports = {
  getProducts: getProducts,
  getProduct: getProduct,
  getFeatures: getFeatures,
  getStyles: getStyles,
  getPhotos: getPhotos,
  getSkus: getSkus
}

