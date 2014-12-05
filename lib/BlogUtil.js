/**
 * Created by luzhen on 14-11-20.
 */
var db=require('./Db');
var conf=require('../conf/conf');
function archive(callback){
    db.query("select date_format(create_time,'%Y-%m') as date, count(*) num from blog.article group by date_format(create_time,'%Y-%m')",function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

function archiveByYourself(author,callback){
    db.query("select date_format(create_time,'%Y-%m') as date, count(*) num from blog.article where author=? group by date_format(create_time,'%Y-%m')",[author],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

function pagination(pageNum,callback){
    db.query("select id,title,content,category_id,author,date_format(create_time,'%Y-%m-%d %H:%i') as create_time,visit_num,reply_num from article order by create_time desc limit ?,?",[(pageNum-1)*conf.pageSize,conf.pageSize],function(err,rows){
        if(err){
            return callback(err);
        }
        for(var i=0;i<rows.length;i++){
            rows[i].content=rows[i].content.split('\n')[0];
        }
        callback(null,rows);
    });
}
function paginationByYourself(option,callback){
    db.query("select id,title,content,category_id,author,date_format(create_time,'%Y-%m-%d %H:%i') as create_time,visit_num,reply_num from article where author = ? order by create_time desc limit ?,?",[option.author,(option.pageNum-1)*conf.pageSize,conf.pageSize],function(err,rows){
        if(err){
            return callback(err);
        }
        for(var i=0;i<rows.length;i++){
            rows[i].content=rows[i].content.split('\n')[0];
        }
        callback(null,rows);
    });
}

function paginationByDate(option,callback){
    db.query("select id,title,content,category_id,author,date_format(create_time,'%Y-%m-%d %H:%i') as create_time,visit_num,reply_num from article where create_time like ? order by create_time desc limit ?,?",[option.date+'%',(option.pageNum-1)*conf.pageSize,conf.pageSize],function(err,rows){
        if(err){
            return callback(err);
        }
        for(var i=0;i<rows.length;i++){
            rows[i].content=rows[i].content.split('\n')[0];
        }
        callback(null,rows);
    });
}

function paginationByCategory(option,callback){
    db.query("select id,title,content,category_id,author,date_format(create_time,'%Y-%m-%d %H:%i') as create_time,visit_num,reply_num from article where category_id=? order by create_time desc limit ?,?",[option.category_id,(option.pageNum-1)*conf.pageSize,conf.pageSize],function(err,rows){
        if(err){
            return callback(err);
        }
        for(var i=0;i<rows.length;i++){
            rows[i].content=rows[i].content.split('\n')[0];
        }
        callback(null,rows);
    });
}


function paginationByYourselfByDate(option,callback){
    db.query("select id,title,content,category_id,author,date_format(create_time,'%Y-%m-%d %H:%i') as create_time,visit_num,reply_num from article where author=? and create_time like ? order by create_time desc limit ?,?",[option.author,option.date+'%',(option.pageNum-1)*conf.pageSize,conf.pageSize],function(err,rows){
        if(err){
            return callback(err);
        }
        for(var i=0;i<rows.length;i++){
            rows[i].content=rows[i].content.split('\n')[0];
        }
        callback(null,rows);
    });
}

function updateArticleVisitNum(articleId,callback){
    db.query("update article set visit_num=visit_num+1 where id=?",[articleId],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

function getArticlesByYourself(option,callback){
    db.query("select id,title,content,category_id,author,date_format(create_time,'%Y-%m-%d %H:%i') as create_time,visit_num,reply_num from article where author = ? order by create_time desc",[option.author],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

function getFriendLinksByUserId(option,callback){
    db.query("select * from friendlinks where user_id=?",[option.user_id],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}
function getFriendLinksByUserName(option,callback){
    db.query("select * from friendlinks where user_name=?",[option.userName],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

function addFriendLink(option,callback){
    db.query("insert into friendlinks values(null,?,?,?,?)",[option.describe,option.url,option.user_id,option.user_name],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

function deleteFriendLink(option,callback){
    db.query("delete from friendlinks where id=? and user_id=?",[option.id,option.user_id],function(err,rows){
        if(err){
            return callback(err);
        }
        callback(null,rows);
    });
}

exports.archive=archive;
exports.archiveByYourself=archiveByYourself;
exports.pagination=pagination;
exports.paginationByYourself=paginationByYourself;
exports.paginationByDate=paginationByDate;
exports.paginationByYourselfByDate=paginationByYourselfByDate;
exports.updateArticleVisitNum=updateArticleVisitNum;
exports.getArticlesByYourself=getArticlesByYourself;
exports.paginationByCategory=paginationByCategory;
exports.getFriendLinksByUserId=getFriendLinksByUserId;
exports.getFriendLinksByUserName=getFriendLinksByUserName;
exports.addFriendLink=addFriendLink;
exports.deleteFriendLink=deleteFriendLink;

