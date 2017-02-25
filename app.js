var express = require('express');
var path = require('path');
var app = express();



app.use(express.static(path.join(__dirname, '/')));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html', null, function(error, data) { //getting the file
        if (error) {
            res.writeHead(404);
            res.write("File not found");
        }
    });
});

app.get('/itemdetails', function(req, res){

})

app.get('/nettrade_login', function(req, res){

})

app.get('/add_new_product', function(req, res){

})

app.get('/userprofile', function(req, res){

})




app.listen(8080, function() {
  console.log("Server is listening on localhost:8080.")
})
