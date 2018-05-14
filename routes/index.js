var express = require('express');
var router = express.Router();
var path = require('path');

var control = require(path.resolve()+'/controllers/restaurantC');

//Retrieve the main page
router.get('/', control.pagina_principal);
//Retrieve JSON
router.get('/restaurants/statistics?', control.nearby);
//Create a new restaurant
router.post('/restaurants', control.create);
// Update a restaurant with id
router.put('/restaurants/:id', control.update);
// Delete a restaurant with id
router.delete('/restaurants/:id', control.delete);

module.exports = router;
