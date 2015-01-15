/**
 * Created by luzhen on 15-1-15.
 */
var pool=require('../lib/Db');
function Message(message) {
    this.id=message.id;
    this.type=message.type;
    this.status=message.status;
    this.from_person=message.from_person;
    this.to_person=message.to_person;
    this.article_id=message.article_id;
}

Message.getUnReadMessage= function (user_id,callback) {
    pool.query("SELECT id,type,status,create_time,article_id,(select user_name from user where user.id=m.from_person) user_name,(select title from article where id=m.article_id) title FROM message m where to_person =? and status='0' order by create_time desc",[user_id], function (err,rows) {
        if(err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
};

Message.getUnReadMessageNum= function (user_id,callback) {
    pool.query("SELECT count(1) as num FROM message m where to_person =? and status='0' order by create_time desc",[user_id], function (err,rows) {
        if(err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
};

Message.getReadedMessage= function (user_id,callback) {
    pool.query("SELECT id,type,status,create_time,article_id,(select user_name from user where user.id=m.from_person) user_name,(select title from article where id=m.article_id) title FROM message m where to_person =? and status='1' order by create_time desc",[user_id], function (err,rows) {
        if(err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
};

Message.updateMessageStatus= function (messageId,callback) {
    pool.query("update message set status='1' where id=?",[messageId], function (err,rows) {
        if(err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
}
Message.prototype.save= function (callback) {
    pool.query('insert into message values(null,?,0,now(),?,?,?)',[this.type,this.from_person,this.article_id,this.to_person],function (err, rows) {
        if(err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
};
module.exports=Message;