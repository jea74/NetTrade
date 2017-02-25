var express = require("express");
var app = express();
var fs = require("fs");

app.use(express.static("."));

app.get("/nav", function(req,res){
  var nav = fs.readFileSync("navbar.html","utf-8");
  res.send(nav);
});

app.listen(8080,function(){
  console.log("Server is Running...")
});
