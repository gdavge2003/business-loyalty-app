module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // helper functions to retrieve values from db ---------------------------------------------------
    function getCustomer(res, mysql, context, id, complete){
        var sql = "SELECT id, name, phone_number, points, is_activated FROM customer WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0]; // get the contents of the first element, aka the customer
            complete();
        });
    }

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name, phone_number, points, is_activated FROM customer", 
            function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }

            context.customers = results;
            complete(); // call in order to reach count in order to render page
        });
    }

    // routes -----------------------------------------------------------------------------------
    router.get('/', function(req, res){
        console.log("view customers gotten");
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');

        context.jsscripts = ["deleteitem.js"];
        getCustomers(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('view_customers', context);
            }
        }
    });

    // Adds a customer, redirects back to customer page
    // points are 0 and activated by default
    router.post('/', function(req, res){
        //console.log("view customers posted!");
        var context = {};
        var mysql = req.app.get('mysql');

        //values for 1st query - initial check
        var customerCheck = "SELECT phone_number FROM customer WHERE phone_number=?";
        var phoneNumberCheck = [req.body.phone_number];

        //values for after 1st query validation passes
        var sql = "INSERT INTO customer (name, phone_number, points, is_activated) VALUES (?,?,?,?)";
        var inserts = [req.body.name, req.body.phone_number, 0, true];

        mysql.pool.query(customerCheck, phoneNumberCheck, function(error, results, fields){
            if(error){
                console.log("Failed to verify!");
                res.write(JSON.stringify(error));
                res.end();
            }else{
                if(results.length){
                    console.log("phone number exists, not adding.");
                    res.redirect('view_customers');
                }else{
                    mysql.pool.query(sql,inserts,function(error, results, fields){
                        if(error){
                            console.log("Failed to insert customer to DB!");
                            res.write(JSON.stringify(error));
                            res.end();
                        }else{
                            res.redirect('view_customers');
                        }
                    });

                }
            }
        });
    });

    // Redirects to this page when clicked on Update Customer
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["updateitem.js"];
        
        getCustomer(res, mysql, context, req.params.id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update_customer', context);
            }
        }
    });

    // sends data from update_customer to here, which updates said customer
    router.put('/:id', function(req, res){
        console.log("view customers putted!")
        var mysql = req.app.get('mysql');

        var customerCheck = "SELECT phone_number FROM customer WHERE phone_number=?";
        var phoneNumberCheck = [req.body.phone_number];

        var sql = "UPDATE customer SET name=?, phone_number=?, points=? WHERE id=?";
        var inserts = [req.body.name, req.body.phone_number, req.body.points, req.params.id];
        
        mysql.pool.query(customerCheck, phoneNumberCheck, function(error, results, fields){
            if(error){
                console.log("Failed to verify!");
                res.write(JSON.stringify(error));
                res.end();
            }else{
                if(results.length){
                    console.log("phone number already exists, not updating.");
                    res.end();
                }else{
                    mysql.pool.query(sql,inserts,function(error, results, fields){
                        if(error){
                            console.log("Failed to update customer!");
                            res.write(JSON.stringify(error));
                            res.end();
                        }else{
                            res.status(200);
                            res.end();
                        }
                    });
                }
            }
        });
    });

    // route to delete. utilizes ajax call from public/js to get the correct ID in the url for deletion
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM customer WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("Failed to delete customer!");
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();