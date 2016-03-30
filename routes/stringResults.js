var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

router.get('/', function(req, res, next) {
    var searchString = req.query.text;
    var containsText = ' . contains text '
    var searchText = getSearchText(searchString,containsText);

    console.log(searchText)
    client.execute(
        "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
        "for $v in .//TEI["+searchText+"]\n"+
        " return db:path($v)",
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

function getSearchText(searchText,containsText){
    searchText = searchText.split('+and')
    if(searchText.constructor === Array){
        searchText = searchText.join("and+++");
    }
    searchText = searchText.split('+or')
    if(searchText.constructor === Array){
        searchText = searchText.join("or+++");
    }
    searchText = searchText.split('+++')
    if(searchText.constructor === Array){
        searchText = searchText.join(containsText)
    }
    searchText = containsText + searchText

    return searchText;
}
module.exports = router;
