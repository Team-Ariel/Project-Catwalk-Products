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
  let query = `SELECT * FROM myschema.product LIMIT ${count} OFFSET (${page} - 1) * ${count}`
  return pool.query(query)
}

const getProduct = (productId) => {
  return pool.query(`SELECT * FROM myschema.product WHERE id=${productId}`)
}

const getFeatures = (productId) => {
  return pool.query(`SELECT feature.value, feature.feature FROM myschema.feature WHERE product_id=${productId}`)
}

const getStyles = (productId) => {
  return pool.query(`SELECT row_to_json(style) AS results
  FROM (
    SELECT a.style_id,
    a.name,
    (SELECT json_agg(photo)
      FROM (
      SELECT photo.url, photo.thumbnail_url FROM myschema.photo WHERE photo.styleId=a.style_id)
    photo) AS photos,

   (SELECT json_object_agg(
     s.id, (SELECT json_build_object('quantity', quantity, 'size', size)
     FROM myschema.sku WHERE myschema.sku.styleId = a.style_id LIMIT 1)
   ) skus
   FROM myschema.sku s WHERE s.styleId=a.style_id)
   FROM myschema.styles AS a)
    style WHERE style_id=1;`);
}


const getRelated = (productId) => {
  return pool.query(`SELECT related_product_id FROM myschema.related WHERE current_product_id=${productId}`)
}


module.exports = {
  getProducts: getProducts,
  getProduct: getProduct,
  getFeatures: getFeatures,
  getStyles: getStyles,
  getRelated: getRelated
}

