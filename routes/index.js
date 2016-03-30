var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

/* GET home page. */
router.get("/",function(req,res){
    res.render('index', { title: 'Colenso Project Home' });
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

router.get("/add",function(req,res){
    if(req.query.path === undefined || req.query.text === undefined){
        console.log('here')
        res.render('add',{
            title: 'Colenso Project Home',
            fileSelected:'false'
        });
    }else{
        console.log('over here')
        console.log(typeof req.query.filePath);
        console.log("\n\n" + req.query.text)
        var name = req.query.text;
        var path = req.query.path
        client.execute(
            "XQUERY " +
            "let $fileName := '"+name+"' "+
            "let $filePath :='"+path+"'"+
            "return (db:add('Colenso',$fileName,$filePath))",
            function(error,result){
                if(error){
                    console.error(error);
                    res.render('add',{
                        title: 'Colenso Project Home',
                        fail: true,
                        name:name
                    });
                }
                else{
                    res.render('add',{
                        title: 'Colenso Project Home',
                        success: true,
                        name:name
                    });
                }
            }

        )

    }
})
module.exports = router;
