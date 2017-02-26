var express = require('express');
var path = require('path');
var exphbs  = require('express-handlebars');
var app = express();

// Handlebar config
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('./assets'))

//  MySQL Connection
var mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Root1!',
	database: 'netTrade',
});

con.connect(function(err) {
	if(err) {
		console.log("Error connecting to database");
	}
	else {
		console.log("Database successfully connected");
	}
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/itemdetails', function(req, res){
  res.render('itemdetails');

})

app.get('/login', function(req, res){
  res.render('login');

})

app.get('/add_new_product', function(req, res){
	var category = req.query.category;
	var product_name= req.query.name;
	var desc=req.query.product_desc;
	var product_price=req.query.price;
	var image=req.query.image;
  var product = { name: product_name, photoURL: image, price: product_price, description: desc, providerID: "FACEBOOK.COM"};
	console.log(product);
  var query = con.query('insert into productt set ?', product, function(err,rows,fields) {
  if (err)
    console.log('Error during query processing');
  else
    console.log('Here is the result : ', rows);
  });
  res.send('ALL');

})

app.get('/userprofile', function(req, res){
  res.redner('userprofile');
})




app.listen(8080, function() {
  console.log("Server is listening on localhost:8080.")
})
