/**
 * Created by luzhen on 14-11-19.
 */
var db=require('./Db');
var tools=require('../lib/tools');
function Post(post){
    this.id=post.articleId;
    this.categoryId=post.categoryId;
    this.title=post.title;
    this.content=post.content;
    this.author=post.author;
}

Post.addCategory=function(option,callback){
    db.query('insert into category(name,user_id) values(?,?)',[option.name,option.user_id],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

Post.editCategory=function(option,callback){
    db.query('update category set name=? where id=? and user_id=?',[option.name,option.categoryId,option.user_id],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}


Post.deleteCategory=function(option,callback){

    db.beginTransaction(function (err) {
        if(err){
            db.rollback(function(){
                callback(err);
            });
        }else{
            db.query('delete from category where id=? and user_id=?',[option.categoryId,option.userId],function(err,rows){
                if(err){
                    db.rollback(function(){
                        callback(err);
                    });
                }else{
                    db.query('update article set category_id=0 where category_id=?',[option.categoryId],function(err,rows){
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

Post.getCategoryByNameByYourself=function(option,callback){
    db.query('select 1 from category c where user_id=? and name=?',[option.user_id,option.name],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

Post.getCategoryByUserId=function(option,callback){
    db.query('select id,name,user_id,(select count(1) total from article a where category_id=c.id) article_num from category c where user_id=?',[option.user_id],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

Post.getCategoryByUsername=function(option,callback){
    db.query('select id,name,user_id,(select count(1) total from article a where category_id=c.id) article_num from category c where user_id=(select id from user where user_name=?)',[option.user_name],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

Post.prototype.add=function(callback){
    db.query('insert into article values(null,?,?,?,?,?,0,0)',[this.title,this.content,this.categoryId,this.author,tools.formatDate(new Date())],function(err,result){
        if (err){
            return callback(err);
        }
        callback(null,result);
    });
}

Post.prototype.update= function (callback) {
    db.query('update article set title=?,content=?,category_id=?,author=? where id=?',[this.title,this.content,this.categoryId,this.author,this.id],function(err,result){
        if (err){
            return callback(err);
        }
        callback(null,result);
    });
}

Post.delete=function(option,callback){
    db.query('delete from article where id=? and author=?',[option.id,option.author],function(err,result){
        if (err){
            return callback(err);
        }
        callback(null,result);
    });
}
Post.queryDetail=function(option,callback){
    db.query("select id,title,content,category_id,author,date_format(create_time,'%Y-%m-%d %H:%i') as create_time,visit_num,reply_num from article where id=?",[option.id],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows[0]);
    });
}
module.exports=Post;