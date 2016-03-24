var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.originalUrl);
  res.render('results', { title: 'Colenso Project Search Results'});
});

module.exports = router;
