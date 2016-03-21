var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('statistics', { title: 'Colenso Project Statistics'});
});

module.exports = router;
