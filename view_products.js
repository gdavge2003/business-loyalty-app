module.exports = function(){
    var express = require('express');
    var router = express.Router();

    // helper functions to retrieve values from db ---------------------------------------------------
    function getProduct(res, mysql, context, id, complete){
        var sql = "SELECT id, name, price FROM product WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product = results[0]; // get the contents of the first element, aka the product
            complete();
        });
    }

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

    // routes -----------------------------------------------------------------------------------
    router.get('/', function(req, res){
        console.log("view_products gotten!");
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');

        context.jsscripts = ["deleteitem.js"];
        getProducts(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('view_products', context);
            }
        }
    });

    // Adds a product, redirects back to product page
    router.post('/', function(req, res){
        console.log("view_prodicuts posted!");
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO product (name, price) VALUES (?,?)";
        var inserts = [req.body.name, req.body.price];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log("Failed to insert product to DB!");
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/view_products');
            }
        });
    });

    // Redirects to this page when clicked on Update Product
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        context.jsscripts = ["updateitem.js"];
        
        getProduct(res, mysql, context, req.params.id, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update_product', context);
            }
        }
    });

    // sends data from update_product to here, which updates said product
    router.put('/:id', function(req, res){
        console.log("view_products putted!")
        var mysql = req.app.get('mysql');
        var sql = "UPDATE product SET name=?, price=? WHERE id=?";
        var inserts = [req.body.name, req.body.price, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log("Failed to update product!");
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    // route to delete. utilizes ajax call from public/js to get the correct ID in the url for deletion
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM product WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log("Failed to delete product!");
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