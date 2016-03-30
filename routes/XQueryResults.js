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
        "for $n in (collection('Colenso/')"+searchString+")\n"+
        " return db:path($n)",
        function (error, result){
            if(error){
                console.error(error);
                res.render('XQueryResults',{
                    title: 'Colenso Project Search XQuery',
                    searchString:searchString,
                    failed: 'true'
                });
            }
            else{
                var results = result.result;
                results = results.split('\n');
                results = removeDuplicates(results);
                var resultCount = results.length;
                res.render('XQueryResults', {
                    title: 'Colenso Project Search XQuery',
                    results:results,
                    resultCount:resultCount,
                    searchString:searchString
                });
            }
        }

    )
});
function removeDuplicates(results){
    var newResults = [];
    for(var i = 0; i < results.length; i++){
        if(newResults.indexOf(results[i]) === -1){
            newResults.push(results[i]);
        }
    }
    return newResults;
}

module.exports = router;
