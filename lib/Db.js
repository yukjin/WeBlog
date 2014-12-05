/**
 * Created by luzhen on 14-11-19.
 */
var mysql      = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'jb98',
    database : 'blog'
});

db.connect();
module.exports=db;