var express = require('express');
var portN = 9987;
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', portN);

//homepage setup
app.get('/',function(req,res){
  res.render('home');
});

//about us setup
app.get('/about-us',function(req,res){
	res.render('aboutus');
});

//media setup
app.get('/media',function(req,res){
	res.render('media');
});

//sermons setup
app.get('/sermons',function(req,res){
	res.render('sermons')
});

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
