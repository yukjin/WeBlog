/**
 * Created by luzhen on 14-11-18.
 */
var db=require('./Db');

function User(user){
    this.user_name=user.user_name;
    this.password=user.password;
    this.email=user.email;
    this.portrait_url=user.portrait_url;
    this.signature=user.signature;
}


User.getByName=function(username,callback){
    db.query('select * from user where user_name=?',[username],function(err, rows) {
        if (err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
}

User.getById=function(userId,callback){
    db.query('select * from user where id=?',[userId],function(err, rows) {
        if (err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
}


User.updateHeadPhoto=function(option,callback){
    db.query('update user set portrait_url=? where user_name=?',[option.portrait_url,option.user_name],function(err, rows) {
        if (err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
}

User.updateSignature=function(option,callback){
    db.query('update user set signature=? where user_name=?',[option.content,option.user_name],function(err, rows) {
        if (err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
}

User.prototype.add=function(callback){
    db.query('insert into user(user_name,password,email,portrait_url,signature) values(?,?,?,?,?)',[this.user_name,this.password,this.email,this.portrait_url,this.signature],function(err, rows) {
        if (err){
            callback(err);
        }else{
            callback(null,rows);
        }
    });
}

module.exports=User;