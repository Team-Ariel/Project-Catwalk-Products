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
  pool.connect()
  return pool.query(query)
}

const getProduct = (productId) => {
  pool.connect()
  // return pool.query(`SELECT
  // product.id,
  // product.slogan,
  // product.description,
  // product.name,
  // product.category,
  // product.default_price,
  // feature.value,
  // feature.feature
  // FROM myschema.product RIGHT JOIN myschema.feature ON myschema.feature.product_id=myschema.product.id WHERE myschema.product.id=${productId};`)
  return pool.query(`SELECT * FROM myschema.product WHERE id=${productId}`)
}

const getFeatures = (productId) => {
  pool.connect()
  return pool.query(`SELECT feature.value, feature.feature FROM myschema.feature WHERE product_id=${productId}`)
}

module.exports = {
  getProducts: getProducts,
  getProduct: getProduct,
  getFeatures: getFeatures
}

