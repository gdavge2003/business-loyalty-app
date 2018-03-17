var portNumber = 4000;

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', portNumber);
app.set('mysql', mysql);


//homepage setup
app.get('/',function(req,res,next){
  var context = {};
  res.render('home', context)
});

//manager pages and functionality---------------------------------
app.get('/manager_main', function(req, res, next) {
  var context = {};
  res.render('manager_main', context);
});

app.use('/view_products', require('./view_products.js'));
app.use('/view_customers', require('./view_customers.js'));

//END manager pages and functionality------------------------------







//error handling
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
