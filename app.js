var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('./assets'))

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/itemdetails', function(req, res){
res.render('itemdetails');
})

app.get('/login', function(req, res){
  res.render('login');
})

app.get('/addnewproduct', function(req, res){
  res.render('addnewproduct');
})

app.get('/userprofile', function(req, res){
  res.render('userprofile');

})




app.listen(8080, function() {
  console.log("Server is listening on localhost:8080.")
})
