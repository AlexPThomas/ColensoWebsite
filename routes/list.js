var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

/* GET home page. */
router.get("/",function(req,res){
    console.log(req.originalUrl);
    client.execute(
        "XQUERY for $n in file:list('Colenso')" +
        "for $i in file:list(concat('Colenso\\',$n))"+
        "for $p in file:list(concat('Colenso\\',$n,$i))"+
        "return concat($n,$i,$p)",
        function (error, result) {
            if(error){ console.error(error);}
            else {

                var results = result.result
                results = results.split("\n")
                var count = req.query.count;
                if(count == undefined || count == "" || parseInt(count) > results.length){
                    count = 0;
                }
                count = parseInt(count)
                var count2 = count+10
                if(count2 > results.length){
                    count2 = results.length;
                }
                results = results.slice(count,count2)
                console.log(results)
                res.render('list', {
                    title: 'Colenso Project List',
                    results: results,
                    count: count
                });
            }
        }
  );
});


module.exports = router;
