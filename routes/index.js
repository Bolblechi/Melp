var express = require('express');
var router = express.Router();
var path = require('path');

var control = require(path.resolve()+'/controllers/restaurantC');

//Retrieve the main page
router.get('/', control.pagina_principal);
//Retrieve JSON
router.get('/restaurants/statistics?', control.nearby);
//Create a new restaurant
app.post('/restaurants', control.create);
// Update a restaurant with id
app.put('/restaurants/:id', restaurants.update);
// Delete a restaurant with id
app.delete('/restaurants/:id', restaurants.delete);

module.exports = router;
