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
	password: 'root',
	database: 'netTrade'
});

// PassportJS
var passport = require('passport');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.provider + user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Adds new user to database if already there does nothing
function addUser(profile) {
	var key = profile.provider + profile.id
	var sql = 'SELECT providerID from usertable WHERE providerID = \'' + key + '\''
	con.query(sql, function(err,rows,fields) {
	console.log("Outputing result of sql usertable find",rows);

	console.log(profile.email);
	if (err)
		console.log(err);
	if (rows.length == 0) {
		 var value = {providerID : key,
									displayName : profile.displayName,
									firstName : profile.name.givenName,
									lastName : profile.name.familyName,
									email : profile.emails[0].value,
									photoURL : "foo.jpg"}
		 console.log(key);
		 con.query('INSERT INTO usertable SET ?',value,function(err,rows,fields) {
			 if (err)
				console.log(err)
			else {
				console.log("Added new user!!!")
			 }
		})
	}
	});
}
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: '465541679426-bieul6n1t3nj49t49kkvd0ritujlield.apps.googleusercontent.com',
    clientSecret: 'A76wPVjerWGfFeRjwvhXzVIG',
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
		console.log("profile",profile)
		addUser(profile);
    return done(null, profile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: 1156295237830810,
    clientSecret: '2230c4715ef21d98097f61eba2fe5330',
    callbackURL: "http://localhost:8080/auth/facebook/callback",
		profileFields: ['id','displayName','email','first_name','last_name']
  },
  function(accessToken, refreshToken, profile, done) {
		console.log("Profile",profile);
		addUser(profile)
    return done(null, profile);
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['public_profile','email']}));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

con.connect(function(err) {
	if(err) {
		console.log("Error connecting to database");
	}
	else {
		console.log("Database successfully connected");
	}
});

app.get('/', function(req, res) {
	console.log(req.user)
  res.render('home');
});

app.get('/itemdetails', function(req, res){
  res.render('itemdetails');

})

app.get('/login', function(req, res){
  res.render('login');

})

app.get('/addproduct',function(req,res){
	res.render("addnewproduct");
})

app.get('/add_new_product', function(req, res){
	var category = req.query.category;
	var product_name= req.query.name;
	var desc=req.query.product_desc;
	var product_price=req.query.price;
	var image=req.query.image;
  var product = { name: product_name, photoURL: image, price: product_price, description: desc, providerID: "FACEBOOK.COM"};
	console.log(product);
  var query = con.query('INSERT INTO productt SET ?', product, function(err,rows,fields) {
  if (err)
    console.log(err);
  else
    console.log('Here is the result : ', rows);
  });
  res.send('ALL');

})

app.get('/userprofile', function(req, res){
  res.render('userprofile');
})

app.get('/search',function(req,res){

})



app.listen(8080, function() {
  console.log("Server is listening on localhost:8080.")
})
