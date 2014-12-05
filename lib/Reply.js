/**
 * Created by luzhen on 14-11-26.
 */
var db=require('./Db');
var User=require('../lib/User');
var tools=require('../lib/tools');
var eventProxy=require('eventproxy');
function Reply(reply){
    this.content=reply.content;
    this.article_id=reply.articleId;
    this.replyer_id=reply.replyer_id;;
}

Reply.getRepliesByArticleId=function(article_id,callback){//查询文章下的所有评论
    db.query("select id,content,article_id,create_time,replyer_id from reply where article_id=?",[article_id],function(err,rows){
        if(err){
            callback(err);
        }else{
            var ep=eventProxy();
            ep.after('getUser',rows.length,function(result){
                callback(null,result);
            });
            rows.forEach(function(row){
                row.create_time=tools.formatDate(row.create_time,true);
                User.getById(row.replyer_id,function(err,user){
                    if(err){
                        callback(err);
                    }else{
                        row['user']=user[0];
                        ep.emit('getUser',row);
                    }
                });
            });

        }
    });
}

Reply.prototype.addReply=function(callback){//发表评论
    var that=this;
    db.beginTransaction(function(err){
        if(err){
            db.rollback(function(){
                callback(err);
            });
        }else{

            db.query('insert into reply values(null,?,?,?,?)',[that.content,that.article_id,tools.formatDate(new Date()),that.replyer_id],function(err,rows){
                if(err){
                    db.rollback(function(){
                        callback(err);
                    });
                }else{
                    db.query('update article set reply_num=reply_num+1 where id=?',[that.article_id],function(err,row){
                        if(err){
                            db.rollback(function(){
                                callback(err);
                            });
                        }else{

                            db.commit(function(err){
                                if(err){
                                    db.rollback(function(){
                                        callback(err);
                                    });
                                }else{
                                    callback(null,rows);
                                }

                            });
                        }
                    });
                }
            });
        }

    });

}

module.exports=Reply;