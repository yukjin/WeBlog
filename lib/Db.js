/**
 * Created by luzhen on 14-11-19.
 */
var mysql      = require('mysql');
// default database config
var db_config = {
    host            : 'localhost',
    port            : 3306,
    user            : 'root',
    password        : 'jb98',
    database        : 'blog'
};
if (process.env.VCAP_SERVICES) {
    var mysql_config = JSON.parse(process.env.VCAP_SERVICES).mysql[0].credentials;
    db_config.host = mysql_config.hostname;
    db_config.port = mysql_config.port;
    db_config.user = mysql_config.username;
    db_config.password = mysql_config.password;
    db_config.database = mysql_config.name;
}
var pool  = mysql.createPool({
    host     : db_config.host,
    user     : db_config.user,
    password : db_config.password,
    database : db_config.database
});
module.exports=pool;