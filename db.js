var mysql = require('mysql')

var con
exports.connect = function(done)
  {
      con = mysql.createConnection(process.env.JAWSDB_URL)
      done()
      con.connect();

    con.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
      if (err) throw err;

      console.log('The solution is: ', rows[0].solution);
    });
   }

 exports.get = function()
 {
    return con;
 }
