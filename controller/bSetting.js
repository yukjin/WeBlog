/**
 * Created by luzhen on 14-12-2.
 */
var Post=require('../lib/Post');
var BlogUtil=require('../lib/BlogUtil');
var eventproxy=require('eventproxy');

exports.deleteArticle=function(req,res,next){//删除文章
    var articleId=req.params.articleId||'';
    Post.delete({'id':articleId,'author':req.session.user.user_name},function(err,result){
        if(err||result.affectedRows<1){
            res.send({'error':'删除失败'});
        }
        res.send({'tip':'success'});
    });
}

exports.addCategory=function(req,res,next){
    var category_name=req.body.category_name||'';
    var user=req.session.user;
    var ep=eventproxy();
    ep.on('category_err',function(tip){
        res.send({error:tip});
    });

    if(category_name==''){
        ep.emit('category_err','分类名不能为空');
        return;
    }

    Post.getCategoryByNameByYourself({'name':category_name,'user_id':user.id},function(err,result){
        if(err){
           next(err);
        }else if(result.length>0){
            ep.emit('category_err','分类名不能重复');
            return;
        }else{

            Post.addCategory({'name':category_name,'user_id':user.id},function (err, result) {
                if(err){
                    next(err);
                }else{
                    res.send({id:result.insertId,name:category_name,'user_id':user.id,'article_num':0});
                }
            })
        }
    });

};

exports.editCategory=function(req,res,next){
    var user=req.session.user;
    var name=req.body.name||'';
    if(name===''){
        res.send({'error':'分类名不能为空'});
        return;
    }
    var categoryId=req.params.categoryId;
    Post.editCategory({'name':name,'categoryId':categoryId,'user_id':user.id},function (err,result) {
        if(err){
            res.send({'error':'删除失败'});
        }else{
            res.send({'name':name});
        }
    });
};

exports.deleteCategory=function(req,res,next){
    var user=req.session.user;
    var categoryId=req.params.categoryId;
    Post.deleteCategory({'categoryId':categoryId,'userId':user.id},function (err,result) {
        if(err){
            res.send({'error':'删除失败'});
        }else{
            res.send({'tip':'success'});
        }
    });
};

exports.addFriendLink=function(req,res,next){
    var describe=req.body.describe||'';
    var url=req.body.url||'';
    var user=req.session.user;
    var ep=eventproxy();
    ep.on('friendLink_err',function(tip){
        res.send({error:tip});
    });

    if(describe===''||url===''){
        ep.emit('friendLink_err','缺少信息');
        return;
    }
    BlogUtil.addFriendLink({'describe':describe,'url':url,'user_id':user.id,'user_name':user.user_name},function(err,result){
         if(err){
            ep.emit('friendLink_err','添加失败,请重试');
             return;
         }else{
             res.send({'describe':describe,'url':url,'id':result.insertId});
         }
    });
}

exports.deleteFriendLink=function(req,res,next){
    var user=req.session.user;
    var friendLinkId=req.params.friendLinkId;

    BlogUtil.deleteFriendLink({'id':friendLinkId,'user_id':user.id},function(err,result){
        if(err||result.affectedRows<1){
            res.send({'error':'删除失败'});
        }else{
            res.send({'tip':'success'});
        }
    });
}