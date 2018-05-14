var path = require('path');
var db = require(path.resolve()+'/db');
var math = require('mathjs');

exports.pagina_principal = function(req, res) 
{
   return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:null})
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
    db.get().query(query,function(errorQ,resultQ,fieldsQ)
    {
        if (errorQ) return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:errorQ});
        forit(resultQ).
        then(function(a){mkJson(a).
        then(function(b){return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:b})})});
    });
};

exports.create = function(req, res) 
{   
    db.get().query("INSERT into Restaurants (id,rating,name,site,email,phone,street,city,state,lat,lng) VALUES ?",[[[req.body.id,req.body.rating,req.body.name,req.body.site,req.body.email,req.body.phone,req.body.street,req.body.city,req.body.state,req.body.lat,req.body.lng]]], function (errorR, resultR, fieldsR) 
    {
      if (errorR) return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:errorR});
      return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:"Nuevo restaurant creado"});
    });
};

exports.update = function(req,res)
{
  function queryUpdate()
  {
    return new Promise(function(result,reject)
    {
      if(Object.keys(req.body).length)
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
      db.get().query(a,function(errorU,resultU,fieldsU)
      {
        if(errorU) return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:errorU});
        return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:"Actualizado"});
      });
    }
    else
    {return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:"Sin cambios"});}
  });
};

exports.delete = function(req,res)
{
    db.get().query("DELETE FROM Restaurants WHERE id=?",[[[req.params.id]]],function(errorD,resultD,fieldsD)
    {
        if (errorD) return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:D});
        return res.render(path.resolve()+'/views/paginaInicio.ejs',{abc:"Borrado con éxito"});
    });

};