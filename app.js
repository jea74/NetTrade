var http=require('http');
var $=require('jquery');
var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var app = express();
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> origin/master
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
<<<<<<< HEAD
=======

app.use(express.static(path.join(__dirname, '/')));
=======

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('./assets'))
>>>>>>> origin/master

>>>>>>> origin/master
app.get('/', function(req, res) {
  res.render('home');
});

app.get('/itemdetails', function(req, res){
res.render('itemdetails');
})

app.get('/login', function(req, res){
  res.render('login');
})

<<<<<<< HEAD
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
 
<<<<<<< HEAD
=======
=======
app.get('/addnewproduct', function(req, res){
  res.render('addnewproduct');
>>>>>>> origin/master
>>>>>>> origin/master
})

app.get('/userprofile', function(req, res){
  res.render('userprofile');

})




app.listen(8080, function() {
  console.log("Server is listening on localhost:8080.")
})