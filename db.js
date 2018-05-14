var mysql = require('mysql')

exports.connect = function(done)
  {
      var con = mysql.createConnection(process.env.JAWSDB_URL)
      done()
   }

 exports.get = function()
 {
    return con;
 }
