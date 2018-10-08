var http = require("http");
var path = require("path");
var hostName = "https://192.168.68.40";
var port = 8442;

let requestApi = require('./server/modules/request');

var express = require("express");
var app = express();

app.use(express.static(path.join(__dirname,"dist")));

app.use("/api/v1/",function(req,res,next){
  next();
});

app.post("/oauth/token",function(req,res,next){ 
  console.log(req.body);
  //let post_data = req.body;
  //requestApi(post_data);
});

var server = http.createServer(app);

server.listen(port,function(){
  
  console.log("服务器已启动！"+server.address().port);
})