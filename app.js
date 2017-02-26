var http=require('http');
var $=require('jquery');
var express = require('express');
var path = require('path');
var app = express();
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

})




app.listen(8080, function() {
  console.log("Server is listening on localhost:8080.")
})
