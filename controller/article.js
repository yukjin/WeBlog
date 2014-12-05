/**
 * Created by luzhen on 14-11-25.
 */
var Post=require('../lib/Post');
var markdown=require('markdown-js');
var toMarkdown = require('to-markdown').toMarkdown;
var eventproxy = require('eventproxy');
exports.showPost=function(req,res,next){
    Post.getCategoryByUserId({user_id:req.session.user.id},function(err,result){
        if(err){
            req.flash('error','获取分类失败！');
            return res.redirect('/edit');
        }
        res.render('post',{'categoryList':result});
    });
}

exports.showEdit=function(req,res,next){
    var articleId=req.params.articleId;
    var user=req.session.user;
    var ep=eventproxy();
    ep.all('getCategory','getArticle',function(categories,article){
        res.render('edit',{'categories':categories,'article':article});
    });
    Post.getCategoryByUserId({user_id:user.id},function(err,result){
        ep.emit('getCategory',result);
    });
    Post.queryDetail({id:articleId,'author':user.user_name},function(err,result){
        if(err){
            next(err);
        }

        if(result){
            result.content=toMarkdown(result.content);
            ep.emit('getArticle',result);
        }else{
            res.redirect('/');
            return;
        }
    });
}

exports.edit=function(req,res,next){
    var articleId=req.params.articleId||'';
    var categoryId=req.body.categoryId||'';
    var title=req.body.title||'';
    var content=req.body.content||'';
    var author=req.session.user.user_name;
    var ep=eventproxy();
    ep.on('edit_err',function(tip){
        req.flash('error',tip);
        res.redirect('/article/edit/'+articleId);
    });
    if ([categoryId,title,content].some(function (item) { return item === ''; })) {
        ep.emit('edit_err', '文章的分类、标题或内容没有填写!');
        return;
    }

    var post=new Post({
        'articleId':articleId,
        'categoryId':categoryId,
        'title':title,
        'content':markdown.parse(content),
        'author':author
    });
    post.update(function(err,result){
        if(err){
            ep.emit('edit_err', '编辑失败！');
            return;
        }
        return  res.redirect('/'+req.session.user.user_name+'/home');
    });
}

exports.post=function(req,res,next){
    var categoryId=req.body.categoryId||'';
    var title=req.body.title||'';
    var content=req.body.content||'';
    var author=req.session.user.user_name;
    var ep=eventproxy();
    ep.on('post_err',function(tip){
        req.flash('error',tip);
        res.redirect('/post');
    });
    if ([categoryId,title,content].some(function (item) { return item === ''; })) {
        ep.emit('post_err', '文章的分类、标题或内容没有填写!');
        return;
    }

    var post=new Post({
        'categoryId':categoryId,
        'title':title,
        'content':markdown.parse(content),
        'author':author
    });
    post.add(function(err,result){
        if(err){
            ep.emit('post_err', '文章发表失败！');
            return;
        }
        return  res.redirect('/'+req.session.user.user_name+'/home');
    });
}
