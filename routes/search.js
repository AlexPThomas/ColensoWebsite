var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.originalUrl);
  res.render('search', { title: 'Colenso Project Search'});
});

module.exports = router;
