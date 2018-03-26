var express = require('express')
var app = express()

app.use(express.static('public'))

app.get('/',function(req,res){
  res.sendFile(__dirname+"/"+"index.html")
})

app.get('/cars',function(req,res){
  console.log("do something here");
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
 
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log("error")
      throw err;
    }
   
    var dbo = db.db("busi_run");
    const col = dbo.collection("allbusi");
    console.log("数据库已创建1!");

    col.find({}).toArray(function(error,result){
      if(error) throw error ;
      //console.log(new Date(result[0]["SCSJ"]).getHours());
      res.send(result);
       db.close(); 
    });

   
    // db.close(); 
  });


})

app.get('/datas',function(req,res){
  console.log("do something here");
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
 
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log("error2")
      throw err;
    }
   
    var dbo = db.db("busi_run");
    const col = dbo.collection("corepnts");
    console.log("数据库已创建2!");

    col.find({}).toArray(function(error,result){
      if(error) throw error ;
      //console.log(new Date(result[0]["SCSJ"]).getHours());
      res.send(result);
       db.close(); 
    });

   
    // db.close(); 
  });


})

console.log("heiheihei")
var server = app.listen(8008, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

