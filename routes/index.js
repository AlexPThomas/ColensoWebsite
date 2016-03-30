var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

/* GET home page. */
router.get("/",function(req,res){
    console.log(req.originalUrl);
    client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
        " (//name[@type='place'])[1] ",
        function (error, result) {
            if(error){ console.error(error);}
            else {
                res.render('index', { title: 'Colenso Project Home', place: result.result });
            }
        }
  );
});

router.get("/download",function(req,res){
    var rootPath = "./Colenso/";
    var docPath = req.query.path;

    client.execute(
        "XQUERY doc('" + rootPath + docPath + "')",
        function (error, result){
            if(error){ console.error(error);}
            else{
                res.download('../../' + rootPath + docPath);
            }
        }
    )
})

module.exports = router;
