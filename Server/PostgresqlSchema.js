const Pool = require('pg').Pool;

const overviewSchema = "myschema";

var pgSchemas = [];

const postgresRole = 'jamesplier';

const pool = new Pool({
  user: postgresRole,
  host: 'localhost',
  database: 'SDCOverview'
  password: '',
  port: '5432',

})

const schemaCodes = {
  "25007": "schema_and_data_statement_mixing_not_supported",
  "3F000": "invalid_schema_name",
  "42P06": "duplicate_schema",
  "42P15": "invalid_schema_definition",
  "42000": "syntax_error_or_access_rule_violation",
  "42601": "syntax_error"
};

// SELECT all of the postgres databases schema names
async function schemaFuncs() {
  let selectSchemasSql = 'SELECT schema_name FROM information_schema.schemata;'
  await Pool.query(selectSchemasSql, (err, res) => {
    console.log('\nselectSchemasSql:', selectSchemasSql)
   // log errors
    if (err) {
      console.log("SELECT schema_name:", schemaCodes[err.code])
      console.log("ERROR code:", err.code)
    }

    else if (res.rows !== undefined) {
      res.rows.forEach(row => {
        pgSchemas.push(row.schema_name)
      })
      console.log("schema names:", pgSchemas)
      console.log("SELECT schema_name total schemas:", res.rowCount);
    }

    let createSql = `CREATE SCHEMA IF NOT EXISTS ${overviewSchema} AUTHORIZATION ${postgresRole};`

    console.log('\ncreateSql:', createSql)
    await pool.query(createSql, (createErr, createRes) => {
      if (createErr) {
        console.log("CREATE SCHEMA ERROR:", createErr.code, "--", schemaCodes[createErr.code])
        console.log("ERROR code:", createErr.code)
        console.log("ERROR detail:", createErr.detail)
      }
      if (createRes) {
        console.log("\nCREATE SCHEMA RESULT", createRes.command)

        let createProductsTable = `CREATE TABLE ${overviewSchema}.product(
          product_id INT GENERATED ALWAYS AS IDENTITY,
          description VARCHAR (255),
          name VARCHAR (50)
          category VARCHAR (255)
          default_price VARCHAR(255)
          PRIMARY KEY(product_id)
        );`

        let createFeaturesJoinTable = `CREATE TABLE ${overviewSchema}.features(
          feature_id INT GENERATED ALWAYS AS IDENTITY
          product_id INT
          FOREIGN KEY(product_id)
            REFERENCES product(product_id)
        );`

        let createFeatureTable = `CREATE TABLE ${overviewSchema}.feature(
          value INT
          feature VARCHAR(255)
          feature_id INT
          FOREIGN KEY(feature_id)
            REFERENCES features(feature_id)
        );`

        let createRelatedTable = `CREATE TABLE ${overviewSchema}.related(
          id INT GENERATED ALWAYS AS IDENTITY
          related_id_list INT ARRAY
          product_id
          FOREIGN KEY(product_id)
            REFERENCES product(product_id)
       );`

       let createStyleTable = `CREATE TABLE ${overviewSchema}.style(
        style_id INT GENERATED ALWAYS AS IDENTITY
        product_id INT
        name VARCHAR(255)
        original_price VARCHAR(255)
        sale_price VARCHAR(255)
        default? BOOLEAN
        FOREIGN KEY(product_id)
          REFERENCES product(product_id)
       );`

       let createSkuTable = `CREATE TABLE ${overviewSchema}.sku(
         style_id INT
         number JSON
         FOREIGN KEY(style_id)
           REFERENCES style(style_id)
         );`

      let createPhotosTable = `CREATE TABLE ${overviewSchema}.photo(
        style_id INT
        thumnail_url VARCHAR(255)
        url VARCHAR(255)
        FOREIGN KEY(style_id)
          REFERENCES style(style_id)
      )`

      }
    })
  })
}