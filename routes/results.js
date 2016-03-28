var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");


router.get('/', function(req, res, next) {
    var searchString = req.query.text
    var rootPath = "./Colenso/"
    client.execute(
        "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
        " (//" + searchString + ")[position() = (1 to 10)]\n",
        function (error, result) {
            if(error){ console.error(error);}
            else {

                //console.log(Object.getOwnPropertyNames(result))
                //console.log(typeof result.result)
                var stuff = result.result
                stuff = stuff.split("\n")
                client.execute(
                    "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';"+
                    "for $n in (//p)[position() = 1 to 10]\n" +
                    "return db:path($n)",
                    function (error, result){
                        if(error){ console.error(error);}
                        else{
                            //console.log(result.result)
                            //console.log('got here')
                            var docPaths = result.result
                            docPaths = docPaths.split("\n")
                            res.render('results', {
                                title: 'Colenso Project Search Results',
                                query: stuff,
                                searchString: searchString,
                                rootPath: rootPath,
                                docPaths: docPaths
                            });
                        }
                    }
                )
            }
        }
    );
  //res.render('results', { title: 'Colenso Project Search Results'});
});

module.exports = router;