var mysql = require('mysql')

var con

exports.connect = function(done)
  {
    if(process.env.JAWSDB_URL) 
    {
      con = mysql.createConnection(process.env.JAWSDB_URL);
      done()
    } 
    else 
    {
      con = mysql.createPool({
      host: "localhost",
      user: "Melp",
      password: "password",
      database: "melp"
      })
      done()
    };
      
   }

 exports.get = function()
 {
    return con;
 }
