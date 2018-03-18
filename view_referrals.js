module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.get('/', function(req, res){
        console.log("view referral gotten");
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');

	    var sql = "SELECT referrer_id, count(referred_id) as referred FROM referral GROUP BY referrer_id";
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
                res.render('view_referrals', context);
            }
        }
    });

    return router;
}();