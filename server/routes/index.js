var express = require('express');
var router = express.Router();
var SwiftParser = require('swift-parser').SwiftParser;
var fs = require('fs');
con = require('../connectDb'); 
const axios = require('axios');


/* GET home page. */
router.get('/', function(req, res, next) {
res.redirect('/search');
});

router.get('/match',function(req,res,next)
{

    var regq =  "select * from mt300 where S82A = 'SOGEFRPPHCM'";
    console.log("Query : "+regq);
    con.query(regq, function (err, result, fields) {
        if (err) {
            console.log("Error!!! Query");
        } else {
            // res.send(JSON.stringify(result))
            // console.log(result[0]['ref1'])

            axios.get('http://localhost:3000/check', {
                params: {
                  ref1: result[0]['S82A'],
                  ref2 : result[0]['S87A'],
                  isda : result[0]['S77H'],
                  cdate : result[0]['S30T'],
                  vdate : result[0]['S30V'],
                  edate : result[0]['36'],
                  vbuy  : result[0]['S32B'],
                  im1   : result[0]['S562'],
                  set1   : result[0]['S572'],
                  ben1   : result[0]['S582'],
                  im2   : result[0]['S563'],
                  set2  : result[0]['S573'],
                  ben2  : result[0]['S583'],
                  status : result[0]['STATUS']

                }
              })
              .then(function (response) {
                console.log(response);
                res.send("Comp")
              })
              .catch(function (error) {
                console.log(error);
              }); 
        }
    });


});

router.get('/rebuild',function(req,res,next)
{

}
);


router.get('/check',function(req,res,next)
{
    var partyB = req.query.ref1;
    var partyA = req.query.ref2;
    var isda = req.query.isda;
    var cdate = req.query.cdate;
    var vdate = req.query.vdate;
    var edate = req.query.edate;
    var vbuy = req.query.vbuy;
    var im1 = req.query.im1;
    var set1= req.query.set1;
    var ben1 = req.query.ben1;
    var im2 = req.query.im2;
    var set2 = req.query.set2;
    var ben2 = req.query.ben2;

    var regq =  "select * from mt300 where S87A = '"+ partyB +"' and S82A =' " + partyA + "' and S77H ='"+ isda +"' and S30T ='"+ cdate +"' and S30V = '" + vdate +"' and S36 = '" + edate +"' and S33B = '"+ vbuy +"' and S563 ='"+ im1 + "' and S573='"+ set1+"' ";
    

            con.query(regq, function (err, result, fields) {
                if (err) {
                    console.log("Error!!! Query");
                } else {
                    
                    if (result.length > 0) {
                        console.log(result[0]);
                        res.send("MATCHED")
        
                       }
                       else {
                           res.send("NOT MATCHED");

                       }
            }
        });



});




router.get('/search',function(req,res,next)
{
    var regq = "select * from mt300";
    con.query(regq, function (err, result, fields) {
        if (err) {
            console.log("Error!!! Query");
        } else {
         res.render('search',{doc : result});
        // res.send(result);

        }
    });
}
);


router.get('/parse', function(req, res, next) {
  var filepath = req.query.fpath;

  console.log(filepath)

  fs.readFile(filepath, 'utf8', function(err, contents) {
    
    var mt300 ={};

    var lines = contents.split("\n");
      var fl = lines[0].replace(/^{+/, '');
      var s= fl.split(":")
      mt300['ref1'] = s[1].slice(0, -3);
      mt300['ref2'] = s[2].slice(0, -3);

    for (var i = 1; i < lines.length-1; i++) {
        lines[i] = lines[i].replace(/^:+/, '');
        var s= lines[i].split(":")
        console.log(s)
        if(s[0]=="32B")
        {
            break;
        }
        else
        {
        mt300[s[0]]=s[1];
        }
    }

    if(s[0]=="32B")
    {
        var a={}
        a[s[0]]=s[1];
        i++;
        lines[i] = lines[i].replace(/^:+/, '');
        s= lines[i].split(":")
        while(s[0]!="33B")
        {
        a[s[0]]=s[1];
        i++;
        lines[i] = lines[i].replace(/^:+/, '');
        s= lines[i].split(":")

        }
        mt300["32B"]=a;
        
    }

    if(s[0]=="33B")
    {
        var b={}
        b[s[0]]=s[1];
        i++;
        lines[i] = lines[i].replace(/^:+/, '');
        s= lines[i].split(":")
        while(s[0]=="53A" || s[0]=="56" || s[0]=="57D" || s[0]=="58A")
        {
        b[s[0]]=s[1];
        i++;
        lines[i] = lines[i].replace(/^:+/, '');
        s= lines[i].split(":")
        }
        mt300["33B"]=b;
        
    }

    while( i < lines.length-1) {
        lines[i] = lines[i].replace(/^:+/, '');
        var s= lines[i].split(":")
        mt300[s[0]]=s[1];
        i++;
    }
    // console.log(mt300);
    res.send(JSON.stringify(mt300)); 
    var ref1 = mt300['ref1'] || "NULL" ;
    var ref2 = mt300['ref2'] || "NULL" ;  
    var m20 =  mt300['20'] || "NULL" ; 
    var m22A = mt300['22A'] || "NULL";
    var m52A = mt300['52A'] || "NULL";
    var m22C = mt300['22C'] || "NULL" ;
    var m94A = mt300['94A'] || "NULL" ;
    var m82A = mt300['82A'] || "NULL" ;
    var m87A = mt300['87A'] || "NULL";
    var m77H = mt300['77H'] || "NULL" ;
    var m30T = mt300['30T'] || "NULL" ;
    var m87A = mt300['87A'] || "NULL" ;
    var m30V = mt300['30V'] || "NULL" ;
    var m36 = mt300['36'] || "NULL" ;
    var m32B = mt300['32B']['32B'] || "NULL";
    var m532 =  mt300['32B']['53A'] || "NULL" ;
    var m562 =  mt300['32B']['56A'] || "NULL";
    var m572 =  mt300['32B']['57A'] || "NULL";
    var m582 =  mt300['32B']['58A'] || "NULL";

    var m33B = mt300['33B']['33B'] || "NULL";
    var m533 =  mt300['33B']['53A'] || "NULL";
    var m563 =  mt300['33B']['56D'] || mt300['33B']['56A']
    var m573 =  mt300['33B']['57D'] || mt300['33B']['57A']
    var m583 =  mt300['33B']['58D'] || mt300['33B']['58A']
    var m72 =  mt300['72'] || "NULL" ;
                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                           
    var regq=  "insert into mt300(ref1,ref2,S20,S22A,S22C,S94A,S82A,S87A,S77H,S30T,S30V,S36,S32B,S532,S562,S572,S582,S33B,S533,S563,S573,S583,S72) values('" + ref1  + "','" + ref2 + "','" + m20 + "','" + m22A  + "','" + m22C + "','" + m94A + "','" + m82A  + "','" + m87A  + "','" + m77H  + "','" + m30T + "','"  + m30V + "','" + m36  + "','"  + m32B + "','" + m532 + "','"  + m562 + "','"  + m572 + "','"  +  m582 + "','"  + m33B + "','"  + m533 + "','"  + m563 + "','" + m573 + "','"  + m583 + "','"  + m72 +"')";

    console.log("Query : "+regq);
    con.query(regq, function (err, result, fields) {
        if (err) {
            console.log("Error!!! Query");
        } else {
         console.log("Success")
        }
    });

});

  
});




module.exports = router;
