const mysql = require("mysql");

const dbsetup = {
  host: "localhost",
  user: "root",
  password: "Mkr@5htgi",
  database: "firstdb",
};

const connection = mysql.createConnection(dbsetup);

module.exports = {
  connect: () => {
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
      }
      console.log("Connected to MySQL database!");
    });
  },
  query: (sql, values, callback) => {
    connection.query(sql, values, (error, results, fields) => {
      if (error) throw error;
      callback(results);
    });
  },
  disconnect: () => {
    connection.end((err) => {
      if (err) {
        console.error("Error closing MySQL connection:", err);
        return;
      }
      console.log("MySQL connection closed.");
    });
  },
};
