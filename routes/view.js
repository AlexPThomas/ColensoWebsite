var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

router.get('/', function(req, res, next) {
    var rootPath = "./Colenso/"
    var docPath = req.query.path
    var viewTEI = req.query.tei
    console.log(docPath)
    client.execute(
        "XQUERY doc('" + rootPath + docPath + "')",
        function (error, result){
            if(error){ console.error(error);}
            else{
                res.render('view', {
                    title: 'Colenso Project view',
                    document:result.result,
                    docPath:docPath,
                    viewTEI:viewTEI
                });
            }
        }
    )

});

module.exports = router;
