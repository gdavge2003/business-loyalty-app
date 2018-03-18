module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/', function(req, res){
        console.log("view sales gotten");
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');

	    var sql = "SELECT p.name as item_name, sum(o.quantity) as number_sold," + 
            "(sum(o.quantity)*p.price) as total_profit FROM order_product o " + 
            "INNER JOIN product p ON o.product_id = p.id GROUP BY item_name ORDER BY number_sold DESC";
	    mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.results = results;
            complete();
        });

        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('view_products_sold', context);
            }
        }
    });

    return router;
}();