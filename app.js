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
/*
	var sql = " SELECT providerID, firstName, lastName FROM userTable WHERE providerID = '" + user.provider+user.id + "';"
	con.query(sql,function(err,rows,fields) {
			if(err){
				console.log(err);
			}
			else{
				 var info = {
					id: rows[0].providerID,
					firstName: rows[0].firstName,
					lastName: rows[0].lastName,
					email: rows[0].email
					}
						console.log(info);
			}
		});
*/
	done(null, {id: user.provider + user.id, displayName: user.displayName, email: user.emails[0].value});
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
		//console.log("profile",profile)
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
		//console.log("Profile",profile);
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


app.post('/update_prod', function(req, res) {
	var product_name= req.body.name;
	var desc=req.body.product_desc;
	var product_price=req.body.price;
	var category = req.body.category;
	var item_id = req.body.id;
 	var qur ='Update itemtable SET name=\'' + product_name + '\', category=\''+category+'\', price=\'' +product_price+ '\',description=\'' +desc+'\' where itemID=\''+item_id+'\';';
	  var query = con.query(qur , function(err,rows,fields) {
  	if (err)
	    console.log(err);
	else
	    console.log('Here is the result : ', rows);
  });

	res.send("Product Updated");
});


app.get('/', function(req, res) {
	console.log(req.user)


	var sql = 'SELECT name, itemtable.photoURL, price, itemID FROM itemTable WHERE category IN (\'Clothes\');';
	con.query(sql,function(err,rows1,fields){
					//console.log(rows1);
		if(err) {
			console.log(err);
			res.status(500).send('Something broke!')
		}
		else {
			var sql = 'SELECT name, itemtable.photoURL, price, itemID FROM itemTable WHERE category IN (\'Electronics\');';
			con.query(sql,function(err,rows2,fields){

					if(err) {
						console.log(err);
						res.status(500).send('Something broke!')
					}
					else {
						res.render('home', {user: req.user, results_clothes : rows1, results_electronics : rows2, ishomepage:true});
					}
			});
		}
	});
});

app.get('/myitems',function(req,res) {
	if (req.user) {
	  var sql = 'SELECT * FROM itemtable WHERE ';
		sql += 'providerID = \'' + req.user.id + '\'';
		con.query(sql,function(err,rows,fields) {
			res.render('myitems', {
				          items : rows,
									user : req.user,
		              helpers: {
										grouped_each: function(every,context,options) {
											var out = "", subcontext = [], i;
                      if (context && context.length > 0) {
                        for (i = 0; i < context.length; i++) {
                          if (i > 0 && i % every === 0) {
                            out += options.fn(subcontext);
                            subcontext = [];
                          }
                        subcontext.push(context[i]);
                      }
                      out += options.fn(subcontext);
                	    }
                      return out;
									}
								}
		 })
	 })
 }
 else {
	 res.render('login')
 }
})

app.get('/login', function(req, res){
  res.render('login');

})


var multer = require('multer')
var upload = multer({dest: 'product_uploads/'})

app.post('/api/file', upload.single('product_image'), function (req, res, next) {
	if(req.user== undefined)
	{
			res.render('/login'); 	//ALERT : DOES NOT WORK	//if user is not logged in and tries to add product, the user will be redirected to the login page.
	}
	else {

	var product_name= req.body.product_name;
	var desc=req.body.product_description;
	var product_price=req.body.price;
	var category = req.body.categories;
	var image = req.file.filename;
	var product = { name: product_name, category: category, photoURL: image, price: product_price, description: desc, providerID: req.user.id};
  var query = con.query('INSERT INTO itemtable SET ?', product, function(err,rows,fields) {
  if (err)
    console.log(err);
  else
    console.log('Product added to database');
  });
  res.redirect('/myitems');
	}
});

app.get('/addproduct',function(req,res){
	// Make sure they are logged in before getting this page
	if (!req.user) {
		res.render('login');
	}
	else {
	  res.render("addnewproduct",{user: req.user});
	}
})

app.post('/api/file2',function (req, res, next) {
	if(req.user== undefined)
	{
			res.render('/login'); 	//ALERT : DOES NOT WORK	//if user is not logged in and tries to add product, the user will be redirected to the login page.
	}
	else {
	var new_firstname= req.body.new_firstname;
	var new_lastname = req.body.new_lastname;
	var new_name = req.body.new_firstname + " " +req.body.new_lastname;
	var new_email = req.body.new_email;
	var providerID = req.user.id;
	//var product = { name: new_name, email: new_email, providerID: req.user.id};
	var sql = "UPDATE userTable SET displayName = '" + new_name + "', firstName = '" + new_firstname + "', lastName = '" + new_lastname + "', email = '" + new_email + "' WHERE providerID = '" + providerID + "';";
console.log("---------------------------------------")
	console.log(sql);
	var query = con.query(sql, function(err,rows,fields) {
  if (err)
    console.log(err);
  else
    console.log('User Info Changed!');
  });
  res.redirect('/userprofile');
	}
});

app.get('/edit',function(req,res){
	// Make sure they are logged in before getting this page
	if (!req.user) {
		res.render('login');
	}
	else {
	  res.render("editacc",{user: req.user});
	}
})

app.get('/userprofile', function(req, res){
	//Will use in serialize later...delete when that change is made
	var sql = " SELECT providerID, firstName, lastName, email FROM userTable WHERE providerID = '" + req.user.id + "';"
	console.log("___________________________________________________")
	console.log(sql);
	con.query(sql,function(err,rows,fields) {
			if(err){
				console.log(err);
			}
			else{
				 var info = {
					id: rows[0].providerID,
					firstName: rows[0].firstName,
					lastName: rows[0].lastName,
					email: rows[0].email
					}
					var displayname = info.firstName + " " + info.lastName;
					res.render('userprofile',{user: req.user, name: displayname , email: info.email});
			}
		});

})


app.get('/product/:id/delete',function(req,res) {
	if (req.user.id) {
	  var sql = 'DELETE from itemtable WHERE providerID =' + '\'' + req.user.id + '\' ';
	  sql += 'AND itemID = \'' + req.params.id + '\';';
	  con.query(sql,function(err,rows,fields) {
		if (err) {
			console.log(err);
			res.status(500).send('Something broke!')
		}
		else {
			res.redirect('/myitems')
		}
	})
  }
	else {
		res.redirect('/login');
	}
})

app.get('/product/:id',function(req,res){
	var sql = 'SELECT name, category, itemtable.photoURL, price, description, itemID, itemtable.providerID, displayName, email FROM itemTable, usertable WHERE itemId = ' + req.params.id + ' && itemtable.providerID=usertable.providerID;';
	con.query(sql,function(err,rows,fields){
		if(err) {
			console.log(err);
			// Send 500 Error
			res.status(500).send('Something broke!')
		}
		else {
			//console.log(req.user);
			var this_user;
			if(req.user)
			{
				this_user = (req.user.id == rows[0].providerID);
			}
			else
			{
				this_user==false;
			}
			res.render('itemdetails', {items : rows[0], user : req.user, product_user : this_user});
		}
	});
})

app.post('/search',function(req,res){

	// Category based search
	if (req.body.searchCategory == 'All') {
	  var sql = 'SELECT * FROM itemTable WHERE(name LIKE \'%' + req.body.searchText + "%\');";
	}
	else {
	  var sql = 'SELECT * FROM itemTable WHERE(name LIKE \'%' + req.body.searchText + "%\') ";
		sql += ' AND category = \'' + req.body.searchCategory + '\';'
		console.log("sql -> ",sql)
	}

	con.query(sql,function(err,rows,fields){
		if(err) {
			console.log(err);
			// Send 500 Error
			res.status(500).send('Something broke!')
		}
		else {
			// Rendering search result page
			// Passing in query results to handlebar template
			console.log(req.body)
			res.render('search',{user: req.user,
				                   search_results : rows,
			                     search_query : req.body.searchText,
													 search_category : req.body.searchCategory,
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

app.get('/logout',function(req,res) {
	req.logout()
	res.redirect('/');
})



app.listen(8080, function() {
  console.log("Server is listening on localhost:8080.")
})
