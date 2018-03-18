module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/', function(req, res){
        console.log("view visit gotten");
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');

	    var sql = "SELECT visit_date, count(customer_id) as visits FROM visit GROUP BY visit_date";
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
                res.render('view_visit', context);
            }
        }
    });

    return router;
}();