var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.route);
  res.render('statistics', { title: 'Colenso Project Statistics'});
});

module.exports = router;
