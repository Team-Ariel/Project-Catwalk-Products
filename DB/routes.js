const Pool = require('pg').Pool;

const postgresRole = 'ubuntu';

const pool = new Pool({
  user: postgresRole,
  host: '18.119.135.173',
  database: 'sdcoverview',
  password: 'ubuntu',
  port: 5432,
})



const getProducts = (params) => {
  let page = params.page || 0;
  let count = params.count || 5;
  let offset = ((page - 1) * count)
  let totalMax = (page + 1) * count;
  let query = `SELECT p.id, p.name, p.slogan, p.description, p.category, p.default_price FROM myschema.product AS p WHERE p.id < ${totalMax} and p.id > ${offset} ORDER BY id LIMIT ${count} `
  return pool.query(query)
}

const getProduct = (productId) => {
  // return pool.query(`SELECT * FROM myschema.product WHERE id=${productId}`)
  return pool.query(`SELECT a.id, a.name, a.slogan, a.description, a.category, a.default_price, (SELECT json_agg(features) FROM (SELECT b.feature feature, b.value FROM myschema.features b WHERE b.product_id = a.id) features) AS features From myschema.product AS a WHERE id=${productId};`)
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
    style WHERE style_id=${productId};`);
}


const getRelated = (productId) => {
  return pool.query(`SELECT related_product_id FROM myschema.related WHERE current_product_id=${productId}`)
}


module.exports = {
  getProducts: getProducts,
  getProduct: getProduct,
  getStyles: getStyles,
  getRelated: getRelated
}

