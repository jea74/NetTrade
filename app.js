var express = require('express');
var path = require('path');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var app = express();

// Handlebar config
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('./assets'));
app.use('/product_uploads',express.static('product_uploads'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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


var multer = require('multer')
var upload = multer({dest: 'upload/'})

app.post('/api/file', upload.single('product_image'), function (req, res, next) {
	var product_name= req.body.product_name;
	var desc=req.body.product_description;
	var product_price=req.body.price;
	var category = req.body.categories;
	var image = req.file.filename;
	console.log("______________________");
	console.log(JSON.stringify(req.file));

	var product = { name: product_name, photoURL: image, price: product_price, description: desc, providerID: "FACEBOOK.COM"};
	console.log(product);
  var query = con.query('INSERT INTO productt SET ?', product, function(err,rows,fields) {
  if (err)
    console.log(err);
  else
    console.log('Here is the result : ', rows);
  });
    res.render('home');
});



app.get('/addproduct',function(req,res){
	res.render("addnewproduct");
})

app.get('/userprofile', function(req, res){
  res.render('userprofile');
})

app.post('/search',function(req,res){

	var sql = 'SELECT * FROM itemTable WHERE(name LIKE \'%' + req.body.searchText + "%\');";
	con.query(sql,function(err,rows,fields){
		if(err) {
			console.log(err);
			// Send 500 Error
			res.status(500).send('Something broke!')
		}
		else {
			// Rendering search result page
			// Passing in query results to handlebar template
			res.render('search',{search_results : rows,
			    search_query : req.body.searchText,
			    num_hits : rows.length,
	        helpers: {
				  // Limits the descript to 100 chars
					description: function() {
					if (this.description.length > 100)
					     return this.description.substring(0,100) + ' ...';
					else
							 return this.description;
					}
					}
			});
		}
	});
})





app.listen(8080, function() {
  console.log("Server is listening on localhost:8080.")
})
