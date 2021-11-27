const Pool = require('pg').Pool;

const overviewSchema = "myschema";

var pgSchemas = [];

const postgresRole = 'jamesplier';

const pool = new Pool({
  user: postgresRole,
  host: 'localhost',
  database: 'SDCOverview',
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
 function schemaFuncs() {
  let selectSchemasSql = 'SELECT schema_name FROM information_schema.schemata;'
    pool.query(selectSchemasSql)
    .then((result) => {
    if (result.rows !== undefined) {
      result.rows.forEach(row => {
        pgSchemas.push(row.schema_name)
      })
      console.log("schema names:", pgSchemas)
      console.log("SELECT schema_name total schemas:", result.rowCount);
    }

    let createSql = `CREATE SCHEMA IF NOT EXISTS ${overviewSchema} AUTHORIZATION ${postgresRole};`

    console.log('\ncreateSql:', createSql)



   pool.query(createSql, (createErr, createRes) => {
      if (createErr) {
        console.log("CREATE SCHEMA ERROR:", createErr.code, "--", schemaCodes[createErr.code])
        console.log("ERROR code:", createErr.code)
        console.log("ERROR detail:", createErr.detail)
      }
      if (createRes) {
        console.log("\nCREATE SCHEMA RESULT", createRes.command)

        let createProductsTable = `CREATE TABLE IF NOT EXISTS ${overviewSchema}.product(
          id INT GENERATED ALWAYS AS IDENTITY,
          slogan VARCHAR(255),
          description VARCHAR (255),
          name VARCHAR (50),
          category VARCHAR (255),
          default_price VARCHAR(255),
          PRIMARY KEY(id)
        );`

        let createFeaturesJoinTable = `CREATE TABLE IF NOT EXISTS ${overviewSchema}.features(
          feature_id INT GENERATED ALWAYS AS IDENTITY,
          id INT,
          PRIMARY KEY(feature_id),
          FOREIGN KEY(id)
            REFERENCES myschema.product(id)
        );`

        let createFeatureTable = `CREATE TABLE IF NOT EXISTS ${overviewSchema}.feature(
          value INT,
          feature VARCHAR(255),
          feature_id INT,
          FOREIGN KEY(feature_id)
            REFERENCES myschema.features(feature_id)
        );`

        let createRelatedTable = `CREATE TABLE IF NOT EXISTS ${overviewSchema}.related(
          related_id INT GENERATED ALWAYS AS IDENTITY,
          related_id_list INT ARRAY,
          id INT,
          FOREIGN KEY(id)
          REFERENCES myschema.product(id)
       );`


       let createStyleTable = `CREATE TABLE IF NOT EXISTS ${overviewSchema}.styles(
        style_id INT GENERATED ALWAYS AS IDENTITY,
        id INT,
        name VARCHAR(255),
        original_price VARCHAR(255),
        sale_price VARCHAR(255),
        default_style BOOLEAN,
        PRIMARY KEY(style_id),
        FOREIGN KEY(id)
        REFERENCES myschema.product(id)
       );`

       let createSkuTable = `CREATE TABLE IF NOT EXISTS sku(
         id INT, 
         styleId INT,
         size VARCHAR(50),
         quantity int,
         FOREIGN KEY(styleId)
         REFERENCES myschema.styles(style_id)
         );`

      let createPhotosTable = `CREATE TABLE IF NOT EXISTS ${overviewSchema}.photo(
        style_id INT,
        thumnail_url VARCHAR(255),
        url VARCHAR(255),
        FOREIGN KEY(style_id)
        REFERENCES myschema.styles(style_id)
      );`

      console.log("\ncreateTableSql", createProductsTable, createPhotosTable, createFeaturesJoinTable, createStyleTable, createSkuTable, createFeatureTable)

      pool.query(createProductsTable, (err, res) => {
        if (err) {
          console.log("CREATE TABLE ERROR:", err.code, "--", schemaCodes[err.code]);
          console.log("createTablesql:", err)
        }

        if (res) {
          console.log("\nCREATE TABLE RESULT:", res)
        }
      })

      pool.query(createFeaturesJoinTable, (err, res) => {
        if (err) {
          console.log("CREATE TABLE ERROR:", err.code, "--", schemaCodes[err.code]);
          console.log("createTablesql:", err)
        }

        if (res) {
          console.log("\nCREATE TABLE RESULT:", res)
        }
      })
      pool.query(createFeatureTable, (err, res) => {
        if (err) {
          console.log("CREATE TABLE ERROR:", err.code, "--", schemaCodes[err.code]);
          console.log("createTablesql:", err)
        }

        if (res) {
          console.log("\nCREATE TABLE RESULT:", res)
        }
      })
      pool.query(createPhotosTable, (err, res) => {
        if (err) {
          console.log("CREATE TABLE ERROR:", err.code, "--", schemaCodes[err.code]);
          console.log("createTablesql:", err)
        }

        if (res) {
          console.log("\nCREATE TABLE RESULT:", res)
        }
      })
      pool.query(createStyleTable, (err, res) => {
        if (err) {
          console.log("CREATE TABLE ERROR:", err.code, "--", schemaCodes[err.code]);
          console.log("createTablesql:", err)
        }

        if (res) {
          console.log("\nCREATE TABLE RESULT:", res)
        }
      })
      pool.query(createSkuTable, (err, res) => {
        if (err) {
          console.log("CREATE TABLE ERROR:", err.code, "--", schemaCodes[err.code]);
          console.log("createTablesql:", err)
        }

        if (res) {
          console.log("\nCREATE TABLE RESULT:", res)
        }
      })



      }
    })
  })
  .catch((err) => {console.log("SELECT schema_name:", schemaCodes[err.code])
  console.log("ERROR code:", err.code)})
}

schemaFuncs();