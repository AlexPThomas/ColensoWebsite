var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

router.get('/', function(req, res, next) {
    var searchString = req.query.text;
    var containsText = ' . contains text '

    console.log(searchString)
    client.execute(
        "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
        "for $n in .//TEI[. contains text "+searchString+"]\n"+
        " return db:path($n)",
        function (error, result){
            if(error){
                console.error(error);
            }
            else{
                var results = result.result
                results = results.split('\n')
                var resultCount = results.length
                res.render('stringResults', {
                    title: 'Colenso Project Search Text',
                    results:results,
                    resultCount:resultCount,
                    searchString:searchString
                });
            }
        }

    )
});

module.exports = router;
