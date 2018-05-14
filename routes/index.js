var express = require('express');
var router = express.Router();
var path = require('path');

var control = require(path.resolve()+'/controllers/restaurantC');

router.get('/', control.pagina_principal);
router.get('/restaurants/statistics?', control.nearby);

module.exports = router;
