const express = require("express");
const mysql = require("mysql2");
const app = express();

const cors = require("cors");
// add comments
var pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  password: "1qaz@WSX",
  database: "taxonomy",
});

pool.getConnection(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

// pool.end(function(err) {
//     if (err) {
//       return console.log(err.message);
//     }
//     // close all connections
//   });

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", async (req, res) => {
  let sql = `SELECT * FROM nodes limit 50`;
  pool.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.send(results);
  });

  //   res.send("Hello World!!");
});

app.get("/:id", (req, res) => {
  let id = req.params.id;
  let sql = `SELECT * FROM nodes where tax_id = ${id} limit 5`;
  pool.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.send(results);
  });

  //   res.send("Hello World!!");
});

app.get("/taxonomy_parent/:id", (req, res) => {
  let id = req.params.id;
  let sql = `SELECT * FROM taxonomy.nodes where parent_tax_id = ${id}`;

  pool.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    res.send(results);
  });
});

app.post("/", (req, res) => {
  //   res.send(req.body.name);

  let id = req.body.id;

  let sql = `SELECT name_txt FROM taxonomy.tax_names 
  where tax_id = ${id} and name_class = 'scientific name';`;

  pool.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }

    res.setHeader("Access-Control-Allow-Origin", "*").send(results);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
