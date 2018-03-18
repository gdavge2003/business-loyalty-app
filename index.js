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
app.use('/view_visit', require('./view_visit.js'));
app.use('/view_referrals', require('./view_referrals.js'));
app.use('/view_products_sold', require('./view_products_sold.js'));

//END manager pages and functionality------------------------------

//customer pages and functionality---------------------------------
app.get('/customer_main', function(req, res, next) {
  var context = {};
  res.render('customer_main', context);
});

// comes here after member submits a phone number. check if existing or not
app.post('/member_check', function(req,res,next){
  var context = {};
  var callbackCount = 0;
  var customerCheck = "SELECT id, name, phone_number, points, is_activated FROM customer WHERE phone_number=?";
  var phoneNumberCheck = [req.body.phone_number];

  function complete(url){
    callbackCount++;
    if(callbackCount >= 1){
      res.render(url, context);
    }
  }

  mysql.pool.query(customerCheck, phoneNumberCheck, function(error, results, fields){
    if(error){
      console.log("Fail to check customer phone number!");
      res.write(JSON.stringify(error));
      res.end();
    } else{
      // phone number matched - go to member dashboard, pass in member info
      if(results.length){
        console.log("Phone number checked. Member Found. Logging In...");
        context.member = results[0];

        // add count to visit table
        var visitsql = "INSERT INTO visit (visit_date, customer_id) VALUES (?,?)";
        var visitinsert = [new Date(), context.member.id];
        mysql.pool.query(visitsql, visitinsert, function(error, results, fields){
          if(error){
            console.log("Failed to insert visit date!");
            console.log(JSON.stringify(error));
          }
        });
        
        complete('member_check');
      } 
      // member not found, go to create new account page
      else{
        console.log("Phone number checked. Not found. Sending to new account...");
        context.number = phoneNumberCheck;
        complete('create_account', context);
      }
    }
  });
});

app.use('/member',require('./member.js'));
//END customer pages and functionality------------------------------

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
