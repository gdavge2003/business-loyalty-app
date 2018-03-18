module.exports = function(){
	var express = require('express');
    var router = express.Router();

    // helper functions
    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, price FROM product", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.products = results;
            complete(); // call in order to reach count in order to render page
        });
    }

    // routes ------------------------------------------------------------------------------

    //main page after login
    router.post('/', function(req, res){
    	console.log("member logged in successfully!");
    	var mysql = req.app.get('mysql');
    	var context = {};
    	var member_id = req.body.id;

    	var sql = "SELECT id, name, phone_number, points, is_activated FROM customer WHERE id=?"
    	var inserts = [member_id];
    	mysql.pool.query(sql, inserts, function(error, results, fields){
    		if(error){
                console.log("Failed to insert!");
                res.write(JSON.stringify(error));
                res.end();
            }else{
            	context.member = results[0];
				res.render('member', context);
            }
    	});
    });

    //refer a friend
    router.post('/refer_friend', function(req, res){
    	var context = {};
    	var mysql = req.app.get('mysql');
    	var friend_number = req.body.friend_number;
    	var member_id = req.body.member_id;

    	//create new member with friend's phone number
    	var sql = "INSERT INTO customer (phone_number, points, is_activated) VALUES (?,?,?)";
    	var inserts = [friend_number, 10, false];
    	mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("Failed to insert!");
                res.write(JSON.stringify(error));
                res.end();
            }else{ //insertId
                sql = "INSERT INTO referral (referrer_id, referred_id) VALUES (?,?)";
                inserts = [member_id, results.insertId];
                console.log(inserts);

                mysql.pool.query(sql, inserts, function(error, results, fields){
            		if(error){
                		console.log("Failed to create referral relationship!");
                		res.write(JSON.stringify(error));
            		} else{
        				context.member_id = member_id;
            			res.render('refer_friend', context);
            		}
            	});
            }
        });
    });

    //making an order
    router.post('/order_page', function(req, res){
    	var callbackCount = 0;
    	var context = {};
    	var mysql = req.app.get('mysql');
    	var member_id = req.body.member_id;
    	var order_id;

    	function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('order_page', context);
            }
        }

    	//create order to customer relationship
    	var sql = "INSERT INTO customer_order (customer_id) VALUES (?)";
    	var inserts = [member_id];
    	mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("Failed to create new order!");
                res.write(JSON.stringify(error));
                res.end();
            }else{ //insertId
            	order_id = results.insertId;
            	
            	//need to push these context in res to preserve data for next post
            	context.order_id = order_id;
            	context.member_id = member_id;
            	complete();
            }
        });

    	//setup data for all products, then render page
    	getProducts(res, mysql, context, complete);
    });

    //after making an order submission, update database with order-product + quantity
    router.post('/order_page/purchase_final', function(req, res) {
    	var price_total = 0;
  		var callbackCount = 0;
  		var context = {};

    	var mysql = req.app.get('mysql');
    	var member_id = parseInt(req.body.member_id);
    	var order_id = parseInt(req.body.order_id);

    	delete req.body.member_id;
    	delete req.body.order_id;

    	var products = {};
    	for(var product_id in req.body){
    		if(parseInt(req.body[product_id]) !== 0){
				products[parseInt(product_id)] = parseInt(req.body[product_id]);
			}
    	}

    	// for (var i in products){
    	// 	addProductToOrder(i, products[i], res, mysql, context, complete);


    	// }
   		


    	//render after adding entry and calculating for each product
    	function complete(){
            callbackCount++;
            if(callbackCount >= 2*products.length){
                res.render('purchase_final', context);
            }
        }

        res.render('purchase_final', context);
    });

    return router;
}();