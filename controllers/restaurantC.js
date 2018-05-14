var path = require('path');
var mysql = require('mysql')
var math = require('mathjs');
var db = mysql.createConnection(process.env.JAWSDB_URL);


exports.pagina_principal = function(req, res) 
{
   return res.render(path.resolve()+'/views/paginaInicio.ejs')
};


exports.nearby = function(req, res) 
{
      function forit(rawdata)
      {
        var rats = []
        return new Promise(function(result,reject)
        {
          if(rawdata && rawdata.length)
          {
            for (var i = 0; i < rawdata.length; i++) 
            {
                rats.push(rawdata[i].rating);
            }
            return result(rats);
          }
          else
          {return result(null)}
        })
      };
    function mkJson(ar)
      {
        return new Promise(function(result,reject)
        {
          if(ar && ar.length)
          {
            var tojson = {count:ar.length,avg:math.mean(ar),std:math.std(ar)};
            return result(JSON.stringify(tojson));
          }
          else
          {
            var tojson = {count:0,avg:0,std:0};
            return result(JSON.stringify(tojson));
          }
        })
      };
    query = "SELECT rating, (6371000 * acos (cos ( radians(" + 
                            req.query.latitude +
                             ") )* cos( radians( lat ) ) * cos( radians( lng ) - radians(" +
                            req.query.longitude +
                             ") ) + sin ( radians(" +
                            req.query.latitude +
                            ") )* sin( radians( lat ) ))) AS distance FROM Restaurants HAVING distance <=" +
                            req.query.radius +
                            " ORDER BY distance"
    db.query(query,function(errorQ,resultQ,fieldsQ)
    {
        if (errorQ) throw errorQ;
        forit(resultQ).
        then(function(a){mkJson(a).
        then(function(b){return console.log(b)})});
    });
};

exports.create = function(req, res) 
{
    db.query("INSERT into Restaurants (id,rating,name,site,email,phone,street,city,state,lat,lng) VALUES ?",[[[req.body.id,req.body.rating,req.body.name,req.body.site,req.body.email,req.body.phone,req.body.street,req.body.city,req.body.state,req.body.lat,req.body.lng]]], function (errorR, resultR, fieldsR) 
    {
      if (errorR) throw errorR;
      return console.log("Nuevo restaurant creado");
    });
};

exports.update = function(req,res)
{
  function queryUpdate()
  {
    return new Promise(function(result,reject)
    {
      if(Object.keys(req.body).length> 1)
      {
        var query = "UPDATE Restaurants SET "
        for (var key in req.body) 
        {
          query += key + " = " + "'" + req.body[key] + "',"
        }
        query = query.substring(0,query.length-1)
        query += " WHERE id = " + "'" + req.params.id + "'";
        return result(query);
      }
      else
      {return result(null)}
    })
  }
  queryUpdate().
  then(function(a)
  {
    if(a)
    {
      db.query(a,function(errorU,resultU,fieldsU)
      {
        if(errorU) throw errorU;
        return console.log("Actualizado");
      });
    }
    else
    {return console.log("Sin cambios")}
  });
};

exports.delete = function(req,res)
{
    db.query("DELETE FROM Restaurants WHERE id=?",[[[req.params.id]]],function(errorD,resultD,fieldsD)
    {
        if (errorD) throw errorD;
        return console.log("Borrado con éxito");
    });

};