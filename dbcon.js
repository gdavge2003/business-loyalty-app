var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_gel',
  password        : '9988',
  database        : 'cs340_gel'
});

module.exports.pool = pool;
