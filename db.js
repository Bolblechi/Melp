var mysql = require('mysql')

var con

exports.connect = function(done)
  {
      con = mysql.createPool(process.env.JAWSDB_URL)
      done()
   }

 exports.get = function()
 {
    return con;
 }
