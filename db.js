var mysql = require('mysql')

var con

exports.connect = function(done)
  {
      con = mysql.createPool({
      host: "localhost",
      user: "Melp",
      password: "password",
      database: "melp"
      })
      done()
   }

 exports.get = function()
 {
    return con;
 }
