var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

router.get('/', function(req, res, next) {
    client.execute(
        "XQUERY declare namespace tei='http://www.tei-c.org/ns/1.0'; " +
        "for $n in (collection('Colenso/Hooker/')//tei:p[position() = 1])\n" +
        "return db:path($n)",
        function(err,result) {
            if(err){ console.error(err);}
            if(!err){
                console.log(result.result)
                var results = result.result
                results = results.split('\n')

                client.execute(
                    "XQUERY doc('./Colenso/"+results[0]+"')",
                    function(error,resu){
                        if(error){ console.error(error);}
                        if(!err){
                            var items = resu.result
                            res.render('statistics', { title: 'Colenso Project Statistics',thing:items});
                        }
                    }
                )
            }
        }
    )


});

module.exports = router;
