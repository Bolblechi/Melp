var path = require('path');
var db = require(path.resolve()+'/db');
var math = require('mathjs');

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
    db.get().query(query,function(errorQ,resultQ,fieldsQ)
    {
        if (errorQ) throw errorQ;
        forit(resultQ).
        then(function(a){mkJson(a).
        then(function(b){return console.log(b)})});
    });
};