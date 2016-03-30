var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");


router.get('/', function(req, res, next) {
    var searchString = req.query.text;
    var count = req.query.count;
    var countString = "";
    if(count == undefined || count == ""){
        count = 1;
    }
    count = parseInt(count)
    countString = count.toString() + " to " + (count + 19).toString();
    var xPath = req.query.xPath;
    if(xPath == undefined || xPath == ""){
        xPath = "";
    }else if(xPath[0] == "["){
        xPath = xPath;
    }else{
        xPath = "[" + xPath + "]";
    }
    var rootPath = "./Colenso/";
    client.execute(
        "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
        " for $n in (//" + searchString + xPath + ")[position() =(" + countString+")]\n"+
        "return $n\n",

        function (error, result) {
            if(error){
                console.error(error);
                res.render('results',{
                    title: 'Colenso Project Search Results',
                    xPath: xPath,
                    searchString: searchString,
                    failed: 'true'
                })
            }
            else {
                var stuff = result.result;
                stuff = stuff.substring(1 + searchString.length,stuff.length);
                stuff = stuff.split("<" + searchString);
                for(var i = 0; i < stuff.length;i++){
                    stuff[i] = "<" + searchString + stuff[i];
                }
                client.execute(
                    "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';"+
                    "for $n in (//" + searchString + xPath + ")[position() = (" + countString+")]\n" +
                    "return db:path($n)",
                    function (error, result){
                        if(error){
                            console.error(error);
                            res.render('results',{
                                title: 'Colenso Project Search Tags',
                                xPath: xPath,
                                searchString: searchString,
                                failed: 'true'
                            });
                        }
                        else{
                            client.execute(
                                "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';"+
                                "for $n in (//" + searchString + xPath + ")\n" +
                                "return db:path($n)",
                                function (error, result){
                                    if(error){
                                        console.error(error);
                                    }else{
                                        var results = result.result;
                                        results = results.split('\n');
                                        resultAmount = results.length
                                        var docPaths = result.result;
                                        docPaths = docPaths.split("\n");
                                        res.render('results', {
                                            title: 'Colenso Project Search Tags',
                                            query: stuff,
                                            searchString: searchString,
                                            rootPath: rootPath,
                                            docPaths: docPaths,
                                            xPath: xPath,
                                            count: count,
                                            resultAmount:resultAmount
                                        });
                                    }
                                }
                            )
                        }
                    }
                )
            }
        }
    );
});
function countResults(searchString,xPath){
    client.execute(
        "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';"+
        "for $n in (//" + searchString + xPath + ")\n" +
        "return db:path($n)",
        function (error, result){
            if(error){
                console.error(error);
            }else{
                var results = result.result;
                results = results.split('\n');
                resultAmount = results.length
            }
        }
    )
}
module.exports = router;
